const express=require('express');
const cors=require('cors');
require('dotenv').config();
const port=5000||process.env.base;
const db=require('./DB');
const roomRoutes=require('./Routes/roomRoutes');


const app=express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Angle-Eyes server");
  });
app.use('/room',roomRoutes);

app.listen(port,()=>{
    console.log(`server is on on port ${port}`)
});