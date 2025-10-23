import { MessageType, OrderEvent, TOPIC_TYPE } from "../../types";

export interface PublishType {
    headers: Record<string, any>; // Mesajla birlikte ekstra meta bilgi
    topic: TOPIC_TYPE;            // Mesajın gönderileceği topic
    event: OrderEvent;            // O mesajın olayı (ör: ORDER_CREATED)
    message: Record<string, any>; // Mesajın asıl datası
}

export type MessageHandler = (input: MessageType) => void;

export type MessageBrokerType = {

    // producer
    connectProducer: <T>() => Promise<T>; // Producer bağlantısını açar ve instance döner
    disconnectProducer: () => Promise<void>; // Producer bağlantısını kapatır
    publish: (data: PublishType) => Promise<boolean>; // Mesajı broker'a yayınlar

    // consumer
    connectConsumer: <T>() => Promise<T>; // Consumer bağlantısını açar ve instance döner
    disconnectConsumer: () => Promise<void>; // Consumer bağlantısını kapatır
    subscribe: (messageHandler: MessageHandler, topic: TOPIC_TYPE) => Promise<void>; // Belirtilen topic'e abone olup mesajları dinler
}

