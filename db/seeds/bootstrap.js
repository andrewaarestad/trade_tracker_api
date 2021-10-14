
async function truncate(knex, tables) {
  for (let ii=0; ii<tables.length; ii+=1) {
    await knex.raw(`TRUNCATE TABLE "${tables[ii]}" RESTART IDENTITY CASCADE`);
  }
}

exports.seed = async function(knex) {

  const brokerage_accounts = require('../fixtures/brokerage_accounts');
  const instruments = require('../fixtures/instruments');
  const position_sets = require('../fixtures/position_sets');
  const positions = require('../fixtures/positions');
  const users = require('../fixtures/users');

  // WARNING: Deletes ALL existing data!

  await truncate(knex, [
    'user',
    // 'position',
    // 'position_set',
    // 'instrument',
    'brokerage_account'
  ]);

  // await knex('instrument').insert(instruments);
  await knex('user').insert(users);
  await knex('brokerage_account').insert(brokerage_accounts);
  // await knex('position_set').insert(position_sets);
  // await knex('position').insert(positions);
};
