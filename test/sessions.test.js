import mongoose, { isValidObjectId } from "mongoose";
import { after, afterEach, before, describe, it } from "mocha";
import supertest from "supertest-session";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import { config } from "../src/config/config.js";
import { usersModel } from "../src/dao/models/usersModel.js";

let usersTest = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 65 }),
    email: faker.internet.email(),
    password: faker.internet.password(),
}

let user = { email: "adminCoder@coder.com", password: "123" };

const requester = supertest("http://localhost:8080");


describe("Prueba de rutas de sesiones", function () {
    before(async function () {
        await mongoose.connect(config.MONGO_URL_COMPLETE, { 
            dbName: config.DB_NAME
        });
    });
    afterEach(async function () {
    await usersModel.deleteMany({ first_name: usersTest.first_name });
    await requester.get("/api/sessions/logout");
    });
    after(async function () {
    await mongoose.disconnect();
    });

    it("Registro", async function () {
        let response = await requester
            .post("/api/sessions/registro")
            .send(usersTest);
        let { status, headers } = response;
        expect(status).to.be.equal(302);
        expect(headers.location).to.be.equal('/login');
    });

    it("Login", async function () {
    let response = await requester
        .post("/api/sessions/login")
        .send(user);
    let { status, headers } = response;
    expect(status).to.be.equal(302);
    expect(headers.location).to.be.equal('/products');
    });

    it("Current user", async function () {
        await requester.post("/api/sessions/login").send(user);
        let response = await requester.get("/api/sessions/current");
        let { status, body } = response;
        expect(status).to.be.equal(200);
        expect(body.email).to.be.equal("adminCoder@coder.com");
        expect(body.first_name).to.be.equal("ADMIN");
        expect(body.fullName).to.be.equal("ADMIN ADMINISTRADOR");
    });
})
