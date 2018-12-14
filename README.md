# fate
----

2017年CTO体系研发年会抽奖程序

> your lottery, my prize

## 分支简介

log-2017：2017CTO体系年会记录版本

master: 可供二次使用的版本

## 开始之前

安装Node环境：

node version: v6.3.0及以上 <https://nodejs.org/en/>

``` bash
# 安装依赖
npm install --production
```

## 开始运行:

`node app.js`或者`pm2 start app.js`(推荐)

*需要安装`npm install -g pm2`*

浏览器打开: http:127.0.0.1:8081

## 操作约定

*由于年会定制需求，抽奖分为组-批次，比如三等奖24人，要分三批抽，连续执行三次`start(8)→end()`后执行`winners()`将24人汇总到屏幕上*

**如果需要使用此需求，并且有一组只有一批，请记得在end()后执行winners()后再去执行下一组start(num)；如果没有此需求，只需要连续start(num)→end()即可**

1. 每次开启整个抽奖之前，需要执行resetAll并刷新页面, 保证整个抽奖只能在开始执行一次（除非要重置整个抽奖流程）
2. 一组完整的抽奖操作：start(number)→end()→ {start(num)→end()→ ...}→winners()
3. 查看中奖名单：server/log下文件
4. 为保证显示效果，建议同屏最多24人，超出部分可能会产生滚动条
5. 抽奖过程中，可以重启node进程和刷新页面，但需要保证data文件夹内容不被手动更改或删除

## 控制台API

1. start(number)：开始抽奖number人
2. end(): 停止抽奖
3. winners(): 汇总上次执行winners到目前为止的几次end的获奖名单，显示在屏幕上
4. resetAll(): 重置511人数据，只在晚会开启前执行（之后不可执行）

## 需要二次使用

1. 删除data文件夹下内容
2. 删除server/log下文本内容
3. 替换初始库server/json/herolist.js 格式为：`module.exports = [{name: '名字', cardid: '工号', dep: '部门'}, ...]`

------

- 需要替换头图：src/assets/img/title.png
- 需要修改前端逻辑和展示(对应src文件夹(除assets文件夹外))，还需要npm install

## 文件目录：
1. server：node express 服务端：持久化数据，提供前端接口获取当前人数
2. src：前端展示
3. server/log: 以文件形式记录的log
4. pm2-logs: 后端的log记录
5. server/json: 总名单
6. src/magic-circle.js 抽奖算法（后端调用为真实结果，前端调用为显示结果）
7. src/test: 抽奖算法的概率测试


```
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
## 其他

1. start(number)执行后会请求一个一次性的token验证码，用于end()使用，所以start和end必须配套使用
2. 虽然前后端共用抽奖算法，但是实际抽奖操作通过前端接口请求后端逻辑实现（即每次end()操作）
3. 如果8081端口被占用，请手动全局搜索代码中8081进行替换

## 联系我

email: （卢培鹏）lupeipeng@iwamai.baidu.com

Hi: 面汤非鱼
