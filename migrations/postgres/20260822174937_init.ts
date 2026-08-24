import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    create table if not exists users (
      id serial not null primary key,
      username varchar(40) not null, 
      password varchar(255) not null,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );

    create table if not exists professions (
      id serial not null primary key,
      title varchar(255) not null,
      description text not null,
      created_at timestamptz default now()
    );

    create table if not exists specialities (
      id serial not null primary key,
      profession_id integer not null references professions(id) on delete cascade,
      title varchar(255) not null,
      description text not null,
      created_at timestamptz default now()
    );

    create table if not exists universities (
      id serial not null primary key,
      title varchar(255) not null,
      region varchar(255) not null,
      created_at timestamptz default now()
    );

    create table if not exists profession_interviews (
      id serial not null primary key,
      profession_id integer not null references professions(id) on delete cascade,
      title varchar(255) not null,
      video_link varchar(255) not null,
      "order" integer not null,
      created_at timestamptz default now()
    );

    create table if not exists speciality_interviews (
      id serial not null primary key,
      speciality_id integer not null references specialities(id) on delete cascade,
      title varchar(255) not null,
      video_link varchar(255) not null,
      sort_order integer not null,
      created_at timestamptz default now()
    );

    create table if not exists speciality_tracks (
      id serial not null primary key,
      speciality_id integer not null references specialities(id) on delete cascade,
      title varchar(255) not null,
      image_link varchar(255) not null,
      sort_order integer not null,
      created_at timestamptz default now()
    );

    create table if not exists speciality_universities (
      id serial not null primary key,
      speciality_id integer not null references specialities(id) on delete cascade,
      university_id integer not null references universities(id) on delete cascade,
      unique (speciality_id, university_id)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    drop table if exists speciality_universities;
    drop table if exists speciality_tracks;
    drop table if exists speciality_interviews;
    drop table if exists profession_interviews;
    drop table if exists universities;
    drop table if exists specialities;
    drop table if exists professions;
    drop table if exists users;
  `);
}
