const express = require('express');
const md5 = require('blueimp-md5');

// 指定过滤的属性
const filter = {password: 0, __v: 0};
//得到路由器对象
const router = express.Router();

//数据库模型
const UserModel = require('../models/UserModel');

//自动登录的路由（利用用户的id）
router.get('/user', (req, res) => {
  // console.log(req.cookies);
  
  const userid = req.cookies.userid;
  if(!userid) {
    return res.send({status: 1, msg: '请先登录'});
  } else {
    //根据id查询对应的用户
    UserModel.findOne({_id: userid}, filter, (err, user) => {
      if(user) {
        res.send({status: 0, data: user});
      } else {
        //这个id没有对应用户，需要清除掉原有id
        res.clearCookie('userid');
        res.send({status: 1, msg: '请先登录'});
      }
    })
  }
})

//用用户id查询用户信息的路由
router.post('/user/id', (req, res) => {
  const {userId} = req.body;
  UserModel.findOne({_id: userId}, filter)
  .then(user => {
    //如果user存在，则有该用户
    if(user) {
      console.log('查询到用户', user.username);
      res.send({status: 0, data: user})
    } else {
      //没有找到该用户，返回错误信息，状态码为1
      res.send({status: 1, msg: '用户名或密码不正确'});
    }
  })
})

//登录的路由
router.post('/user/login', (req, res) => {
  const {username, password, isCookie} = req.body;
  
  //查找数据库中是否有该用户
  UserModel.findOne({username, password: md5(password)}, filter)
    .then(user => {
      //如果user存在，则有该用户
      if(user) {
        console.log('查询到用户', user.username);
        //根据是否自动登录决定cookie的保存期限是关闭浏览器为止还是一天后
        //谷歌浏览器由于其自动保存关闭浏览器时的样子，cookie也没有消失，IE浏览器的话重新打开cookie就没有了
        !isCookie ? res.cookie('userid', user._id) : res.cookie('userid', user._id, {maxAge: 1000*60*60*24});
        // res.cookie('userid', user._id, {
        //   maxAge: 1000*60*60*24 ,
        //   path: '/'
        // });
        res.send({status: 0, data: user})
      } else {
        //没有找到该用户，返回错误信息，状态码为1
        res.send({status: 1, msg: '用户名或密码不正确'});
      }
    })
})

//确认密码是否正确的路由
router.post('/user/password', (req, res) => {
  const {id, password} = req.body;
  
  //根据id查询用户和其密码是否正确
  UserModel.findOne({_id: id, password: md5(password)})
  .then(result => {
    if(!result) {
      res.send({status: 1, msg: '密码错误'});
    } else {
      res.send({status: 0, result});
    }
  })
})

//修改密码的路由
router.post('/user/modify', (req, res) => {
  const {id, password} = req.body;
  UserModel.updateOne({_id: id}, {
    password: md5(password)
  })
  .then(() => {
    res.send({status: 0, msg: '密码修改成功'});
  })
  .catch(error => {
    console.error('修改密码异常', error);
    res.send({status: 1, msg: '修改密码异常, 请重新尝试'});
  })
})

//注册的路由
router.post('/user/register', (req, res) => {
  const {username, password, permission} = req.body;
  //判断用户是否已经存在
  UserModel.findOne({username})
    .then(user => {
      //如果用户已存在
      if(user) {
        //返回错误的信息
        res.send({status: 1, msg: '该用户已存在'});
        return new Promise(() => {});
      } else {
        console.log({...req.body, password: md5(password)});
        //将发送到body的数据都保存进去，而密码用md5加密后的替换原有密码
        return UserModel.create({...req.body, password: md5(password)});
      }
    })
    .then(user => {
      //返回包含user的json数据
      res.send({status: 0, data: user});
    })
    .catch(error => {
      console.error('注册异常', error);
      res.send({status: 1, msg: '注册用户异常, 请重新尝试'});
    })
})

//获取用户列表
router.post('/user/list', (req, res) => {
  const {permission} = req.body;
  UserModel.find({permission})
    .then(users => {
      res.send({status: 0, data: users});
    })
    .catch(error => {
      console.error('查找失败', error);
      res.send({status: 1, msg: '获取用户列表失败'});
    })
})

//模糊查询用户列表
router.post('/user/fuzzySearch', (req, res) => {
  const {permission, keyword} = req.body;
  //创建正则表达式进行匹配，i是不区分大小写
  const reg = new RegExp(keyword, 'i'); 
  UserModel.find({
    permission,
    $or: [ 
      { username: { $regex: reg} } 
    ]
  })
  .then(data => {
    res.send({status: 0, data});
  })
  .catch(error => {
    console.error('查找失败', error);
    res.send({status: 1, msg: '获取用户列表失败'});
  })
})

//删除用户
router.post('/user/delete', (req, res) => {
  const {userId} = req.body
  UserModel.deleteOne({_id: userId})
  .then((err) => {
    if(err.deletedCount != 0) {
      res.send({status: 0, msg: '用户已删除'})
    } else {
      res.send({status: 1, msg: '删除用户失败'})
    }
  })
  // .catch(error => {
  //   console.error('删除失败', error);
  //   res.send({status: 1, msg: '删除用户失败'});
  // })
})


module.exports = router;
