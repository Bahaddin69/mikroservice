/*
  Warnings:

  - A unique constraint covering the columns `[tracking_number]` on the table `Cargo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CargoStatus" AS ENUM ('PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Cargo" ADD COLUMN     "status" "CargoStatus" NOT NULL DEFAULT 'PREPARING',
ADD COLUMN     "tracking_number" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Cargo_tracking_number_key" ON "Cargo"("tracking_number");
