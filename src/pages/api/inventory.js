import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const machineData = req.body;
    const newMachine = await prisma.machine.create({
      data: {
        ...machineData,
        year: parseInt(machineData.year),
        horsepower: machineData.horsepower ? parseInt(machineData.horsepower) : null,
        engineHours: machineData.engineHours ? parseInt(machineData.engineHours) : null,
      }
    });

    res.status(201).json(newMachine);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
} 