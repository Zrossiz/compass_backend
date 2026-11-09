const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { Readable, Writable } = require('node:stream');
require('module-alias').addAlias('app', path.join(__dirname, '../dist'));
const { SpecialityTrackService } = require('../dist/service/specialityTrack');
const { SpecialityTrackHandler } = require('../dist/handler/specialityTrack');
const { SpecialityTrackS3 } = require('../dist/repository/s3/specialityTrack');
const { SpecialityInterviewDTO } = require('../dist/handler/dto/specialityInterview');
const file = { mimetype: 'image/png', originalname: 'roadmap.png', buffer: Buffer.from('image'), size: 5 };
const payload = { specialityId: 1, title: 'Колледж → работа', sortOrder: 0 };
function response() {
  return {
    code: null,
    status(code) {
      this.code = code;
      return this;
    },
    json() {},
    send() {},
    end() {},
  };
}

test('editing title and order without a file preserves the stored image', async () => {
  let saved;
  const service = new SpecialityTrackService(
    {
      getById: async () => ({ imageLink: 'speciality-tracks/old/image.png' }),
      update: async (_id, data) => {
        saved = data;
      },
    },
    { save: assert.fail },
  );
  const handler = new SpecialityTrackHandler(service);
  const res = response();
  await handler.updateById({ params: { id: '1' }, body: payload }, res, assert.fail);
  assert.equal(res.code, 204);
  assert.deepEqual(saved, payload);
});

test('creation requires an image and editing rejects unsupported files', async () => {
  const handler = new SpecialityTrackHandler({ create: assert.fail, update: assert.fail });
  for (const [method, supplied] of [
    ['create', undefined],
    ['updateById', { ...file, mimetype: 'text/html' }],
  ]) {
    const res = response();
    await handler[method]({ params: { id: '1' }, body: payload, file: supplied }, res, assert.fail);
    assert.equal(res.code, 400);
  }
});

test('missing track returns 404 without uploading replacement', async () => {
  const handler = new SpecialityTrackHandler(
    new SpecialityTrackService({ getById: async () => null }, { save: assert.fail }),
  );
  const res = response();
  await handler.updateById({ params: { id: '99' }, body: payload, file }, res, assert.fail);
  assert.equal(res.code, 404);
});

test('multiple tracks are exposed through public API URLs without storage host dependencies', async () => {
  const service = new SpecialityTrackService(
    {
      getAllBySpecialityId: async () => [
        { id: 1, ...payload, imageLink: 'speciality-tracks/a.png' },
        { id: 2, ...payload, imageLink: 'speciality-tracks/b.png' },
      ],
    },
    {},
  );
  const rows = await service.getAllBySpecialityId(1);
  assert.deepEqual(
    rows.map((r) => r.imageLink),
    ['/api/v1/speciality-track/1/image', '/api/v1/speciality-track/2/image'],
  );
});

test('same filename and title never overwrite another track; legacy object keys remain readable', async () => {
  const objects = new Map();
  const s3 = new SpecialityTrackS3({
    bucketExists: async () => true,
    putObject: async (_bucket, key, buffer) => objects.set(key, buffer),
    statObject: async (_bucket, key) => {
      assert.ok(objects.has(key));
      return { metaData: { 'content-type': 'image/png' } };
    },
    getObject: async (_bucket, key) => Readable.from(objects.get(key)),
  });
  const first = await s3.save(file, payload.title);
  const second = await s3.save(file, payload.title);
  assert.notEqual(first, second);
  objects.set('/legacy title/roadmap.png', file.buffer);
  for (const link of [first, second, 'speciality-tracks/legacy title/roadmap.png']) {
    const image = await s3.getImage(link);
    assert.equal(image.contentType, 'image/png');
    const chunks = [];
    for await (const chunk of image.stream) chunks.push(chunk);
    assert.deepEqual(Buffer.concat(chunks), file.buffer);
  }
});

test('image handler streams the private image with its MIME type', async () => {
  const chunks = [];
  const headers = {};
  const res = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(chunk);
      callback();
    },
  });
  res.setHeader = (key, value) => {
    headers[key] = value;
  };
  const handler = new SpecialityTrackHandler({
    getImage: async () => ({ stream: Readable.from(file.buffer), contentType: file.mimetype }),
  });
  await handler.getImage({ params: { id: '1' } }, res, assert.fail);
  assert.deepEqual(Buffer.concat(chunks), file.buffer);
  assert.equal(headers['Content-Type'], 'image/png');
});

test('videos accept web URLs and reject protocols the client cannot play', () => {
  const video = { specialityId: 1, title: 'Видео', order: 0 };
  assert.ok(SpecialityInterviewDTO.safeParse({ ...video, videoLink: 'https://example.com/video.mp4' }).success);
  assert.equal(SpecialityInterviewDTO.safeParse({ ...video, videoLink: 'ftp://example.com/video.mp4' }).success, false);
});
