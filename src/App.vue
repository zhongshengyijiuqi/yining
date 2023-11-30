<template>
  <div id="app">
    <header>报工信息</header>
    <div class="main" v-if="show">
      <Reporting-information></Reporting-information>
    </div>
    <van-overlay :show="loadShow" class-name="verlay" z-index="999999">
      <div class="wrapper">
        <van-loading size="2rem" color="#1989fa" />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import ReportingInformation from './components/ReportingInformation'
import { closeApp } from "yiyun-app-sdk";
import $axios from './utils/axios'
import qs from 'qs'
export default {
  name: 'App',
  components: {
    ReportingInformation,
  },
  data() {
    return {
      activeType: 0,
      nums: 0,
      loadShow: true,
      show:false,
      Time: null
    }
  },
  async created() {
    this.Time = setInterval(this.uncomfortable, 1000);
  },
  methods: {
    async uncomfortable() {
      if (window.sessionStorage.MemberId) {
        clearInterval(this.Time);
        await this.configIP()
        this.loadShow = false
          this.show = true
      } else if (this.nums >= 10) {
        clearInterval(this.Time);
        this.loadShow = false
        this.$dialog
          .alert({ title: "标题", message: "登录状态失效，请重新登录" })
          .then((action) => {
            closeApp();
          });
      } else {
        this.nums = this.nums + 1;
      }
    },
    async configIP() {//配置地址
      try {
        // console.log($axios.defaults)
        await $axios.defaults({
          method: 'post',
          url: '/token',
          // withCredentials: false,
          data: qs.stringify({
            'grant_type': 'password',
            'username': 'guest',
            'password': 'kWS/rVmF3u4='
          }),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(async res => {
          // console.log('res',res)
          localStorage.setItem('Authorization', res.access_token)
          let add = await $axios.post('/api/Account/GetAccountInfo')
          // console.log('add',add)
          localStorage.setItem('yiyun_registerId', add[0].CODE)

        }).catch((error) => {
          
          if (error.message && error.message == 'Network Error') {
            this.$notify({ type: 'danger', message: '请求已超时' })
          } else if (error.response && error.response.data == '网络已断开' && error.response.status == 502) {
            this.$notify({ type: 'danger', message: '服务已断开，请联系管理员' })
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style>
html,
body {
  height: 100%;
}

#app {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
  -webkit-overflow-scroll: touch;
  -webkit-overflow-scrolling: touch;
}

header {
  width: 100%;
  text-align: center;
  background: rgba(34, 51, 97, 1);
  color: #fff;
  padding: 15px 0;
  font-size: 18px;
  height: 44px;
  line-height: 44px;
}

.main {
  width: 100%;
  height: calc(100% - 44px);
  background-color: #F8F9FD;
}

.verlay {
  background-color: #ffffff !important;
  opacity: 0.6;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
