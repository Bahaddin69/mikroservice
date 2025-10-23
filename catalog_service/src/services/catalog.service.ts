import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { OrderWithLineItems } from "../types/message.type";
import { AppEventListener } from "../utils/AppEventListener";
import { ElasticSearchService } from "./elasticsearch.service";

export class CatalogService {

    private _repository: ICatalogRepository

    constructor(repository: ICatalogRepository) {
        this._repository = repository
    }

    async createProduct(input: any) {
        const data = await this._repository.create(input)
        if (!data.id) {
            throw new Error("unable to create product")
        }

        AppEventListener.instance.notify({
            event: "createProduct",
            data
        });
        return data;
    }

    async updateProduct(input: any) {
        const data = await this._repository.update(input)
        if (!data.id) {
            throw new Error("unable to update product")
        }

        AppEventListener.instance.notify({
            event: "updateProduct",
            data
        });

        return data;
    }

    async getProducts(limit: number, offset: number, search: string) {
        const elkService = new ElasticSearchService();
        const products = await elkService.searchProduct(search);
        console.log("products from elastic search");
        return products;
    }

    async getProduct(id: number) {
        const product = await this._repository.findOne(id);
        return product;
    }

    async deleteProduct(id: number) {
        const response = await this._repository.delete(id);

        AppEventListener.instance.notify({
            event: "deleteProduct",
            data: { id }
        })

        return response;
    }

    async getProductStock(ids: number[]) {
        const product = await this._repository.findStock(ids);
        if (!product)
            throw new Error("unable to find product stock details");

        return product;
    }



    async handleBrokerMessage(message: any) {
        console.log("Katalog servisi mesaj aldı", message);
        const { event, data } = message;

        if (event === "create_order") {
            const orderData = data as OrderWithLineItems;
            const { orderItems } = orderData;
            orderItems.forEach(async (item) => {
                console.log("Ürün stockların sipariş kadar eksilmesi", item.productId, item.qty);
                const product = await this.getProduct(item.productId);
                if (!product)
                    console.log("Sipariş oluşturma için stok güncellemesi sırasında ürün bulunamadı", item.productId);
                else {
                    const updateStock = product.stock - item.qty;
                    await this.updateProduct({ ...product, stock: updateStock });
                }
            });
        }

        if (event === "cancel_order") {
            console.log("CANCEL ORDER EVENT MESAJI GELDİ KATALOG SERVİSİNE");
            const { items } = data;
            console.log("GELEN VERİ", items);

            for (const item of items) {
                const product = await this._repository.findByName(item.productName);

                if (!product) {
                    console.log(
                        "Sipariş iptali için stok güncellemesi sırasında ürün bulunamadı",
                        item.productName
                    );
                } else {
                    const updateStock = product.stock + item.qty;
                    await this.updateProduct({ ...product, stock: updateStock });
                }
            }
        }
    }
}
