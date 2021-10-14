const Schemas = require("../migration-functions");

exports.up = function(knex) {

  return Promise.all([

    Schemas.createStandardTable(knex, 'brokerage_account', t => {
      t.string('name');
      t.string('brokerage');
      t.string('account_id');
      t.integer('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE');

    }),

    Schemas.createStandardTable(knex, 'position_set', t => {
      t.integer('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
      t.integer('underlying_instrument_id').notNullable().references('id').inTable('instrument').onDelete('SET NULL');
      t.integer('brokerage_account_id').notNullable().references('id').inTable('brokerage_account').onDelete('CASCADE');
      t.string('type');
      t.boolean('is_open').notNullable().defaultTo('true');

      t.dateTime('entry_time').notNullable();
      t.dateTime('exit_time');
    }),

    Schemas.createStandardTable(knex, 'trade', t => {

      t.integer('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
      t.integer('instrument_id').notNullable().references('id').inTable('instrument');
      t.integer('position_set_id').references('id').inTable('position_set').onDelete('CASCADE');
      t.integer('position_id').references('id').inTable('position').onDelete('CASCADE');
      t.integer('brokerage_account_id').notNullable().references('id').inTable('brokerage_account').onDelete('CASCADE');

      t.dateTime('execution_time');
      t.double('quantity');
      t.double('price');
      t.double('value');

      t.string('external_id');
      t.string('order_id');

      t.jsonb('source_json');

    }),

    Schemas.createStandardTable(knex, 'position', t => {

      t.integer('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
      t.integer('instrument_id').references('id').inTable('instrument').onDelete('SET NULL');
      t.integer('position_set_id').references('id').inTable('position_set').onDelete('CASCADE');
      t.integer('brokerage_account_id').notNullable().references('id').inTable('brokerage_account').onDelete('CASCADE');

      t.integer('rolled_from_id').references('id').inTable('position').onDelete('SET NULL');
      t.integer('rolled_to_id').references('id').inTable('position').onDelete('SET NULL');


      t.dateTime('entry_time').notNullable();
      t.dateTime('exit_time');
      t.double('entry_quantity');
      t.double('current_quantity');
      t.double('entry_price');
      t.double('exit_price');
      t.double('pl_close');
      t.double('entry_value');
      t.double('exit_value');

    }),

    Schemas.createStandardTable(knex, 'instrument', t => {

      t.string('type').notNullable();
      t.string('symbol').notNullable();

      t.dateTime('expiration');

      t.integer('strike');
      t.string('put_call');

      t.integer('underlying_instrument_id').references('id').inTable('instrument').onDelete('SET NULL');

    }),

    Schemas.createStandardTable(knex, 'session', t => {
      t.integer('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
      t.string('token').notNullable();
      t.string('type').notNullable();
      t.dateTime('expires_at');
    }),

    Schemas.createStandardTable(knex, 'user', t => {

      t.string('email').notNullable();
      t.string('password').notNullable();



    })

  ])
};

exports.down = function(knex) {
  return Promise.all([
    Schemas.dropTableCascade(knex, 'brokerage_account'),
    Schemas.dropTableCascade(knex, 'position_set'),
    Schemas.dropTableCascade(knex, 'trade'),
    Schemas.dropTableCascade(knex, 'position'),
    Schemas.dropTableCascade(knex, 'instrument'),
    Schemas.dropTableCascade(knex, 'session'),
    Schemas.dropTableCascade(knex, 'user')
  ])
};
