// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import './assets/element-#0D0D0D/index.css'
import './main.less'
import http from './components_module/http.js'

Vue.use(Element)
Vue.use(http);
Vue.http.onRequest(function(request){})
Vue.http.onResponse(function(response,request){})
Vue.http.setUriMap()
Vue.config.productionTip = false
Vue.filter('timeStr', function (value) {
  var date = new Date(value);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = date.getDate()<10?('0'+date.getDate() + ' '):(date.getDate() + ' ');
  var h = date.getHours()<10?('0'+date.getHours() + ':'):(date.getHours() + ':');
  var m = date.getMinutes()<10?('0'+date.getMinutes() + ':'):(date.getMinutes()+':');
  var s = date.getSeconds()<10?('0'+date.getSeconds()):date.getSeconds();
  return Y+M+D+h+m+s;

})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')