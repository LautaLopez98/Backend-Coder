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

describe("Prueba de rutas de carritos", function () {
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
        .collection("carritos")
        .deleteMany({});
    });

    it("Traer todos los carritos", async function () {
        let response = await requester.get("/api/carts");
        let { ok, status, body } = response;
        expect(body).to.be.an("array");
        expect(status).to.be.equal(200);
        expect(ok).to.be.true;
    });

    it("Traer carrito por su ID", async function () {
        let cartRes = await requester.post("/api/carts").send();
        let cid = cartRes.body.newCart._id;
        expect(cid).to.not.be.undefined;

        let response = await requester.get(`/api/carts/${cid}`);
        let { ok, status, body } = response;
        expect(body).to.have.property("_id");
        expect(isValidObjectId(body._id)).to.be.true;
        expect(status).to.be.equal(200);
        expect(ok).to.be.true;
    });

    it("Crear un carrito", async function () {
        let response = await requester.post("/api/carts").send();
        let { ok, status, body } = response;
        expect(body).to.have.property("newCart");
        expect(isValidObjectId(body.newCart._id)).to.be.true;
        expect(status).to.be.equal(200);
        expect(ok).to.be.true;
    });

    it("Agregar un producto al carrito", async function () {
        await requester.post("/api/sessions/login").send(user);
        let productRes = await requester.post("/api/products").send(testProduct);
        let pid = productRes.body._id;
        expect(pid).to.not.be.undefined; 
        let cartRes = await requester.post("/api/carts").send();
        let cid = cartRes.body.newCart._id;
        let response = await requester.post(`/api/carts/${cid}/product/${pid}`).send();
        let { ok, status, body } = response;
        expect(body.payload).to.be.equal("Carrito actualizado");
        expect(status).to.be.equal(200);
        expect(ok).to.be.true;
    });

    it("Eliminar producto del carrito", async function () {
        let productRes = await requester.post("/api/products").send({
        title: "Test Product",
        description: "Product for testing",
        code: faker.string.alphanumeric(4),
        price: faker.commerce.price({ min: 10, max: 500 }),
        status: true,
        stock: faker.number.int({ min: 1, max: 100 }),
        category: faker.commerce.productAdjective(),
        thumbnails: [faker.image.url()],
        });
        let pid = productRes.body._id;
        expect(pid).to.not.be.undefined;

        let cartRes = await requester.post("/api/carts").send();
        let cid = cartRes.body.newCart._id;
        expect(cid).to.not.be.undefined;

        await requester.post(`/api/carts/${cid}/product/${pid}`).send();

        let response = await requester.delete(`/api/carts/${cid}/products/${pid}`).send();
        let { ok, status, body } = response;
        expect(body.message).to.be.equal("Producto eliminado del carrito");
        expect(status).to.be.equal(200);
        expect(ok).to.be.true;
    });

    it("Actualizar carrito", async function () {
        let cartRes = await requester.post("/api/carts").send();
        let cid = cartRes.body.newCart._id;
        expect(cid).to.not.be.undefined;

        let response = await requester.put(`/api/carts/${cid}`).send({
        products: [
            {
            product: new mongoose.Types.ObjectId(),
            quantity: 2,
            },
        ],
        });
        let { ok, status, body } = response;
        expect(body.message).to.be.equal("Carrito actualizado");
        expect(status).to.be.equal(200);
        expect(ok).to.be.true;
    });

    it("Realizar compra de productos en el carrito", async function () {
        let cartRes = await requester.post("/api/carts").send();
        let cid = cartRes.body.newCart._id;
        expect(cid).to.not.be.undefined;
        let productRes = await requester.post("/api/products").send({
        title: "Test Product",
        description: "Product for testing",
        code: faker.string.alphanumeric(4),
        price: faker.commerce.price({ min: 10, max: 500 }),
        status: true,
        stock: 10,
        category: faker.commerce.productAdjective(),
        thumbnails: [faker.image.url()],
        });
        let pid = productRes.body._id;
        expect(pid).to.not.be.undefined;
        await requester.post(`/api/carts/${cid}/product/${pid}`).send();
        let response = await requester.post(`/api/carts/${cid}/purchase`).send();
        let { ok, status, body } = response;
        expect(body.message).to.be.equal("Compra realizada con éxito");
        expect(status).to.be.equal(200);
        expect(ok).to.be.true;
    });
    })