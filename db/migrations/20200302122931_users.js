exports.up = function(knex) {
  return knex.schema.createTable("users", usersTable => {
    usersTable.string("username").primary();
    usersTable.string("avatar_url");
    usersTable.string("name").notNullable();
    usersTable.string("password").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
