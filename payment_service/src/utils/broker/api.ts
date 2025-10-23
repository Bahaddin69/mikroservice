import axios from "axios";
import { AuthorizeError, NotFoundError } from "../error";
import { logger } from "../logger";
import { User } from "../../dto/User.Model";
import { InProcessOrder } from "../../dto/Order.model";

const ORDER_SERVICE_BASE_URL = process.env.ORDER_SERVICE_BASE_URL || "http://localhost:9002";
const AUTH_SERVICE_BASE_URL = process.env.AUTH_SERVICE_BASE_URL || "http://localhost:9000";

export const GetOrderDetails = async (orderNumber: number) => {

    try {
        const response = await axios.get(`${ORDER_SERVICE_BASE_URL}/orders/${orderNumber}/checkout`);
        return response.data as InProcessOrder;
    } catch (error) {
        logger.error(error);
        throw new NotFoundError("product not found");
    }
};

export const validateUser = async (token: string) => {

    try {
        const response = await axios.get(`${AUTH_SERVICE_BASE_URL}/auth/validate`, {
            headers: {
                Authorization: token
            }
        });

        if (response.status !== 200)
            throw new AuthorizeError("user not authorised");

        return response.data as User;

    } catch (error) {
        throw new AuthorizeError("user not authorised");
    }

};
