const express=require("express");
const {Pool}=require("pg");
const app=express();
app.use(express.json());
const db=new Pool({connectionString:process.env.DATABASE_URL||null,host:process.env.DB_HOST||"localhost",port:parseInt(process.env.DB_PORT||"5432"),database:process.env.DB_NAME||"inpay",user:process.env.DB_USER||"postgres",password:process.env.DB_PASSWORD||"",ssl:process.env.DATABASE_URL?{rejectUnauthorized:false}:false});
app.get("/",(_,res)=>res.json({name:"InPay",version:"1.0.0",status:"running",time:new Date()}));
app.get("/health",async(req,res)=>{
try{
const r=await db.query("SELECT 1 as ok");
res.json({status:"ok",database:"connected"});
}catch(e){res.json({status:"error",message:e.message});}
});
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log("InPay running on port "+PORT));
