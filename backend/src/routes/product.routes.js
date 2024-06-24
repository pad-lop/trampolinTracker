import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.get('/products', async (req, res) => {
	try {
	  const products = await prisma.product.findMany();
	  res.status(200).json(products);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  });
  

router.post('/products', async (req, res) => {
	const { producto, descripcion, precio, tipo } = req.body;
  
	try {
	  const nuevoProducto = await prisma.product.create({
		data: {
		  producto,
		  descripcion,
		  precio,
		  tipo,
		},
	  });
  
	  res.status(201).json(nuevoProducto);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  });
  


router.delete('/products/:id', async (req, res) => {
	const { id } = req.params;
  
	try {
	  await prisma.product.delete({
		where: { id: Number(id) },
	  });
  
	  res.status(204).end();
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  });

router.put('/products/:id', async (req, res) => {
	const { id } = req.params;
	const { producto, descripcion, precio, tipo } = req.body;
  
	try {
	  const updatedProduct = await prisma.product.update({
		where: { id: Number(id) },
		data: {
		  producto,
		  descripcion,
		  precio,
		  tipo,
		},
	  });
  
	  res.status(200).json(updatedProduct);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  });

export default router;