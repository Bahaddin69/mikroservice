import { Producer } from "kafkajs";
import { MessageBroker } from "../utils";
import { PaymentEvent } from "../types";

export const InitalizeBroker = async () => {
    const producer = await MessageBroker.connectProducer<Producer>();

    producer.on("producer.connect", async () => {
        console.log("Order Service Producer connected successfully");
    });
};

export const SendPaymentUpdateMessage = async (data: unknown) => {
    await MessageBroker.publish({
        event: PaymentEvent.UPDATE_PAYMENT,
        topic: "OrderEvents",
        headers: {},
        message: { data },
    });
};
