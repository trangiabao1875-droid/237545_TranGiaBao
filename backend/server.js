require('dotenv').config();
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const employees=require('./routes/employees');
const app=express();
const allowed=(process.env.CLIENT_URL||'http://localhost:5173').split(',').map(s=>s.trim());
app.use(cors({origin:(origin,cb)=>!origin||allowed.includes(origin)?cb(null,true):cb(new Error('CORS origin bị từ chối'))}));
app.use(express.json());
app.get('/',(req,res)=>res.json({message:'HR Management API',health:'/health'}));
app.get('/health',(req,res)=>res.status(mongoose.connection.readyState===1?200:503).json({status:mongoose.connection.readyState===1?'ok':'database disconnected'}));
app.use('/api/employees',employees);
app.use((err,req,res,next)=>{console.error(err.message);res.status(500).json({message:'Lỗi xử lý yêu cầu'});});
async function start(){if(!process.env.MONGODB_URI||!process.env.DB_NAME)throw new Error('Thiếu MONGODB_URI hoặc DB_NAME');await mongoose.connect(process.env.MONGODB_URI,{dbName:process.env.DB_NAME});console.log('MongoDB connected');const port=process.env.PORT||5000;app.listen(port,'0.0.0.0',()=>console.log('API listening on '+port));}
start().catch(err=>{console.error(err);process.exit(1)});
