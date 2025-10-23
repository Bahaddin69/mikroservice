import { InProcessOrder, OrderLineItemType, OrderWithLineItems } from "../dto/orderRequest.dto";
import { CartRepositoryType } from "../repository/cart.repository";
import { OrderRepository, OrderRepositoryType } from "../repository/order.repository";
import { MessageType, OrderEvent, OrderStatus } from "../types";
import { SendCreateOrderMessage, PublishSendEmailEvent, SendOrderCanceledMessage } from "./broker.service";

export const CreateOrder = async (userId: number, repo: OrderRepositoryType, cartRepo: CartRepositoryType) => {

    const cart = await cartRepo.findCart(userId);
    if (!cart)
        throw new Error("cart not found");

    let cartTotal = 0;
    let orderLineItems: OrderLineItemType[] = [];

    cart.lineItems.forEach((item) => {
        orderLineItems.push({
            productId: item.productId,
            itemName: item.itemName,
            qty: item.qty,
            price: item.price,
        } as OrderLineItemType);
    });

    const orderNumber = Math.floor(Math.random() * 1000000);

    const orderInput: OrderWithLineItems = {
        orderNumber: orderNumber,
        txnId: null,
        status: OrderStatus.PENDING,
        customerId: userId,
        amount: cartTotal.toString(),
        orderItems: orderLineItems
    };

    const order = await repo.createOrder(orderInput);
    await cartRepo.clearCartData(userId);
    console.log("order created", order);

    await SendCreateOrderMessage(orderInput);
    return { message: "Order created successfully", orderNumber: orderNumber };
};

export const UpdateOrder = async (orderId: number, status: OrderStatus, repo: OrderRepositoryType) => {

    await repo.updateOrder(orderId, status);

    return { message: "Order update successfully" }
}

export const GetOrder = async (orderId: number, repo: OrderRepositoryType) => {
    const order = await repo.findOrder(orderId);
    if (!order)
        throw new Error("order not found")

    return order;
};

export const GetOrders = async (userId: number, repo: OrderRepositoryType) => {
    const orders = await repo.findOrdersByCustomerId(userId);
    if (!Array.isArray(orders))
        throw new Error("orders not found")

    return orders;
};

export const DeleteOrder = async (orderId: number, repo: OrderRepositoryType) => {
    const order = await repo.findOrder(orderId);
    if (!order)
        throw new Error("order not found");

    console.log("order item neymiş amk", order.orderItems);

    const items = order.orderItems.map(item => ({
        productName: item.itemName,
        qty: item.qty
    }));

    console.log("itemsden gelen veri", items);

    await repo.deleteOrder(orderId);

    await SendOrderCanceledMessage({ items });
    return true;
};

export const HandleSubcription = async (message: MessageType) => {
    console.log("Message received by order kafka consumer", message);

    const { event, data } = message;

    if (event === OrderEvent.UPDATE_PAYMENT) {
        console.log("event update_payment geldi", data);

        const { orderNumber, status } = data.data;

        console.log("sipariş numarası",
            orderNumber,
            "sipariş durumu", status
        );

        try {
            const response = await OrderRepository.findOrderByNumber(orderNumber);
            if (!response) throw new Error("sipariş bulunamadı");
            console.log("sipariş bulundu", response);

            const txnId = data.data.paymentLog.id;
            console.log("paymentId", txnId);

            if (!txnId) throw new Error("paymentId not found");

            if (status === "succeeded") {
                await OrderRepository.updateOrder(Number(response.id), OrderStatus.SUCCEEDED, txnId);
                console.log("sipariş durumu güncellendi");
                const resultLog = await PublishSendEmailEvent({
                    orderNumber: response.orderNumber,
                    customerId: response.customerId,
                    email: "bahaddinkumru7@gmail.com"

                    // burada kullanıcının sipariş ettiği ürün listesine gerek var mı
                });

                console.log("email event gönderildi", resultLog);
            } else {
                await OrderRepository.updateOrder(Number(response.id), OrderStatus.FAILED, txnId);
                console.log("sipariş durumu başarısız olarak güncellendi");
            }

        } catch (error) {
            console.log("sipariş bulunamadı", error);
            return;
        }
    }
};

export const CheckoutOrder = async (orderId: number, repo: OrderRepositoryType) => {
    const order = await repo.findOrderByNumber(orderId);
    if (!order) throw new Error("order not found");

    const checkoutOrder: InProcessOrder = {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status ?? OrderStatus.PENDING,
        customerId: order.customerId,
        amount: Number(order.amount),
        createdAt: order.createdAt,
        UpdatedAt: order.updatedAt
    };

    return checkoutOrder;
};
