import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../interfaces/userRepository.interface";
import { UserModel } from "../models/users.model";


export class UserRepository implements IUserRepository {

    private _prisma: PrismaClient;

    constructor() {
        this._prisma = new PrismaClient();
    }

    async create(data: UserModel): Promise<UserModel> {
        return await this._prisma.user.create({ data });
    }

    async update(data: UserModel): Promise<UserModel> {
        const user = await this._prisma.user.update({
            where: { id: data.id },
            data
        });

        if (!user.id) throw new Error("user not id");

        return user;
    }

    async delete(id: number): Promise<UserModel> {
        const user = await this._prisma.user.delete({
            where: { id }
        });

        return user;
    }

    async findOne(id: number): Promise<UserModel> {
        const user = await this._prisma.user.findFirst({
            where: { id }
        });

        if (user) return Promise.resolve(user);

        throw new Error("User not found");
    }

    async findUserByEmail(email: string): Promise<UserModel | null> {
        const user = await this._prisma.user.findUnique({ where: { email } });
        return user;
    }

}
