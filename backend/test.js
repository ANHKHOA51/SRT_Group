import { test, before, after } from 'node:test';
import assert from 'node:assert';
import db, { initializeDatabase } from './db.js';
import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';

let server;
const PORT = 3001; 
const API_URL = `http://localhost:${PORT}/api/tasks`;

before(async () => {
  await initializeDatabase();

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/tasks', tasksRouter);

  await new Promise((resolve) => {
    server = app.listen(PORT, resolve);
  });
  console.log(`Test server booted successfully on port ${PORT}`);
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await db.destroy();
  console.log('Test teardown complete. Connections closed.');
});

test('GET /api/tasks - returns successful task list array', async () => {
  const response = await fetch(API_URL);
  assert.strictEqual(response.status, 200);
  const data = await response.json();
  assert.ok(Array.isArray(data));
});

test('POST /api/tasks - rejects invalid status at API validation level', async () => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Invalid API Status', status: 'super_done' }),
  });

  assert.strictEqual(response.status, 400);
});

test('POST /api/tasks - accepts valid status and deadline', async () => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Knex Integration Test Task',
      description: 'Verifying DB and HTTP layers work together',
      status: 'ongoing',
      deadline: '2026-12-31T23:59:59.000Z'
    }),
  });

  assert.strictEqual(response.status, 201);
  const data = await response.json();
  assert.strictEqual(data.title, 'Knex Integration Test Task');
  assert.strictEqual(data.status, 'ongoing');
  assert.strictEqual(data.deadline, '2026-12-31T23:59:59.000Z');
});

test('Database constraints - blocks invalid status inserts at PostgreSQL layer', async () => {
  try {
    await db('tasks').insert({
      title: 'Bypassing API validator',
      status: 'invalid_status_value'
    });
    assert.fail('Should have failed due to database CHECK constraint violation');
  } catch (error) {
    assert.strictEqual(error.code, '23514', `Expected PostgreSQL error 23514 but got: ${error.message}`);
    console.log('Database correctly blocked invalid status at SQL constraint layer!');
  }
});
