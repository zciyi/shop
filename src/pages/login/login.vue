<template>
  <div class="login">
    <div class="loginMain">
     
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item>
             <div class="loginTitle">登录</div> 
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="form.name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.pws" type="password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="onSubmit">立即登录</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import './login.less'
export default {
  name: 'login',
  data () {
    return {
      form:{
        name:"",
        pws:"",
      }
    }
  },
  beforeCreate(){
  },
  mounted(){
    var me = this
    document.onkeyup = function (e) {  
      if (window.event) e = window.event;    
      var code = e.charCode || e.keyCode;    
      if (code == 13&&me.form.name&&me.form.pws) {    
        me.onSubmit();  
      }
    }


  },
  methods:{
    onSubmit(){
      var me = this;
      if(!this.form.name){
        me.tip("请输入用户名","warning")
        return false
      }else if(!me.form.pws){
        me.tip("请输入密码","warning")
        return false
      }
      this.$request({
          url:"/login",
          method:"post",
          params:{},
          data:{
            username:this.form.name.trim(),
            password:this.form.pws.trim()
          }
      }).then(function(re){
          me.load = false;
          if(re){
            var key = [];
            var dat = [];
            var random =Math.ceil((10+Math.random()*(20-10+1)))
            for(var i=0;i<random;i++){
              var obj ={}
              obj["_SHOP_PASS_ININ"+random]= Date.now().toString(16) + "_" + Math.ceil(Math.random() * 1000)
              dat.push(obj)
              key.push("_SHOP_PASS_ININ"+random);
            }
            localStorage.setItem("_SHOP_PASS_IN",JSON.stringify({
              _SHOP_PASS_IN:key
              ,_SHOP_PASS_IN_VALUE:dat
              ,TIME:new Date().getTime()
              ,_SHOP_SET_SESSION:re.sessionId
            }) )
            me.tip('登录成功');
            me.$router.push({path:"/home"})

          }
      },function(){
          me.tip('登录失败',"warning");
          me.load = false;
      })
    }
    ,tip(title,type,duration){
        this.$notify({
            title: title || '',
            type: type||'success',
            duration:duration||1000
        });

    }
  }

}
</script>
