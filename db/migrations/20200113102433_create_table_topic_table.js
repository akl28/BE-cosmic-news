// const knex = require("knex");

exports.up = function(knex) {
  console.log("up function has been called");
  // make topics table
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug")
      .primary()
      .unique();
    // ? increments
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  // drop topics table
  console.log("calling the down function");
  return knex.schema.dropTable("topics");
};

// data we have but not how it should look in DB
