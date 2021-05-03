// 1.引入mongoose
const mongoose = require('mongoose')
const md5 = require('blueimp-md5')

// 2.定义Schema(描述文档结构)
const userSchema = new mongoose.Schema({
  username: {type: String, required: true}, // 用户名
  password: {type: String, required: true}, // 密码
  permission: {type: String, required: true}, // 用户权限 1用户 2职工 3管理员
  status: {type: String, default: "free"},    //状态，是否在处理任务
  solveId: {type: String, default: ''}      //正在处理的任务的id
})
// 3. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('users', userSchema)

// 初始化默认超级管理员用户: admin/admin
UserModel.findOne({username: 'admin'}).then(user => {
  if(!user) {
    UserModel.create({username: 'admin', password: md5('admin'), permission: '3', status: "free"})
            .then(user => {
              console.log('初始化管理员, 用户名: admin 密码为: admin')
            })
  }
})

// 4. 向外暴露Model
module.exports = UserModel