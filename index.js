const express=require("express");
const app=express();
app.use(express.json());
app.get("/",(_,res)=>res.json({name:"InPay",version:"1.0.0",status:"running",zambia:true}));
app.get("/health",(_,res)=>res.json({status:"ok"}));
app.listen(process.env.PORT,"0.0.0.0",()=>console.log("InPay running on port "+process.env.PORT));
