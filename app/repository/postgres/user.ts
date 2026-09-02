import type { User } from 'app/model/user';
import type { IUserRepository } from 'app/repository/postgres/interface';
import type { Knex } from 'knex';
import { isUniquePgErrViolation } from 'app/helpers/isUniqueViolation';
import { UsernameAlreadyExistsError } from 'app/errors/user';

type UserRow = {
  id: number;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
};

export class UserRepo implements IUserRepository {
  constructor(private readonly pgConn: Knex) {}

  async create(username: string, password: string): Promise<User> {
    try {
      const [row] = await this.pgConn<UserRow>('users').insert({ username, password }).returning('*');

      return this.toUser(row);
    } catch (err) {
      if (isUniquePgErrViolation(err)) {
        throw new UsernameAlreadyExistsError();
      }

      throw err;
    }
  }

  async getByUsername(username: string): Promise<User | null> {
    const row = await this.pgConn<UserRow>('users').where({ username }).first();

    return row ? this.toUser(row) : null;
  }

  private toUser = (row: UserRow): User => ({
    id: row.id,
    username: row.username,
    password: row.password,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}
