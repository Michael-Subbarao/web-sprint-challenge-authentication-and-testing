const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

beforeAll(async () => {
  await db.migrate.rollback();  // npx knex migrate:rollback
  await db.migrate.latest();    // npx knex migrate:latest
});

beforeEach(async () => {
  await db('users').truncate();
  await request(server).post('/api/auth/register')
    .send({username:'Errol123', password:'abc123'});
});

afterAll(async () => {
  await db.destroy();
});




//Tests Run Without Error
test('Sanity',()=>{
  expect(true).toBe(true);
});

//In testing environment
test('Environment',()=>{
  expect(process.env.NODE_ENV).toBe('testing');
});

//MVP Req 1 An authentication workflow with npm functionality for account creation and login, implemented inside `api/auth/auth-router.js`.
//MVP Req 2 Middleware used to restrict access to resources from non-authenticated requests, implemented inside `api/middleware/restricted.js`.

//Api
describe("Functionality for account creation and login, implemented inside `api/auth/auth-router.js`.",()=>{

   //Testing /api/auth/register
   test('[POST] to the `/api/auth/register` endpoint creates a new account',async()=>{
    const res = await request(server).post('/api/auth/register')
    .send({username:'USER', password:'PASS'});
    const users = await db('users');
    expect(res.body.message).toBe('Great to have you, USER');
    expect(users).toHaveLength(2);
    
  })

   test('[POST] /api/auth/register returns correct error message with no username.',async()=>{
    const res = await request(server).post('/api/auth/register')
    .send({username:'', password:'PASS'});
    expect(res.body).toMatchObject({message:'username and password required.'});
  })

  test('[POST] /api/auth/register returns correct error message with no password.',async()=>{
    const res = await request(server).post('/api/auth/register')
    .send({username:'ADMIN', password:''});
    expect(res.body).toMatchObject({message:'username and password required.'});
  })

  //test('[POST] /api/auth/register returns correct error message when password is too short.',async()=>{
  //  const res = await request(server).post('/api/auth/register')
  //  .send({username:'ADMIN', password:'P'});
  //  expect(res.body).toMatchObject({message:'Password must be at least 4 characters.'});
  //})

  //Testing /api/auth/login
  test('[POST] /api/auth/login endpoint returns a token',async()=>{
    let res = await request(server).post('/api/auth/login')
    .send({username:'Errol123', password:'abc123'});
    expect(res.body).toHaveProperty('token');
  })

  test('[POST] /api/auth/login returns correct error message with incorrect username.',async()=>{
    const res = await request(server).post('/api/auth/login')
    .send({username:'Errol123', password: 'abc122'});
    expect(res.body).toMatchObject({message: "invalid credentials"});
  })

  test('[POST] /api/auth/login returns correct error message with incorrect password.',async()=>{
    const res = await request(server).post('/api/auth/login')
    .send({username:'Errol124', password: 'abc123'});
    expect(res.body).toMatchObject({message: "invalid credentials"});
  })
}
);


describe("Middleware used to restrict access to resources from non-authenticated requests",()=>{
  //Testing restricted middleware
  test('[GET] /api/jokes shows correct message when missing token in authorization header.',async()=>{
    const res = await request(server).get('/api/jokes');
    expect(res.body.message).toBe("token required");
  })
  test('[GET] /api/jokes shows correct message when token is expired or invalid',async()=>{
    const res = await request(server).get('/api/jokes').set('Authorization', "2dsdcxt3fdsdfs");
    expect(res.body.message).toBe("token invalid");
  })
}
);