export enum OrderEvent {
    SEND_EMAIL = 'send_email',
    SEND_EMAIL_CARGO_STATUS_SHIPPED = 'send_email_cargo_status_shipped',
    SEND_EMAIL_CARGO_STATUS = 'send_email_cargo_status',
}

export type TOPIC_TYPE = "OrderEvents" | "EmailEvents" | "CargoEvents";

export interface MessageType {
    headers?: Record<string, any>;
    event: OrderEvent;
    data: Record<string, any>;
}

