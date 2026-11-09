import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import "dotenv/config";
import app from "../app.js";
import { db, connectToMongoDB, disconnectFromMongoDB } from "../db.js";

const MISSING_ID = "000000000000000000000000";
let createdId;

beforeAll(async () => {
  // safety guard: never wipe a real database
  if (!db.databaseName.endsWith("-test")) {
    throw new Error(`Refusing to run tests against "${db.databaseName}"`);
  }
  await connectToMongoDB();
  await db.collection("expenses").deleteMany({});
});

afterAll(async () => {
  await db.collection("expenses").deleteMany({});
  await disconnectFromMongoDB();
});

describe("health", () => {
  it("GET /api/health returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("create", () => {
  it("POST creates an expense with a date", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .send({ title: "Coffee", amount: 4.5, date: "2026-08-15" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Coffee");
    expect(res.body.date).toBe("2026-08-15T00:00:00.000Z");
    expect(res.body.isActive).toBe(1);
    createdId = res.body._id;
  });

  it("POST without a title returns 400", async () => {
    const res = await request(app).post("/api/expenses").send({ amount: 5 });
    expect(res.status).toBe(400);
  });

  it("POST with amount 0 returns 400", async () => {
    const res = await request(app).post("/api/expenses").send({ title: "Bad", amount: 0 });
    expect(res.status).toBe(400);
  });

  it("POST with a bad date returns 400", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .send({ title: "Bad", amount: 1, date: "hello" });
    expect(res.status).toBe(400);
  });
});

describe("read", () => {
  it("GET all includes the created expense", async () => {
    const res = await request(app).get("/api/expenses");
    expect(res.status).toBe(200);
    expect(res.body.some((e) => e._id === createdId)).toBe(true);
  });

  it("GET one returns the expense", async () => {
    const res = await request(app).get(`/api/expenses/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Coffee");
  });

  it("GET with an invalid id returns 400", async () => {
    const res = await request(app).get("/api/expenses/123");
    expect(res.status).toBe(400);
  });

  it("GET a nonexistent id returns 404", async () => {
    const res = await request(app).get(`/api/expenses/${MISSING_ID}`);
    expect(res.status).toBe(404);
  });
});

describe("update", () => {
  it("PUT changes amount and date, keeps the title", async () => {
    const res = await request(app)
      .put(`/api/expenses/${createdId}`)
      .send({ amount: 5.25, date: "2026-08-16" });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(5.25);
    expect(res.body.title).toBe("Coffee");
  });

  it("PUT with an empty body returns 400", async () => {
    const res = await request(app).put(`/api/expenses/${createdId}`).send({});
    expect(res.status).toBe(400);
  });

  it("PUT a nonexistent id returns 404", async () => {
    const res = await request(app).put(`/api/expenses/${MISSING_ID}`).send({ amount: 1 });
    expect(res.status).toBe(404);
  });
});

describe("delete", () => {
  it("DELETE removes the expense", async () => {
    const res = await request(app).delete(`/api/expenses/${createdId}`);
    expect(res.status).toBe(200);
    const check = await request(app).get(`/api/expenses/${createdId}`);
    expect(check.status).toBe(404);
  });

  it("DELETE a nonexistent id returns 404", async () => {
    const res = await request(app).delete(`/api/expenses/${MISSING_ID}`);
    expect(res.status).toBe(404);
  });
});