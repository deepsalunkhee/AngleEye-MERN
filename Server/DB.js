const mongoose =require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.Mongo_key,{
    useNewUrlParser:true,
    //q:what does above line do?
    //a:it is used to parse the url string in the connect method
    useUnifiedTopology:true,
})

const db=mongoose.connection;
db.on('error',console.error.bind(console,'DB connection failed'))
db.once('open',()=>{
    console.log('DB connection successful')
})

module.exports=db;
