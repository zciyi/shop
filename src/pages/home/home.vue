<template>
    <div class="P-home">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基础配置" name="base"></el-tab-pane>
            <el-tab-pane label="轮播图" name="bar"></el-tab-pane>
            <el-tab-pane label="瀑布图" name="pic"></el-tab-pane>
        </el-tabs>
        <div v-show="activeName==='base'">
            <el-form ref="form" :model="form" label-width="150px">
                <el-form-item label="菜单颜色设置">
                <el-color-picker v-model="form.base.backgroundColor" show-alpha></el-color-picker>
                </el-form-item>
            </el-form>

        </div>
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
                     <template slot-scope="scope" v-if="scope.row.mediaType===1">
                        {{scope.row.link}}
                    </template>
                </el-table-column>
                <el-table-column
                prop="position"
                label="位置">
                    <template slot-scope="scope">
                        {{scope.row.position===1?"左":"右"}}
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
            <div v-show="pop.type==='bar'">
                <el-form ref="form" :model="form" label-width="150px">
                    <el-form-item label="背景图" required>
                        <el-upload
                        class="pic-uploader"
                        :action="upload.url"
                        :on-success="upload.success"
                        :before-upload="upload.beforeUpload"
                        :headers="{'Content-Type': null}"
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
            <div v-show="pop.type==='pic'">
                <el-form ref="form" :model="form" label-width="150px">
                    <el-form-item label="类型" class="radio" required>
                        <el-radio-group v-model="form.pic.mediaType">
                            <el-radio :label="1">图片</el-radio>
                            <el-radio :label="2">视频</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="图片" v-show="form.pic&&form.pic.mediaType===1" required>
                        <el-upload
                        class="pic-uploader"
                        :action="upload.url"
                        :on-success="upload.success"
                        :before-upload="upload.beforeUpload"
                        :headers="{'Content-Type': null}"
                        v-if="!form.pic.picture"
                        >
                        <i class="el-icon-plus pic-uploader-icon"></i>
                        </el-upload>
                        <div class="pic">
                            <img v-if="form.pic&&form.pic.picture" @click="handlePictureCardPreview(form.pic.picture)"  :src="form.pic.picture" >
                            <i v-if="form.pic&&form.pic.picture" @click="upload.remove" class="el-icon-close pic-uploader-icon picIcon"></i>
                        </div>
                    </el-form-item>
                    <el-form-item label="视频链接" v-show="form.pic&&form.pic.mediaType===2" required>
                        <el-input v-model="form.pic.video" placeholder="请输入视频链接"></el-input>
                    </el-form-item>
                    <el-form-item label="跳转链接" v-show="form.pic&&form.pic.mediaType===1" required>
                        <el-input v-model="form.pic.link" placeholder="请输入跳转链接"></el-input>
                    </el-form-item>
                    <el-form-item label="位置" class="radio" required>
                        <el-radio-group v-model="form.pic.position">
                            <el-radio :label="1">左</el-radio>
                            <el-radio :label="2">右</el-radio>
                        </el-radio-group>
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
                pic:{
                    picture:""
                    ,mediaType:1
                    ,link:""
                    ,position:1
                }
            },
            upload:{
                url:this.$config.protocol+"://"+this.$config.biServer+this.$config.apis["/uploadFile"]||'',                
                success:(res, file)=>{
                    me.form[me.pop.type].picture = res.result.url;
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
                    me.form[me.pop.type].picture="";
                }
            }
            ,activeName:'base'
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
                            validate.link = {
                            tip:"请输入跳转链接",
                                validate:function(val){
                                    if(!me.$util.RegExp.url.test(val)){
                                        this.tip = "跳转链接格式不正确"
                                        return false
                                    }
                                    return true
                                }
                            }
                            break
                        case "pic":
                            type = "catalogs";
                            if(me.form.pic.mediaType===2){
                                validate.video="请输入视频链接"
                            }else{
                                validate.picture = "请上传图片"
                                validate.link={
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
                            break
                    }
                    var tip = me.checkData(validate,me.form[me.pop.type])
                    if(!tip){
                        return false
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
        handleClick(e){
        },
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
                    picture:row.picture||""
                    ,mediaType:(row.mediaType|| 1)
                    ,link:row.link||""
                    ,position:(row.position || 1)
                    ,video:row.video||''
                }
            }else{
                this.form.pic ={
                    picture:""
                    ,mediaType:1
                    ,link:""
                    ,position:1
                    ,video:""
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
                if(!this.form.base.backgroundColor){
                    this.tip("请设置色值","warning")
                    return
                }else if(!this.broadcasts.length){
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