import Vue from 'vue'
import App from './App.vue'
import { onLoad, getConfig } from 'yiyun-app-sdk'

import "@/plugins/index";
import utils from "./utils";
import './assets/reset.scss'
//Android机测试用
// import Vconsole from 'vconsole';
// const vConsole = new Vconsole();
// Vue.use(vConsole)

import FastClick from 'fastclick'

FastClick.attach(document.body);
Object.assign(Vue.prototype, {
  $utils: utils,
});
Vue.config.productionTip = false
//获取亦云配置信息
onLoad(() => {
  let config = getConfig()
  // sessionStorage.setItem('yiyun_route', JSON.stringify(config.route))
  window.sessionStorage.setItem("OrganizationId", config.organizationId);
  window.sessionStorage.setItem("MemberId", config.memberId);
  //亦云上需要onload结束后才能加载页面，否则业务逻辑取不到config信息
  // new Vue({
  //   render: h => h(App),
  // }).$mount('#app')
})
// window.sessionStorage.setItem("MemberId", "4tzSWdTKPrX");
new Vue({
  render: h => h(App),
}).$mount('#app')




