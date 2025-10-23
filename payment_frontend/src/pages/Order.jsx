import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    addCartApi,
    createPaymentApi,
    getCartApi,
    placeOrderApi,
} from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setOrder, setPayment } from "../store/userSlice";
import { PaymentForm } from "../components/PaymentForm";

const Order = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userReducer = useSelector((state) => state.auth);

    const [initiatePayment, setInitiatePayment] = useState(false);

    useEffect(() => {
        getCart();
    }, []);

    const getCart = async () => {
        try {
            const response = await getCartApi();
            console.log("response", response);
            if (response.status === 200) {
                console.log("response", response.data.token);
                dispatch(setCart(response.data));
                navigate("/orders");
            }
        } catch (error) {
            console.error("get cart failed:", error);
        }
    };

    const addToCart = async () => {
        try {
            const response = await addCartApi(7, 10);
            console.log("response", response);
            if (response.status === 200) {
                dispatch(setCart(response.data));
                await getCart();
            }
        } catch (error) {
            console.error("create cart failed:", error);
        }
    };

    const placeOrder = async () => {
        try {
            const response = await placeOrderApi();
            console.log("response", response);
            if (response.status === 200) {
                console.log("response", response.data.orderNumber);
                dispatch(setOrder(response.data));
                await createPayment(response.data.orderNumber);
            }
        } catch (error) {
            console.error("place order failed:", error);
        }
    };

    const createPayment = async (orderNumber) => {
        try {
            const response = await createPaymentApi(orderNumber);
            console.log("response", response);
            if (response.status === 200) {
                dispatch(setPayment(response.data.data));
                setInitiatePayment(true);
            }
        } catch (error) {
            console.error("Create payment failed:", error);
        }
    };

    if (initiatePayment) {
        console.log("eze", initiatePayment);
        return (
            <PaymentForm
                pk={userReducer.payment.pubKey}
                clientSecret={userReducer.payment.secret}
                orderId={userReducer.order.orderNumber}
                amount={userReducer.payment.amount}
            />
        );
    } else {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="card bg-white p-6 shadow-xl">
                    <h1>Order Page</h1>
                    <div className="flex flex-col items-center space-y-3 mt-10 mb-10 p-10 overflow-auto">
                        <pre>{JSON.stringify(userReducer, null, 2)}</pre>
                        <p>{JSON.stringify(userReducer.order)}</p>
                        <p>{JSON.stringify(userReducer.payment)}</p>
                    </div>

                    <div className="flex flex-col items-center space-y-3 mt-10 mb-10">
                        <button
                            type="submit"
                            className="btn btn-warning btn-lg w-1/3"
                            onClick={addToCart}
                        >
                            Add Item to Cart
                        </button>
                    </div>

                    <div className="flex flex-col items-center space-y-3 mt-10 mb-10">
                        <button
                            type="submit"
                            className="btn btn-warning btn-lg w-1/3"
                            onClick={placeOrder}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

export default Order;
