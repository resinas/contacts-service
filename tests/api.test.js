const app = require('../app');
const request = require('supertest');
const Contact = require('../models/contact');

describe("Contacts API", () => {
    describe("GET /", () => {
        it("Should return an HTML document", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("h1"));
            })
        })
    });

    describe("GET /contacts", () => {
        it("Should return all contacts", () => {
            const contacts = [
                new Contact({"name": "juan", "phone": "5555"}),
                new Contact({"name": "pepe", "phone": "6666"})
            ];

            dbFind = jest.spyOn(Contact, "find");
            dbFind.mockImplementation(async () => Promise.resolve(contacts));

            return request(app).get("/api/v1/contacts").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalled();
            });
        });
    });

    describe("POST /contacts", () => {
        const contact = {name: "juan", phone: "6777"};
        var dbSave;

        beforeEach(() => {
            dbSave = jest.spyOn(Contact.prototype, "save");
        });

        it("Should add a new contact if everything is fine", () => {
            dbSave.mockImplementation(async () => Promise.resolve(true));

            return request(app).post("/api/v1/contacts").send(contact).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbSave).toBeCalled();
            })
        });

        it("Should return 500 if there is a problem with the connection", () => {
            dbSave.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).post("/api/v1/contacts").send(contact).then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbSave).toBeCalled();
            });
        });
    });
});