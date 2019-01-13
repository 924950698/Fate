<script>
import Vue from 'vue'
import attachApi from './magic/attachWindowApi.js'
import MagicCircle from './magic-circle.js'

  export default {
    name: 'downLoad',
    methods: {
      functionA() {
        let jsonData = JSON.parse(window.localStorage.dataHero)//先获取当前的中奖数据
        console.log(jsonData, '获取localhost的数据')
        console.log(jsonData.length, '开始下载文件')
        let [str, title] = [jsonData.length + '人中奖名单\n', jsonData.length + '人中奖名单'];
        // title = jsonData.length + '人中奖名单';
        // console.log(str)
        //增加\t为了不让表格显示科学计数法或者其他格式
        for(let i = 0 ; i < jsonData.length ; i++ ){
          for(let item in jsonData[i]){
              str+=`${jsonData[i][item] + '\t'},`; 
          }
          str+='\n';
        }
        //encodeURIComponent解决中文乱码
        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
        //通过创建a标签实现
        var link = document.createElement("a");
        link.href = uri;
        //对下载的文件命名
        link.download = title ;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.localStorage.clear();
      }
    }
  }
</script>

<template>
  <div>
    <div @click="functionA">点击下载</div>
  </div>
</template>

<style>
</style>
