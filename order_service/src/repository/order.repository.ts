import { DB } from "../db/db.connection";
import { orders, orderLineItems } from "../db/schema";
import { OrderWithLineItems } from "../dto/orderRequest.dto";
import { eq } from "drizzle-orm";
import { OrderStatus } from "../types";

export type OrderRepositoryType = {
    createOrder: (lineItem: OrderWithLineItems) => Promise<number>;
    findOrder: (id: number) => Promise<OrderWithLineItems | null>;
    findOrderByNumber: (orderNumber: number) => Promise<OrderWithLineItems | null>;
    updateOrder: (id: number, status: string, txnId?: string) => Promise<OrderWithLineItems>;
    deleteOrder: (id: number) => Promise<boolean>;
    findOrdersByCustomerId: (customerId: number) => Promise<OrderWithLineItems[]>;
};

const createOrder = async (lineItem: OrderWithLineItems): Promise<number> => {
    const result = await DB.insert(orders)
        .values({
            customerId: lineItem.customerId,
            orderNumber: lineItem.orderNumber,
            status: lineItem.status,
            txnId: lineItem.txnId,
            amount: lineItem.amount,
        })
        .returning();

    const [{ id }] = result;

    if (id > 0) {
        for (const item of lineItem.orderItems) {
            await DB.insert(orderLineItems)
                .values({
                    orderId: id,
                    itemName: item.itemName,
                    price: item.price,
                    qty: item.qty,
                })
                .execute();
        }
    }

    return id;
};


const findOrder = async (id: number): Promise<OrderWithLineItems | null> => {
    const order = await DB.query.orders.findFirst({
        where: eq(orders.id, id),
        with: {
            lineItems: true,
        },
    });

    if (!order) return null;

    return {
        ...order,
        orderItems: order.lineItems,
        status: order.status ?? OrderStatus.PENDING
    };
};

const updateOrder = async (id: number, status: string, txnId?: string): Promise<OrderWithLineItems> => {
    await DB.update(orders)
        .set({ status, txnId })
        .where(eq(orders.id, id))
        .execute();

    const order = await findOrder(id);
    if (!order) throw new Error("Order not found");

    return order;
};

const deleteOrder = async (id: number): Promise<boolean> => {
    await DB.delete(orders)
        .where(eq(orders.id, id))
        .execute();

    return true;
};

const findOrdersByCustomerId = async (customerId: number): Promise<OrderWithLineItems[]> => {
    const ordersList = await DB.query.orders.findMany({
        where: eq(orders.customerId, customerId),
        with: {
            lineItems: true,
        },
    });

    return ordersList as unknown as OrderWithLineItems[];
};

const findOrderByNumber = async (orderNumber: number): Promise<OrderWithLineItems | null> => {
    const order = await DB.query.orders.findFirst({
        where: eq(orders.orderNumber, orderNumber),
        with: {
            lineItems: true,
        },
    });

    if (!order) throw new Error("Order not found");

    return order as unknown as OrderWithLineItems;
}

export const OrderRepository: OrderRepositoryType = {
    createOrder,
    findOrder,
    findOrderByNumber,
    findOrdersByCustomerId,
    updateOrder,
    deleteOrder,
};
