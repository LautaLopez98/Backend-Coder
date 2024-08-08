import mongoose, { isValidObjectId } from "mongoose";
import { after, afterEach, before, describe, it } from "mocha";
import supertest from "supertest-session";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import { config } from "../src/config/config.js";

const requester = supertest("http://localhost:8080");

let testProduct = {
    title: "test",
    description: "product test",
    code: faker.string.alphanumeric(4),
    price: faker.commerce.price({ min: 10000, max: 50000 }),
    status: true,
    stock: faker.number.int({ min: 1, max: 50 }),
    category: faker.commerce.productAdjective(),
    thumbnails: [faker.image.url()],
};

let user = { email: "adminCoder@coder.com", password: "123" };

describe("Pruebas sobre productos", function () {
    this.timeout(20000);

    before(async function () {
    await mongoose.connect(config.MONGO_URL_COMPLETE, { 
        dbName: config.DB_NAME
    });
    await requester.post("/api/sessions/login").send(user);
    });

    after(async function () {
        await requester.get("/api/sessions/logout");
        await mongoose.disconnect();
    });

    afterEach(async function () {
    await mongoose.connection
        .collection("productos")
        .deleteMany({ title: "test" });
    });

        it("Traer todos los productos", async function () {
        let response = await requester.get("/api/products");
        let { ok, status, body } = response;
        expect(body.status).to.be.equal("success");
        expect(Array.isArray(body.payload)).to.be.true;
        expect(body.payload[0]).to.have.property("_id");
        expect(status).to.be.equal(200);
        expect(ok).to.be.true;
    });

    it("Traer un producto por su ID", async function () {
        let productRes = await requester.post("/api/products").send(testProduct);
        let pid = productRes.body._id;
        expect(pid).to.not.be.undefined;
        let response = await requester.get(`/api/products/${pid}`);
        let { ok, status, body } = response;
        expect(body).to.have.property("_id");
        expect(isValidObjectId(body._id)).to.be.true;
        expect(status).to.be.equal(200);
        expect(ok).to.be.true;
    });

    it("Crear un producto", async function () {
        let response = await requester.post("/api/products").send(testProduct);
        let { ok, status, body } = response;
        expect(body.title).to.be.equal(testProduct.title);
        expect(isValidObjectId(body._id)).to.be.true;
        expect(status).to.be.equal(200);
        expect(ok).to.be.true;
    });

    it("Actualizar un producto", async function () {
        let productRes = await requester.post("/api/products").send(testProduct);
        let pid = productRes.body._id;
        expect(pid).to.not.be.undefined;

        let response = await requester.put(`/api/products/${pid}`).send({ stock: 20 });
        let { ok, status, body } = response;
        expect(isValidObjectId(body._id)).to.be.true;
        expect(status).to.be.equal(200);
        expect(ok).to.be.true;
        expect(body.stock).not.to.be.equal(productRes.body.stock);
    });
});

