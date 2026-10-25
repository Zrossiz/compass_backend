const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('module-alias').addAlias('app', path.join(__dirname, '../dist'));
const { UniversityHandler } = require('../dist/handler/university');
const { UniversityRepo } = require('../dist/repository/postgres/university');
const { UserHandler } = require('../dist/handler/user');
const { Handler } = require('../dist/handler/handler');
function response() {
  return {
    code: null,
    data: null,
    cookies: [],
    status(code) {
      this.code = code;
      return this;
    },
    json(data) {
      this.data = data;
      return this;
    },
    send() {},
    clearCookie(name, options) {
      this.cookies.push({ name, options });
    },
  };
}
test('university listing returns data and forwards service failures', async () => {
  const rows = [{ id: 1, title: 'Вуз', description: 'Описание', region: 'Москва' }];
  const handler = new UniversityHandler({ getAll: async () => rows });
  const res = response();
  await handler.getAll({}, res, assert.fail);
  assert.equal(res.code, 200);
  assert.deepEqual(res.data, rows);
  const failure = new Error('database');
  let received;
  await new UniversityHandler({
    getAll: async () => {
      throw failure;
    },
  }).getAll({}, response(), (e) => {
    received = e;
  });
  assert.equal(received, failure);
});
test('university projection preserves description and separate relation ID', () => {
  const repo = new UniversityRepo(null);
  const row = { id: 12, title: 'Вуз', region: 'Москва', description: 'Описание', created_at: new Date(), link_id: 81 };
  const entity = repo.toUniversity(row);
  assert.equal(entity.id, 12);
  assert.equal(entity.linkId, 81);
  assert.equal(entity.description, 'Описание');
  delete row.link_id;
  assert.equal('linkId' in repo.toUniversity(row), false);
});
test('logout clears both cookies with matching production attributes', () => {
  const handler = new UserHandler({}, { env: 'production' });
  const res = response();
  handler.logout({}, res);
  assert.equal(res.code, 204);
  assert.deepEqual(
    res.cookies.map((c) => c.name),
    ['accessToken', 'refreshToken'],
  );
  for (const cookie of res.cookies)
    assert.deepEqual(cookie.options, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
});
test('university list is authenticated and logout route is registered', () => {
  const routes = [];
  const app = {};
  for (const method of ['get', 'post', 'delete'])
    app[method] = (url, ...handlers) => routes.push({ method, url, handlers });
  new Handler(app, {}, { app: { jwt: {} } }).registerRoutes();
  const list = routes.find((r) => r.method === 'get' && r.url === '/api/v1/university');
  assert.equal(list.handlers.length, 2);
  assert.ok(routes.some((r) => r.method === 'post' && r.url === '/api/v1/users/logout'));
});
