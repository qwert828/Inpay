const express=require('express');
const path=require('path');
const compression=require('compression');
const rateLimit=require('express-rate-limit');
const crypto=require('crypto');
const app=express();
const PORT=process.env.PORT||3000;
const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD||'InP@y#Zm2026!';
const VALID_CODES=['INPAY2026','BETA001','MERCHANT01','LUSAKA01','AARON01'];

const limiter=rateLimit({windowMs:60*1000,max:100});
const authLimiter=rateLimit({windowMs:15*60*1000,max:5,message:'Too many login attempts.'});
const signupLimiter=rateLimit({windowMs:60*1000,max:10});

app.use(compression());
app.use(express.json());
app.use(limiter);

app.use((req,res,next)=>{
res.setHeader('X-Frame-Options','DENY');
res.setHeader('X-Content-Type-Options','nosniff');
res.setHeader('X-XSS-Protection','1; mode=block');
res.setHeader('Strict-Transport-Security','max-age=31536000');
next();
});

app.use(express.static(path.join(__dirname,'public')));

app.post('/api/admin/login',authLimiter,(req,res)=>{
const email=req.body.email||'';
const password=req.body.password||'';
if(email==='admin@inpay.zm' && password===ADMIN_PASSWORD){
res.json({success:true,token:'inpay-admin-'+Date.now()});
}else{
res.status(401).json({success:false,message:'Invalid credentials'});
}
});

app.post('/api/merchants/signup',signupLimiter,(req,res)=>{
const businessName=req.body.businessName||'';
const email=req.body.email||'';
const phone=req.body.phone||'';
const province=req.body.province||'';
const businessType=req.body.businessType||'';
const accessCode=(req.body.accessCode||'').toUpperCase();
if(VALID_CODES.indexOf(accessCode)===-1){
return res.status(403).json({success:false,message:'Invalid access code'});
}
if(!businessName||!email||!phone||!province||!businessType){
return res.status(400).json({success:false,message:'All fields required'});
}
const apiKey='inpay_sandbox_'+crypto.randomBytes(20).toString('hex');
res.json({success:true,apiKey:apiKey,merchantName:businessName});
});

app.get('/*splat',(req,res)=>{
res.sendFile(path.join(__dirname,'public','index.html'));
});

app.listen(PORT,()=>console.log('InPay running on port '+PORT));

