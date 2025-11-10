import { Cargo } from "../models/Cargo";

export interface CargoItemDTO {
    id: number;
    itemName: string;
    totalQty: number;
}

export interface CargoDTO {
    id: number;
    orderNumber: string;
    customerId: number;
    email: string;
    totalUniqueProducts: number;
    totalQty: number;
    items: CargoItemDTO[];
}

export const CargoDTOMapper = {
    fromModel(data: Cargo): CargoDTO {
        return {
            id: data.id!,
            orderNumber: data.orderNumber,
            customerId: data.customerId,
            email: data.email,
            totalUniqueProducts: data.totalUniqueProducts,
            totalQty: data.totalQty,
            items: data.items.map(i => ({
                id: i.id!,
                itemName: i.itemName,
                totalQty: i.totalQty,
            })),
        };
    },
    fromModels(data: Cargo[]): CargoDTO[] {
        return data.map(this.fromModel);
    },
};
