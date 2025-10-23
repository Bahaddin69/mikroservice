import Stripe from 'stripe';
import { PaymentGateway } from "./payment.type";

// İlk parametre: Stripe dashboard'dan aldığımız secret key (.env içinde tutuluyor)
// İkinci parametre: Stripe API versiyonu (belirtilmezse default kullanılır, burada manuel ayarlanmış)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-08-27.basil"
})

// createPayment fonksiyonu:
// - amount (ödeme tutarı) ve metadata (sipariş & kullanıcı bilgisi) alır
// - Stripe üzerinde yeni bir PaymentIntent oluşturur
// - Dönen paymentIntent nesnesinden client_secret ve tutarı alır
// - Ayrıca .env'deki public key'i de yanıt içine ekler
const createPayment = async (
    amount: number,
    metadata: { orderNumber: number; userId: number }
): Promise<{ secret: string; pubKey: string; amount: number }> => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount,   // Ödenecek miktar (ör. 1000 => $10.00)
        currency: "usd", // Para birimi
        metadata // Ekstra bilgi (sipariş id, kullanıcı id vs.)
    });

    return {
        secret: paymentIntent.client_secret as string, // Ödeme onayı için frontend'de kullanılacak secret
        pubKey: process.env.STRIPE_PUB_KEY as string, // Frontend tarafında Stripe.js için kullanılacak public key
        amount: paymentIntent.amount // Stripe'ın kabul ettiği ödeme miktarı
    }
};

// getPayment fonksiyonu:
// - paymentId parametresini alır (Stripe PaymentIntent id'si)
// - Stripe'tan ilgili ödeme bilgisini getirir
// - Ödeme durumunu (status) ve tüm ödeme logunu döner
const getPayment = async (
    paymentId: string
): Promise<Record<string, unknown>> => {
    const paymentResponse = await stripe.paymentIntents.retrieve(paymentId, {});
    const { status } = paymentResponse;
    console.log("PaymentStatus", JSON.stringify(paymentResponse.status));
    const orderNumber = paymentResponse?.metadata["orderNumber"];
    return { status, orderNumber, paymentLog: paymentResponse };
};

// StripePayment objesi, PaymentGateway tipini implemente ediyor.
// Bu sayede dışarıya standart bir interface üzerinden
// createPayment ve getPayment fonksiyonlarını export etmiş oluyoruz.
export const StripePayment: PaymentGateway = {
    createPayment,
    getPayment,
};
