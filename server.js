const express=require("express");
const {Pool}=require("pg");
const path=require("path");
const app=express();
const PORT=process.env.PORT||3000;

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

const db=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_URL?{rejectUnauthorized:false}:false});

app.get("/health",async(req,res)=>{
try{
const r=await db.query("SELECT NOW()");
res.json({status:"ok",database:"connected",time:r.rows[0].now});
}catch(e){res.json({status:"ok",database:"not connected",message:e.message});}
});

app.get("*",(req,res)=>{
res.sendFile(path.join(__dirname,'public','index.html'));
});

app.listen(PORT,()=>console.log("InPay running on port "+PORT));
