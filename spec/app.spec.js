process.env.NODE_ENV = "test";
const chai = require("chai");
const { expect } = chai;
const request = require("supertest");
const app = require("../app");
const connection = require("../connection");

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
          // console.log(response);
          expect(response.body.msg).to.equal("Path does not exist");
        });
    });
    describe("/topics/", () => {
      it("GET:200 responds with an array of topic objects which have the properties slug and description", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(response => {
            // console.log(response.body, "response here <<");
            expect(response.body.topics).to.be.an("array");
            response.body.topics.forEach(topic => {
              expect(topic).to.have.keys("slug", "description");
            });
          });
      });
    });
    describe("/users", () => {
      it("GET: 200 responds with one user object of a user, given a username", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then(response => {
            // console.log(response.body.user, "response here <<");
            expect(response.body).to.eql({
              user: [
                {
                  username: "icellusedkars",
                  name: "sam",
                  avatar_url:
                    "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
                }
              ]
            });
            response.body.user.forEach(user1 => {
              expect(user1).to.have.keys("username", "name", "avatar_url");
            });
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
    });
    describe.only("/articles", () => {
      it("GET: 200 responds with an article object with a comment count, given an article_id", () => {
        return request(app)
          .get("/api/articles/12")
          .expect(200)
          .then(response => {
            // console.log(response.body, "**");
            expect(response.body).to.eql({
              article: {
                article_id: 12,
                title: "Moustache",
                body: "Have you seen the size of that thing?",
                votes: 0,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "1974-11-26T12:21:54.171Z",
                comment_count: "0"
              }
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
      it("PATCH: 200 updates the current article votes given an article id", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(200)
          .send({ inc_votes: 22 }) // << body
          .then(response => {
            // console.log(response.body.article, "***");
            expect(response.body.article).to.eql([
              {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2018-11-15T12:21:54.171Z",
                votes: 122
              }
            ]);
          });
      });
    });
  });
});

/* Notes


// describe("delete", () => {
//   it("DELETE:  :/id responds with 204 no content", () => {
//     return (
//       request(app)
//         .delete("/api/houses/5")
//         .expect(204)
//         // could make a get req for number 5 in the same test to see if its been deleted
//         .then(makeRequestForHouse5)
//     );
//   });
//   // this delete test below depends on other info
//   // sql foreign key on delete cascade
//   // gets added into migrations child table chained onto references
//   // references().onDelete('SET NULL')
//   it("DELETE /:id deleting a house with students responds with 204", () => {
//     return request(app)
//       .delete("/api/houses/1")
//       .expect(204);
//   })
*/
