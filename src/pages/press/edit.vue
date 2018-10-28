<template>
    <div class="P-pressEdit">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基础配置" name="base"></el-tab-pane>
            <el-tab-pane label="轮播图" name="catalogs"></el-tab-pane>
            <el-tab-pane label="瀑布图" name="medias"></el-tab-pane>
        </el-tabs>
        <el-form ref="form" :model="form" label-width="150px" v-if="activeName==='base'">
            <el-form-item label="标题">
                <el-input v-model="form.base.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="标题颜色设置">
                <el-color-picker v-model="form.base.titleColor" show-alpha></el-color-picker>
            </el-form-item>
            <el-form-item label="是否外跳" class="radio" required>
                <el-radio-group v-model="form.base.isJumpOut">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="外跳链接" v-show="form.base.isJumpOut==1" required>
                <el-input v-model="form.base.outLink" placeholder="请输入外跳链接"></el-input>
            </el-form-item>
            <el-form-item label="图片" required>
                <el-upload
                class="pic-uploader"
                :action="upload.url"
                :on-success="upload.success"
                :before-upload="upload.beforeUpload"
                :headers="upload.headers"
                v-if="!form.base.picture&&upload.headers"
                >
                <i class="el-icon-plus pic-uploader-icon"></i>
                </el-upload>
                <div class="pic">
                    <div class="picImg">
                        <img v-if="form.base.picture" @click="handlePictureCardPreview(form.base.picture)"  :src="form.base.picture" >
                    </div>
                    <i v-if="form.base.picture" @click="upload.remove" class="el-icon-close pic-uploader-icon picIcon"></i>
                </div>
            </el-form-item>
        </el-form>
        <div v-show="activeName==='catalogs'">
            <div class="addBtn M-Con-left" >
                <el-button type="primary"  class="M-Btn"  @click="mediasEdit()">新增 </el-button>
            </div>
            <el-table
            :data="catalogs"
            border
            style="width: 100%" >
                <el-table-column
                prop="mediaType"
                label="类型">
                <template slot-scope="scope">
                    {{scope.row.mediaType==1?"图片":"视频"}}
                </template>
                </el-table-column>
                <el-table-column
                prop="picture"
                label="图片/视频">
                <template slot-scope="scope">
                    <img  :src="scope.row.picture" v-if="scope.row.mediaType==1&&scope.row.picture" class="pic">
                    <div v-if="scope.row.mediaType==2&&scope.row.video" >{{scope.row.video}}</div>
                </template>
                </el-table-column>
                <el-table-column
                prop="link"
                label="跳转链接">
                    <template slot-scope="scope" v-if="scope.row.mediaType==1">
                        {{scope.row.link}}
                    </template>
                
                </el-table-column>
                <!-- <el-table-column
                prop="position"
                label="位置">
                    <template slot-scope="scope">
                        {{scope.row.position==1?"左":"右"}}
                    </template>
                </el-table-column> -->
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="mediasEdit(scope,'catalogs')" v-model="scope.row" size="small">编辑</el-button>
                        <el-button type="text" @click="mediasDelete(scope,'catalogs')" v-model="scope.row" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-show="activeName==='medias'">
            <div class="addBtn M-Con-left" >
                <el-button type="primary"  class="M-Btn"  @click="mediasEdit()">新增 </el-button>
            </div>
            <el-table
            :data="medias"
            border
            style="width: 100%" >
                <el-table-column
                prop="mediaType"
                label="类型">
                <template slot-scope="scope">
                    {{scope.row.mediaType==1?"图片":"视频"}}
                </template>
                </el-table-column>
                <el-table-column
                prop="picture"
                label="图片/视频">
                <template slot-scope="scope">
                    <img  :src="scope.row.picture" v-if="scope.row.mediaType==1&&scope.row.picture" class="pic">
                    <div v-if="scope.row.mediaType==2&&scope.row.video" >{{scope.row.video}}</div>
                </template>
                </el-table-column>
                <el-table-column
                prop="link"
                label="跳转链接">
                    <template slot-scope="scope" v-if="scope.row.mediaType==1">
                        {{scope.row.link}}
                    </template>
                
                </el-table-column>
                <!-- <el-table-column
                prop="position"
                label="位置">
                    <template slot-scope="scope">
                        {{scope.row.position==1?"左":"右"}}
                    </template>
                </el-table-column> -->
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="mediasEdit(scope)" v-model="scope.row" size="small">编辑</el-button>
                        <el-button type="text" @click="mediasDelete(scope)" v-model="scope.row" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="btnCtrl">
            <el-button  class="M-Btn" size="large" @click="goback">返回</el-button>
            <el-button class="M-Btn" type="primary" size="large" @click="onSubmit">{{activeName==='medias'?'保存':'下一步'}}</el-button>
        </div>
        <el-dialog
        :title="pop.title"
        :visible.sync="pop.visible"
        width="60%"
        :before-close="pop.close"
        center>
            <el-form ref="form" :model="form" label-width="150px" >
                <el-form-item label="类型" class="radio" required>
                    <el-radio-group v-model="form[activeName].mediaType">
                        <el-radio :label="1">图片</el-radio>
                        <el-radio :label="2">视频</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图片" v-show="form[activeName].mediaType===1" required>
                    <el-upload
                    class="pic-uploader"
                    :action="upload.url"
                    :on-success="upload.success"
                    :before-upload="upload.beforeUpload"
                    :headers="upload.headers"
                    v-if="!form[activeName].picture&&upload.headers"
                    >
                    <i class="el-icon-plus pic-uploader-icon"></i>
                    </el-upload>
                    <div class="pic">
                        <div class="picImg">
                            <img v-if="form[activeName].picture" @click="handlePictureCardPreview(form[activeName].picture)"  :src="form[activeName].picture" >
                        </div>
                        <i v-if="form[activeName].picture" @click="upload.remove" class="el-icon-close pic-uploader-icon picIcon"></i>
                    </div>
                </el-form-item>
                <el-form-item label="视频链接" v-show="form[activeName].mediaType===2" required>
                    <el-input v-model="form[activeName].video" placeholder="请上传视频链接" ></el-input>
                    <el-upload
                        :action="video.url"
                        :headers="upload.headers"
                        :on-success="video.success"
                        :show-file-list="false">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="跳转链接" v-show="form[activeName].mediaType===1" >
                    <el-input v-model="form[activeName].link" placeholder="请输入跳转链接"></el-input>
                </el-form-item>
                <!-- <el-form-item label="位置" class="radio" required>
                    <el-radio-group v-model="form.medias.position">
                        <el-radio :label="1">左</el-radio>
                        <el-radio :label="2">右</el-radio>
                    </el-radio-group>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="M-Btn" @click="pop.visible = false">取 消</el-button>
                <el-button class="M-Btn" type="primary" @click="pop.confirm">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible" class="previewPop">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
            
    </div>
