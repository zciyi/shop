<template>
    <div class="P-about">
        <div>
            <div class="addBtn M-Con-left" >
                <el-button class="M-Btn" type="primary" @click="picturesEdit()">新增 </el-button>
            </div>
            <el-table
            :data="pictures"
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
                        <el-button type="text" @click="picturesEdit(scope)" v-model="scope.row" size="small">编辑</el-button>
                        <el-button type="text" @click="picturesDelete(scope)" v-model="scope.row" size="small">删除</el-button>
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
                            <div class="picImg">
                                <img v-if="form.bar&&form.bar.picture" @click="handlePictureCardPreview(form.bar.picture)"  :src="form.bar.picture" >
                            </div>
                            <i v-if="form.bar&&form.bar.picture" @click="upload.remove" class="el-icon-close pic-uploader-icon picIcon"></i>
                        </div>
                    </el-form-item>
                    <el-form-item label="跳转链接">
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
import './about.less'
  export default {
    data() {
        var me = this;
        return {
            form:{
                bar:{
                    picture:""
                    ,link:""

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
            ,activeName:'base'
            ,pictures:[]
            ,pop:{
                visible:false,
                item:{},
                close:(done)=>{
                    done()
                },
                confirm:function(){
                    var validate = {
                        picture:"请上传图片"
                    }
                    if(me.form.bar.link&&!me.$util.RegExp.url.test(me.form.bar.link)){
                        me.tip('跳转链接格式不正确','warning')
                        return
                    }
                    if(!me.checkData(validate,me.form.bar)){
                        return false
                    }
                    if(me.pop.item.index||me.pop.item.index===0){
                      me.$set(me.pictures,me.pop.item.index,me.form[me.pop.type]) 
                    }else{
                      var addIndex = me.pictures.length
                      me.pictures.push(me.form[me.pop.type])
                    }
                    
                    me.pop.visible =false;

                }
            }
            ,dialogVisible:false
            ,dialogImageUrl:""
            ,id:""
        }
    },
    beforeCreate(){
        var me = this;
        this.$request({
            url:"/getAbout",
            method:"get"
        }).then(function(re){
            me.pictures = re.pictures;
            me.id = re.id;
        })
    },
    methods: {
        picturesEdit(scope){
            this.pop.visible = true;
            this.pop.title = scope?"编辑图片":"新增图片"
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
        picturesDelete(scope){
          this.pictures.splice(scope.$index,1);
        },
        handlePictureCardPreview(url) {
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        }
        ,onSubmit(){
            var me = this;
            if(!this.pictures.length){
                me.tip("请添加数据","warning")
                return
            }
            if(this.load)return
            this.load = true
            this.$request({
                url:"/updateAbout",
                method:"post",
                params:{
                    id:this.id
                },
                data:{
                    pictures:this.pictures
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
            me.tip( tip,'warning');
            return false
            }
            return true
        }
    }
  }
</script>