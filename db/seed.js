const bcrypt=require('bcryptjs');
require('dotenv').config();
const {query,initDb,pool}=require('./index');
(async()=>{
 try{
  await initDb();
  const email=(process.env.ADMIN_EMAIL||'admin@example.com').toLowerCase();
  const password=process.env.ADMIN_PASSWORD||'ChangeMeNow!123';
  const hash=await bcrypt.hash(password,12);
  await query(`INSERT INTO users(full_name,email,whatsapp,password_hash,role,status)
   VALUES($1,$2,$3,$4,'admin','active')
   ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash,role='admin',status='active'`,
   ['Academy Administrator',email,process.env.ADMIN_WHATSAPP||'+263778731715',hash]);
  const mods=[
   [1,'Introduction to Shipping & Logistics',0,true,'Shipping, logistics, supply chain, customs and core terminology.',1],
   [2,'Import & Export Procedures',12,false,'Step-by-step import and export procedures.',2],
   [3,'Shipping Documents & Forms',12,false,'Invoices, bills of lading, manifests, declarations and certificates.',3],
   [4,'Incoterms & International Trade',12,false,'FOB, CIF, EXW, FCA, CFR, DAP, DPU, DDP and examples.',4],
   [5,'Customs, HS Codes & Tariff Classification',12,false,'Customs, HS codes, tariff books, valuation, origin, duties and taxes.',5],
   [6,'ASYCUDA & Customs Clearance',12,false,'Declarations, assessment, selectivity, inspection, payment and release.',6],
   [7,'Freight Forwarding & Transport',12,false,'Sea, air, road, rail, FCL, LCL, consolidation and transit.',7],
   [8,'Warehousing, Cargo & Inventory',12,false,'Warehouse operations, inventory, cargo handling and stock control.',8],
   [9,'Costs, Duties & Practical Calculations',12,false,'Freight, insurance, customs value, duty, VAT, landed cost and CBM.',9],
   [10,'Professional Shipping Operations',12,false,'Complete shipment case study, documentation workflow and final assessment.',10]
  ];
  for(const m of mods) await query(`INSERT INTO modules(id,title,price_usd,is_free,description,sort_order) VALUES($1,$2,$3,$4,$5,$6)
   ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,price_usd=EXCLUDED.price_usd,is_free=EXCLUDED.is_free,description=EXCLUDED.description,sort_order=EXCLUDED.sort_order`,m);
  console.log('Admin ready:',email);
 }catch(e){console.error(e);process.exitCode=1}finally{await pool.end();}
})();
