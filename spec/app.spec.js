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
  it("Status:404 - NOT FOUND /api/tropics-  path not found'", () => {
    return request(app)
      .get("/api/tropics")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Not Found.");
      });
  });
  it("Status:405 - BAD METHOD / PUT/DELETE/PATCH - Incorrect method", () => {
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

  it("Status:404 - NOT FOUND / username 'whatever", () => {
    return request(app)
      .get("/api/usors/whatever")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Not Found.");
      });
  });
  it("Status:405 - BAD METHOD / PUT/DELETE/PATCH - Incorrect method", () => {
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

  it("Status:400 - BAD REQUEST / api/articles/rainbow.", () => {
    return request(app)
      .get("/api/articles/rainbow")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Status 400: Bad request - Invalid data type");
      });
  });

  it("Status:404 - NOT FOUND / api/articleers - Not Found.", () => {
    return request(app)
      .get("/api/articleers/")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Not Found.");
      });
  });

  it("Status:404 - NOT FOUND / Valid path but resource does not exist", () => {
    return request(app)
      .get("/api/articles/78585994")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal(
          "Status:404 - Valid path but resource does not exist"
        );
      });
  });

  it("Status:405 - BAD METHOD / DELETE - Incorrect method", () => {
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
  it("Status:400 - BAD REQUEST / body no keys in object ie. {} ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).to.deep.equal(
          "Status 400: Bad request - Column does not exist"
        );
      });
  });

  it("Status:400 - BAD REQUEST / Invalid datatype - { inc_votes: 'testing' }", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: "testing" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Status 400: Bad request - Invalid data type");
      });
  });
  it("Status:404 - NOT FOUND / api/articleers/4 - Not Found.", () => {
    return request(app)
      .get("/api/articleers/4")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Not Found.");
      });
  });

  it("Status:405 - BAD METHOD / PUT/DELETE/PATCH - Incorrect method", () => {
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

describe("ARTICLES - POST", () => {
  it("Status:201 - Post a comment to article_id 1 - returns object with key of 'comment'", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "rogersop",
        comment: "This comment goes without saying..."
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).to.be.an("object");
      });
  });

  it("Status:201 - Object to include 'body, author and votes' keys.", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "rogersop", comment: "Eye-swirling naffness!" })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).to.contain.keys("body", "author", "votes");
      });
  });

  it("Status:201 - Comment to be 'Here today gone today.'", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "rogersop", comment: "Here today gone today." })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.body).to.eql("Here today gone today.");
      });
  });

  it("Status:400 - BAD REQUEST / Post to non-existant article", () => {
    return request(app)
      .post("/api/articles/800/comments")
      .send({
        username: "rogersop",
        comment: "This comment goes without saying..."
      })
      .expect(400)
      .then(response => {
        expect(response.body.msg).to.equal(
          "Status 400: Article does not exist"
        );
      });
  });

  it("Status:400 - BAD REQUEST / username non-existant", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "RogerRabbit",
        comment: "This comment goes without saying..."
      })
      .expect(400)
      .then(response => {
        expect(response.body.msg).to.equal(
          "Status 400: Article does not exist"
        );
      });
  });

  it("Status:400 - BAD REQUEST / Empty object sent", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({})
      .expect(400)
      .then(response => {
        expect(response.body.msg).to.equal(
          "Status 400: Bad request - Invalid data type"
        );
      });
  });

  it("Status:400 - BAD REQUEST / Incorrect number of keys in post object", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ comment: "This won't work!" })
      .expect(400)
      .then(response => {
        expect(response.body.msg).to.equal(
          "Status 400: Bad request - Invalid data type"
        );
      });
  });

  it("Status:400 - BAD REQUEST / wrong data type", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ usorNamed: "bill" })
      .expect(400)
      .then(response => {
        expect(response.body.msg).to.equal(
          "Status 400: Bad request - Invalid data type"
        );
      });
  });

  it("Status:405 - BAD METHD / PUT/DELETE/PATCH - Incorrect method", () => {
    const incorrectMethods = ["delete"];
    const methodPromises = incorrectMethods.map(method => {
      return request(app)
        .delete("/api/articles/3")
        .expect(405)
        .then(({ body: { message } }) => {
          expect(message).to.equal("Status: 405 Method not allowed");
        });
    });
    return Promise.all(methodPromises);
  });
});

