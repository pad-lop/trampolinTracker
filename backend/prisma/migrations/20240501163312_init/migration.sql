/*
  Warnings:

  - You are about to drop the column `total` on the `Corte` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Corte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFinal" DATETIME,
    "folioInicial" INTEGER,
    "folioFinal" INTEGER,
    "fondoInicio" REAL NOT NULL,
    "fondoFinal" REAL,
    "efectivoTotal" REAL,
    "recibosTotal" REAL,
    "estado" TEXT NOT NULL DEFAULT 'abierto'
);
INSERT INTO "new_Corte" ("estado", "fechaFinal", "fechaInicio", "folioFinal", "folioInicial", "fondoFinal", "fondoInicio", "id") SELECT "estado", "fechaFinal", "fechaInicio", "folioFinal", "folioInicial", "fondoFinal", "fondoInicio", "id" FROM "Corte";
DROP TABLE "Corte";
ALTER TABLE "new_Corte" RENAME TO "Corte";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
