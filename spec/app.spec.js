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
      .then(({ body }) => {
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
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Not Found.");
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
  it("Status:200 - ONE object containing user info", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body }) => {
        expect(body).to.eql({
          user: {
            username: "rogersop",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
            name: "paul"
          }
        });
      });
  });

  it("Status:200 - User object to contain keys, 'username', 'avatar_url', 'name'", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).to.contain.keys("username", "avatar_url", "name");
      });
  });

  it("Status:404 - Not Found - username 'whatever", () => {
    return request(app)
      .get("/api/usors/whatever")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Not Found.");
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

describe("ARTICLES - GET", () => {
  it("Status:200 - ONE object with a key of 'article'", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(body).to.be.an("object");
      });
  });

  it("Status:200 - Should contain title, author, body", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).to.contain.keys("title", "author", "body");
      });
  });

  it("Status:200 - ONE article with comments_count of 1", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).to.equal("1");
      });
  });

  it("Status:404 - /api/articles/rainbow.", () => {
    return request(app)
      .get("/api/articleers/rainbow")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Not Found.");
      });
  });

  it("Status:404 - /api/articleers - Not Found.", () => {
    return request(app)
      .get("/api/articleers/")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Not Found.");
      });
  });

  it("Status:404 - Valid path but resource does not exist", () => {
    return request(app)
      .get("/api/articles/78585994")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal(
          "Status:404 - Valid path but resource does not exist"
        );
      });
  });

  it("Status:405 - DELETE - Incorrect method", () => {
    return request(app)
      .delete("/api/articles/:article_id")
      .expect(405)
      .then(({ body: { message } }) => {
        expect(message).to.equal("Status: 405 Method not allowed");
      });
  });
});

describe("ARTICLES - PATCH", () => {
  it("Status:200 - Increases vote by ONE", () => {
    return request(app)
      .patch("/api/articles/5")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).to.equal(1);
      });
  });

  it("Status:200 - Decreases vote by 5", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).to.equal(95);
      });
  });

  it("Status:200 - ONE article object with a key of 'article'", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        expect(body).to.be.an("object");
      });
  });

  it("Status:200 - ONE article object to contain keys, 'author','title','topic','votes'", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).to.contain.keys("author", "title", "topic", "votes");
      });
  });
  it("Status:400 - Bad request body, no keys in object ie. {} ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).to.deep.equal("Status 400: Bad request");
      });
  });

  it("Status:400 - Invalid datatype - { inc_votes: 'testing' }", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: "testing" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Status 400: Bad request");
      });
  });
  it("Status:404 - /api/articleers/4 - Not Found.", () => {
    return request(app)
      .get("/api/articleers/4")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Not Found.");
      });
  });

  it("Status:405 - PUT/DELETE/PATCH - Incorrect method", () => {
    const incorrectMethods = ["put", "delete"];
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
