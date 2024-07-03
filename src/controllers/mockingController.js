import { fakerEN_US as faker } from "@faker-js/faker";

export class Mocking {
    static generateProducts = (req, res) => {
        try {
            let products = [];
            for (let i = 0; i < 100; i++) {
                products.push({
                    _id: faker.database.mongodbObjectId(),
                    title: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    code: faker.string.alphanumeric(4),
                    price: faker.commerce.price({min: 100, max: 1000}),
                    status: true,
                    stock: faker.number.int({ min: 1, max: 10 }),
                    category: faker.commerce.productAdjective(),
                    thumbnail: [faker.image.url()]
                });
            }
            res.json(products);
        } catch (error) {
            res.status(400).json({ error: `${error.message}`});
        }
    }
}

