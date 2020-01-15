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
    describe("/articles", () => {
      describe("/:article_id", () => {
        it("GET: 200 responds with an article object with a comment count, given an article_id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(response => {
              // console.log(response.body.article[0], "**");
              // const { articles } = response.body;
              //expect(articles).to.have.length(8);
              //  console.log(response.body, "**");
              expect(response.body.article).to.be.an("array");
              expect(response.body.article[0]).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 100,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z",
                comment_count: "13"
              });

              expect(response.body.article[0]).to.have.keys(
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
              // console.log(response.body, "***");
              expect(response.body).to.eql({
                article: [
                  {
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2018-11-15T12:21:54.171Z",
                    votes: 122
                  }
                ]
              });
            });
        });
        it("PATCH: 200 decrements the current article votes given an article id", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(200)
            .send({ inc_votes: -25 }) // << body
            .then(response => {
              // console.log(response.body, "***");
              expect(response.body).to.eql({
                article: [
                  {
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2018-11-15T12:21:54.171Z",
                    votes: 75
                  }
                ]
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
        it("PATCH: 400 sends an error message when sending an invlaid body", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(400)
            .send({ inc_votes: "twentytwovotes" })
            .then(response => {
              // console.log(response.body.msg, "***");
              expect(response.body.msg).to.equal("Bad Request");
            });
        });
        it("PATCH: 400 sends an error message when sending a missing body", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(400)
            .send({})
            .then(response => {
              expect(response.body.msg).to.equal("Bad Request");
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
              expect(response.body.comment[0]).to.have.keys(
                "body",
                "votes",
                "created_at",
                "author",
                "article_id",
                "comment_id"
              );
              expect(response.body.comment[0].body).to.equal(
                "The fluffy dog ate the banana"
              );
              expect(response.body.comment[0]["article_id"]).to.equal(1);
              expect(response.body.comment[0]["author"]).to.equal(
                "butter_bridge"
              );
            });
        });
        it("POST: 400 when empty body is sent as a comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .expect(400)
            .send({})
            .then(response => {
              // console.log(response);
              expect(response.body.msg).to.equal("Bad Request: empty body");
            });
        });
        it("POST: 400 when comment is sent in wrong format", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .expect(400)
            .send({ username: 28, body: "hi" })
            .then(response => {
              // console.log(response);
              expect(response.body.msg).to.equal(
                "Bad Request: comment in wrong format"
              );
            });
        });
        it.only("GET: 200 responds with an array of comments given the article_id", () => {
          return request(app)
            .get("/api/articles/9/comments")
            .expect(200)
            .then(response => {
              // console.log(response.body.comments, "**");
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

// querying
// test order by query will sort by house name alphabetically
// api/houses?order_by=animal
// const houses = {response.body}
// expect(houses).to.be.sortedBy('animal', {descending: false})

// // controller
// getHouses => {
//   selectHouses(req.query.order_by, req.query.animal)
// }

// //model
// // takes a parameter
// // default value = house name
// exports.selectHouses = ((order_by = 'house_name'), animal) => {
//   // if animal has a value we want to apply a where clause

//     .modify(function(currentQuery) {
//       if (animal) currentQuery.where('houses.animal', animal)
//       if (another thing) {another query onto currentQuery}
//     })

// }
// .orderBy('order_by' || 'house_name','asc')

// // ? when hard to put a default value
// // it get 200 query to bring back houses that only havea a ccertain animal
// // get.api/houses?animal=badger
// // when animal/badger is not provided - ignore where statement
// const { houses} = res.body
// expect(houses[0].animal).to.equal('badger')
// expect (houses.every(house => house.animal === 'badger')
