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


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')