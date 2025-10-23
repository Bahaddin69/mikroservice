import { th } from "@faker-js/faker";
import { CatalogProduct } from "../dto/payload.dto";
import { EventPayload } from "../utils/AppEventListener";
import { Client } from "@elastic/elasticsearch";

export class ElasticSearchService {

    private indexName = "product";
    private client: Client;

    constructor() {
        this.client = new Client({
            node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
        });

        this.createIndex();
    }

    async handleEvents({ event, data }: EventPayload) {
        console.log("ElasticSearchService:handleEvents", event, data);
        switch (event) {
            case "createProduct":
                await this.createProduct(data as CatalogProduct);
                console.log("Create product event received in ElasticSearchService");
                return;
            case "updateProduct":
                await this.updateProduct(data as CatalogProduct);
                console.log("Update product event received in ElasticSearchService");
                return;
            case "deleteProduct":
                const { id } = data as CatalogProduct;
                await this.deleteProduct(id);
                console.log("Delete product event received in ElasticSearchService");
        }
    }

    async createIndex() {

        const indexExists = await this.client.indices.exists({ index: this.indexName });
        if (!indexExists) {
            await this.client.indices.create({
                index: this.indexName,
                body: {
                    mappings: {
                        properties: {
                            id: { type: "keyword" },
                            name: { type: "text" },
                            description: { type: "text" },
                            price: { type: "float" },
                            stock: { type: "integer" }
                        },
                    },
                } as Record<string, any>,
            });
        }
    }

    async getProduct(id: number) {
        const result = await this.client.get({
            index: this.indexName,
            id: id.toString()
        });

        return result._source;
    }

    async createProduct(data: CatalogProduct) {
        await this.client.index({
            index: this.indexName,
            id: data.id.toString(),
            document: data
        });
        console.log("product created with id", data.id);
    }

    async updateProduct(data: CatalogProduct) {
        await this.client.update({
            index: this.indexName,
            id: data.id.toString(),
            doc: {
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock
            },
            doc_as_upsert: true
        });
        console.log("product updated with id", data.id);
    }


    async deleteProduct(id: number) {
        await this.client.delete({
            index: this.indexName,
            id: id.toString()
        });
        console.log("product deleted with id", id);
    }

    async searchProduct(queryString: string) {
        const result = await this.client.search({
            index: this.indexName,
            query: queryString.length === 0 ? {
                match_all: {},
            } : {
                multi_match: {
                    query: queryString,
                    fields: ["name", "description"], // tabloda hangi alanda arama yapmak istiyorsam onu eklerim :D
                    fuzziness: "AUTO",
                }
            }

        });
        return result.hits.hits.map((hit) => hit._source);
    }

}
