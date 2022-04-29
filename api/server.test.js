const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');



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
beforeAll(async () => {
  await db.migrate.rollback();  // npx knex migrate:rollback
  await db.migrate.latest();    // npx knex migrate:latest
});

afterAll(async () => {
  await db.destroy();
});

beforeEach(async () => {
  await request(server).post('/api/auth/register')
  .send({username:'Errol123', password:'abc123'})
});


//Api
describe("Functionality for account creation and login, implemented inside `api/auth/auth-router.js`.",()=>{
  
  
  test('[POST] to the `/api/auth/login` endpoint returns a token',async()=>{
    const res = await request(server).post('/api/auth/register')
    .send({username:'Errol123', password:'abc123'});
    expect(res.body).toHaveProperty('token');
  })

   //Testing /api/auth/register
   test('[POST] to the `/api/auth/register` endpoint creates a new account',async()=>{
    const res = await request(server).post('/api/auth/register')
    .send({username:'USER', password:'PASS'});
    expect(res.body).toHaveProperty('id');
  })

   test('[POST] /api/auth/register returns correct error message with no username.',async()=>{
    const res = await request(server).post('/api/auth/register')
    .send({username:'', password:'PASS'});
    expect(res.body).toMatchObject({message:'Missing username or password.'});
  })

  test('[POST] /api/auth/register returns correct error message with no password.',async()=>{
    const res = await request(server).post('/api/auth/register')
    .send({username:'ADMIN', password:''});
    expect(res.body).toMatchObject({message:'Missing username or password.'});
  })

  test('[POST] /api/auth/register returns correct error message when password is too short.',async()=>{
    const res = await request(server).post('/api/auth/register')
    .send({username:'ADMIN', password:'P'});
    expect(res.body).toMatchObject({message:'Password must be at least 4 characters.'});
  })

  //Testing /api/auth/login
  test('[POST] /api/auth/login returns correct error message with incorrect username.',async()=>{
    const res = await request(server).post('/api/auth/login')
    .send({username:'Errol123', password: 'abc122'});
    expect(res.body).toMatchObject({message: 'Username or Password Incorrect'});
  })

  test('[POST] /api/auth/login returns correct error message with incorrect password.',async()=>{
    const res = await request(server).post('/api/auth/login')
    .send({username:'Errol124', password: 'abc123'});
    expect(res.body).toMatchObject({message: 'Username or Password Incorrect'});
  })
}
);


describe("Middleware used to restrict access to resources from non-authenticated requests",()=>{
  //Testing restricted middleware
  test('[GET] /api/jokes shows correct message when missing token in authorization header.',async()=>{
    const res = await (await request(server).get('/api/jokes'))
    .send({});
    expect(res.body).toMatchObject({message: 'token required'});
  })
  test('[GET] /api/jokes shows correct message when token is expired or invalid',async()=>{
    const res = await (await request(server).get('/api/jokes'))
    .send({token: '2xsdbjabb3sda'});
    expect(res.body).toMatchObject({message: 'token invalid'});
  })

}
);