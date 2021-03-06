process.env.NODE_ENV = "test";
const chai = require("chai");
const { expect } = chai;
const request = require("supertest");
const app = require("../app");
const connection = require("../connection");
chai.use(require("sams-chai-sorted"));

describe("app", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => connection.destroy());
  describe("/api", () => {
    it("GET:404 sends an error message when given a route that does not exist ", () => {
      return request(app)
        .get("/api/notAValidRoute")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Path does not exist");
        });
    });
    describe("/topics/", () => {
      it("GET:200 responds with an array of topic objects which have the properties slug and description", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(response => {
            expect(response.body.topics).to.be.an("array");
            response.body.topics.forEach(topic => {
              expect(topic).to.have.keys("slug", "description");
            });
          });
      });

      describe("INVALID METHODS", () => {
        it("status:405", () => {
          const invalidMethods = ["patch", "put", "delete", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/topics")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Found");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
    describe("/users", () => {
      it("GET: 200 responds with one user object of a user, given a username", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then(response => {
            expect(response.body.user).to.eql({
              username: "icellusedkars",
              name: "sam",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
            });
            // response.body.user.forEach(user1 => {
            //   expect(user1).to.have.keys("username", "name", "avatar_url");
            // });
          });
      });
      it("GET: 404 sends an error message when given a valid but non-existent username", () => {
        return request(app)
          .get("/api/users/anna")
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal("Username does not exist");
          });
      });

      describe("INVALID METHODS", () => {
        it("status:405", () => {
          const invalidMethods = ["patch", "put", "delete", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/topics")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Found");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
    describe("/articles", () => {
      describe("/:article_id", () => {
        it("GET: 200 responds with an article object with a comment count, given an article_id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(response => {
              expect(response.body.article).to.be.an("object");
              expect(response.body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 100,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z",
                comment_count: "13"
              });

              expect(response.body.article).to.have.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
            });
        });
        it("GET: 404 sends an error message when given a valid but non-existent article_id", () => {
          return request(app)
            .get("/api/articles/1000")
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("Article does not exist");
            });
        });
        it("GET: 400 sends an error message when given an invalid article_id", () => {
          return request(app)
            .get("/api/articles/articlenumber1")
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal("Bad Request");
            });
        });
        it("PATCH: 200 increments the current article votes given an article id", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(200)
            .send({ inc_votes: 22 }) // << body
            .then(response => {
              expect(response.body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2018-11-15T12:21:54.171Z",
                votes: 122
              });
            });
        });
        it("PATCH: 200 decrements the current article votes given an article id", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(200)
            .send({ inc_votes: -25 }) // << body
            .then(response => {
              expect(response.body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2018-11-15T12:21:54.171Z",
                votes: 75
              });
            });
        });
        it("PATCH: 404 sends an error message when given a valid but non-existent article_id", () => {
          return request(app)
            .patch("/api/articles/1000")
            .expect(404)
            .send({ inc_votes: 22 })
            .then(response => {
              expect(response.body.msg).to.equal("Article does not exist");
            });
        });
        it("PATCH: 400 sends an error message when given an invalid article_id", () => {
          return request(app)
            .patch("/api/articles/articlenumber1")
            .expect(400)
            .send({ inc_votes: 22 })
            .then(response => {
              expect(response.body.msg).to.equal("Bad Request");
            });
        });
        it("PATCH: 400 sends an error message when sending an invalid body", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(400)
            .send({ inc_votes: "cats" })
            .then(response => {
              expect(response.body.msg).to.equal("Bad Request");
            });
        });
        it("PATCH: 200 sends the original article back when sending a missing body", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(200)
            .send({})
            .then(response => {
              expect(response.body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2018-11-15T12:21:54.171Z",
                votes: 100
              });
            });
        });
        it("PATCH: 200 increments the current article votes given a body with other properties on it ", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(200)
            .send({ inc_votes: 22, name: "Mitch", blah: "Invalidproperty" })
            .then(response => {
              expect(response.body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2018-11-15T12:21:54.171Z",
                votes: 122
              });
            });
        });
      });
      describe("/comments", () => {
        it("POST: 201 posts a new comment to an article", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .expect(201)
            .send({
              username: "butter_bridge",
              body: "The fluffy dog ate the banana"
            })
            .then(response => {
              expect(response.body.comment).to.have.keys(
                "body",
                "votes",
                "created_at",
                "author",
                "article_id",
                "comment_id"
              );
              expect(response.body.comment).to.be.an("object");
              expect(response.body.comment.body).to.equal(
                "The fluffy dog ate the banana"
              );
              expect(response.body.comment["article_id"]).to.equal(1);
              expect(response.body.comment["author"]).to.equal("butter_bridge");
            });
        });
        it("POST: 400 when empty body is sent as a comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .expect(400)
            .send({})
            .then(response => {
              expect(response.body.msg).to.equal("Bad Request: empty body");
            });
        });
        it("POST: 400 when comment is sent in wrong format", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .expect(404)
            .send({ username: 28, body: "hi" })
            .then(response => {
              expect(response.body.msg).to.equal(
                "Bad Request: comment in wrong format"
              );
            });
        });
        it("GET: 200 responds with an array of comments given the article_id", () => {
          return request(app)
            .get("/api/articles/9/comments")
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.be.an("array");
              expect(response.body.comments[0]).to.have.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
            });
        });
        it("GET: 200 accepts a limit query which responds with the amount of comments to display - defaults to 10", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=3")
            .expect(200)
            .then(response => {
              expect(response.body.comments.length).to.equal(3);
              expect(response.body.comments[0]["comment_id"]).to.equal(2);
            });
        });
        it("GET: 200 accepts a p (offset) query which sets the first position to return from the results of the query - defaults to 0", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=5&p=2")
            .expect(200)
            .then(response => {
              expect(response.body.comments.length).to.equal(5);
              expect(response.body.comments[0]["comment_id"]).to.equal(7);
              expect(response.body.comments[4]["comment_id"]).to.equal(11);
            });
        });
        it("GET: 200 sends an empty array when given an ARTICLE that exists but does not have any comments", () => {
          return request(app)
            .get("/api/articles/12/comments")
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.be.an("array");
              expect(response.body.comments).to.have.length(0);
            });
        });
        it("GET: 200 responds with an array of comments sorted by votes when passed a query in default descending order", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.be.an("array");
              expect(response.body.comments).to.be.sortedBy("votes", {
                descending: true
              });
            });
        });
        it("GET: 200 responds with an array of comments in ascending order and sorted by 'created_at' as a default", () => {
          return request(app)
            .get("/api/articles/1/comments?order=asc")
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.be.an("array");
              expect(response.body.comments).to.be.sortedBy("created_at", {
                descending: false
              });
            });
        });
        it("GET: 404 sends an error message when given a valid but non-existent article id", () => {
          return request(app)
            .get("/api/articles/10000/comments?sort_by=votes")
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("Does not exist");
            });
        });
        it("GET: 400 sends an error message when given an invalid article ID", () => {
          return request(app)
            .get("/api/articles/one/comments?sort_by=votes")
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal("Bad Request");
            });
        });
        it("GET: 400 sends an error message when given an invalid sort_by column", () => {
          return request(app)
            .get("/api/articles/one/comments?sort_by=animals")
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal(
                "Bad Request: Sort by column does not exist"
              );
            });
        });
        it("GET: 200 responds with order in default of descending if passed an invalid order by", () => {
          return request(app)
            .get("/api/articles/1/comments?order=blah")
            .expect(200)
            .then(response => {
              expect(response.body.comments).to.be.an("array");
              expect(response.body.comments).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
      });
      // GET /api/articles
      it("GET: 200 responds with an array of article objects with a comment count property", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.be.an("array");
            expect(response.body.articles[0]).to.have.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      describe("INVALID METHODS", () => {
        it("status:405", () => {
          const invalidMethods = ["patch", "put", "delete", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Found");
              });
          });
          return Promise.all(methodPromises);
        });
      });
      it("GET: 200 accepts a limit query which responds with the amount of articles to display - defaults to 10", () => {
        return request(app)
          .get("/api/articles?limit=2")
          .expect(200)
          .then(response => {
            expect(response.body.articles.length).to.equal(2);
            expect(response.body.articles[0]["article_id"]).to.equal(1);
          });
      });
      it("GET: 200 accepts a p (offset) query which sets the first position to return from the results of the query - defaults to 0", () => {
        return request(app)
          .get("/api/articles?limit=5&p=2")
          .expect(200)
          .then(response => {
            expect(response.body.articles.length).to.equal(5);
            expect(response.body.articles[0]["article_id"]).to.equal(6);
            expect(response.body.articles[4]["article_id"]).to.equal(10);
          });
      });
      it("GET: 200 responds with an array of article objects and accepts a sort_by query which sorts by column, where the order defaults to descending", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.be.an("array");
            expect(response.body.articles.length).to.equal(10);
            expect(response.body.articles).to.be.sortedBy("title", {
              descending: true
            });
          });
      });
      it("GET: 200 responds with an array of article objects and accepts an order query, which orders ascending & is sorted by date by default", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.be.an("array");
            expect(response.body.articles).to.be.sortedBy("created_at", {
              descending: false
            });
          });
      });
      it("GET: 200 responds with an array of article objects from a specific author when passed as a query", () => {
        return request(app)
          .get("/api/articles?author=rogersop")
          .expect(200)
          .then(response => {
            expect(response.body.articles[0].author).to.equal("rogersop");
            expect(
              response.body.articles.every(
                article => article.author === "rogersop"
              )
            );
          });
      });
      it("GET: 200 responds with an array of article objects with a specific topic when passed as a query", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(response => {
            expect(response.body.articles[0].topic).to.equal("cats");
            expect(
              response.body.articles.every(article => article.topic === "cats")
            );
          });
      });
      it("GET: 400, sends an error message when given an invalid sort_by column", () => {
        return request(app)
          .get("/api/articles?sort_by=colours")
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal(
              "Bad Request: Sort by column does not exist"
            );
          });
      });
      it("GET: 200 responds with order as a default of descending if passed an invalid order by", () => {
        return request(app)
          .get("/api/articles?order=upsidedown")
          .expect(200)
          .then(response => {
            //  console.log(response.body.comments);
            expect(response.body.articles).to.be.an("array");
            expect(response.body.articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET: 404 sends an error message when given a valid but non-existent author", () => {
        return request(app)
          .get("/api/articles?author=anna")
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal("Does not exist");
          });
      });
      it("GET: 404 sends an error message when given a valid but non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=unknowntopic")
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal("Does not exist");
          });
      });
      it("GET: 200 sends an empty array when given an AUTHOR that exists but does not have any articles", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.be.an("array");
            expect(response.body.articles).to.have.length(0);
          });
      });
      it("GET: 200 sends a message when given a TOPIC that exists but does not have any articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.be.an("array");
            expect(response.body.articles).to.have.length(0);
          });
      });
    });
    describe("comments", () => {
      it("PATCH: 200 increments the comments current vote count given a comment id", () => {
        return request(app)
          .patch("/api/comments/3")
          .expect(200)
          .send({ inc_votes: 60 }) // << body
          .then(response => {
            expect(response.body).to.be.an("object");
            expect(response.body.comment.votes).to.equal(160);
            expect(response.body.comment).to.eql({
              comment_id: 3,
              author: "icellusedkars",
              article_id: 1,
              votes: 160,
              created_at: "2015-11-23T12:36:03.389Z",
              body:
                "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works."
            });
          });
      });
      it("PATCH: 200 decrements the comments current vote count given a comment id", () => {
        return request(app)
          .patch("/api/comments/3")
          .expect(200)
          .send({ inc_votes: -36 }) // << body
          .then(response => {
            expect(response.body.comment.votes).to.equal(64);
            expect(response.body.comment).to.eql({
              comment_id: 3,
              author: "icellusedkars",
              article_id: 1,
              votes: 64,
              created_at: "2015-11-23T12:36:03.389Z",
              body:
                "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works."
            });
          });
      });
      it("PATCH: 404 sends an error message when given a valid but non-existent comment_id", () => {
        return request(app)
          .patch("/api/comments/1000")
          .expect(404)
          .send({ inc_votes: 11 })
          .then(response => {
            expect(response.body.msg).to.equal("Comment does not exist");
          });
      });
      it("PATCH: 400 sends an error message when given an invalid comment_id", () => {
        return request(app)
          .patch("/api/comments/commentnumber1")
          .expect(400)
          .send({ inc_votes: 11 })
          .then(response => {
            expect(response.body.msg).to.equal("Bad Request");
          });
      });
      it("PATCH: 400 sends an error message when sending an invalid body", () => {
        return request(app)
          .patch("/api/comments/4")
          .expect(400)
          .send({ inc_votes: "seventysixvotes" })
          .then(response => {
            expect(response.body.msg).to.equal("Bad Request");
          });
      });
      it("PATCH: 200 sends the original comment back when sending a missing body", () => {
        return request(app)
          .patch("/api/comments/3")
          .expect(200)
          .send({})
          .then(response => {
            expect(response.body.comment.votes).to.equal(100);
            expect(response.body.comment).to.eql({
              comment_id: 3,
              author: "icellusedkars",
              article_id: 1,
              votes: 100,
              created_at: "2015-11-23T12:36:03.389Z",
              body:
                "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works."
            });
          });
      });
    });
    it("PATCH: 200 increments the current article votes given a body with other properties on it ", () => {
      return request(app)
        .patch("/api/comments/3")
        .expect(200)
        .send({ inc_votes: 50, name: "Mitch", blah: "Invalidproperty" })
        .then(response => {
          expect(response.body.comment).to.eql({
            comment_id: 3,
            author: "icellusedkars",
            article_id: 1,
            votes: 150,
            created_at: "2015-11-23T12:36:03.389Z",
            body:
              "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works."
          });
        });
    });
    it("DELETE: 204 responds with no content and deletes the comment given a comment_id", () => {
      return request(app)
        .delete("/api/comments/5")
        .expect(204);
    });
    it("DELETE:404 responds with an appropriate error message when given a non-existent comment id", () => {
      return request(app)
        .delete("/api/comments/99999")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal(
            "Comment does not exist, nothing deleted"
          );
        });
    });
    describe("INVALID METHODS", () => {
      it("status:405", () => {
        const invalidMethods = ["get", "put", "post"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/comments/3")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method Not Found");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("/api", () => {
      it("GET: 200, sends out the json api when requested", () => {
        return request(app)
          .get("/api/")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("object");
            expect(response.body).to.contain.keys("GET /api");
          });
      });
    });
  });
});
