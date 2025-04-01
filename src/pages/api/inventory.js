const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { S3Client, DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { ObjectId } = require('mongodb');

const prisma = new PrismaClient();

// Debug logging for AWS configuration
console.log("AWS Configuration Check:");
console.log("Region exists:", !!process.env.AWS_BUCKET_REGION);
console.log("Bucket name exists:", !!process.env.AWS_BUCKET_NAME);
console.log("Access Key ID exists:", !!process.env.AWS_ACCESS_KEY_ID);
console.log("Secret Access Key exists:", !!process.env.AWS_SECRET_ACCESS_KEY);

// Initialize S3 client with error handling
let s3Client;
try {
  s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  console.log("S3 client initialized successfully");
} catch (error) {
  console.error("Failed to initialize S3 client:", error);
}

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id) {
  try {
    return ObjectId.isValid(id);
  } catch (error) {
    return false;
  }
}

// Helper function to upload a single image to S3
async function uploadImageToS3(file) {
  try {
    const key = `inventory/${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw new Error("Failed to upload image to S3");
  }
}

// Upload images endpoint
router.post("/upload", upload.array("images"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    const uploadPromises = req.files.map(file => uploadImageToS3(file));
    const imageUrls = await Promise.all(uploadPromises);

    res.json({ success: true, imageUrls });
  } catch (error) {
    console.error("Error in upload endpoint:", error);
    res.status(500).json({ 
      message: "Error uploading images",
      error: error.message 
    });
  }
});

// Add images to existing item endpoint
router.post("/:id/add-images", upload.array("images"), async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Adding images for machine ID:", id);

    if (!isValidObjectId(id)) {
      console.error("Invalid ObjectId:", id);
      return res.status(400).json({ message: "Invalid machine ID format" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    // First check if the machine exists
    const existingMachine = await prisma.machine.findUnique({
      where: { id }
    });

    if (!existingMachine) {
      console.error("Machine not found with ID:", id);
      return res.status(404).json({ message: "Machine not found" });
    }

    console.log("Found machine:", existingMachine);

    const uploadPromises = req.files.map(file => uploadImageToS3(file));
    const imageUrls = await Promise.all(uploadPromises);

    console.log("Successfully uploaded images:", imageUrls);

    // Update the machine with new images
    const currentImages = existingMachine.images || [];
    const updatedMachine = await prisma.machine.update({
      where: { id },
      data: {
        images: [...currentImages, ...imageUrls]
      }
    });

    console.log("Successfully updated machine with new images");

    res.json({ 
      success: true, 
      imageUrls,
      machine: updatedMachine
    });
  } catch (error) {
    console.error("Error in add-images endpoint:", {
      error: error.message,
      stack: error.stack,
      code: error.code,
      meta: error.meta
    });
    res.status(500).json({ 
      message: "Error adding images",
      error: error.message,
      details: error.stack
    });
  }
});

// Delete single image endpoint
router.post("/:id/delete-image", async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "No image URL provided" });
    }

    // Extract the key from the URL
    const key = imageUrl.split('.amazonaws.com/')[1];
    
    // Delete from S3
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    });

    await s3Client.send(command);

    // Update the machine's images array
    const machine = await prisma.machine.findUnique({
      where: { id }
    });

    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    const updatedImages = machine.images.filter(img => img !== imageUrl);
    
    await prisma.machine.update({
      where: { id },
      data: {
        images: updatedImages
      }
    });

    res.json({ 
      success: true,
      message: "Image deleted successfully"
    });
  } catch (error) {
    console.error("Error in delete-image endpoint:", error);
    res.status(500).json({ 
      message: "Error deleting image",
      error: error.message 
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const machineData = req.body;
    
    const newMachine = await prisma.machine.create({
      data: {
        ...machineData,
        year: parseInt(machineData.year),
        horsepower: machineData.horsepower
          ? parseInt(machineData.horsepower)
          : null,
        engineHours: machineData.engineHours
          ? parseInt(machineData.engineHours)
          : null,
        price: machineData.price ? parseFloat(machineData.price) : null,
        deckSize: machineData.deckSize || null,
        images: machineData.images || [] // Store the S3 URLs directly
      },
    });
    res.status(201).json(newMachine);
  } catch (error) {
    console.error("Error creating machine:", error);
    res.status(500).json({ message: "Error creating machine" });
  }
});

router.get("/", async (req, res) => {
  try {
    const machines = await prisma.machine.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!machines || machines.length === 0) {
      console.log("No machines found");
      return res.json([]);
    }

    res.json(machines);
  } catch (error) {
    console.error("Detailed error fetching machines:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      meta: error.meta
    });
    res.status(500).json({ 
      message: "Error fetching machines",
      details: error.message 
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Delete request received for ID:", id);
    
    // Validate ID format
    if (!id || id.length !== 24) {
      console.log("Invalid ID format:", id);
      return res.status(400).json({ 
        message: "Invalid ID format",
        details: "ID must be a valid MongoDB ObjectId"
      });
    }

    // First get the machine to get its images
    let machine;
    try {
      machine = await prisma.machine.findUnique({
        where: { id }
      });
    } catch (dbError) {
      console.error("Database query error:", {
        error: dbError.message,
        code: dbError.code,
        meta: dbError.meta
      });
      throw new Error(`Database error: ${dbError.message}`);
    }

    if (!machine) {
      console.log("Machine not found with ID:", id);
      return res.status(404).json({ message: "Machine not found" });
    }

    console.log("Found machine:", {
      id: machine.id,
      make: machine.make,
      model: machine.model,
      imageCount: machine.images?.length || 0
    });

    // Delete images from S3 if they exist
    if (machine.images && machine.images.length > 0) {
      console.log(`Attempting to delete ${machine.images.length} images for machine ${id}`);
      
      const deletePromises = machine.images.map(async (imageUrl) => {
        try {
          // Extract the key from the URL (e.g., from https://.../inventory/filename.jpg, get inventory/filename.jpg)
          const key = imageUrl.split('.amazonaws.com/')[1];
          console.log(`Attempting to delete image with key: ${key}`);
          
          const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
          });

          await s3Client.send(command);
          console.log(`Successfully deleted image: ${key}`);
        } catch (error) {
          console.error(`Failed to delete image ${imageUrl}:`, {
            error: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack,
            command: {
              bucket: process.env.AWS_BUCKET_NAME,
              key: key
            }
          });
          // Don't throw here, just log the error and continue with other deletions
        }
      });

      try {
        await Promise.all(deletePromises);
      } catch (error) {
        console.error("S3 deletion error:", {
          error: error.message,
          code: error.code,
          name: error.name,
          stack: error.stack
        });
        // Continue with database deletion even if S3 deletion fails
      }
    }
    
    // Delete the machine from the database
    try {
      await prisma.machine.delete({
        where: { id },
      });
      console.log("Successfully deleted machine from database");
    } catch (dbError) {
      console.error("Database deletion error:", {
        error: dbError.message,
        code: dbError.code,
        name: dbError.name,
        stack: dbError.stack,
        meta: dbError.meta
      });
      throw new Error(`Database deletion error: ${dbError.message}`);
    }
    
    res.status(200).json({ message: "Machine and associated images deleted successfully" });
  } catch (error) {
    console.error("Delete error:", {
      error: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
      params: req.params,
      body: req.body
    });
    
    // Pass the error to the global error handler
    next(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const machineData = { ...req.body };
    
    // Remove id from the data object since Prisma doesn't allow updating id
    delete machineData.id;
    
    const existingMachine = await prisma.machine.findUnique({
      where: { id }
    });

    if (!existingMachine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    const updatedMachine = await prisma.machine.update({
      where: { id },
      data: {
        ...machineData,
        year: machineData.year ? parseInt(machineData.year) : existingMachine.year,
        horsepower: machineData.horsepower ? parseInt(machineData.horsepower) : existingMachine.horsepower,
        engineHours: machineData.engineHours ? parseInt(machineData.engineHours) : existingMachine.engineHours,
        price: machineData.price ? parseFloat(machineData.price) : existingMachine.price,
        hidden: machineData.hidden !== undefined ? machineData.hidden : existingMachine.hidden,
        type: machineData.type || existingMachine.type,
        images: machineData.images || existingMachine.images
      },
    });

    res.json(updatedMachine);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating machine" });
  }
});

module.exports = router;
