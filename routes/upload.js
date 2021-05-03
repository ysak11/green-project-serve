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


//多图片上传
router.post('/upload/imgs', upload.array('imgs'), (req, res) => {
  //获取上传的文件
  const files = req.files;
  

  if(files) {
    //存储图片地址的数组
    let urlArr = [];
    //在回调函数中记录图片数的变量
    let count = 0;
    //循环处理每一张图片
    for(let i = 0, len = files.length; i < len; i++) {
      //获取后缀名
      const extname = path.extname(files[i].originalname);
      //获取上传成功之后的文件路径
      const filepath = files[i].path;
      //上传之后文件的名称(包括它前面的路径)
      const filename = filepath + extname;
      //重命名，借用fs的rename重命名的方法，第一参数是源文件地址路径，第二个参数是将源文件改名后的地址(和参数一地址相同，只不过名字变了而已，两个参数都是地址)
      fs.rename(filepath, filename, err => {
        //还得重新加上后缀名
        files[i].filename = files[i].filename + extname;
        // console.log(req.file);
        //成功以后要做的事情
        if(!err){
          //前端直接请求的路径（加上服务器的地址）
          const url = '/public/imgs/' + files[i].filename;
          urlArr.push(url);
          count++;
          
          //全部图片已经处理完成
          if(count === len) {
            // console.log(urlArr);
            res.send({status: 0, urlArr});
          }
        }
      })
      // urlArr.push(files[i].url);
      // console.log(urlArr);
    }

    // files.forEach(item => urlArr.push(item.url));
    // console.log(urlArr);
    
    
  } else {
    res.send({status: 1, msg: '没有找到文件'})
  }
  
})

//导出路由
module.exports = router;