<template>
    <div class="P-collection">
        <div>
            <div class="addBtn M-Con-left" >
                <el-button class="M-Btn" type="primary" @click="broadcastsEdit()">新增 </el-button>
            </div>
            <el-table
            :data="broadcasts"
            border
            style="width: 100%" >
                <el-table-column
                prop="picture"
                label="图片">
                <template slot-scope="scope">
                    <img  :src="scope.row.picture" class="pic">
                </template>
                
                </el-table-column>
                <el-table-column
                prop="link"
                label="跳转链接">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="broadcastsEdit(scope)" v-model="scope.row" size="small">编辑</el-button>
                        <el-button type="text" @click="broadcastsDelete(scope)" v-model="scope.row" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
        </div>
        <el-dialog
            :title="pop.title"
            :visible.sync="pop.visible"
            width="60%"
            :before-close="pop.close"
            center>
            <div v-if="pop.type==='bar'">
                <el-form ref="form" :model="form" label-width="150px">
                    <el-form-item label="背景图" required>
                        <el-upload
                        class="pic-uploader"
                        :action="upload.url"
                        :on-success="upload.success"
                        :before-upload="upload.beforeUpload"
                        :headers="upload.headers"
                        v-if="!form.bar.picture"
                        >
                        <i class="el-icon-plus pic-uploader-icon"></i>
                        </el-upload>
                        <div class="pic">
                            <img v-if="form.bar&&form.bar.picture" @click="handlePictureCardPreview(form.bar.picture)"  :src="form.bar.picture" >
                            <i v-if="form.bar&&form.bar.picture" @click="upload.remove" class="el-icon-close pic-uploader-icon picIcon"></i>
                        </div>
                    </el-form-item>
                    <el-form-item label="跳转链接" required>
                        <el-input v-model="form.bar.link" placeholder="请输入跳转链接"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            
            <span slot="footer" class="dialog-footer">
                <el-button class="M-Btn" @click="pop.visible = false">取 消</el-button>
                <el-button class="M-Btn" type="primary" @click="pop.confirm">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="dialogVisible" class="previewPop">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <div class="btnCtrl">
            <el-button  type="primary" size="large" class="M-Btn" @click="onSubmit">保存</el-button>
        </div>
            
    </div>
</template>

<script>
import './collection.less'
  export default {
    data() {
        var me = this;
        return {
            form:{
                bar:{
                    picture:""
                    ,link:""

                },
                base:{
                    backgroundColor:"rgba(225, 225, 225, 1)"
                }
            },
            upload:{
                headers:{
                    'Content-Type': null
                    ,'X-Authorization':this.$Token
                },
                url:this.$config.protocol+"://"+this.$config.biServer+this.$config.apis["/uploadFile"]||'',
                success:(res, file)=>{
                    me.form.bar.picture = res.result.url;
                    console.log(me.form)
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
                    me.form.bar.picture="";
                }
            }
            ,broadcasts:[]
            ,pop:{
                visible:false,
                item:{},
                close:(done)=>{
                    done()
                },
                confirm:function(){
                    var validate ={
                        picture:"请上传图片",
                        link:{
                            tip:"请输入跳转链接",
                            validate:function(val){
                                if(!me.$util.RegExp.url.test(val)){
                                    this.tip = "跳转链接格式不正确"
                                    return false
                                }
                                return true
                            }
                        }
                    }
                    var tip = me.checkData(validate,me.form.bar)
                    if(!tip){
                        return false
                    }
                    if(me.pop.item.index||me.pop.item.index===0){
                      me.$set(me.broadcasts,me.pop.item.index,me.form[me.pop.type]) 
                    }else{
                      var addIndex = me.broadcasts.length
                      me.broadcasts.push(me.form[me.pop.type])
                    }
                    
                    me.pop.visible =false;

                }
            }
            ,dialogVisible:false
            ,dialogImageUrl:""
            ,nav:["base","bar"]
            ,id:""
        }
    },
    beforeCreate(){
        var me = this;
        this.$request({
            url:"/getCollection",
            method:"get"
        }).then(function(re){
            me.form.base.backgroundColor = re.backgroundColor;
            me.broadcasts = re.broadcasts;
            me.id = re.id;
        })
    },
    methods: {
        broadcastsEdit(scope){
            this.pop.visible = true;
            this.pop.title = scope?"编辑轮播图":"新增轮播图"
            this.pop.type ="bar"
            if(scope){
                scope.row.index = scope.$index;
                var row = scope.row
                this.pop.item = row;
                this.form.bar ={
                    picture:row.picture||''
                    ,link:row.link||''
                }
            }else{
                this.form.bar ={
                    picture:""
                    ,link:""
                }
            }
            
        },
        broadcastsDelete(scope){
          this.broadcasts.splice(scope.$index,1);
        },
        handlePictureCardPreview(url) {
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        }
        ,onSubmit(){
            var me = this;
            if(!this.form.base.backgroundColor){
                this.tip("请设置色值","warning")
                return
            }else if(!this.broadcasts.length){
                this.tip("请添加轮播图","warning")
                return
            }
            if(this.load)return
            this.load = true
            this.$request({
                url:"/updateCollection",
                method:"post",
                params:{
                    id:this.id
                },
                data:{
                    backgroundColor:this.form.base.backgroundColor,
                    broadcasts:this.broadcasts
                }
            }).then(function(re){
                if(re){
                    me.tip('保存成功');
                }
                me.load = false
            },function(){
                me.tip('保存失败',"warning");
                me.load = false
            })
            

        },
        tip(title,type,duration){
          this.$notify({
              title: title || '',
              type: type||'success',
              duration:duration||1000
          });

        },
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
                this.tip(tip,'warning')
                return false
            }
            return true
        }
    }
    ,components:{
    }
  }
</script>