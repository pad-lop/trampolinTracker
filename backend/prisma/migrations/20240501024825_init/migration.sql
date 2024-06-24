/*
  Warnings:

  - You are about to drop the column `folioActual` on the `Corte` table. All the data in the column will be lost.
  - You are about to drop the column `fondo` on the `Corte` table. All the data in the column will be lost.
  - Added the required column `folioFinal` to the `Corte` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fondoFinal` to the `Corte` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fondoInicio` to the `Corte` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Corte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFinal" DATETIME NOT NULL,
    "folioInicial" INTEGER NOT NULL,
    "folioFinal" INTEGER NOT NULL,
    "fondoInicio" REAL NOT NULL,
    "fondoFinal" REAL NOT NULL,
    "total" REAL NOT NULL
);
INSERT INTO "new_Corte" ("fechaFinal", "fechaInicio", "folioInicial", "id", "total") SELECT "fechaFinal", "fechaInicio", "folioInicial", "id", "total" FROM "Corte";
DROP TABLE "Corte";
ALTER TABLE "new_Corte" RENAME TO "Corte";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
