const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
      },
    });
    res.status(201).json(newMachine);
  } catch (error) {
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
      return res.json([]);
    }

    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching machines" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.machine.delete({
      where: { id },
    });
    res.status(200).json({ message: "Machine deleted successfully" });
  } catch (error) {
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
        // Only parse numeric fields if they're included in the update
        year: machineData.year ? parseInt(machineData.year) : existingMachine.year,
        horsepower: machineData.horsepower ? parseInt(machineData.horsepower) : existingMachine.horsepower,
        engineHours: machineData.engineHours ? parseInt(machineData.engineHours) : existingMachine.engineHours,
        price: machineData.price ? parseFloat(machineData.price) : existingMachine.price,
        hidden: machineData.hidden !== undefined ? machineData.hidden : existingMachine.hidden
      },
    });

    res.json(updatedMachine);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating machine" });
  }
});

module.exports = router;
