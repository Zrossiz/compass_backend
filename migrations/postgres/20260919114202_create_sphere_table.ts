import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        create table if not exists spheres (
            id serial not null primary key,
            title varchar(255) not null unique,
            description text not null,
            created_at timestamptz default now(),
            updated_at timestamptz default now()
        );

        alter table professions 
        add sphere_id integer not null references spheres(id) on delete cascade;
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        drop table if not exists spheres;

        alter table professions 
        drop column sphere_id;
    `)
}

