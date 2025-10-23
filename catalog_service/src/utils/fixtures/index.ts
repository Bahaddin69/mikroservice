import { Factory } from "rosie";
import { Product } from "../../models/products.model";
import { faker } from "@faker-js/faker";

export const ProductFactory = new Factory<Product>()
    .attr('id', faker.number.int({ min: 10, max: 1000 }))
    .attr('name', faker.commerce.productName())
    .attr('description', faker.commerce.productDescription())
    .attr('price', +faker.commerce.price())
    .attr('stock', faker.number.int({ min: 10, max: 100 }));
