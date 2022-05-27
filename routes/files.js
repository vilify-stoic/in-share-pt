const router = require('express').Router();
const multer = require('multer');
const path = require('path')
const File = require('../models/file');
const {v4:uuidv4} = require('uuid');
const { emit } = require('process');

let storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        console.log(req.file);
        const uniqueName= `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
        console.log(uniqueName);
    },
})

let upload = multer({
    storage,
    limit:{fileSize:1000000*100}
}).single('myfile');

router.post('/', async(req,res)=>{

    upload(req,res,async (err)=>{
        console.log("inside upload -------");
        if(!req.file){
            
            console.log(req.file);
            return res.json({error:'All fields are required !!!!!!'});
        }

        if(err){
            return res.status(500).send({error:err.message});
        }
        const file = new File({
            filename:req.file.filename,
            uuid:uuidv4(),
            path:req.file.path,
            size:req.file.size
        });

        const response = await file.save();
        return res.json({file:`${process.env.APP_BASE_URL}/file/${response.uuid}`});
        
    });
});

router.post('/send',async (req,res)=>{
    const  {uuid,emailTo, emailFrom} = req.body;
   
    console.log(uuid);
    console.log(emailTo);
    console.log(emailFrom);
    if(!uuid || !emailTo || ! emailFrom){
        return res.status(422).send({error: 'All Fields are required'});
    }

    //Get data from database

    const file  = await File.findOne({uuid:uuid});

    if(file.sender){
        return res.status(422).send({error: 'Email already sent'});
    }

    file.sender=emailFrom;
    file.receiver=emailTo;
    const response = await file.save();

    //send email

    const sendMail = require('../services/emailService')
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:'inShare File Sharing',
        text:`${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/file/${file.uuid}`,
            size:parseInt(file.size/1000) + 'KB',
            expires:'24 hours'
        })
    });
    return res.send({success: 'true'});
})

module.exports=router;