describe("ARTICLES/COMMENTS - GET", () => {
  it("Status:200 - Array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(typeof comments).to.equal("object");
      });
  });
  it("Status:200 - Array of comments for article_id 1 to equal 13", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).to.equal(13);
      });
  });

  it("Status:200 - Array of all comments for article id 1 sorted by AUTHOR", () => {
    return request(app)
      .get("/api/articles/1/comments?sort_by=author")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).to.be.sortedBy("author", {
          ascending: true
        });
      });
  });

  it("Status:200 - Array of all comments for  article id 1 sorted by AUTHOR DESC", () => {
    return request(app)
      .get("/api/articles/1/comments?sort_by=author&order=desc")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).to.be.sortedBy("author", {
          descending: true
        });
      });
  });

  it("Status:200 - Array of all comments for  article id 1 sorted by CREATED_AT ASC by default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).to.be.sortedBy("created_at", {
          ascending: true
        });
      });
  });

  it("Status:400 - BAD REQUEST / non valid sort_by", () => {
    return request(app)
      .get("/api/articles/1/comments?sort_by=Turkey")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).to.eql("Status 400: Bad request - Column does not exist");
      });
  });

  it("Status:400 - BAD REQUEST / 'Test' given as :article_id number", () => {
    return request(app)
      .post("/api/articles/Test/comments")
      .send({ username: "grumpy19", comment: "Eye-swirling naffness!" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Status 400: Bad request - Invalid data type");
      });
  });

  it("Status:404 - NOT FOUND / Valid datatype but resource non-existant", () => {
    return request(app)
      .get("/api/articles/40404040/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Valid article number but not found.");
      });
  });
});

describe("ALL ARTICLES - GET", () => {
  it("Status:200 - Returns an array of articles", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).to.be.an("array");
      });
  });

  it("Status:200 - Array of all articles, includes comment count & Date descending", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).to.be.sortedBy("created_at", {
          descending: true
        });
      });
  });

  it("Status:200 - Array of all articles sorted by TITLE DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).to.be.sortedBy("title", {
          descending: true
        });
      });
  });

  it("Status:200 - Array of all articles sorted by TITLE ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).to.be.sortedBy("title", {
          ascending: true
        });
      });
  });

  it("Status:200 - Article to contains keys - author, votes & body", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments[0]).to.contain.keys("author", "votes", "body");
      });
  });

  it("Status 200 - Filter articles array by author", () => {
    return request(app)
      .get("/api/articles?author=butter_bridge")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).to.equal(3);
      });
  });

  it("Status 200 - Filter articles array by topic (cats)", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).to.equal(1);
      });
  });

  it("Status:400 - BAD REQUEST / 'test' given as :article_id number", () => {
    return request(app)
      .post("/api/articles/test/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Status 400: Bad request - Invalid data type");
      });
  });

  it("Status:400 - BAD REQUEST / Sort_by 'yello'", () => {
    return request(app)
      .get("/api/articles?sort_by=yello&order=asc")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Status 400: Bad request - Column does not exist");
      });
  });

  it("Status:400 - BAD REQUEST / Order not asc/desc", () => {
    return request(app)
      .get("/api/articles?sort_by=yello&order=boots")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Status 400: Bad request - Column does not exist");
      });
  });
});

describe("COMMENTS - PATCH", () => {
  it("Status:200 - Increase article's comment vote by 1", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ votes: 1 })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.votes).to.equal(17);
      });
  });

  it("Status:200 - Decrease article's comment vote by 5", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ votes: -5 })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.votes).to.equal(11);
      });
  });

  it("Status:400 - BAD REQUEST / body, no keys in object ie. {} ", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).to.deep.equal(
          "Status 400: Bad request - Invalid data type"
        );
      });
  });

  it("Status:400 - BAD REQUEST / body, wrong datatype.", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ votes: "test" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).to.deep.equal(
          "Status 400: Bad request - Invalid data type"
        );
      });
  });
});

describe("COMMENTS - DELETE", () => {
  it("Status:204 - Deletes the given comment.", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204);
  });
});
