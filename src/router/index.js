import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import contenMain from '@/pages/contenMain'
import login from '@/pages/login/login'
import forbidden from "@/pages/forbidden"
import campaign from "@/pages/campaign/campaign"
import campaignEdit from "@/pages/campaign/edit"
import collection from "@/pages/collection/collection"
import collectionlist from "@/pages/collection/list"
import eshop from "@/pages/eshop/eshop"
import about from "@/pages/about/about"
import project from "@/pages/project/project"
import projectEdit from "@/pages/project/edit"
import shop from "@/pages/shop/shop"
import press from "@/pages/press/press"
import pressEdit from "@/pages/press/edit"
import home from "@/pages/home/home"
import menu from "@/pages/home/menu"
import bottom from "@/pages/home/bottom"
import ip from "@/pages/ip/ip"



Vue.use(Router)
var routes = new Router({
  routes: [
    {
      path: '/contenMain',
      name: 'contenMain',
      component: contenMain,
      children: [
        { path: '/home', component: home, name: 'home',text:"home"},
        { path: '/campaign', component: campaign, name: 'campaign',text:"campaign列表"},
        { path: '/campaignEdit', component: campaignEdit, name: 'campaignEdit',text:"campaign编辑"},
        { path: '/collectionlist', component: collectionlist, name: 'collectionlist' },
        { path: '/collection', component: collection, name: 'collection' },
        { path: '/eshop', component: eshop, name: 'eshop' },
        { path: '/project', component: project, name: 'project' },
        { path: '/projectEdit', component: projectEdit, name: 'projectEdit' },
        { path: '/about', component: about, name: 'about' },
        { path: '/shop', component: shop, name: 'shop' },
        { path: '/press', component: press, name: 'press' },
        { path: '/pressEdit', component: pressEdit, name: 'pressEdit' },
        { path: '/menu', component: menu, name: 'menu' },
        { path: '/bottom', component: bottom, name: 'bottom' },
        { path: '/ip', component: ip, name: 'ip' }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: forbidden
    },
    {
      path: '*',
      hidden: true,
      redirect: { path: '/forbidden' }
    },
    {
      path: '/',
      hidden: true,
      redirect: { path: '/home' }
    }
  ]
})

routes.beforeEach(({meta, path}, from, next) => {
  const {auth = true} = meta   
  var isLogin = false;
  var getDat = localStorage.getItem("_SHOP_PASS_IN")
  var isPassLogin = localStorage.getItem("_SHOP_PASS_IN_WITHOUT_TOKEN")||true
  getDat = JSON.parse(getDat)
  if(getDat){
    var keep =true
    getDat._SHOP_PASS_IN && getDat._SHOP_PASS_IN.forEach(i => {
      getDat._SHOP_PASS_IN_VALUE &&getDat._SHOP_PASS_IN_VALUE.forEach(v=> {
        if(!v[i]){
          keep =false
        }
      })
     
    });
    if((new Date().getTime()-getDat.TIME)>86400*1000){
      keep =false
    }
    isLogin = keep;

  }
　　
　if (((auth && !isLogin)||(isPassLogin==='0')) && path !== '/login') {  
　　　return next({ path: '/login' })  
　}

  next();
})
export default routes
