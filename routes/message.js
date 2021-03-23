const express = require('express');

//得到路由器对象
const router = express.Router();

//数据库模型
const MessageModel = require('../models/MessageModel');

//获取信息列表
router.get('/message/list', (req, res) => {
  MessageModel.find()
  .then(data => {
    res.send({status: 0, data});
  })
  .catch(err => {
    console.error('获取信息异常', err);
    res.send({status: 1, msg: err});
  })
});

//添加信息
router.post('/message/add', (req, res) => {
  MessageModel.create({...req.body})
  .then(data => {
    res.send({status: 0, data});
  })
  .catch(err =>{
    console.error('添加信息异常', err);
    res.send({status: 1, msg: '添加信息异常, 请重新尝试'});
  })
});

//更新信息
router.post('/message/update', (req, res) => {
  const obj = req.body;
  MessageModel.updateOne({_id: obj._id}, obj)
  .then(data => {
    res.send({status: 0, data});
  })
  .catch(error => {
    console.error('更新信息异常', error);
    res.send({status: 1, msg: '更新信息异常, 请重新尝试'});
  })
});

//查找信息
router.post('/message/find', (req, res) => {
  
})

//导出路由
module.exports = router;