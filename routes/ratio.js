const express = require('express');

//得到路由器对象
const router = express.Router();

//数据库模型
const RatioModel = require('../models/RatioModel');

//获取比率的路由
router.post('/ratio/get', (req, res) => {
  const {name} = req.body;
  RatioModel.findOne({name})
  .then(data => {
    res.send({status: 0, data})
  })
  .catch(error => {
    console.error('获取比率异常', error);
    res.send({status: 1, msg: error});
  })
});

//获取比率列表
router.get('/ratio/list', (req, res) => {
  RatioModel.find()
  .then(data => {
    res.send({status: 0, data});
  })
  .catch(error => {
    console.error('获取比率列表异常', error);
    res.send({status: 1, msg: '获取比率列表异常, 请重新尝试'});
  })
})

//添加比率的路由
router.post('/ratio/add', (req, res) => {
  const {name} = req.body;

  
  RatioModel.findOne({name})
  .then(name => {
    //该区域名已经存在
    if(name) {
      res.send({status: 1, msg: '名称已存在'});
      return new Promise(() => {});
    } else {
      //将发送到body的数据都保存进去
      return RatioModel.create({...req.body});
    }
  })
  .then(data => {
    res.send({status: 0, data})
  })
  .catch(error => {
    console.error('添加比率异常', error);
    res.send({status: 1, msg: '添加比率异常, 请重新尝试'});
  })
})

//修改比率的路由
router.post('/ratio/update', (req, res) => {
  const {id, ratio} = req.body;
  RatioModel.updateOne({_id: id}, {
    ratio
  })
  .then(data => {
    res.send({status: 0, data});
  })
  .catch(error => {
    console.error('更新比率异常', error);
    res.send({status: 1, msg: '更新比率异常, 请重新尝试'});
  })
})


//导出路由
module.exports = router;