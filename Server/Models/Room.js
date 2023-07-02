const mongoose=require('mongoose');

const roomSchema=new mongoose.Schema({
    roomCode:{
        type:String,
        required:true,
        unique:true,
    },
    expitationTime:{
        type:Date,
        required:true,
    },
    users:[
        {   
            name:{
                type:String,
                required:true,
            },
            location:{
                latitude:{
                    type:Number,
                    required:true,
                },
                longitude:{
                    type:Number,
                    required:true,
                },
            }
        },
    ],
})

const Room=mongoose.model('Room',roomSchema);
module.exports=Room;