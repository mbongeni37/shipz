const jwt=require('jsonwebtoken');const {query}=require('../db');
async function auth(req,res,next){try{const t=req.cookies.sla_session;if(!t)return res.status(401).json({error:'Not logged in'});const p=jwt.verify(t,process.env.JWT_SECRET);const r=await query('SELECT id,full_name,email,whatsapp,role,status FROM users WHERE id=$1',[p.id]);if(!r.rowCount)return res.status(401).json({error:'Account not found'});const u=r.rows[0];if(u.status==='blocked'||u.status==='rejected')return res.status(403).json({error:'Account is not active'});req.user=u;next()}catch(e){res.status(401).json({error:'Session expired'})}}
function adminOnly(req,res,next){if(req.user?.role!=='admin')return res.status(403).json({error:'Administrator access required'});next()}
module.exports={auth,adminOnly};
