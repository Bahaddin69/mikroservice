import { GetOrderDetails } from "../utils";
import { PaymentGateway } from "../utils";
import { SendPaymentUpdateMessage } from "./broker.service";

export const CreatePayment = async (
    userId: number,
    orderNumber: number,
    paymentGateway: PaymentGateway
) => {
    // 1. Order servisinden sipariş detaylarını alacaksın
    const order = await GetOrderDetails(orderNumber);
    if (order.customerId !== userId) throw new Error("user not authorised to create payment");

    // 2. Yeni bir payment kaydı oluşturacaksın
    // Bu kaydı kendi payment_service veritabanında tutarsın:
    // userId, orderId, status: "pending", amount vs.
    const amountInCents = Math.max(order.amount * 100, 100);
    const orderMetaData = {
        orderNumber: order.orderNumber,
        userId: userId
    };
    // 3. Payment Gateway çağrısı yapacaksın
    // Mesela Stripe, Iyzico, PayPal API'sine istek atılır.
    // Burada gateway sana bir "payment intent" veya "checkout session" döner.
    const paymentResponse = await paymentGateway.createPayment(amountInCents, orderMetaData);
    console.log(paymentResponse);
    // 4. Kullanıcıya geri döneceğin şey
    // Payment sayfasını açabilmesi için gerekli secret/public key ve ödeme tutarı.
    return {
        secret: paymentResponse.secret,  // gateway'den gelen token/secret
        pubKey: paymentResponse.pubKey, // frontend'in ödeme başlatması için kullanılacak key
        amount: paymentResponse.amount, // ödenecek tutar,
        order: order // just to test
    };
};

export const verifyPayment = async (
    paymentId: string,
    paymentGateway: PaymentGateway
) => {
    // 1. Payment Gateway'e doğrulama isteği at
    // Örn: Stripe, PayPal, Iyzico API'sine gidip paymentId üzerinden
    // bu ödemenin gerçekten başarılı olup olmadığını sorarsın.
    const paymentResponse = await paymentGateway.getPayment(paymentId);
    console.log("PaymentStatus", paymentResponse.status);
    console.log("PaymentLog", paymentResponse.paymentLog);

    // 2. Gelen cevaba göre kendi veritabanındaki payment kaydını güncelle
    // status: "success" ya da "failed" şeklinde update edilir.
    const response = await SendPaymentUpdateMessage({
        orderNumber: paymentResponse.orderNumber,
        status: paymentResponse.status,
        paymentLog: paymentResponse.paymentLog
    });

    console.log("Message broker response", response);
    // 3. Order Service'e mesaj gönder (message broker ile, örn: Kafka)
    // "orderId şu, payment başarılı/başarısız" diye bildirirsin.
    // Böylece Order Service siparişin durumunu "paid" yapabilir.

    // 4. Frontend'e response döndür (opsiyonel)
    // Burada kullanıcıya "ödeme başarılı" ya da "ödeme başarısız"
    // şeklinde bilgi verebilirsin.
    return {
        message: "Payment verified",
        status: paymentResponse.status,
        paymentLog: paymentResponse.paymentLog
    };
};
