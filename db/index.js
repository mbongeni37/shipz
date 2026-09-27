const {Pool}=require('pg');
const fs=require('fs');
const path=require('path');
require('dotenv').config();
if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing');
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:false});
async function query(text,params){return pool.query(text,params);}
async function initDb(){await pool.query(fs.readFileSync(path.join(__dirname,'schema.sql'),'utf8'));}
module.exports={pool,query,initDb};
