// 按需全局引入 vant组件
import Vue from 'vue'
import {
  Toast, Icon, Popup, DatetimePicker,
  Loading, Circle, TabbarItem, Tabbar,
  Tab,
  Tabs,
  ActionSheet,
  overlay,
  Dialog,
  Notify,
  Swipe, SwipeItem
} from 'vant'
Object.assign(Vue.prototype, {
  $dialog: Dialog,
  $notify: Notify,
});
;

Vue.use(Toast)
Vue.use(DatetimePicker)
Vue.use(Icon)
Vue.use(Dialog);
Vue.use(Loading)
Vue.use(Popup)
Vue.use(Circle);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(ActionSheet);
Vue.use(overlay);
Vue.use(Swipe);
Vue.use(SwipeItem);
