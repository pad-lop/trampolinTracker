/*
  Warnings:

  - You are about to drop the column `tiempoRestante` on the `ReceiptRow` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReceiptRow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "detenido" BOOLEAN DEFAULT false,
    "precio" REAL NOT NULL,
    "cantidad" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "tiempoRentado" REAL NOT NULL,
    "tiempoUsado" REAL,
    "tipo" TEXT NOT NULL,
    "receiptId" INTEGER NOT NULL,
    CONSTRAINT "ReceiptRow_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ReceiptRow" ("cantidad", "descripcion", "detenido", "fecha", "id", "nombre", "precio", "receiptId", "subtotal", "tiempoRentado", "tipo") SELECT "cantidad", "descripcion", "detenido", "fecha", "id", "nombre", "precio", "receiptId", "subtotal", "tiempoRentado", "tipo" FROM "ReceiptRow";
DROP TABLE "ReceiptRow";
ALTER TABLE "new_ReceiptRow" RENAME TO "ReceiptRow";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
