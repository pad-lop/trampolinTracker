import express from "express";
import productRoutes from "./routes/product.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import receiptRoutes from "./routes/receipts.routes.js";
import cortesRoutes from "./routes/cortes.routes.js";
import usersRoutes from "./routes/user.routes.js";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json({ limit: "100mb" }));
app.use(cors());
app.use("/api", productRoutes);
app.use("/api", serviceRoutes);
app.use("/api", receiptRoutes);
app.use("/api", cortesRoutes);
app.use("/api", usersRoutes);

async function updateSubtotals() {
  try {
    // Obtener todas las filas de ReceiptRow
    const receiptRows = await prisma.receiptRow.findMany();

    // Iterar sobre cada fila y actualizar el subtotal
    for (const row of receiptRows) {
      const subtotal = row.cantidad * row.precio;
      await prisma.receiptRow.update({
        where: { id: row.id },
        data: { subtotal: subtotal },
      });
    }

    console.log("Subtotales actualizados correctamente.");
  } catch (error) {
    console.error("Error al actualizar los subtotales:", error);
  }
}


const main = async () => {
  await updateSubtotals();
  setInterval(updateSubtotals, 5 * 60 * 1000);
};


app.listen(3000);
console.log("Server on port", 3000);