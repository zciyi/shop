<template>
    <div class="P-home">
        <el-tabs v-model="activeName">
            <el-tab-pane label="轮播图" name="bar"></el-tab-pane>
            <el-tab-pane label="瀑布图" name="pic"></el-tab-pane>
        </el-tabs>
        <div v-show="activeName==='bar'">
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
                        <el-button type="text" @click="deleteRow(scope,'broadcasts')" v-model="scope.row" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
        <div v-show="activeName==='pic'">
            <div class="addBtn M-Con-left" >
                <el-button type="primary" class="M-Btn" @click="catalogsAdd()">新增 </el-button>
            </div>
            <el-table
            :data="catalogs"
            border
            style="width: 100%" >
                <el-table-column
                prop="width"
                label="左宽度">
                </el-table-column>
                <el-table-column
                prop="leftMediaType"
                label="左类型">
                <template slot-scope="scope">
                    {{scope.row.leftMediaType==1?"图片":"视频"}}
                </template>
                </el-table-column>
                <el-table-column
                prop="leftPicture"
                label="左图片/左视频">
                <template slot-scope="scope">
                    <img  :src="scope.row.leftPicture" v-if="scope.row.leftMediaType==1&&scope.row.leftPicture" class="pic">
                    <div v-if="scope.row.leftMediaType==2&&scope.row.leftVideo" >{{scope.row.leftVideo}}</div>
                </template>
                </el-table-column>
                <el-table-column
                prop="leftLink"
                label="左跳转链接">
                     <template slot-scope="scope" v-if="scope.row.leftMediaType===1">
                        {{scope.row.leftLink}}
                    </template>
                </el-table-column>
                <el-table-column
                prop="rightMediaType"
                label="右类型">
                <template slot-scope="scope">
                    {{scope.row.rightMediaType==1?"图片":"视频"}}
                </template>
                </el-table-column>
                <el-table-column
                prop="rightPicture"
                label="右图片/右视频">
                <template slot-scope="scope">
                    <img  :src="scope.row.rightPicture" v-if="scope.row.rightMediaType==1&&scope.row.rightPicture" class="pic">
                    <div v-if="scope.row.rightMediaType==2&&scope.row.rightVideo" >{{scope.row.rightVideo}}</div>
                </template>
                </el-table-column>
                <el-table-column
                prop="rightLink"
                label="跳转链接">
                     <template slot-scope="scope" v-if="scope.row.rightMediaType===1">
                        {{scope.row.rightLink}}
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="catalogsAdd(scope)" size="small">编辑</el-button>
                        <el-button type="text" @click="deleteRow(scope,'catalogs')" v-model="scope.row" size="small">删除</el-button>
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
                            <i v-if="form.bar&&form.bar.picture" @click="upload.remove('picture')" class="el-icon-close pic-uploader-icon picIcon"></i>
                        </div>
                    </el-form-item>
                    <el-form-item label="跳转链接" >
                        <el-input v-model="form.bar.link" placeholder="请输入跳转链接"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="pop.type==='pic'">
                <el-form ref="form" :model="form" label-width="150px">
                    <el-form-item label="左宽度"  required>
                        <el-input v-model="form.pic.width" placeholder="请输入0-100的数字"></el-input>
                    </el-form-item>
                    <el-form-item label="右宽度">
                       {{form.pic.width?(100-form.pic.width):100}}
                    </el-form-item>
                    <el-form-item label="左类型" class="radio" required>
                        <el-radio-group v-model="form.pic.leftMediaType">
                            <el-radio :label="1">图片</el-radio>
                            <el-radio :label="2">视频</el-radio>
                        </el-radio-group>
                    </el-form-item>
                     <el-form-item label="左图片" v-show="form.pic&&form.pic.leftMediaType===1" required>
                        <div   @click="upload.setType('leftPicture')">
                            <el-upload
                            class="pic-uploader"
                            :action="upload.url"
                            :on-success="upload.success"
                            :before-upload="upload.beforeUpload"
                            :headers="upload.headers"
                            v-if="!form.pic.leftPicture"
                            >
                            <i class="el-icon-plus pic-uploader-icon"></i>
                            </el-upload>
                        </div>
                        <div class="pic">
                            <div class="picImg">
                                <img v-if="form.pic&&form.pic.leftPicture" @click="handlePictureCardPreview(form.pic.leftPicture)"  :src="form.pic.leftPicture" >
                            </div>
                            <i v-if="form.pic&&form.pic.leftPicture" @click="upload.remove('leftPicture')" class="el-icon-close pic-uploader-icon picIcon"></i>
                        </div>
                    </el-form-item>
                    <el-form-item label="左视频链接" v-show="form.pic&&form.pic.leftMediaType===2" >
                        <el-input v-model="form.pic.leftVideo" placeholder="请上传视频链接" ></el-input>
                        <div @click="video.setType('leftVideo')">
                            <el-upload
                                :action="video.url"
                                :headers="upload.headers"
                                :on-success="video.success"
                                :show-file-list="false">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </div>
                    </el-form-item>
                    <el-form-item label="左跳转链接" v-show="form.pic&&form.pic.leftMediaType===1">
                        <el-input v-model="form.pic.leftLink" placeholder="请输入跳转链接"></el-input>
                    </el-form-item>
                    <el-form-item label="右类型" class="radio" required>
                        <el-radio-group v-model="form.pic.rightMediaType">
                            <el-radio :label="1">图片</el-radio>
                            <el-radio :label="2">视频</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="右图片" v-show="form.pic&&form.pic.rightMediaType===1" required>
                        <div   @click="upload.setType('rightPicture')">
                            <el-upload
                            class="pic-uploader"
                            :action="upload.url"
                            :on-success="upload.success"
                            :before-upload="upload.beforeUpload"
                            :headers="upload.headers"
                            v-if="!form.pic.rightPicture"
                            >
                            <i class="el-icon-plus pic-uploader-icon"></i>
                            </el-upload>
                        </div>
                        <div class="pic">
                            <div  class="picImg">
                                <img v-if="form.pic&&form.pic.rightPicture" @click="handlePictureCardPreview(form.pic.rightPicture)"  :src="form.pic.rightPicture" >
                            </div>
                            <i v-if="form.pic&&form.pic.rightPicture" @click="upload.remove('rightPicture')" class="el-icon-close pic-uploader-icon picIcon"></i>
                        </div>
                    </el-form-item>
                    <el-form-item label="右视频链接" v-show="form.pic&&form.pic.rightMediaType===2" required>
                        <el-input v-model="form.pic.rightVideo" placeholder="请上传视频链接" ></el-input>
                        <div @click="video.setType('rightVideo')">
                            <el-upload
                                :action="video.url"
                                :headers="upload.headers"
                                :on-success="video.success"
                                :show-file-list="false">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </div>
                    </el-form-item>
                    <el-form-item label="右跳转链接" v-show="form.pic&&form.pic.rightMediaType===1">
                        <el-input v-model="form.pic.rightLink" placeholder="请输入跳转链接"></el-input>
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
            <el-button  type="primary" size="large" class="M-Btn" @click="onSubmit">{{activeName==='pic'?'保存':'下一步'}}</el-button>
        </div>
            
    </div>
