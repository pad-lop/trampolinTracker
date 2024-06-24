import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.post('/services', async (req, res) => {
	const { tiempo, precio, text, tipo, nombre } = req.body;
  
	try {
	  const newService = await prisma.service.create({
		data: {
		  tiempo,
		  precio,
		  text,
		  tipo,
		  nombre,
		},
	  });
  
	  res.status(201).json(newService);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Failed to create service' });
	}
  });
  
  router.get('/services', async (req, res) => {
	try {
	  const services = await prisma.service.findMany();
	  res.status(200).json(services);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Failed to retrieve services' });
	}
  });

  router.put('/services/:id', async (req, res) => {
	const { id } = req.params;
	const { tiempo, precio, text } = req.body;
  
	try {
	  const updatedService = await prisma.service.update({
		where: { id: parseInt(id) },
		data: {
		  tiempo,
		  precio,
		  text,
		},
	  });
  
	  res.status(200).json(updatedService);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Failed to update service' });
	}
  });

  router.delete('/services/:id', async (req, res) => {
	const { id } = req.params;
  
	try {
	  await prisma.service.delete({
		where: { id: parseInt(id) },
	  });
  
	  res.status(204).end();
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Failed to delete service' });
	}
  });

export default router;