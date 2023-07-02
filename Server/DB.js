const mongoose =require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.Mongo_key, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Continue with your server setup or other operations
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const db=mongoose.connection;
db.on('error',console.error.bind(console,'DB connection failed'))
db.once('open',()=>{
    console.log('DB connection successful')
})

module.exports=db;
