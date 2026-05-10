const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());

app.use(express.static(__dirname));

app.use('/uploads', express.static('uploads'));



/* 업로드 */

const storage = multer.diskStorage({

    destination:(req,file,cb)=>{

        cb(null,'uploads/');
    },

    filename:(req,file,cb)=>{

        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });



/* site.json 불러오기 */

app.get('/content/site.json',(req,res)=>{

    fs.readFile('./content/site.json','utf8',(err,data)=>{

        if(err){

            return res.status(500).json({
                error:'read fail'
            });
        }

        res.json(JSON.parse(data));
    });
});



/* 저장 */

app.post('/api/update',(req,res)=>{

    fs.writeFile(

        './content/site.json',

        JSON.stringify(req.body,null,2),

        err=>{

            if(err){

                return res.json({
                    success:false
                });
            }

            res.json({
                success:true
            });
        }
    );
});



/* 업로드 */

app.post('/api/upload', upload.single('image'), (req,res)=>{

    res.json({

        success:true,

        path:'/uploads/' + req.file.filename
    });
});



/* 이미지 목록 */

app.get('/api/images',(req,res)=>{

    fs.readdir('./uploads',(err,files)=>{

        if(err){

            return res.json([]);
        }

        res.json(

            files.map(file=>({
                url:'/uploads/' + file
            }))
        );
    });
});



app.listen(3000,()=>{

    console.log('RUNNING');
});
