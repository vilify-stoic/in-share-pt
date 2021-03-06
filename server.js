const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');


const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5000', 'https://in-share-ft.herokuapp.com',"http://127.0.0.1:3001"]
    // process.env.ALLOWED_CLIENTS.split(',')
  }

const PORT = process.env.PORT || 3000;
app.use(cors(corsOptions))
app.use(express.static('public'));
app.use(express.json());

//body-Parser
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//Database
const connectDB = require('./config/db.js');
connectDB();

//Template Engine
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');

//Router
app.use('/api/files',require('./routes/files'))
app.use('/file',require('./routes/show'))
app.use('/files/download',require('./routes/download'));


app.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`);
})


app.use((req,res)=>{
    res.status(404).render('error',{title:'404'});
});