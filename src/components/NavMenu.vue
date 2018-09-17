
<template>
  <div class="M-navMenu">
    <!-- <el-menu router default-active="this.$route.path"  @open="handleOpen" @close="handleClose" v-for ='n in nav' :key="n.path">
      <el-submenu :index="n.path" v-if='n.subNav'>
        <template slot="title">{{n.text}}</template>
        <el-menu-item  v-for='l in n.subNav' :index="l.path" :key="l.path">{{l.text}}</el-menu-item>
      </el-submenu>
      <el-menu-item v-if='!n.subNav' :index="n.path" ><span>{{n.text}}</span></el-menu-item>
    </el-menu> -->
    <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="left">
          <el-tab-pane :label="n.text" :name="n.path" v-for ='n in nav' :key="n.path"></el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import './NavMenu.less'
  export default {
    name:"NavMenu",
    data(){
        return {
          nav:[{
            text:"home",
            path:"/home"
          },{
            text:"menu",
            path:"/menu",
          },{
              text:"bottom",
              path:"/bottom",
          },{
            text:"campaign",
            path:"/campaign"
          },{
            text:"collection",
            path:"/collection"
          },{
            text:"eshop",
            path:"/eshop"
          },{
            text:"project",
            path:"/project"
          },{
            text:"shop",
            path:"/shop"
          },{
            text:"press",
            path:"/press"
          },{
            text:"about",
            path:"/about"
          }]
          ,activeName:this.$route.path||"/home"
        }
    },
    methods: {
      handleClick(e){
        this.$router.push({path:e.name})
      },
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      }

    }
  }
</script>