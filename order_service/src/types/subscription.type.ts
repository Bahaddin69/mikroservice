export enum OrderEvent {
    CREATE_ORDER = 'create_order',
    CANCEL_ORDER = 'cancel_order',
    UPDATE_PAYMENT = 'update_payment',
    SEND_EMAIL = 'send_email',
    SEND_CARGO = 'send_cargo',
    SEND_EMAIL_CARGO_STATUS = 'send_email_cargo_status'
}

export type TOPIC_TYPE = "OrderEvents" | "CatalogEvents" | "EmailEvents" | "CargoEvents";

export interface MessageType {
    headers?: Record<string, any>;
    event: OrderEvent;
    data: Record<string, any>;
}
