import { UserModel } from "../models/users.model";

export interface IUserRepository {
    create(data: UserModel): Promise<UserModel>;
    update(data: UserModel): Promise<UserModel>;
    delete(id: number): Promise<UserModel>;
    findOne(id: number): Promise<UserModel>;
    findUserByEmail(email: string): Promise<UserModel | null>;
}
