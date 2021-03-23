const express = require('express');

//得到路由器对象
const router = express.Router();

//数据库模型
const AreaModel = require('../models/AreaModel');

//增加绿化区域的路由
router.post('/area/add', (req, res) => {
  // const {path, name, type, plant, warnValue, waterTop, waterQuantity, hourConsume} = req.body;
  const {name} = req.body;
  AreaModel.findOne({name})
    .then(name => {
      //该区域名已经存在
      if(name) {
        res.send({status: 1, msg: '该区域名称已存在'});
        return new Promise(() => {});
      } else {
        //将发送到body的数据都保存进去
        return AreaModel.create({...req.body});
      }
    })
    .then(area => {
      //返回包含area的json数据
      res.send({status: 0, data: area});
    })
    .catch(error => {
      console.error('添加区域异常', error);
      res.send({status: 1, msg: '添加区域异常, 请重新尝试'});
    })
});

//获取绿化区域列表
router.get('/area/list', (req, res) => {
  AreaModel.find()
  .then(list => {
    res.send({status: 0, data: list});
  })
  .catch(error => {
    console.error('获取区域列表异常', error);
    res.send({status: 1, msg: '获取区域列表异常, 请重新尝试'});
  })
})

//区域模糊搜索
router.post('/area/fuzzySearch', (req, res) => {
  const {nameWord, typeWord} = req.body;
  //生成名字和种类的正则表达式,i是不区分大小写
  const nameReg = new RegExp(nameWord, 'i');
  const typeReg = new RegExp(typeWord, 'i');
  AreaModel.find({
    $and: [
      { name: { $regex: nameReg}},
      { type: { $regex: typeReg}}
    ]
  })
  .then(data => {
    res.send({status: 0, data});
  })
  .catch(error => {
    console.error('获取区域列表异常', error);
    res.send({status: 1, msg: '获取区域列表异常, 请重新尝试'});
  })
})

//更新水量
router.post('/area/updateWater', (req, res) => {
  const {val, id} = req.body;
  AreaModel.updateOne({_id: id}, {
    waterQuantity: val
  })
  .then(data => {
    res.send({status: 0, data});
  })
  .catch(error => {
    console.error('更新水量异常', error);
    res.send({status: 1, msg: '更新水量异常, 请重新尝试'});
  })
})

//更新区域数据
router.post('/area/update', (req, res) => {
  //传送过来的直接是整个区域模型的数据
  const area = req.body;
  AreaModel.updateOne({_id: area._id}, area)
  .then(data => {
    res.send({status: 0, data});
  })
  .catch(error => {
    console.error('更新区域异常', error);
    res.send({status: 1, msg: '更新区域异常, 请重新尝试'});
  })
})

//删除区域
router.post('/area/delete', (req, res) => {
  const {id} = req.body;
  AreaModel.deleteOne({_id: id})
  .then(result => {
    if(result.deletedCount != 0) {
      res.send({status: 0, msg: "区域已删除"});
    } else {
      res.send({status: 1, msg: '删除区域失败'});
    }
  })
})

//批量更新区域
// router.post('/area/updateList', (req, res) => {
//   const areaList = req.body;
//   AreaModel.update({_id: "$[].id"}, "$[]")
//   .then(data => {
//     // console.log(data);
//     res.send({status: 0, data});
//   })
//   .catch(error => {
//     console.error('更新区域异常', error);
//     res.send({status: 1, msg: '更新区域异常, 请重新尝试'});
//   })
//   // areaList.forEach(area => {
//   //   AreaModel.updateOne({_id: area._id}, area);
//   //   // console.log(area);
    
//   // })
// })

//导出路由
module.exports = router;