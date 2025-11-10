import { ICargoRepository } from "../interfaces/ICargoRepository";
import { Cargo } from "../models/Cargo";
import { PrismaClient, CargoStatus } from "../generated/prisma";

export class CargoRepository implements ICargoRepository {

    private _prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this._prisma = prisma;
    }

    async create(cargo: Cargo): Promise<Cargo> {
        const created = await this._prisma.cargo.create({
            data: {
                order_number: cargo.orderNumber,
                customer_id: cargo.customerId,
                email: cargo.email,
                total_unique_products: cargo.totalUniqueProducts,
                total_qty: cargo.totalQty,
                tracking_number: cargo.trackingNumber,
                items: {
                    create: cargo.items.map(item => ({
                        item_name: item.itemName,
                        total_qty: item.totalQty,
                    })),
                },
            },
            include: { items: true }
        });

        return new Cargo(
            created.order_number,
            created.customer_id,
            created.email,
            created.total_unique_products,
            created.total_qty,
            created.items.map(i => ({
                itemName: i.item_name,
                totalQty: i.total_qty,
                id: i.id
            })),
            created.status,
            created.tracking_number,
            created.id
        )
    }

    async findById(id: number): Promise<Cargo | null> {
        const cargo = await this._prisma.cargo.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!cargo) return null;

        return new Cargo(
            cargo.order_number,
            cargo.customer_id,
            cargo.email,
            cargo.total_unique_products,
            cargo.total_qty,
            cargo.items.map(i => ({
                itemName: i.item_name,
                totalQty: i.total_qty,
                id: i.id,
            })),
            cargo.status,
            cargo.tracking_number,
            cargo.id
        );
    }

    async findAll(): Promise<Cargo[]> {
        const cargos = await this._prisma.cargo.findMany({
            include: { items: true }
        });

        return cargos.map(c => new Cargo(
            c.order_number,
            c.customer_id,
            c.email,
            c.total_unique_products,
            c.total_qty,
            c.items.map(i => ({
                itemName: i.item_name,
                totalQty: i.total_qty,
                id: i.id,
            })),
            c.status,
            c.tracking_number,
            c.id
        ));
    }

    async updateStatus(id: number, status: string): Promise<Cargo> {
        const cargoStatus = status as CargoStatus;

        const updated = await this._prisma.cargo.update({
            where: { id },
            data: {
                status: cargoStatus,
            },
            include: { items: true }
        });

        return new Cargo(
            updated.order_number,
            updated.customer_id,
            updated.email,
            updated.total_unique_products,
            updated.total_qty,
            updated.items.map(i => ({
                itemName: i.item_name,
                totalQty: i.total_qty,
                id: i.id,
            })),
            updated.status,
            updated.tracking_number,
            updated.id
        );
    }
}
