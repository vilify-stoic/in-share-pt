require('dotenv').config();

const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true}).then(()=>{console.log("connected")}).catch((error)=>{console.log(err)});

    const connection = mongoose.connection;

    connection.on("error",(error)=>console.log(error));
    connection.once("open",()=> console.log("connected"));

    // connection.once('open', () => {
    //     console.log('Database Connected.');
    // }).catch(err => {
    //     console.log('Connection Failed.');
    // })
}

module.exports=connectDB;