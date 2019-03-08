// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//Import Vue 
import Vue from 'vue'
// Import Main App component for basement
import App from './App'
// Import Router if need in future
import router from './router'
// Import Element UI for UI Kit css
import 'element-ui/lib/theme-chalk/index.css';
// Import Specific Component for UI kit
import {
	Tabs,
  TabPane,
  Icon,
	Row,
	Col,
	Card,
	Loading
} from 'element-ui'

// UI kit are using as plugin so we need to use them
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Loading.directive);

// Loading component as directive in here
Vue.prototype.$loading = Loading.service;

Vue.config.productionTip = false

/* eslint-disable no-new */
window.app = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
