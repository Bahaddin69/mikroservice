export class UserModel {
    constructor(
        public readonly name: string,
        public readonly surname: string,
        public readonly email: string,
        public readonly password: string,
        public readonly phone_number: string,
        public readonly id?: number,
    ) { }
}
