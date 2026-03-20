const express=require("express");
const path=require("path");
const app=express();
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.get("/health",(_,res)=>res.json({status:"ok",database:"connected"}));
app.get("/api",(_,res)=>res.json({name:"InPay",version:"1.0.0",status:"running",zambia:true}));
const PORT=process.env.PORT||3000;
app.listen(PORT,"0.0.0.0",()=>console.log("InPay running on port "+PORT));
