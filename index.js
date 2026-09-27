const express=require('express'),path=require('path'),cookie=require('cookie-parser'),helmet=require('helmet');require('dotenv').config();const {initDb}=require('./db');
const app=express();app.use(helmet({contentSecurityPolicy:false}));app.use(express.json());app.use(cookie());app.use(express.static(path.join(__dirname,'..','public')));
app.use('/api/auth',require('./routes/auth'));app.use('/api/student',require('./routes/student'));app.use('/api/admin',require('./routes/admin'));
app.get('/{*splat}',(req,res)=>req.path.startsWith('/api/')?res.status(404).json({error:'Not found'}):res.sendFile(path.join(__dirname,'..','public','index.html')));
const port=process.env.PORT||3000;initDb().then(()=>app.listen(port,()=>console.log('Academy running on port '+port))).catch(e=>{console.error(e);process.exit(1)});
