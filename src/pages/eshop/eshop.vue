<template>
    <div class="P-shop">
      <el-form ref="form" :model="form" label-width="150px" >
            <el-form-item label="图片" >
                <el-upload
                class="pic-uploader"
                :action="upload.url"
                :on-success="upload.success"
                :before-upload="upload.beforeUpload"
                :headers="upload.headers"
                v-if="!form.picture&&upload.headers"
                >
                <i class="el-icon-plus pic-uploader-icon"></i>
                </el-upload>
                <div class="pic">
                    <div class="picImg">
                        <img v-if="form.picture" @click="handlePictureCardPreview(form.picture)"  :src="form.picture" >
                    </div>
                    <i v-if="form.picture" @click="upload.remove" class="el-icon-close pic-uploader-icon picIcon"></i>
                </div>
            </el-form-item>
        </el-form>
        <div class="btnCtrl">
            <el-button  type="primary" size="large" class="M-Btn" @click="onSubmit">保存</el-button>
        </div>
        <el-dialog :visible.sync="dialogVisible" class="previewPop">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import './eshop.less'
  export default {
    data() {
      var me = this;
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        form: {
          "picture": ""
        },
        id:"",
        upload:{
            headers:{
                    'Content-Type': null
                    ,'X-Authorization':this.$Token
            },
            url:this.$config.protocol+"://"+this.$config.biServer+this.$config.apis["/uploadFile"]||'',
            success:(res, file)=>{
                me.form.picture = res.result.url;
            },
            beforeUpload:(file)=>{
                var format = file.type.split("/")
                const isImg =["png","gif","jpeg"].indexOf(format.length&&format[1])>-1;
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isImg) {
                me.$message.error(' 图片格式不对!');
                }
                if (!isLt2M) {
                me.$message.error('上传图片大小不能超过 2MB!');
                }
                return isImg && isLt2M;
            },
            remove(){
                me.form.picture="";
            }
        }
      }
    },
    created:function(){
        var me = this;
        this.$request({
            url:"/getEshop",
            method:"get",
            query:{
            }
        }).then(function(re){
            me.form.picture = re.picture;
            me.id = re.id
        })
    },
    methods: {
      checkData(validate,datas){
          var me =this;
          var tip;
          for(var key in validate){
              if(!tip){
                  if(me.$util.isObject(validate[key])){
                      if(!datas[key]||!validate[key].validate(datas[key],datas)){
                          tip=validate[key].tip;
                      }
                  }else{
                      if(!datas[key]){
                          tip=validate[key];
                      } 
                  }
              }  
          }
          if(tip){
            me.tip( tip,'warning');
            return false
          }
          return true
      },
      onSubmit(){
        var me = this;
        if(me.load)return
        me.load=true
        this.$request({
            url:"/updateEshop",
            method:"post",
            params:{
                id:me.id
            },
            data:{
                picture:this.form.picture
            }
        }).then(function(re){
            if(re){
                me.tip('保存成功');
            }
            me.load = false
        },function(){
            me.load = false
        })
      },
      tip(title,type,duration){
        this.$notify({
            title: title || '',
            type: type||'success',
            duration:duration||1000
        });

      }
    }
  }
</script>