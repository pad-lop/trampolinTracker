-- CreateTable
CREATE TABLE "Corte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechaInicio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFinal" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "folioInicial" INTEGER NOT NULL,
    "folioFinal" INTEGER NOT NULL,
    "fondo" REAL NOT NULL,
    "total" REAL NOT NULL
);

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
    "corteId" INTEGER,
    CONSTRAINT "ReceiptRow_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReceiptRow_corteId_fkey" FOREIGN KEY ("corteId") REFERENCES "Corte" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ReceiptRow" ("cantidad", "descripcion", "fecha", "id", "nombre", "precio", "receiptId", "subtotal", "tiempoRentado", "tipo") SELECT "cantidad", "descripcion", "fecha", "id", "nombre", "precio", "receiptId", "subtotal", "tiempoRentado", "tipo" FROM "ReceiptRow";
DROP TABLE "ReceiptRow";
ALTER TABLE "new_ReceiptRow" RENAME TO "ReceiptRow";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
