-- CreateTable
CREATE TABLE "Cargo" (
    "id" SERIAL NOT NULL,
    "order_number" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "total_unique_products" INTEGER NOT NULL,
    "total_qty" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CargoItem" (
    "id" SERIAL NOT NULL,
    "cargo_id" INTEGER NOT NULL,
    "item_name" TEXT NOT NULL,
    "total_qty" INTEGER NOT NULL,

    CONSTRAINT "CargoItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CargoItem" ADD CONSTRAINT "CargoItem_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "Cargo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
