const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const mainRouter = require('./routes/index');
const AreaRouter = require('./routes/area');
const RatioRouter = require('./routes/ratio');
const FileRouter = require('./routes/upload');
const MessageRouter = require('./routes/message')

const app = express();

//使用cors插件解决跨域
// const cors = require('cors');
// app.use(cors({
//   origin: 'http://localhost:8080',
//   credentials: true,
// }))
//解决跨域问题
app.all('*', function(req, res, next) {
  //设为指定的域
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header('Access-Control-Allow-Credentials', true);
  res.header("X-Powered-By", ' 3.2.1');
  next();
});

// 声明使用静态中间件
app.use(express.static('public'))
//解析body请求体的插件
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//使用cookie插件
app.use(cookieParser());
//加载路由器中间件
// app.use(mainRouter);
app.use('/', mainRouter);  
app.use('/', AreaRouter);
app.use('/', RatioRouter);
app.use('/', FileRouter);
app.use('/', MessageRouter);

// 设置静态文件目录
app.use('/public', express.static('public'));


//连接数据库，
//useNewUrlParser使用新的解析器，避免“不建议使用当前URL字符串解析器”警告
//当前服务器发现和监视引擎已弃用，将在将来的版本中删除。要使用新的服务器发现和监视引擎，请将选项{useUnifiedTopology:true}传递给mongoclient构造函数。
mongoose.connect('mongodb://localhost:27017/green-project', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('数据库连接成功');
    //开启服务器监听端口
    app.listen('5000', () => {
      console.log('服务器启动成功，端口号为5000');
    })
  })
  .catch(error => {
    console.error('数据库连接失败 ', error);
  })
// module.exports = app;