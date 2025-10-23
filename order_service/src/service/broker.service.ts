import { Consumer, Producer } from "kafkajs";
import { MessageBroker } from "../utils";
import { HandleSubcription } from "./order.service";
import { OrderEvent } from "../types";

export const InitalizeBroker = async () => {
    const producer = await MessageBroker.connectProducer<Producer>();
    producer.on("producer.connect", async () => {
        console.log("Order Service Producer connected successfully");
    });

    const consumer = await MessageBroker.connectConsumer<Consumer>();
    consumer.on("consumer.connect", async () => {
        console.log("Order Service Consumer connected successfully");
    });

    await MessageBroker.subscribe(HandleSubcription, "OrderEvents");  // Consumer'ı OrderEvents topic'ine abone et
};

// (İşlem bittikten sonra yeni bir event üret → örn: “OrderCreated”, “PaymentCompleted”)

export const SendCreateOrderMessage = async (data: any) => {
    await MessageBroker.publish({  // CatalogEvents topic'ine CREATE_ORDER eventi gönder
        event: OrderEvent.CREATE_ORDER,
        topic: "CatalogEvents",
        headers: {},
        message: data
    });
};

export const SendOrderCanceledMessage = async (data: any) => {
    await MessageBroker.publish({ // CatalogEvents topic'ine CANCEL_ORDER eventi gönder
        event: OrderEvent.CANCEL_ORDER,
        topic: "CatalogEvents",
        headers: {},
        message: data
    });
};

export const PublishSendEmailEvent = async (data: any) => {
    await MessageBroker.publish({
        event: OrderEvent.SEND_EMAIL,
        topic: "OrderEvents",
        headers: {},
        message: data
    });
};
