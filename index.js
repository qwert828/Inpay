const express=require("express");
const path=require("path");
const app=express();

app.use((req,res,next)=>{
res.setHeader("X-Content-Type-Options","nosniff");
res.setHeader("X-Frame-Options","DENY");
res.setHeader("X-XSS-Protection","1; mode=block");
res.setHeader("Referrer-Policy","strict-origin-when-cross-origin");
res.setHeader("Strict-Transport-Security","max-age=31536000; includeSubDomains");
if(req.headers["x-forwarded-proto"]==="http"){return res.redirect(301,"https://"+req.headers.host+req.url);}
next();
});

const hits={};
app.use((req,res,next)=>{
const ip=req.ip||req.connection.remoteAddress;
const now=Date.now();
if(!hits[ip])hits[ip]=[];
hits[ip]=hits[ip].filter(t=>now-t<60000);
if(hits[ip].length>100){return res.status(429).json({error:"Too many requests"});}
hits[ip].push(now);
next();
});

app.use(express.json({limit:"10kb"}));
app.use(express.static(path.join(__dirname,"public")));

app.get("/health",(_,res)=>res.json({status:"ok"}));
app.get("/api",(_,res)=>res.json({name:"InPay",version:"1.0.0",status:"running",zambia:true}));

app.use((_,res)=>res.status(404).sendFile(path.join(__dirname,"public","index.html")));
app.use((err,_,res,__)=>{console.error(err.message);res.status(500).json({error:"Internal server error"});});

const PORT=process.env.PORT||3000;
app.listen(PORT,"0.0.0.0",()=>console.log("InPay running on port "+PORT));
