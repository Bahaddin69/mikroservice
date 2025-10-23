import express, { NextFunction, Request, Response } from 'express'
import { RequestAuthorizer } from './middleware';
import * as service from '../service/order.service'
import { OrderRepository } from '../repository/order.repository';
import { CartRepository } from '../repository/cart.repository';
import { OrderStatus } from '../types';

const repo = OrderRepository;
const cartRepo = CartRepository;
const router = express.Router();

router.post('/orders', RequestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        next(new Error("user not found"));
        return;
    }

    const response = await service.CreateOrder(user.id, repo, cartRepo);

    return res.status(200).json(response);
});

router.get('/orders', RequestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        next(new Error("user not found"));
        return;
    }

    const response = await service.GetOrders(user.id, repo)
    return res.status(200).json(response);
});

router.get('/order/:id', async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        next(new Error("user not found"));
        return;
    }

    const response = await service.GetOrder(user.id, repo);
    return res.status(200).json(response);
});

router.patch('/order/:id', async (req: Request, res: Response, next: NextFunction) => {
    const orderId = parseInt(req.params.id);
    const status = req.body.status as OrderStatus;
    const response = await service.UpdateOrder(orderId, status, repo);
    return res.status(200).json(response);
});

router.delete('/order/:id', RequestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        next(new Error("user not found"));
        return;
    }
    const orderId = parseInt(req.params.id);
    const response = await service.DeleteOrder(orderId, repo);
    return res.status(200).json(response);
});

router.get('/orders/:id/checkout', async (req: Request, res: Response) => {
    const orderNumber = parseInt(req.params.id);
    const response = await service.CheckoutOrder(orderNumber, repo);
    return res.status(200).json(response);
});

export default router;
