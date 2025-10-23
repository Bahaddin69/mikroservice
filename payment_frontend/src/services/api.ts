import axios from "axios";

const AUTH_BASE_URL = "http://localhost:9000";
const ORDER_BASE_URL = "http://localhost:9002";
const PAYMENT_BASE_URL = "http://localhost:9003";

export const loginApi = async (credentials) => {
    try {
        const response = await axios.post(
            `${AUTH_BASE_URL}/auth/login`,
            credentials
        ); // API endpoint
        return response;
    } catch (error: any) {
        return error.response;
    }
};

export const addCartApi = async (productId, qty) => {
    try {
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${localStorage.getItem("token")}`;
        const response = await axios.post(`${ORDER_BASE_URL}/cart`, {
            productId,
            qty,
        });
        return response;
    } catch (error: any) {
        return error.response;
    }
};

export const getCartApi = async () => {
    try {
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${localStorage.getItem("token")}`;
        const response = await axios.get(`${ORDER_BASE_URL}/cart`);
        return response;
    } catch (error: any) {
        return error.response;
    }
};

export const placeOrderApi = async () => {
    try {
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${localStorage.getItem("token")}`;
        const response = await axios.post(`${ORDER_BASE_URL}/orders`);
        return response;
    } catch (error: any) {
        return error.response;
    }
};

export const createPaymentApi = async (orderNumber) => {
    try {
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${localStorage.getItem("token")}`;
        const response = await axios.post(`${PAYMENT_BASE_URL}/create-payment`, {
            orderNumber,
        });

        return response;
    } catch (error: any) {
        return error.response;
    }
};

export const verifyPaymentApi = async (paymentId) => {
    try {
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${localStorage.getItem("token")}`;
        const response = await axios.get(
            `${PAYMENT_BASE_URL}/verify-payment/${paymentId}`
        );
        return response;
    } catch (error: any) {
        return error.response;
    }
};
