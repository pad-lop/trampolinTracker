import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.post("/receipts", async (req, res) => {
	const { productos, ...rest } = req.body;
	try {
	  // Obtener la fecha actual
	  const currentDate = new Date();
  
	  // Calcular la fecha de hace 5 minutos
	  const fiveMinutesAgo = new Date(currentDate.getTime() - 10 * 1000);
  
	  // Buscar recibos creados en los últimos 5 minutos
	  const recentReceipts = await prisma.receipt.findMany({
		where: {
		  fecha: {
			gte: fiveMinutesAgo,
		  },
		},
		include: {
		  productos: true,
		},
	  });
  
	  // Verificar si algún recibo reciente tiene los mismos productos
	  const isDuplicate = recentReceipts.some((receipt) => {
		// Comparar la cantidad de productos
		if (receipt.productos.length !== productos.length) {
		  return false;
		}
  
		// Comparar cada producto
		return receipt.productos.every((producto, index) => {
		  const newProducto = productos[index];
		  return (
			producto.nombre === newProducto.nombre &&
			producto.cantidad === newProducto.cantidad &&
			producto.precio === newProducto.precio &&
			producto.tipo === newProducto.tipo &&
			producto.tiempoRentado === newProducto.tiempoRentado
		  );
		});
	  });
  
	  if (isDuplicate) {
		// Si es un recibo duplicado, retornar un mensaje de error
		return res.status(400).json({ message: "Duplicate receipt" });
	  }
  
	  // Si no es un recibo duplicado, crear el nuevo recibo
	  const newReceipt = await prisma.receipt.create({
		data: {
		  ...rest,
		  productos: {
			create: productos.map((producto) => {
			  const fecha = new Date();
			  if (producto.tipo === "Servicio") {
				fecha.setMinutes(fecha.getMinutes() + 1);
			  }
			  return {
				nombre: producto.nombre,
				descripcion: producto.descripcion,
				precio: producto.precio,
				cantidad: producto.cantidad,
				subtotal: producto.subtotal,
				tipo: producto.tipo,
				tiempoRentado: parseFloat(producto.tiempoRentado),
				fecha: fecha,
			  };
			}),
		  },
		},
		include: {
		  productos: true,
		},
	  });
  
	  res.status(201).json(newReceipt);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: "Failed to create receipt" });
	}
  });
router.get("/receipts", async (req, res) => {
	try {
		const receipts = await prisma.receipt.findMany({
			include: {
				productos: true,
			},
		});
		res.status(200).json(receipts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to retrieve receipts" });
	}
});

router.get("/receiptsByCorte", async (req, res) => {
	try {
		const { corteId } = req.query;

		const whereClause = corteId
			? {
					corteId: parseInt(corteId),
			  }
			: {};

		const receipts = await prisma.receipt.findMany({
			where: whereClause,
			include: {
				productos: true,
			},
		});

		res.status(200).json(receipts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to retrieve receipts" });
	}
});

router.get("/receiptRows", async (req, res) => {
	try {
		const today = new Date();
		const startOfDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate()
		);
		const endOfDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() + 1
		);

		const receiptRows = await prisma.receiptRow.findMany({
			where: {
				fecha: {
					gte: startOfDay,
					lt: endOfDay,
				},
				tipo: "Servicio",
			},
		});
		res.status(200).json(receiptRows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to retrieve receipt rows" });
	}
});

router.get("/receiptsDateRange", async (req, res) => {
	try {
		const { startDate, endDate } = req.query;

		if (!startDate || !endDate) {
			return res
				.status(400)
				.json({ error: "Missing startDate or endDate query parameters" });
		}

		const parsedStartDate = startDate;
		const parsedEndDate = endDate;

		const receipts = await prisma.receipt.findMany({
			where: {
				fecha: {
					gte: parsedStartDate,
					lte: parsedEndDate,
				},
			},
			include: {
				productos: true,
			},
		});

		if (receipts === null) {
			return res.status(400).json([]);
		}

		res.status(200).json(receipts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to retrieve receipts" });
	}
});

router.put("/detenerReceiptRow/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { tiempoUsado } = req.body;

		const updatedReceiptRow = await prisma.receiptRow.update({
			where: { id: parseInt(id) },
			data: {
				detenido: true,
				tiempoUsado: tiempoUsado,
			},
		});

		res.status(200).json(updatedReceiptRow);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to stop receipt row" });
	}
});
export default router;
