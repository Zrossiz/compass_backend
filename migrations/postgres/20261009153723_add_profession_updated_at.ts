import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
      alter table professions
      add updated_at timestamptz default now();
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
        alter table professions
        drop column updated_at;
    `);
}
