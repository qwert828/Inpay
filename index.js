const express=require("express");
const {Pool}=require("pg");
const app=express();
app.use(express.json());
const db=new Pool({host:process.env.DB_HOST||"localhost",port:5432,database:"inpay",user:process.env.DB_USER||"u0_a272",password:""});
app.get("/health",async(req,res)=>{
try{
const r=await db.query("SELECT COUNT(*) FROM admins");
res.json({status:"ok",admins:r.rows[0].count,database:"connected"});
}catch(e){res.json({status:"error",message:e.message});}
});
app.listen(3000,()=>console.log("InPay running on port 3000"));
