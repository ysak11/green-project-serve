const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  //设备名
  name: {type: String, require: true},
  //设备类型
  type: {type: String, require: true},
  //设备单独的灌溉参数（一次性灌溉量）
  setting: {type: String, require: true},
  //绑定区域
  toArea: {type: String, default: ''},
})

//定义Model(与集合对应, 可以操作集合)
const DeviceModel = mongoose.model('devices', DeviceSchema);

//向外暴露Model
module.exports = DeviceModel;