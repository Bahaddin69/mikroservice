import { CargoItem } from "./CargoItem";
import { CargoStatus } from "../generated/prisma";

export class Cargo {
    constructor(
        public readonly orderNumber: string,
        public readonly customerId: number,
        public readonly email: string,
        public readonly totalUniqueProducts: number,
        public readonly totalQty: number,
        public readonly items: CargoItem[],
        public readonly status: CargoStatus,
        public readonly trackingNumber: string,
        public readonly id?: number
    ) { }
}
