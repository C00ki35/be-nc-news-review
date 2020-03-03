process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
chai.use(require("chai-sorted"));
const app = require("../app");
const connection = require("../db/connection.js");

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe("TOPICS - GET", () => {
  it("Status:200 - Array of topics in an object on the key of 'topics'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(response => {
        const { body } = response;
        expect(body).to.be.an("object");
      });
  });
  it("Status:200 - topics to contain 'slug' & 'description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(response => {
        const { body } = response;
        expect(body.topics[0]).to.contain.keys("slug", "description");
      });
  });
  it("Status:404 - /api/tropics-  path not found'", () => {
    return request(app)
      .get("/api/tropics")
      .expect(404)
      .then(response => {
        expect(response.body.msg).to.equal("Not Found.");
      });
  });
  it("Status:405 - PUT/DELETE/PATCH - Incorrect method", () => {
    const incorrectMethods = ["put", "delete", "patch"];
    const methodPromises = incorrectMethods.map(method => {
      return request(app)
        .post("/api/topics")
        .expect(405)
        .then(({ body: { message } }) => {
          expect(message).to.equal("Status: 405 Method not allowed");
        });
    });
    return Promise.all(methodPromises);
  });
});

describe("USERS - GET", () => {
  it.only("Status:200 - ONE object containing user info", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(response => {
        expect(response.body).to.eql({
          user: {
            username: "rogersop",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
            name: "paul"
          }
        });
      });
  });
  it("Status:404 - Not Found - username 'whatever", () => {
    return request(app)
      .get("/api/usors/whatever")
      .expect(404)
      .then(response => {
        expect(response.body.msg).to.equal("Not Found.");
      });
  });
  it("Status:405 - PUT/DELETE/PATCH - Incorrect method", () => {
    const incorrectMethods = ["put", "delete", "patch"];
    const methodPromises = incorrectMethods.map(method => {
      return request(app)
        .post("/api/topics")
        .expect(405)
        .then(({ body: { message } }) => {
          expect(message).to.equal("Status: 405 Method not allowed");
        });
    });
    return Promise.all(methodPromises);
  });
});
