/* eslint-disable react/prop-types */
/*
{"secret":"pi_3QsgjXHV4CtDYt8I1sYFxyCo_secret_YWA39LVFENmagFLOv8OS762vx","pubKey":"pk_test_51P2spaHV4CtDYt8IyyyedSikLgfWPRJmY6KlJ3ygqWvH7zv5ipvPCiyV8X5BytsDKSsSqDBIRKg8R1EhME7KEcpv00vpIjO0gu","amount":1400}
*/
import {
    useStripe,
    useElements,
    PaymentElement,
    Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { verifyPaymentApi } from "../services/api";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ onHandleReturn }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        const response = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
            confirmParams: {
                return_url: `${window.location.origin}/verify`,
            },
        });
        onHandleReturn(response);
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <div
                className="col-12 mt_35 wow fadeInUp"
                style={{ justifyContent: "flex-end", display: "flex" }}
            >
                <button
                    className="btn btn-warning w-full mt-4"
                    style={{ width: 150 }}
                    onClick={() => { }}
                    disabled={!stripe}
                >
                    Pay
                </button>
            </div>
        </form>
    );
};

export const PaymentForm = ({ clientSecret, pk, orderId, amount }) => {
    const navigate = useNavigate();

    const appearance = {
        theme: "flat",
        variables: {
            fontWeightNormal: "500",
            borderRadius: "2px",
            colorBackground: "white",
            colorPrimary: "#DF1B41",
            colorPrimaryText: "white",
            spacingGridRow: "15px",
        },
        rules: {
            ".Label": {
                marginBottom: "6px",
            },
            ".Tab, .Input, .Block": {
                boxShadow: "0px 3px 10px rgba(18, 42, 66, 0.08)",
                padding: "12px",
            },
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    const stripePromise = () => {
        return loadStripe(pk);
    };

    const onHandleReturnUrl = async (response) => {
        console.log("response Payment response", response);
        try {
            const { error, paymentIntent } = response;
            if (paymentIntent) {
                if (paymentIntent.status === "succeeded") {
                    const verificationResult = await verifyPaymentApi(paymentIntent.id);
                    console.log("verificationResult", verificationResult);
                    toast("Payment Successful and Order confirmed", {
                        type: "success",
                    });
                    navigate("/order-success");
                }
            } else {
                if (error) {
                    toast("Error on payment! Kindly Check with your Card Issuer. ", {
                        type: "error",
                    });
                }
            }
        } catch (error) {
            toast("Error on payment! Kindly Check with your Card Issuer. " + error, {
                type: "error",
            });
        }
    };

    if (clientSecret && pk) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="card w-1/2 bg-white p-6 shadow-xl">
                    <div className="flex flex-col items-center space-y-3 mt-10 mb-10 p-10 overflow-auto">
                        <div className="row">
                            <div className="col-xl-6 col-lg-6 wow fadeInLeft">
                                <h2 style={{ marginTop: 20, marginBottom: 20 }}>
                                    Pay to Continue
                                </h2>
                                <p style={{ fontSize: "1.1rem" }}>
                                    Order ID: {" Available with Invoice email"}
                                    <span style={{ color: "#000", fontSize: "1.2rem" }}>
                                        {orderId}
                                    </span>
                                </p>
                                <p style={{ fontSize: "1.1rem" }}>
                                    Total Payable Amount:{" "}
                                    <span style={{ color: "#000", fontSize: "1.2rem" }}>
                                        ${amount.toFixed(2)}
                                    </span>
                                </p>
                            </div>
                            <div className="col-xl-6 col-lg-6 wow fadeInRight">
                                <div style={{ maxWidth: 420 }}>
                                    <Elements options={options} stripe={stripePromise()}>
                                        <CheckoutForm onHandleReturn={onHandleReturnUrl} />
                                    </Elements>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <section className="tf__about_us_page mt_195 xs_mt_100">
                <p>Preparing Payment</p>
                <p>ClientSecret: {clientSecret}</p>
                <p>Private Key: {pk}</p>
            </section>
        );
    }
};
