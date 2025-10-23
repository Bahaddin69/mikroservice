import * as Repository from "../repository/cart.repository";
import { CreateCart } from "../service/cart.service";
import { CartRequestInput } from "../dto/cartRequest.dto";

describe("cartService", () => {
    let repo: Repository.CartRepositoryType;

    beforeEach(() => {
        repo = Repository.CartRepository;
    });

    afterEach(() => {
        repo = {} as Repository.CartRepositoryType;
    });

    it("should return correct data while creating cart", async () => {
        const mockCart: CartRequestInput = {
            productId: 1,
        
            qty: 2
        };

        jest.spyOn(Repository.CartRepository, "create").mockImplementationOnce(() =>
            Promise.resolve({
                message: "fake response from cart repository",
                input: mockCart,
            })
        );

        const res = await CreateCart(mockCart, repo);

        expect(res).toEqual({
            message: "fake response from cart repository",
            input: mockCart,
        });
    });
});
