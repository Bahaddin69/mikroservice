export type RegisterUserRequestDTO = {
    name: string;
    surname: string;
    phone_number: string;
    email: string;
    password: string;
}

export type UserResponseDTO = {
    id?: number;
    name: string;
    surname: string;
    email: string;
    phone_number: string;
};

export type LoginRequestDTO = {
    email: string,
    password: string
}
