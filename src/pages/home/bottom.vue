<template>
    <div class="P-bottom">
        <div class="addBtn M-Con-left" >
            <el-button type="primary"  class="M-Btn"  @click="add()">新增 </el-button>
        </div>
        <el-table
            :data="tableData"
            border
            style="width: 100%" >
            <el-table-column
            prop="orderNumber"
            label="排序号">
            </el-table-column>
            <el-table-column
            prop="type"
            label="类型">
            <template slot-scope="scope">
                {{scope.row.type===1?"图标":"文字"}}
            </template>
            </el-table-column>
            <el-table-column
            prop="orderNumber"
            label="图标/文字">
                <template slot-scope="scope">
                    <img  :src="scope.row.icon" v-if="scope.row.type===1&&scope.row.icon" class="pic">
                    <div  v-else>{{scope.row.title}}</div>
                </template>
            </el-table-column>
            <el-table-column
            prop="clickType"
            label="点击类型">
            <template slot-scope="scope">
                {{scope.row.type===1?"图片":"链接"}}
            </template>
            </el-table-column>
            <el-table-column
            prop="picture"
            label="图片/链接">
            <template slot-scope="scope">
                <img  :src="scope.row.clickPicture" v-if="scope.row.clickType===1&&scope.row.clickPicture" class="pic">
                <div  v-else>{{scope.row.clickLink}}</div>
            </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button @click="add(scope)" type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pagesSizes"
            :page-size="pagesSize"
            layout="total,prev, pager, next,sizes,jumper"
            :total="total">
            </el-pagination>
        </div>
      <el-dialog
        :title="pop.title"
        :visible.sync="pop.visible"
        width="60%"
        :before-close="pop.close"
        center>
            <el-form ref="form" :model="form" label-width="150px" >
                <el-form-item label="排序号" required>
                    <el-input v-model="form.orderNumber" placeholder="请输入排序号"></el-input>
                </el-form-item>
                <el-form-item label="类型" class="radio" required>
                    <el-radio-group v-model="form.type">
                        <el-radio :label="1">图标</el-radio>
                        <el-radio :label="2">文字</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图标" v-show="form.type===1" required>
                    <div @click="upload.setType('icon')">
                        <el-upload
                        class="pic-uploader"
                        :action="upload.url"
                        :on-success="upload.success"
                        :before-upload="upload.beforeUpload"
                        :headers="upload.headers"
                        v-if="!form.icon"
                        >
                        <i class="el-icon-plus pic-uploader-icon"></i>
                        </el-upload>
                    </div>
                    <div class="pic">
                        <img v-if="form.icon" @click="handlePictureCardPreview(form.icon)"  :src="form.icon" >
                        <i v-if="form.icon" @click="upload.remove('icon')" class="el-icon-close pic-uploader-icon picIcon"></i>
                    </div>
                </el-form-item>
                <el-form-item label="标题" v-show="form.type===2" required>
                    <el-input v-model="form.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="点击类型" class="radio" required>
                    <el-radio-group v-model="form.clickType">
                        <el-radio :label="1">展示图片</el-radio>
                        <el-radio :label="2">跳转链接</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图片" v-show="form.clickType===1" required>
                    <div @click="upload.setType('clickPicture')">
                        <el-upload
                        class="pic-uploader"
                        :action="upload.url"
                        :on-success="upload.success"
                        :before-upload="upload.beforeUpload"
                        :headers="upload.headers"
                        v-if="!form.clickPicture"
                        >
                        <i class="el-icon-plus pic-uploader-icon"></i>
                        </el-upload>
                    </div>
                    <div class="pic">
                        <img v-if="form.clickPicture" @click="handlePictureCardPreview(form.clickPicture)"  :src="form.clickPicture" >
                        <i v-if="form.clickPicture" @click="upload.remove('clickPicture')" class="el-icon-close pic-uploader-icon picIcon"></i>
                    </div>
                </el-form-item>
                <el-form-item label="跳转链接" v-show="form.clickType===2" required>
                    <el-input v-model="form.clickLink" placeholder="请输入跳转链接"></el-input>
                </el-form-item>
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
import './bottom.less'
  export default {
    data() {
        var  me = this;
        var uploadType="";
        return {
            tableData: [],
            currentPage:1,
            total:0,
            pagesSize:5,
            pagesSizes:[5,10,20,30,40,50],
            form:{
                "clickLink": "",
                "clickPicture": "",
                "clickType": 1,
                "icon": "",
                "orderNumber": 0,
                "title": "",
                "type": 1
            },
            dialogImageUrl: '',
            dialogVisible: false,
            upload:{
                headers:{
                    'Content-Type': null
                    ,'X-Authorization':this.$Token
                },
                url:this.$config.protocol+"://"+this.$config.biServer+this.$config.apis["/uploadFile"]||'',
                setType(type){
                    uploadType = type
                },
                success:(res, file)=>{
                    me.form[uploadType] = res.result.url;
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
                remove(type){
                    me.form[type]="";
                }
            }
            ,pop:{
                visible:false,
                item:{},
                close:(done)=>{
                    done()
                },
                confirm:function(){
                    var validate ={
                        orderNumber:{
                            tip:"请输入排序号",
                            validate:function(val){
                                if(!me.$util.RegExp.number.test(val)){
                                    this.tip = "排序号格式不正确"
                                    return false
                                }
                                return true
                            }
                        }
                    }
                    if(me.form.type===1){
                        validate.icon ="请上传图标" 
                    }else{
                        validate.title = "请输入标题"
                    }
                    if(me.form.clickType===1){
                        validate.clickPicture="请上传图片";
                    }else{
                        validate.clickLink={
                            tip:"请输入跳转链接",
                            validate:function(val,row){
                                if(!me.$util.RegExp.url.test(val)){
                                    this.tip = "跳转链接格式不正确"
                                    return false
                                }
                                return true
                            }
                        }
                    }
                    var tip = me.checkData(validate,me.form)
                    if(!tip||me.load){
                        return false
                    }
                    if(me.form.type===1) me.form.title = ""
                    if(me.form.type===2) me.form.icon = ''
                    if(me.form.clickType===1) me.form.clickLink=""
                    if(me.form.clickType===2) me.form.clickPicture=""
                    var type =false
                    if(me.pop.item.index||me.pop.item.index===0){
                        
                        me.$set(me.tableData,me.pop.item.index,me.$util.extend({},me.pop.item,me.form))
                    }else{
                        var addIndex = me.tableData.length
                        me.tableData.push(me.form)
                        type =true
                    }
                    var url=type?"/saveBottom":"/updateBottom"
                    var params = !type?{
                        id:me.pop.item.id||""
                    }:{}
                    me.load = true
                    me.$request({
                        url:url,
                        method:"post",
                        params:params,
                        data:me.form
                    }).then(function(re){
                        me.tip("保存成功")
                        me.load = false
                    },function(){
                        me.tip("保存失败","warning")
                        me.load = false
                    })
                    
                    me.pop.visible =false;

                }
            }
        }
    },
    created:function(){
      this.getData(this.currentPage,this.pagesSize);
    },
    methods: {
        getData(pageNo,pageSize){
            var me = this;
            this.$request({
                url:"/getBottomList",
                method:"get",
                query:{
                pageNo:pageNo,
                pageSize:pageSize
                }
            }).then(function(re){
                me.tableData = re.items;
                me.currentPage = re.pageNo;
                me.pagesSize = re.pageSize;
                me.total = re.total;
            })
        },
        handleSizeChange(val) {
            this.getData(this.currentPage,val);
        },
        handleCurrentChange(val) {
            this.getData(val,this.pagesSize);
        }
        ,add(scope){
            this.pop.visible = true;
            this.pop.title =  scope?"编辑bottom":"新增bottom";
            if(scope){
                scope.row.index = scope.$index;
                var row = scope.row
                this.pop.item = row;
                this.form ={
                    "clickLink":row.clickLink||"",
                    "clickPicture": row.clickPicture||"",
                    "clickType": row.clickType||1,
                    "icon": row.icon||"",
                    "orderNumber": row.orderNumber||0,
                    "title": row.title||"",
                    "type": row.type||1
                }
            }else{
                this.form ={
                    "clickLink": "",
                    "clickPicture": "",
                    "clickType": 1,
                    "icon": "",
                    "orderNumber": 0,
                    "title": "",
                    "type": 1
                }
            }
        }
        ,checkData(validate,datas){
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
        ,tip(title,type,duration){
            this.$notify({
                title: title || '',
                type: type||'success',
                duration:duration||1000
            });

        }
        ,handlePictureCardPreview(file) {
            this.dialogImageUrl = file;
            this.dialogVisible = true;
        }
    }
  }
</script>