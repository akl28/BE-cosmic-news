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
  it("take an array of one object and returns a new array with all object inside unchanged", () => {
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
    const expected = [];
    expect(actual).to.eql(expected);
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
