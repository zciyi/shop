<template>
  <div class="M-header">
    <span class="M-headerCon">{{msg}}</span>
    <div class="M-headerRight" @click="loginout">
    退出登录
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'CARSYDA'
    }
  },
  methods:{
    loginout(){
      localStorage.removeItem("_SHOP_PASS_IN")
      localStorage.removeItem("_SHOP_PASS_IN_WITHOUT_TOKEN")
      window.location.href ="/#/login"

    }

  }
}
</script>
<style>
.M-header{
  background: #0D0D0D;
  height: 50px;
  line-height: 50px;
  color: #fff;
  text-align: left;
  
}
.M-headerCon{
    display: inline-block;
    text-align: center;
    min-width: 160px;
  }
.M-headerRight{
  position: absolute;
  color:#fff;
  right:20px;
  top:0;
}
</style>
