import express, { Request, Response } from 'express';
import { CargoService } from '../services/cargo.service';
import { CargoRepository } from '../repositories/CargoRepository';
import { PrismaClient, CargoStatus } from '../generated/prisma';

const router = express.Router();

const prisma = new PrismaClient();
const repository = new CargoRepository(prisma);
const cargoService = new CargoService(repository);

router.post('/:id/status', async (req: Request, res: Response) => {
    try {
        const cargoId = Number(req.params.id);
        const { status, trackingNumber } = req.body;

        if (!trackingNumber)
            return res.status(400).json({ message: "SHIPPED durumu için gerçek bir 'trackingNumber' gereklidir." });

        if (status === CargoStatus.PREPARING) {
            const updatedCargo = await cargoService.updateCargoStatus(cargoId, status);
            if (!updatedCargo)
                return res.status(404).json({ message: "Cargo not found" });

            return res.status(200).json({ message: "Cargo status updated to PREPARING" });
        }

        if (status === CargoStatus.SHIPPED) {
            const updatedCargo = await cargoService.updateCargoStatus(cargoId, status);
            if (!updatedCargo)
                return res.status(404).json({ message: "Cargo not found" });

            return res.status(200).json({ message: "Cargo status updated to SHIPPED" });
        }

        if (status === CargoStatus.DELIVERED) {
            const updatedCargo = await cargoService.updateCargoStatus(cargoId, status);
            if (!updatedCargo)
                return res.status(404).json({ message: "Cargo not found" });

            return res.status(200).json({ message: "Cargo status updated to DELIVERED" });
        }

        if (status === CargoStatus.CANCELLED) {
            const updatedCargo = await cargoService.updateCargoStatus(cargoId, status);
            if (!updatedCargo)
                return res.status(404).json({ message: "Cargo not found" });

            return res.status(200).json({ message: "Cargo status updated to CANCELLED" });
        }

        return res.status(400).json({ message: "Invalid status value" });

    } catch (error) {
        console.error("Error updating cargo status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
