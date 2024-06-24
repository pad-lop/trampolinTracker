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
    "total" REAL,
    "estado" TEXT NOT NULL DEFAULT 'abierto'
);
INSERT INTO "new_Corte" ("fechaFinal", "fechaInicio", "folioFinal", "folioInicial", "fondoFinal", "fondoInicio", "id", "total") SELECT "fechaFinal", "fechaInicio", "folioFinal", "folioInicial", "fondoFinal", "fondoInicio", "id", "total" FROM "Corte";
DROP TABLE "Corte";
ALTER TABLE "new_Corte" RENAME TO "Corte";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
