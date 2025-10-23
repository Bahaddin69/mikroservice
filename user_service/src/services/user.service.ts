import { IUserRepository } from "../interfaces/userRepository.interface";
import { UserModel } from "../models/users.model";

export class UserService {

    private readonly _repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this._repository = repository;
    }

    async createUser(input: UserModel) {
        return await this._repository.create(input);
    }

    async updateUser(input: UserModel) {
        return await this._repository.update(input);
    }

    async deleteUser(id: number) {
        const response = await this._repository.delete(id);
        if (!response) throw new Error("user not found");
        return response;
    }

    async findUser(id: number) {
        const user = await this._repository.findOne(id);
        if (!user) throw new Error("User not found");
        return user;
    }

}
