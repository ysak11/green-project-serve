const mongoose = require('mongoose');

//定义Schema(描述文档结构)
const MessageSchema = new mongoose.Schema({
  //具体信息
  message: {type: String, require: true},
  //状态(4种：待解决、正在解决、已解决、无效(待解决问题已经解决了，留下来记录曾经出现的问题))
  status: {type: String, require: true},
  //日期
  date: {type: String, require: true},
  //区域名
  areaName: {type: String, require: true},
  //职工名
  workerName: {type: String},
  //图片
  imgs: {type: Array}
})

//定义Model(与集合对应, 可以操作集合)
const MessageModel = mongoose.model('messages', MessageSchema);

//向外暴露Model
module.exports = MessageModel;