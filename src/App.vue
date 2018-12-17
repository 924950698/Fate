<script>
/**
 * 页面主入口
 */
import attachApi from './magic/attachWindowApi.js'
import MagicCircle from './magic-circle.js'
import Vue from 'vue'
Event=new Vue()
let IP = 'http://127.0.0.1:8081'
export default {
    name: 'app',
    data () {
        return {
          master: 1, // 当前第几组（仅用于记录用）
          servant: 1, // 当前该组第几批（仅用于记录用）
          cacheNameList: [],//累加中奖名单
          beginPolling: null, //名单滚动回调
          heroNumber: 1, // 抽奖请求参数
          isLogoTop: false,
          ratial : '0em', //名单上间距比例
          heroRoll: [], // 页面上即时显示的英雄名单 {Array}
          arrList: [],
          widthSize: 0,
          singleRow: true,

          newHerosList: [], // 经过多次之后的抽奖之后，剔除每次calledHeros后的数据列表

          token: '2017',

          status: 'init' // init, started, stoped, showAlled
        }
    },
    watch:{
      heroRoll(val){
        if (val.length > 0) {
          let length = val.length;
          let width = length < 5 ? (100/length).toFixed(2) : 20;
          if (length == 6) {
              width = (100/3).toFixed(2);
          }
          if (length > 10) {
            width = 16
          }
          this.widthSize = width;
          this.singleRow = length > 5? false: true;
          if(length>5 && length<13) {
            this.doubleRow = true;
          } else {
            this.doubleRow = false;
          }
          let contentwidth = $('.content').width();
          let contentheigth = $('.content').height();
          let tempRatial = 0;
          if (this.singleRow == true) {
              // tempRatial = (20*contentheigth/contentwidth).toFixed(2);
              tempRatial = '6em'
          }
          else if (length > 10) {
              tempRatial = '0.8em';
          }
          else {
              tempRatial = '0.3em';
          }
          this.ratial = tempRatial;
        }
      }
    },
    mounted() {
        this.$nextTick(() => {
            $.ajax({
                url: `${IP}/getAllHeros`
            }).done((res) => {
              console.log(res, '--res123--')
                this.newHerosList = res.data
                console.info(`%c已存中奖数：${this.cacheNameList.length}-初始库存：%s`,"color: red;background: yellow;font-size: 20px",
                    `${this.newHerosList.length}`)
            }).fail((err) => {
                console.error('--getAllHeros--', err)
            })

            window.start = this.startSummon
            window.openDraw = this.showContent
            window.end = this.end
            window.winners = this.showResult
        })
    },
    methods: {
        /**
         * 触发魔法阵：召唤英雄
         * （点击按钮）
         */
        startSummon(num) {
            if(this.status === 'started' ) {
                console.error(`${this.status}-已存中奖数：${this.cacheNameList.length}`, '当前的执行应该为end 或者 winners')
                return ;
            }
            if (num > 24) {
                alert('最多抽24位人数')
                console.error(`${this.status}-已存中奖数：${this.cacheNameList.length}`, 'start人数不可超过24')
                return;
            }
            if(this.cacheNameList.length > 24) {
                console.warn(`${this.status}-已存中奖数：${this.cacheNameList.length}-当前批次：${this.master}-${this.servant}%c%s`,"color: red;background: yellow;font-size: 20px",
                    '库存人数超过24了！')
            }
            if(!this.isLogoTop) {
                this.showContent()
            }
            this.heroNumber = num;
            // BGM start：紧张兮兮的音乐
            this.$refs.drawAudio.currentTime = 0;
            this.$refs.drawAudio.pause();
            this.$refs.rollAudio.play();
            // 执行变化动画
            this.beginPolling = setInterval( () => {
              let result = MagicCircle.call(this.newHerosList, num)
              this.heroRoll = result.calledHeros
            }, 100)

            $.ajax({
                url: `${IP}/gettoken`
            }).done((rs) => {
                if(+rs.errno === 0) {
                    this.token = rs.data

                    this.status = 'started'

                    console.info(`${this.status}-已存中奖数：${this.cacheNameList.length}-当前批次：${this.master}-${this.servant}%c%s`,"color: red;background: yellow;font-size: 20px",
                        '下一次操作是：end')
                } else {
                    console.warn('startSummon errno!=0: ', rs.status)
                }
            }).fail((err) => {
                console.warn('startSummon: ', err)
            })
        },
        nowSummon(num) {
            // 喊 “停”
            // BGM start: 答案揭晓的音乐
            this.$refs.drawAudio.play()
            setTimeout(() => {
                $.ajax({
                    url: `${IP}/rollMyHeros`, // 获取最新中奖名单
                    dataType: 'json',
                    data: {
                        token: this.token, // 上一次产生的token，必须
                        master: this.master,
                        servant: this.servant,
                        num: num
                    }
                }).done((rs) => {
                    if(+rs.errno === 0) {
                        clearInterval(this.beginPolling)
                        this.beginPolling = null

                        this.heroRoll = rs.data.calledHeros || []
                        this.newHerosList = rs.data.newHerosList || []
                        this.cacheNameList.push(...this.heroRoll)

                        this.servant++
                        console.info(`${this.status}-已存中奖数：${this.cacheNameList.length}-下次批次：${this.master}-${this.servant}- 剩余人数:${this.newHerosList.length}%c%s`,"color: red;background: yellow;font-size: 20px"
                        , '下一次操作是：winners 或者 start')

                        if(this.cacheNameList.length > 24) {
                            console.warn(`${this.status}-已存中奖数：${this.cacheNameList.length}-下次批次：${this.master}-${this.servant}%c%s`,"color: red;background: yellow;font-size: 20px",
                                '库存人数超过24了！')
                        }

                    } else {
                        console.warn('rollMyHeros', rs.status)
                    }

                }).fail((err) => {
                    console.warn('rollMyHeros', err)
                })
            }, 0)
        },
        showContent() {
            if(!this.isLogoTop) {
                this.isLogoTop = true
            }
            $(this.$refs.titlePic).animate({top: "4.5em"},1000)
        },
        end(){
            if(this.status !== 'started') {
                console.error(`${this.status}-已存中奖数：${this.cacheNameList.length}`, '必须先开始！')
                return;
            }

          this.$refs.rollAudio.pause();
          this.nowSummon( this.heroNumber)
          this.status = 'stoped'
        },
        showResult(){
            if(this.status !== 'stoped') {
                console.error(`${this.status}-已存中奖数：${this.cacheNameList.length}`, '必须先结束！')
                return;
            }

            this.master++
            this.servant = 1
            this.heroRoll = this.cacheNameList;
            this.cacheNameList = [];
            this.status = 'showAlled'
           
            this.arrList.push(this.heroRoll)
            console.log(this.arrList, '--this.arrList--')
            console.info(`${this.status}-已存中奖数：${this.cacheNameList.length}-下次批次：${this.master}-start%c%s`,"color: red;background: yellow;font-size: 20px",
             '下一次操作是：start')
        },
        
        handleToDown() { //制作excel表格，需手动设置边框线以及微调样式
          let jsonData = this.cacheNameList //先获取当前的中奖数据
          console.log(jsonData, '开始下载文件')
          let [str, title] = [jsonData.length + '人中奖名单', jsonData.length + '人中奖名单'];
          // title = jsonData.length + '人中奖名单';
          console.log(str)
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
          link.download = title;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
    }
}
</script>

<template>
  <div id="app">
    <div class="header">
      
    </div>
    <div class="content">
      <div :style="{marginTop: ratial}">
        <ul class="employee-list">
          <li v-for="hero in heroRoll" :style="{width: widthSize+'%'}" :class="{singlerow: singleRow, doublerow: doubleRow}">
            <div class="name-normal">
              <p class="hero-info">{{hero.cardid}}</p>
              {{hero.name}}<br/>
              <!-- <br/> -->

              <p class="hero-info">{{hero.dep}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div ref="titlePic" class="title-pic-wrapper">
      <div class="title-pic" @click="showContent"></div>
    </div>
    <div class="handleToDown">
      <span @click="handleToDown" >导出名单</span>
    </div>
    <audio loop="loop" ref="rollAudio">
      <source src="./src/assets/audio/drum.mp3" type="audio/mpeg" />
    </audio>
    <audio ref="drawAudio">
      <source src="./src/assets/audio/goal.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<style>
@import "./css/index.css";
</style>
