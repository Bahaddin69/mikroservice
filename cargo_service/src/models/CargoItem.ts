export class CargoItem {
    constructor(
        public readonly itemName: string,
        public readonly totalQty: number,
        public readonly id?: number
    ) { }
}