</template>

<script>
import './home.less'
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
                },
                pic:
                {
                    "leftLink": "",
                    "rightLink": "",
                    "leftMediaType": 0,
                    "rightMediaType": 0,
                    "leftPicture": "",
                    "rightPicture": "",
                    "width": 0,
                    "position": 0,
                    "leftVideo": "",
                    "rightVideo": ""
                }

            },
            videoUpload:'',
            video:{
                src:[],
                url:this.$config.protocol+"://"+this.$config.biServer+this.$config.apis["/uploadFileVideo"]||'',
                success:(res, file)=>{
                    this.tip('上传成功');
                    this.src=file
                    this.form[me.pop.type][me.videoUpload]=res.result.url;
                },
                setType(key){
                    me.videoUpload=key;
                }
            },
            typeUpload:"",
            upload:{
                headers:{
                    'Content-Type': null
                    ,'X-Authorization':this.$Token
                },
                url:this.$config.protocol+"://"+this.$config.biServer+this.$config.apis["/uploadFile"]||'',                
                success:(res, file)=>{
                    me.form[me.pop.type][me.typeUpload||'picture'] = res.result.url;
                },
                beforeUpload:(file)=>{
                    var format = file.type && file.type.split("/")
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
                remove(type){
                    me.form[me.pop.type][type||'picture']="";
                },
                setType(key){
                    me.typeUpload=key;
                }
            }
            ,activeName:'bar'
            ,broadcasts:[]
            ,catalogs:[]
            ,pop:{
                visible:false,
                item:{},
                close:(done)=>{
                    done()
                },
                confirm:function(){
                    var type = ""
                    var validate = {};
                    switch(me.pop.type){
                        case "bar":
                            type = "broadcasts";
                            validate.picture = "请上传图片";
                            if(me.form[me.pop.type].link&&!me.$util.RegExp.url.test(me.form[me.pop.type].link)){
                                    me.tip('跳转链接格式不正确','warning')
                                    return
                            }
                            break
                        case "pic":
                            type = "catalogs";
                            if(me.form.pic.leftMediaType===2){
                                validate.leftVideo="请上传左视频链接"
                            }else{
                                validate.leftPicture = "请上传左图片"
                                if(me.form[me.pop.type].leftLink&&!me.$util.RegExp.url.test(me.form[me.pop.type].leftLink)){
                                     me.tip('跳转链接格式不正确','warning')
                                     return
                                }
                            }
                            if(me.form.pic.rightMediaType===2){
                                validate.rightVideo="请上传右视频链接"
                            }else{
                                validate.rightPicture = "请上传右图片"
                                if(me.form[me.pop.type].rightLink&&!me.$util.RegExp.url.test(me.form[me.pop.type].rightLink)){
                                     me.tip('跳转链接格式不正确','warning')
                                     return
                                }
                            }
                            break
                    }
                    var tip = me.checkData(validate,me.form[me.pop.type])
                    if(!tip){
                        return false
                    }
                    if(me.pop.type==='pic'){
                        if(me.form[me.pop.type].leftMediaType===1)me.form[me.pop.type].leftVideo=""
                        if(me.form[me.pop.type].leftMediaType===2){
                            me.form[me.pop.type].leftPicture=""
                            me.form[me.pop.type].leftLink=""
                        }
                        if(me.form[me.pop.type].rightMediaType===1)me.form[me.pop.type].rightVideo=""
                        if(me.form[me.pop.type].rightMediaType===2){
                            me.form[me.pop.type].rightPicture=""
                            me.form[me.pop.type].rightLink=""
                        }
                    }
                    if(me.pop.item.index||me.pop.item.index===0){
                        me.$set(me[type],me.pop.item.index,me.form[me.pop.type])
                    }else{
                        var addIndex = me[type].length
                        me[type].push(me.form[me.pop.type])
                    }
                    
                    me.pop.visible =false;

                }
            }
            ,dialogVisible:false
            ,dialogImageUrl:""
            ,nav:["base","bar","pic"]
            ,id:""
        }
    },
    beforeCreate(){
        var me = this;
        this.$request({
            url:"/getIndex",
            method:"get"
        }).then(function(re){
            me.form.base.backgroundColor = re.backgroundColor;
            me.catalogs = re.catalogs;
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
        catalogsAdd(scope){
            this.pop.visible = true;
            this.pop.title =  scope?"编辑瀑布图":"新增瀑布图";
            this.pop.type ="pic";
            if(scope){
                scope.row.index = scope.$index;
                var row = scope.row
                this.pop.item = row;
                this.form.pic ={
                    leftPicture:row.leftPicture||""
                    ,leftMediaType:(row.leftMediaType|| 1)
                    ,leftLink:row.leftLink||""
                    ,position:(row.position || 1)
                    ,leftVideo:row.leftVideo||''
                    ,width:row.width
                    ,rightPicture:row.rightPicture||""
                    ,rightMediaType:(row.rightMediaType|| 1)
                    ,rightLink:row.rightLink||""
                    ,rightVideo:row.rightVideo||''
                }
            }else{
                this.form.pic ={
                    "leftLink": "",
                    "rightLink": "",
                    "leftMediaType": 1,
                    "rightMediaType": 1,
                    "leftPicture": "",
                    "rightPicture": "",
                    "width": 0,
                    "position": 0,
                    "leftVideo": "",
                    "rightVideo": ""
                }
            }
        },
        deleteRow(row,type){
            this[type].splice(row.$index,1)
        },
        handlePictureCardPreview(url) {
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        }
        ,onSubmit(){
            var me = this;
            if(this.activeName==='pic'){
                if(!this.broadcasts.length){
                    this.tip("请添加轮播图","warning")
                    return
                }else if(!this.catalogs.length){
                    this.tip("请添加瀑布图","warning")
                    return
                }
                this.$request({
                    url:"/saveIndex",
                    method:"post",
                    params:{
                        id:this.id
                    },
                    data:{
                        backgroundColor:this.form.base.backgroundColor,
                        catalogs:this.catalogs,
                        broadcasts:this.broadcasts
                    }
                }).then(function(re){
                    if(re){
                        me.$notify({
                            title: '保存成功',
                            type: 'success',
                            duration:1000
                        });
                    }
                })

            }else{
                var keep = false;
                this.nav.forEach(function(item,index){
                    if(me.activeName===item&&!keep){
                        me.activeName = me.nav[index+1]
                        keep = true
                    }
                });
            }
            

        }
        ,tip(title,type,duration){
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
        },
    }
    ,components:{
    }
  }
</script>