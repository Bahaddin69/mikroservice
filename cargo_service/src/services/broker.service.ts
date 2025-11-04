import { Consumer, Producer } from "kafkajs";
import { MessageBroker } from "../utils/broker";
import { CargoEvent, MessageType } from "../types";
import { CargoRepository } from "../repositories/CargoRepository";
import { CargoStatus, PrismaClient } from "../generated/prisma";
import { CargoItem } from "../models/CargoItem";
import { Cargo } from "../models/Cargo";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();
const cargoRepository = new CargoRepository(prisma);

const HandleSubscription = async (message: MessageType) => {
    console.log("OrderService event geldi:", message.event, message.data);

    const { event, data } = message;

    if (event === "send_cargo") {
        console.log("baba geldi hüseyin", data);

        try {
            const itemsToCreate = Object.entries(data.orderStats.itemStats).map(
                ([itemName, itemDetails]) => {
                    return new CargoItem(itemName, (itemDetails as any).totalQty);
                }
            );

            const tempTrackingNumber = nanoid(10);

            const cargoToCreate = new Cargo(
                data.orderStats.orderNumber,
                data.customerId,
                data.email,
                data.orderStats.totalUniqueProducts,
                data.orderStats.totalQty,
                itemsToCreate,
                CargoStatus.PREPARING,
                tempTrackingNumber
            );

            const newCargo = await cargoRepository.create(cargoToCreate);

            console.log("cargo is success create", newCargo);
        } catch (error) {
            console.error("Kargo oluşturulurken hata oluştu:", error);
        }
    }
};

export const InitializeBroker = async () => {

    const producer = await MessageBroker.connectProducer<Producer>();
    producer.on("producer.connect", async () => {
        console.log("Cargo Service Producer connected successfully");
    });

    const consumer = await MessageBroker.connectConsumer<Consumer>();

    consumer.on("consumer.connect", () => {
        console.log("CargoService Consumer connected successfully");
    });

    await MessageBroker.subscribe(HandleSubscription, "CargoEvents");
};

export const PublishSendCargoStatus = async (data: any) => {
    await MessageBroker.publish({
        event: CargoEvent.SEND_EMAIL_CARGO_STATUS,
        topic: "OrderEvents",
        headers: {},
        message: data
    });

    console.log("cargo status event publish edildi", data);
};

export const PublishSendEmailCargoStatus = async (data: any) => {
    await MessageBroker.publish({
        event: CargoEvent.SEND_EMAIL_CARGO_STATUS_SHIPPED,
        topic: "EmailEvents",
        headers: {},
        message: data
    });

    console.log("cargo status email event publish edildi", data);
}
