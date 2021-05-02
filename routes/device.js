const express = require('express');

//得到路由器对象
const router = express.Router();

//数据库模型
const DeviceModel = require('../models/DeviceModel');


//添加新设备
router.post('/device/add', (req, res) => {
  const {name} = req.body;
  DeviceModel.findOne({name})
    .then(name => {
      //该区域名已经存在
      if(name) {
        res.send({status: 1, msg: '该设备名称已存在'});
        return new Promise(() => {});
      } else {
        //将发送到body的数据都保存进去
        return DeviceModel.create({...req.body});
      }
    })
    .then(device => {
      //返回包含area的json数据
      res.send({status: 0, data: device});
    })
    .catch(error => {
      console.error('添加设备异常', error);
      res.send({status: 1, msg: '添加设备异常, 请重新尝试'});
    })
})


//更新设备数据
router.post('/device/update', (req, res) => {
  //传送过来的直接是整个区域模型的数据
  const device = req.body;
  DeviceModel.updateOne({_id: device._id}, device)
  .then(data => {
    res.send({status: 0, data});
  })
  .catch(error => {
    console.error('更新设备异常', error);
    res.send({status: 1, msg: '更新设备异常, 请重新尝试'});
  })
})

//删除设备
router.post('/device/delete', (req, res) => {
  const {id} = req.body;
  DeviceModel.deleteOne({_id: id})
  .then(result => {
    if(result.deletedCount != 0) {
      res.send({status: 0, msg: "设备已删除"});
    } else {
      res.send({status: 1, msg: '删除设备失败'});
    }
  })
})

//获取设备列表
router.get('/device/list', (req, res) => {
  DeviceModel.find()
  .then(devices => {
    res.send({status: 0, data: devices});
  })
  .catch(error => {
    console.error('获取设备列表异常', error);
    res.send({status: 1, msg: '获取设备列表异常, 请重新尝试'});
  })
})

//模糊查询设备列表
router.post('/device/fuzzySearch', (req, res) => {
  const {keyword} = req.body;
  //创建正则表达式进行匹配，i是不区分大小写
  const reg = new RegExp(keyword, 'i'); 
  DeviceModel.find({
    name: { $regex: reg}
  })
  .then(data => {
    res.send({status: 0, data});
  })
  .catch(error => {
    console.error('查找失败', error);
    res.send({status: 1, msg: '获取设备列表失败'});
  })
})

//导出路由
module.exports = router;