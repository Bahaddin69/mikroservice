export enum CargoEvent {
    CREATE_ORDER = 'create_order',
    CANCEL_ORDER = 'cancel_order',
    UPDATE_PAYMENT = 'update_payment',
    SEND_EMAIL = 'send_email',
    SEND_CARGO = 'send_cargo',
    SEND_EMAIL_CARGO_STATUS_SHIPPED = 'send_email_cargo_status_shipped',
    SEND_EMAIL_CARGO_STATUS = 'send_email_cargo_status'
}

export type TOPIC_TYPE = "OrderEvents" | "EmailEvents" | "CargoEvents";

export interface MessageType {
    headers?: Record<string, any>;
    event: CargoEvent;
    data: Record<string, any>;
}
