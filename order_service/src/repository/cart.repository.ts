import { DB } from "../db/db.connection";
import { Cart, CartLineItem, cartLineItems, carts } from "../db/schema";
import { CartWithLineItems } from "../dto/cartRequest.dto";
import { NotFoundError } from "../utils";
import { eq } from "drizzle-orm";

export type CartRepositoryType = {
    createCart: (customerId: number, lineItem: CartLineItem) => Promise<number>;
    findCart: (id: number) => Promise<CartWithLineItems>;
    updateCart: (id: number, qty: number) => Promise<CartLineItem>;
    deleteCart: (id: number) => Promise<Boolean>;
    clearCartData: (id: number) => Promise<Boolean>;
    findCartByProductId: (
        customerId: number,
        productId: number
    ) => Promise<CartLineItem | null>;
};

const createCart = async (
    customerId: number,
    { itemName, price, productId, qty, variant }: CartLineItem
): Promise<number> => {
    const result = await DB.insert(carts)
        .values({
            customerId: customerId,
        })
        .returning()
        .onConflictDoUpdate({
            target: carts.customerId,
            set: { updatedAt: new Date() },
        });

    const [{ id }] = result;

    if (id > 0) {
        await DB.insert(cartLineItems).values({
            cartId: id,
            productId: productId,
            itemName: itemName,
            price: price,
            qty: qty,
            variant: variant,
        });
    }
    return id;
};

const findCart = async (id: number): Promise<CartWithLineItems> => {
    const cart = await DB.query.carts.findFirst({
        where: eq(carts.customerId, id),
        with: {
            lineItems: true,
        },
    });

    if (!cart) {
        throw new NotFoundError("cart not found");
    }

    return cart;
};

const updateCart = async (id: number, qty: number): Promise<CartLineItem> => {
    const [cartLineItem] = await DB.update(cartLineItems)
        .set({
            qty: qty,
        })
        .where(eq(cartLineItems.id, id))
        .returning();
    return cartLineItem;
};

const deleteCart = async (id: number): Promise<boolean> => {
    console.log("Proposed ID", id);
    await DB.delete(cartLineItems).where(eq(cartLineItems.id, id)).returning();
    return true;
};

const clearCartData = async (customerId: number): Promise<boolean> => {
    const cart = await DB.query.carts.findFirst({
        where: eq(carts.customerId, customerId)
    });

    if (cart)
        await DB.delete(carts).where(eq(carts.id, cart.id));

    return true;
};


const findCartByProductId = async (
    customerId: number,
    productId: number
): Promise<CartLineItem | null> => {
    const cart = await DB.query.carts.findFirst({
        where: eq(carts.customerId, customerId),
        with: {
            lineItems: true,
        },
    });

    if (!cart) return null;

    const lineItem = cart.lineItems.find((item) => item.productId === productId);
    return lineItem ?? null;
};

export const CartRepository: CartRepositoryType = {
    createCart,
    findCart,
    updateCart,
    deleteCart,
    clearCartData,
    findCartByProductId,
};
