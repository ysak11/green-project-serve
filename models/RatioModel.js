const mongoose = require('mongoose');

const RatioSchema = new mongoose.Schema({
  //名称
  name: {type: String, require: true},
  //比率
  ratio: {type: Array, require: true}
})

//定义Model(与集合对应, 可以操作集合)
const RatioModel = mongoose.model('ratios', RatioSchema);

//向外暴露Model
module.exports = RatioModel;