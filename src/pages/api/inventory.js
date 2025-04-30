const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { put, del, list } = require('@vercel/blob');
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { ObjectId } = require('mongodb');

const prisma = new PrismaClient();

// Debug logging for Vercel Blob configuration
console.log("Vercel Blob Configuration Check:");
console.log("BLOB_READ_WRITE_TOKEN exists:", !!process.env.BLOB_READ_WRITE_TOKEN);

// Add this endpoint for testing Vercel Blob
router.get("/test-blob", async (req, res) => {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({ 
        success: false,
        message: "Vercel Blob token is not configured" 
      });
    }
    
    // List the first 10 blobs to verify connection
    const blobs = await list({ limit: 10 });
    
    return res.status(200).json({ 
      success: true,
      message: "Vercel Blob connection successful",
      count: blobs.blobs.length,
      blobs: blobs.blobs.map(b => ({
        url: b.url,
        pathname: b.pathname,
        size: b.size,
        uploadedAt: b.uploadedAt
      }))
    });
  } catch (error) {
    console.error("Blob test error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to connect to Vercel Blob",
      error: error.message
    });
  }
});

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id) {
  try {
    return ObjectId.isValid(id);
  } catch (error) {
    return false;
  }
}

// Helper function to upload a single image to Vercel Blob
async function uploadImageToBlob(file) {
  try {
    const filename = `inventory-${Date.now()}-${file.originalname}`;
    const blob = await put(filename, file.buffer, {
      contentType: file.mimetype,
      access: 'public',
    });
    
    return blob.url;
  } catch (error) {
    console.error("Error uploading image to Vercel Blob:", error);
    throw new Error("Failed to upload image to Vercel Blob");
  }
}

// Upload images endpoint
router.post("/upload", upload.array("images"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    const uploadPromises = req.files.map(file => uploadImageToBlob(file));
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

    const uploadPromises = req.files.map(file => uploadImageToBlob(file));
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

    // Delete from Vercel Blob
    await del(imageUrl);

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
        images: machineData.images || [] // Store the Blob URLs directly
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

    // Delete images from Vercel Blob if they exist
    if (machine.images && machine.images.length > 0) {
      console.log(`Attempting to delete ${machine.images.length} images for machine ${id}`);
      
      const deletePromises = machine.images.map(async (imageUrl) => {
        try {
          await del(imageUrl);
          console.log(`Successfully deleted image: ${imageUrl}`);
        } catch (error) {
          console.error(`Failed to delete image ${imageUrl}:`, {
            error: error.message,
            name: error.name,
            stack: error.stack
          });
          // Don't throw here, just log the error and continue with other deletions
        }
      });

      try {
        await Promise.all(deletePromises);
      } catch (error) {
        console.error("Blob deletion error:", {
          error: error.message,
          name: error.name
        });
        // Continue with database deletion even if Blob deletion fails
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