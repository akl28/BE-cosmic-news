const knex = require("knex");
const customConfig = require("./knexfile");

const connection = knex(customConfig);

module.exports = connection;