</template>

<script>
import './edit.less'
  export default {
    data() {
        var me = this;
      return {
            form:{
                base:{
                    titleColor:"rgba(225, 225, 225, 1)",
                    picture:""
                    ,link:""
                    ,isJumpOut:0
                    ,outLink:""
                },
                medias:{
                    picture:""
                    ,mediaType:1
                    ,link:""
                    // ,position:1
                    ,video:""
                },
                catalogs:{
                    picture:""
                    ,mediaType:1
                    ,link:""
                    // ,position:1
                    ,video:""
                }
            },
            catalogs:[],
            medias:[],
            activeName:"base",
            dialogImageUrl: '',
            dialogVisible: false,
            video:{
                src:[],
                url:this.$config.protocol+"://"+this.$config.biServer+this.$config.apis["/uploadFileVideo"]||'',
                success:(res, file)=>{
                    this.tip('上传成功');
                    this.src=file;
                    this.form[me.activeName].video=res.result.url;
                }
            },
            upload:{
                headers:{
                    'Content-Type': null
                    ,'X-Authorization':this.$Token
                },
                url:this.$config.protocol+"://"+this.$config.biServer+this.$config.apis["/uploadFile"]||'',
                success:(res, file)=>{
                    me.form[me.activeName].picture = res.result.url;
                },
                beforeUpload:(file)=>{
                    var format = file.type.split("/")
                    const isImg =["png","gif","jpeg"].indexOf(format.length&&format[1])>-1;
                    const isLt2M = file.size / 1024 / 1024 < 10;

                    if (!isImg) {
                    me.$message.error(' 图片格式不对!');
                    }
                    if (!isLt2M) {
                    me.$message.error('上传图片大小不能超过 10MB!');
                    }
                    return isImg && isLt2M;
                },
                remove(){
                    me.form[me.activeName].picture="";
                }
            }
            ,pop:{
                visible:false,
                item:{},
                close:(done)=>{
                    done()
                },
                confirm:function(){
                    var validate ={}
                    if(me.form[me.activeName].mediaType===2){
                        validate.video="请上传视频链接"
                    }else{
                        validate.picture = "请上传图片"
                        if(me.form[me.activeName].link&&!me.$util.RegExp.url.test(me.form[me.activeName].link)){
                            me.tip('跳转链接格式不正确','warning')
                            return
                        }
                    }
                    var tip = me.checkData(validate,me.form[me.activeName])
                    if(!tip)return false
                    if(me.form[me.activeName].mediaType===1)me.form[me.activeName].video=""
                    if(me.form[me.activeName].mediaType===2){
                        me.form[me.activeName].picture=""
                        me.form[me.activeName].link=""
                    }
                    if(me.pop.item.index||me.pop.item.index===0){
                         me.$set(me[me.activeName],me.pop.item.index,me.form[me.activeName])
                    }else{
                        var addIndex = me[me.activeName].length
                        me[me.activeName].push(me.form[me.activeName])
                    }
                    
                    me.pop.visible =false;

                }
            }
      }
    },
    created:function(){
        if(this.$route.query.id){
            var me = this;
            this.$request({
                url:"/getPress",
                method:"get",
                query:{
                
                },
                params:{
                    id:this.$route.query.id
                }
            }).then(function(re){
                me.form.base.titleColor = re.titleColor;
                me.form.base.title = re.title;
                me.form.base.picture = re.picture;
                me.form.base.isJumpOut = re.isJumpOut;
                me.form.base.outLink = re.outLink;
                me.medias = re.medias;
                me.catalogs = re.catalogs;
            })
        }
        
    },
    methods: {
        handleClick(){

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
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file;
            this.dialogVisible = true;
        },
        mediasEdit(scope){
            this.pop.visible = true;
            if(this.activeName==='bar'){
                this.pop.title =  scope?"编辑轮播图":"新增轮播图";

            }else{
                this.pop.title =  scope?"编辑瀑布图":"新增瀑布图";

            }
            if(scope){
                scope.row.index = scope.$index;
                var row = scope.row
                this.pop.item = row;
                this.form[this.activeName] ={
                    picture:row.picture||""
                    ,mediaType:(row.mediaType|| 1)
                    ,link:row.link||""
                    // ,position:(row.position || 1)
                    ,video:row.video||""
                }
            }else{
                this.form[this.activeName] ={
                    picture:""
                    ,mediaType:1
                    ,link:""
                    // ,position:1
                    ,video:""
                }
            }
        }
        ,onSubmit(){
            var me = this;
            if(this.activeName==='base'){
                var tip = me.checkData({picture:"请上传图片"},me.form.base)
                if(!tip)return false
                if(me.form.base.isJumpOut){
                    if(!me.form.base.outLink){
                        me.tip('请输入外跳链接','warning')
                        return
                    }
                    if(!me.$util.RegExp.url.test(me.form.base.outLink)){
                        me.tip('外跳链接格式不正确','warning')
                        return
                    }

                }
                
                this.activeName = "catalogs";
            }else if(this.activeName === "catalogs"){
                var tip =me.checkData({catalogs:{
                    tip:"请添加轮播图",
                    validate:function(val){
                        if( val.length){
                                return true
                            }
                            return false
                        }
                    }
                }
                ,{catalogs:me.catalogs})
                if(!tip)return false
                this.activeName = "medias";
            }else{
                var isPass = me.checkData({picture:"请上传图片"},me.form.base)
                isPass = me.checkData({catalogs:{
                    tip:"请添加轮播图",
                    validate:function(val){
                        if( val.length){
                                return true
                            }
                            return false
                        }
                    }
                }
                ,{catalogs:me.catalogs})
                if(isPass){
                    isPass = me.checkData({medias:{
                        tip:"请添加瀑布图",
                        validate:function(val){
                            if(me.form.base.isJumpOut|| val.length){
                                return true
                            }
                            return false
                        }
                    }
                    },{medias:me.medias})
                }
                if(!isPass||this.load)return
                var id = this.$route.query.id
                var url =id?"/updatePress":"/savePress"
                var params = id?{
                    id:id
                }:{}
                this.load=true;
                this.$request({
                    url:url,
                    method:"post",
                    params:params,
                    data:{
                        titleColor:this.form.base.titleColor,
                        title:this.form.base.title,
                        outLink:this.form.base.outLink,
                        isJumpOut:this.form.base.isJumpOut,
                        picture:this.form.base.picture,
                        medias:this.medias,
                        catalogs:this.catalogs
                    }
                }).then(function(re){
                    me.load=false;
                    if(re){
                        me.tip('保存成功');
                        me.$router.push({path:"/press"})

                    }
                    
                },function(){
                    me.load=false;
                    me.tip('保存失败','warning');
                })
            }

        }
        ,goback(){
            this.$router.push({path:"/press"})
        }
        ,tip(title,type,duration){  
            this.$notify({
                title: title || '',
                type: type||'success',
                duration:duration||1000
            });

        },mediasDelete(scope,key){
            if(key){
                this[key].splice(scope.$index,1)

            }else{
                this.medias.splice(scope.$index,1)

            }
        }
    }
  }
</script>