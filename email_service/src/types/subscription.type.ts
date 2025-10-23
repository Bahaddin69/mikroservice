export enum OrderEvent {
    SEND_EMAIL = 'send_email'
}

export type TOPIC_TYPE = "OrderEvents";

export interface MessageType {
    headers?: Record<string, any>;
    event: OrderEvent;
    data: Record<string, any>;
}
