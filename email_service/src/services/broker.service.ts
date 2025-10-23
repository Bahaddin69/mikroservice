import { Consumer } from "kafkajs";
import { MessageBroker } from "../utils/broker";
import { MessageType } from "../types";
import { sendEmail } from "./email.service";

// Event geldiğinde yapılacak işlem
const HandleSubscription = async (message: MessageType) => {
    console.log("OrderService event geldi:", message.event, message.data);

    const { event, data } = message;

    if (event === "send_email") {
        await sendEmail(
            data.email,
            "Order Confirmation",
            `<p>Your order <strong>${data.orderNumber}</strong> has been successfully placed.</p>`
        );
        console.log(`Email sent to ${data.email} for order ${data.orderNumber}`);
    }

};

export const InitializeBroker = async () => {
    const consumer = await MessageBroker.connectConsumer<Consumer>();

    consumer.on("consumer.connect", () => {
        console.log("EmailService Consumer connected successfully");
    });

    // OrderEvents topic'ine abone ol
    await MessageBroker.subscribe(HandleSubscription, "OrderEvents");
};
