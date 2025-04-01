const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const AWS = require('aws-sdk');

const prisma = new PrismaClient();

// Configure AWS
AWS.config.update({
  region: process.env.REACT_APP_AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

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

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // First get the machine to get its images
    const machine = await prisma.machine.findUnique({
      where: { id }
    });

    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    // Delete images from S3 if they exist
    if (machine.images && machine.images.length > 0) {
      const deletePromises = machine.images.map(async (imageUrl) => {
        try {
          // Extract the key from the URL (e.g., from https://.../inventory/filename.jpg, get inventory/filename.jpg)
          const key = imageUrl.split('/').slice(-2).join('/');
          
          await s3.deleteObject({
            Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
            Key: key
          }).promise();
        } catch (error) {
          console.error(`Failed to delete image ${imageUrl}:`, error);
          throw error;
        }
      });

      try {
        await Promise.all(deletePromises);
      } catch (error) {
        return res.status(500).json({ message: "Failed to delete images from S3" });
      }
    }
    
    // Delete the machine from the database
    await prisma.machine.delete({
      where: { id },
    });
    
    res.status(200).json({ message: "Machine and associated images deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting machine" });
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
