import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
const { Client } = pkg;

const app = express();
app.use(express.json());

let dbClient = null;
if (process.env.DATABASE_URL) {
  dbClient = new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false });
  dbClient.connect()
    .then(async () => {
      await dbClient.query(`CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, title TEXT NOT NULL, done BOOLEAN DEFAULT false);`);
      console.log('Connected to Postgres');
    })
    .catch(err => { console.error('PG error', err.message); dbClient=null; });
}

const USERS = [ { id: 1, username: 'admin', password: 'secret' } ];
const SECRET = process.env.JWT_SECRET || 'changeme';

function auth(req, res, next) {
  const bearer = req.headers['authorization']?.split(' ')[1];
  if (!bearer) return res.status(401).json({ error: 'Token required' });
  try {
    req.user = jwt.verify(bearer, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/', (_req, res) => res.send('Backend running — try /todos or /login'));

app.get('/health', (_req, res) => res.send('OK'));

app.post('/login', (req,res)=>{
  const {username,password} = req.body;
  const user = USERS.find(u=>u.username===username && u.password===password);
  if(!user) return res.status(401).json({error:'Invalid credentials'});
  const token = jwt.sign({ sub: user.id, username }, SECRET, { expiresIn:'7d'});
  res.json({ token });
});

const MEM = [ { id:1, title:'Ship to Render', done:true } ];

app.get('/todos', async (_req,res)=>{
  if(dbClient){
      const {rows} = await dbClient.query('SELECT * FROM todos ORDER BY id');
      return res.json(rows);
  }
  res.json(MEM);
});

app.post('/todos', auth, async (req,res)=>{
  const {title=''} = req.body;
  if(!title) return res.status(400).json({error:'title required'});
  if(dbClient){
      const {rows} = await dbClient.query('INSERT INTO todos (title) VALUES ($1) RETURNING *',[title]);
      return res.status(201).json(rows[0]);
  }
  const id = MEM.length ? Math.max(...MEM.map(t=>t.id))+1:1;
  const todo = {id,title,done:false};
  MEM.push(todo);
  res.status(201).json(todo);
});

const PORT = process.env.PORT || 8080;
if(process.env.NODE_ENV!=='test'){
  app.listen(PORT, ()=>console.log('API on',PORT));
}
export default app;
