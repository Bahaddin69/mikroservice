import { Consumer } from "kafkajs";
import { MessageBroker } from "../utils/broker";
import { MessageType, OrderEvent } from "../types";
import { sendEmail } from "./email.service";

const HandleSubscription = async (message: MessageType) => {

    const { event, data } = message;

    if (event === OrderEvent.SEND_EMAIL) {
        await sendEmail(
            data.email,
            "Sipariş Onayı",
            `<p>Siparişiniz <strong>${data.orderNumber}</strong> başarıyla verildi.</p>`
        );
        console.log(`Email sent to ${data.email} for order ${data.orderNumber}`);
    }

    if (event === OrderEvent.SEND_EMAIL_CARGO_STATUS_SHIPPED) {

        const { email, status, orderNumber } = data;

        if (status === "SHIPPED") {
            await sendEmail(
                email,
                "Kargonuz yola çıktı",
                `<p><strong>${orderNumber}</strong> siparişiniz için kargonuz yola çıktı.</p>`
            );
            console.log(`${orderNumber} siparişinin durumun yola çıktı email gönderildi`);
        }

        if (status === "CANCELLED") {
            await sendEmail(
                email,
                "Kargonuz iptal edildi",
                `<p><strong>${orderNumber}</strong> siparişiniz için kargonuz iptal edildi.</p>`
            );
            console.log(`${orderNumber} siparişinin durumun iptal edildi email gönderildi`);
        }
    }
}

export const InitializeBroker = async () => {
    const consumer = await MessageBroker.connectConsumer<Consumer>();

    consumer.on("consumer.connect", () => {
        console.log("EmailService Consumer connected successfully");
    });

    await MessageBroker.subscribe(HandleSubscription, ["OrderEvents", "EmailEvents"]);
};
