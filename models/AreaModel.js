const mongoose = require('mongoose');

//定义Schema(描述文档结构)
const AreaSchema = new mongoose.Schema({
  //绘图路径
  path: {type: Array, require: true},
  //区域别名
  name: {type: String, require: true},
  //绿化种类
  type: {type: String, require: true},
  //具体植株
  plant: {type: String, require: true},
  //水量报警值
  warnValue: {type: String, require: true},
  //水量储存上限
  waterTop: {type: String, require: true},
  //现在水量
  waterQuantity: {type: String, require: true},
  //每小时耗水量（以温度20℃为参考)
  hourConsume: {type: String, require: true},
  //用户评论
  comment: {type: Array, default: []},
  //待处理问题
  //question: {type: Array, default: []},
  // 图片的路径
  imgPath: {type: String, default: ''},
})

//定义Model(与集合对应, 可以操作集合)
const AreaModel = mongoose.model('areas', AreaSchema);

//向外暴露Model
module.exports = AreaModel;