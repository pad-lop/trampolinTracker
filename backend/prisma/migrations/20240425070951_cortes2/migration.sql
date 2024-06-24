/*
  Warnings:

  - You are about to drop the column `corteId` on the `ReceiptRow` table. All the data in the column will be lost.
  - You are about to drop the column `folioFinal` on the `Corte` table. All the data in the column will be lost.
  - Added the required column `folioActual` to the `Corte` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReceiptRow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" REAL NOT NULL,
    "cantidad" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "tiempoRentado" REAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "receiptId" INTEGER NOT NULL,
    CONSTRAINT "ReceiptRow_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ReceiptRow" ("cantidad", "descripcion", "fecha", "id", "nombre", "precio", "receiptId", "subtotal", "tiempoRentado", "tipo") SELECT "cantidad", "descripcion", "fecha", "id", "nombre", "precio", "receiptId", "subtotal", "tiempoRentado", "tipo" FROM "ReceiptRow";
DROP TABLE "ReceiptRow";
ALTER TABLE "new_ReceiptRow" RENAME TO "ReceiptRow";
CREATE TABLE "new_Receipt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" REAL NOT NULL,
    "corteId" INTEGER,
    CONSTRAINT "Receipt_corteId_fkey" FOREIGN KEY ("corteId") REFERENCES "Corte" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Receipt" ("fecha", "id", "total") SELECT "fecha", "id", "total" FROM "Receipt";
DROP TABLE "Receipt";
ALTER TABLE "new_Receipt" RENAME TO "Receipt";
CREATE TABLE "new_Corte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechaInicio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFinal" DATETIME NOT NULL,
    "folioInicial" INTEGER NOT NULL,
    "folioActual" INTEGER NOT NULL,
    "fondo" REAL NOT NULL,
    "total" REAL NOT NULL
);
INSERT INTO "new_Corte" ("fechaFinal", "fechaInicio", "folioInicial", "fondo", "id", "total") SELECT "fechaFinal", "fechaInicio", "folioInicial", "fondo", "id", "total" FROM "Corte";
DROP TABLE "Corte";
ALTER TABLE "new_Corte" RENAME TO "Corte";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
