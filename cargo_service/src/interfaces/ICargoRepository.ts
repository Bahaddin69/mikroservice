import { Cargo } from "../models/Cargo";

export interface ICargoRepository {
    create(cargo: Cargo): Promise<Cargo>;
    findById(id: number): Promise<Cargo | null>;
    findAll(): Promise<Cargo[]>;
    updateStatus(id: number, status: string): Promise<Cargo>;
}
