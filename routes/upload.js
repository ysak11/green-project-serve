const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
//用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件。
const multer = require('multer');
//配置multer
const upload = multer({ dest: __dirname + '/../public/imgs'});

//上传图片，single是上传的类型，img是表单数据的name为img的才能匹配
router.post('/upload/img', upload.single('img'), (req, res) => {
  //获取上传的文件
  const file = req.file;
  if(req.file) {
    //获取后缀名
    const extname = path.extname(file.originalname);
    //获取上传成功之后的文件路径
    const filepath = file.path;
    //上传之后文件的名称(包括它前面的路径)
    const filename = filepath + extname;
    //重命名，借用fs的rename重命名的方法，第一参数是源文件地址路径，第二个参数是将源文件改名后的地址(和参数一地址相同，只不过名字变了而已，两个参数都是地址)
    fs.rename(filepath, filename, err =>{
      //还得重新加上后缀名
      req.file.filename = req.file.filename + extname;
      // console.log(req.file);
      //成功以后要做的事情
      if(!err){
        //前端直接请求的路径（加上服务器的地址）
        const url = '/public/imgs/' + req.file.filename;
        res.send({status: 0, url});
      }
    })
    
  }
})

//导出路由
module.exports = router;