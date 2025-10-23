import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../services/user.service';
import { LoginRequestDTO, RegisterUserRequestDTO, UserResponseDTO } from '../dto/user.dto';
import { JWTPayload } from '../types/user.types';
dotenv.config();

const router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const generateToken = (user: JWTPayload): string => {
    return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });
}

router.post('/register', async (req: Request, res: Response) => {
    try {

        const dto: RegisterUserRequestDTO = req.body;

        const existsUser = await userRepository.findUserByEmail(dto.email);
        if (existsUser)
            return res.status(400).json({ message: "already user exists" })

        const hashedPassword = await bcrypt.hash(String(dto.password), 10);

        const user = await userService.createUser({
            ...dto,
            password: hashedPassword
        });

        const response: UserResponseDTO = {
            id: user.id!,
            email: user.email,
            name: user.name,
            surname: user.surname,
            phone_number: user.phone_number
        };

        return res.status(200).json({ message: "create user", user: response })

    } catch (error) {

    }
});

// buraya yarın test edilecek
router.post('/login', async (req: Request, res: Response) => {

    const { email, password }: LoginRequestDTO = req.body;

    const user = await userRepository.findUserByEmail(email);
    if (!user)
        return res.status(404).json({ message: "user not found" });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
        return res.status(400).json({ message: "invalid password" });

    const token = generateToken({ id: user.id!, email: user.email });

    return res.status(200).json({ message: "login successful", token });
});

router.get("/validate", async (req: Request, res: Response) => {
    const token = req.headers["authorization"];
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });

    try {
        const tokenData = token.split(" ")[1];
        const user = jwt.verify(tokenData, process.env.JWT_SECRET as string) as JWTPayload;
        return res.status(200).json({ ...user });
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
});

export default router;
