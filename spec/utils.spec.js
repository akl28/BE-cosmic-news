const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("takes an array and returns a new array", () => {
    const input = [];
    const actual = formatDates(input);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it("takes an array of one timestamp object and returns a new array with the date formatted", () => {
    const input = [
      {
        created_at: 1542284514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        created_at: new Date(1542284514171)
        // "created_at": "2018-11-15T12:21:54.171Z"
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("takes an array of an object with multiple key/value pairs and returns a new array with the date formatted", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("takes an array of multiple objects and returns a new array with date formatted", () => {
    const input = [
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171
      },
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: new Date(1037708514171)
      },
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: new Date(911564514171)
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: new Date(785420514171)
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("does not mutate the input array", () => {
    const input = [
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    const input2 = [
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    formatDates(input);
    expect(input).to.eql(input2);
  });
});

// utils function 2
describe("makeRefObj", () => {
  it("returns an empty object when passed an empty array", () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it("takes an array of one object and returns an object with title value as the key and article_id value as the value", () => {
    const input = [{ article_id: 1, title: "A" }];
    const actual = makeRefObj(input);
    const expected = { A: 1 };
    expect(actual).to.eql(expected);
  });
  it("takes an array of multiple objects and returns an object with new format", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" }
    ];

    const actual = makeRefObj(input);
    const expected = { A: 1, B: 2 };
    expect(actual).to.eql(expected);
  });
  it("does not mutate the input array", () => {
    const input = [{ article_id: 1, title: "A" }];
    const input2 = [{ article_id: 1, title: "A" }];
    makeRefObj(input);
    expect(input).to.eql(input2);
  });
});

// utils function 3
describe.only("formatComments", () => {
  it("takes an array and returns an array", () => {
    const input = [];
    const refObj = { A: 1 };
    const actual = formatComments(input, refObj);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it('takes an array of one object and renames the "belongs_to" property to an "article_id" key and `created_by` to `author` and formats the date', () => {
    const input = [
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389
      }
    ];
    const refObj = {
      "Living in the shadow of a great man": 1,
      "Eight pug gifs that remind me of mitch": 2,
      "UNCOVERED: catspiracy to bring down democracy": 4,
      A: 5,
      Z: 6
    };
    const actual = formatComments(input, refObj);
    const expected = [
      {
        body: "This morning, I showered for nine minutes.",
        article_id: 1,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(975242163389)
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("takes an array of multiple objects and returns an array of objects in correct format", () => {
    const input = [
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389
      },
      {
        body: "I am 100% sure that we're not completely sure.",
        belongs_to: "UNCOVERED: catspiracy to bring down democracy",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1069850163389
      }
    ];
    const refObj = {
      "Living in the shadow of a great man": 1,
      "Eight pug gifs that remind me of mitch": 2,
      "UNCOVERED: catspiracy to bring down democracy": 4,
      A: 5,
      Z: 6
    };
    const actual = formatComments(input, refObj);
    const expected = [
      {
        body: "This morning, I showered for nine minutes.",
        article_id: 1,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(975242163389)
      },
      {
        body: "I am 100% sure that we're not completely sure.",
        article_id: 4,
        author: "butter_bridge",
        votes: 1,
        created_at: new Date(1069850163389)
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("does not mutate the input array", () => {
    const input = [
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389
      }
    ];
    const input2 = [
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389
      }
    ];
    makeRefObj(input);
    expect(input).to.eql(input2);
  });
});
