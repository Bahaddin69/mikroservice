import { ICargoRepository } from "../interfaces/ICargoRepository";
import { Cargo } from "../models/Cargo";
import { PublishSendCargoStatus, PublishSendEmailCargoStatus } from "./broker.service";

export class CargoService {
    private _repository: ICargoRepository;

    constructor(repository: ICargoRepository) {
        this._repository = repository;
    }

    async createCargo(cargoData: Cargo) {
        const data = await this._repository.create(cargoData);
        return data;
    }

    async findById(id: number) {
        const data = await this._repository.findById(id);
        return data;
    }

    async findAll() {
        const cargos = await this._repository.findAll();
        return cargos;
    }

    async updateCargoStatus(id: number, status: string) {
        const updatedCargoStatus = await this._repository.updateStatus(id, status);

        await PublishSendCargoStatus({
            customerId: updatedCargoStatus.customerId,
            cargoId: updatedCargoStatus.id,
            status: updatedCargoStatus.status,
            trackingNumber: updatedCargoStatus.trackingNumber,
            orderNumber: updatedCargoStatus.orderNumber,
            email: updatedCargoStatus.email
        });

        await PublishSendEmailCargoStatus({
            email: updatedCargoStatus.email,
            status: updatedCargoStatus.status,
            orderNumber: updatedCargoStatus.orderNumber,
            message: "ben erenim"
        });

        return updatedCargoStatus;
    }
}
