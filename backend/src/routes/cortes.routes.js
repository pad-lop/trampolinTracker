import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.post("/cortes/abrir", async (req, res) => {
	const { fondoInicio } = req.body;

	try {
		// Verificar si hay un corte abierto
		const corteAbierto = await prisma.corte.findFirst({
			where: { estado: "abierto" },
		});

		if (corteAbierto) {
			return res.status(400).json({
				message: "No se puede abrir un nuevo corte. Hay un corte sin cerrar.",
			});
		}

		// Crear un nuevo corte
		const nuevoCorteo = await prisma.corte.create({
			data: {
				fechaInicio: new Date(),
				fondoInicio,
			},
		});

		res.json(nuevoCorteo);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error al abrir el corte" });
	}
});

router.put("/cortes/cerrar", async (req, res) => {
	const {
	  recibos,
	  fondoFinal,
	  folioInicial,
	  folioFinal,
	  recibosTotal,
	  efectivoTotal,
	} = req.body;
  
	try {
	  // Verificar si hay un corte abierto
	  const corteAbierto = await prisma.corte.findFirst({
		where: { estado: "abierto" },
	  });
  
	  if (!corteAbierto) {
		return res
		  .status(400)
		  .json({ message: "No hay un corte abierto para cerrar." });
	  }
  
	  // Actualizar el corte con la información de cierre
	  const corteCerrado = await prisma.corte.update({
		where: { id: corteAbierto.id },
		data: {
		  fechaFinal: new Date(),
		  folioInicial,
		  folioFinal,
		  fondoFinal,
		  efectivoTotal,
		  recibosTotal,
		  estado: "cerrado",
		  recibos: {
			connect: recibos.map((recibo) => ({ id: recibo.id })),
		  },
		},
	  });
  
	  // Enviar solo el corte cerrado en la respuesta
	  res.json(corteCerrado);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: "Error al cerrar el corte" });
	}
  });

router.get("/cortes/ultimo", async (req, res) => {
	try {
		const ultimoCorte = await prisma.corte.findFirst({
			where: { estado: "abierto" },
			include: { recibos: true },
		});

		if (ultimoCorte) {
			res.json(ultimoCorte);
		} else {
			res.json(null);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error al obtener el último corte" });
	}
});

router.get("/cortes", async (req, res) => {
	try {
		const cortes = await prisma.corte.findMany({
			include: {
				recibos: true,
			},
		});

		res.status(200).json(cortes);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to retrieve cortes" });
	}
});

export default router;
