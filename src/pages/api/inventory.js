const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const machineData = req.body;
    console.log('Received data:', machineData);

    const newMachine = await prisma.machine.create({
      data: {
        ...machineData,
        year: parseInt(machineData.year),
        horsepower: machineData.horsepower ? parseInt(machineData.horsepower) : null,
        engineHours: machineData.engineHours ? parseInt(machineData.engineHours) : null,
        price: machineData.price ? parseFloat(machineData.price) : null,
        deckSize: machineData.deckSize || null,
      }
    });

    console.log('Created machine:', newMachine);
    res.status(201).json(newMachine);
  } catch (error) {
    console.error('Error creating machine:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('Fetching machines from database...');
    const machines = await prisma.machine.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('Fetched machines:', machines);
    
    if (!machines || machines.length === 0) {
      console.log('No machines found in database');
    }
    
    res.json(machines);
  } catch (error) {
    console.error('Error fetching machines:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.machine.delete({
      where: {
        id: id
      }
    });
    res.status(200).json({ message: 'Machine deleted successfully' });
  } catch (error) {
    console.error('Error deleting machine:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const machineData = req.body;
    
    const updatedMachine = await prisma.machine.update({
      where: {
        id: id
      },
      data: {
        condition: machineData.condition,
        make: machineData.make,
        model: machineData.model,
        brand: machineData.brand,
        description: machineData.description,
        year: parseInt(machineData.year),
        horsepower: machineData.horsepower ? parseInt(machineData.horsepower) : null,
        engineHours: machineData.engineHours ? parseInt(machineData.engineHours) : null,
        price: machineData.price ? parseFloat(machineData.price) : null,
        fuelType: machineData.fuelType || null,
        liftCapacity: machineData.liftCapacity || null,
        weight: machineData.weight || null,
        drive: machineData.drive || null,
        deckSize: machineData.deckSize || null,
        images: machineData.images || []
      }
    });
    
    res.json(updatedMachine);
  } catch (error) {
    console.error('Error updating machine:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 