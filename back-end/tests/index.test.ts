import { faker } from "@faker-js/faker";
import supertest from "supertest";

import { prisma } from "../src/database.js";
import app from "../src/app.js";
import bodyFactory from "./factories/bodyFactory.js";
import recommendationFactory from "./factories/recommendationsFactory.js";


const agent = supertest(app);

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

describe("GET /recommendations", () => {
    it("should return a list of recommendations", async () => {
        const recommendations = bodyFactory();
        await prisma.recommendation.create({ data: recommendations[0] });

        const response = await agent.get("/recommendations");

        expect(response.status).toEqual(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body.length).not.toBeNull();
    });
})

describe("GET /recommendations/random", () => {
    it("should return a random recommendation", async () => {
        const recommendations = bodyFactory();
        const data = await prisma.recommendation.create({ data: recommendations[0] });
        const response = await agent.get("/recommendations/random");
        expect(response.body).toEqual(data);
    });
})

describe("GET /recommendations/top/:amount", () => {
    it("should return a list of top recommendations", async () => {
        const recommendations = recommendationFactory();
        await prisma.recommendation.createMany({ data: [{...recommendations[0]}, {...recommendations[1]}, {...recommendations[2]}] });
        const response = await agent.get("/recommendations/top/2");
        expect(response.body.length).toEqual(2);
    });
})

describe("POST /recomendations", () => {
    it("valid body", async () => {
        const body = bodyFactory();
        const response = await agent.post("/recommendations").send(body[0]);
        expect(response.status).toEqual(201);
    })

    it("invalid body - no name", async () => {
        const body = bodyFactory();
        delete body[0].name;
        const response = await agent.post("/recommendations").send(body[0]);
        expect(response.status).toEqual(422);
    });

    it("invalid body - no youtubeLink", async () => {
        const body = bodyFactory();
        delete body[0].youtubeLink;
        const response = await agent.post("/recommendations").send(body[0]);
        expect(response.status).toEqual(422);
    });

    it("no body", async () => {
        const response = await agent.post("/recommendations");
        expect(response.status).toEqual(422);
    });
})




afterAll(async () => {
    await prisma.$disconnect();
});