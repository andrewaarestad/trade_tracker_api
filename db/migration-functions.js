const autoUpdateSQL = "CREATE OR REPLACE FUNCTION update_updated_at_column()\n RETURNS TRIGGER AS $$ \nBEGIN \n   IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN\n      NEW.updated_at = now();\n      RETURN NEW;\n   ELSE\n      RETURN OLD;\n   END IF;\nEND;\n$$ language 'plpgsql';";
const dropFunction = 'DROP FUNCTION update_updated_at_column();';


module.exports = {

  // createAutoUpdatedAtTimestampTrigger: (knex) => {
  //   return
  // },
  //
  // dropAutoUpdatedAtTimestampTrigger: (knex) => {
  //   return knex.raw(this.dropFunction)
  // },

  addAutoUpdatedAtTimestampTriggerForTable: async (knex, tableName) => {
    await knex.raw(autoUpdateSQL);
    return knex.raw(
      'CREATE TRIGGER update_' +
      tableName +
      '_updated_at BEFORE UPDATE ON "' +
      tableName +
      '" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();'
    )
  },

  changeColumnType: (knex, table, column, newType) => {
    return knex.raw('ALTER TABLE "' + table + '" ALTER COLUMN "' + column + '" TYPE ' + newType + '')
  },

  dropTableCascade(knex, tableName) {
    return knex.raw(`DROP TABLE "${tableName}" CASCADE;`)
  },

  // alterConstraint(knex, table, constraintName) {
  //
  //   const sql = 'begin;\n' +
  //     '\n' +
  //     'alter table ' + table + '\n' +
  //     'drop constraint ' + constraintName + ';\n' +
  //     '\n' +
  //     'alter table ' + table + '\n' +
  //     'add constraint ' + constraintName + '\n' +
  //     'foreign key (customer_id)\n' +
  //     'references customers (id)\n' +
  //     'on delete cascade;\n' +
  //     '\n' +
  //     'commit;'
  //
  // }

  createStandardTable(knex, tableName, builder) {
    return knex.schema.createTable(tableName, t => {
      t.increments('id').primary();
      t.timestamps(false, true);

      t.boolean('deleted').notNullable().defaultTo(false);

      builder(t)
    })
    .then(() => {
      return this.addAutoUpdatedAtTimestampTriggerForTable(knex, tableName);
    })
  }
}
