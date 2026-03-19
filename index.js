const express=require("express");
const {Pool}=require("pg");
const app=express();
app.use(express.json());
const db=new Pool({host:process.env.DB_HOST||"localhost",port:process.env.DB_PORT||5432,database:process.env.DB_NAME||"inpay",user:process.env.DB_USER||"u0_a272",password:process.env.DB_PASSWORD||""});
app.get("/health",async(req,res)=>{
try{
const r=await db.query("SELECT COUNT(*) FROM admins");
res.json({status:"ok",admins:r.rows[0].count,database:"connected"});
}catch(e){res.json({status:"error",message:e.message});}
});
app.get("/",(_,res)=>res.json({name:"InPay",version:"1.0.0",status:"running"}));
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log("InPay running on port "+PORT));
