<template>
    <div class="P-shop">
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
        prop="phone"
        label="手机号">
        </el-table-column>
        <el-table-column
        prop="provice"
        label="省份">
        </el-table-column>
        <el-table-column
        prop="address"
        label="地址">
        </el-table-column>
        <el-table-column
        prop="market"
        label="商场">
        </el-table-column>
        <el-table-column
        prop="picture"
        label="图片">
          <template slot-scope="scope">
              <img  :src="scope.row.picture" class="pic">
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
                <el-button @click="add(scope)" type="text" size="small">编辑</el-button>
                <el-button @click="deleteStore(scope)" type="text" size="small">删除</el-button>
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
              <el-form-item label="手机号" required>
                  <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="省份">
                  <el-input v-model="form.provice" placeholder="请输入省份"></el-input>
              </el-form-item>
              <el-form-item label="地址" required>
                  <el-input v-model="form.address" placeholder="请输入地址"></el-input>
              </el-form-item>
              <el-form-item label="商场">
                  <el-input v-model="form.market" placeholder="请输入商场"></el-input>
              </el-form-item>
              <el-form-item label="图片" required>
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
          <span slot="footer" class="dialog-footer">
              <el-button class="M-Btn" @click="pop.visible = false">取 消</el-button>
              <el-button class="M-Btn" type="primary" @click="pop.confirm">保 存</el-button>
          </span>
      </el-dialog>
        <el-dialog :visible.sync="dialogVisible" class="previewPop">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import './shop.less'
  export default {
    data() {
        var me = this;
        return {
            tableData: [],
            currentPage:1,
            total:0,
            pagesSize:5,
            pagesSizes:[5,10,20,30,40,50],
            dialogImageUrl: '',
            dialogVisible: false,
            form: {
            "address": "",
            "market": "",
            "orderNumber": 0,
            "phone": "",
            "picture": "",
            "provice": ""
            },
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
            ,pop:{
                visible:false,
                item:{},
                close:(done)=>{
                    done()
                },
                confirm:function(){
                    var validate ={
                        picture:"请上传图片",
                        phone:{
                        tip:"请输入手机号",
                        validate:function(val){
                            if(!me.$util.RegExp.mobile.test(val)){
                                this.tip = "手机号格式不正确"
                                return false
                            }
                            return true
                        }
                        },
                        orderNumber:{
                        tip:"请输入排序号",
                        validate:function(val){
                            if(!me.$util.RegExp.number.test(val)){
                                this.tip = "排序号格式不正确"
                                return false
                            }
                            return true
                        }
                        },address:"请输入地址"
                    }
                    var isPass = me.checkData(validate,me.form)
                    if(!isPass||me.load) return
                
                    var type =false
                    if(me.pop.item.index||me.pop.item.index===0){
                        me.$set(me.tableData,me.pop.item.index,me.$util.extend({},me.pop.item,me.form))
                    }else{
                        var addIndex = me.tableData.length
                        me.tableData.push(me.form)
                        type =true
                    }
                
                    var params = type?{}:{id:me.pop.item.id}
                    var url=type?"/saveShop":"/updateShop"
                    me.load = true;
                    me.$request({
                    url:url,
                    method:"post",
                    params:params,
                    data:me.form
                    }).then(function(re){
                    if(re){
                        me.tip('保存成功');
                    }
                    me.load = false;
                    },function(){
                    me.tip('保存失败','warning');
                    me.load = false;
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
                url:"/getShopList",
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
        ,add(scope){
            this.pop.visible = true;
            this.pop.title =  scope?"编辑门店":"新增门店";
            if(scope){
                scope.row.index = scope.$index;
                var row = scope.row
                this.pop.item = row;
                this.form ={
                "address": row.address||"",
                "market": row.market||"",
                "orderNumber": row.orderNumber||0,
                "phone": row.phone||"",
                "picture": row.picture||"",
                "provice": row.provice||""
                }
            }else{
                this.form ={
                "address": "",
                "market": "",
                "orderNumber": 0,
                "phone": "",
                "picture": "",
                "provice": ""
                }
            }
        },
        tip(title,type,duration){
            this.$notify({
                title: title || '',
                type: type||'success',
                duration:duration||1000
            });

        },
        deleteStore(scope){
            this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                var me = this;
                var params={}
                params.id = scope.row.id
                if(me.loadDelete)return
                me.loadDelete = true;
                me.$request({
                    url:"/deleteStore",
                    method:"delete",
                    params:params,
                    data:{}
                }).then(function(re){
                    me.loadDelete = false;
                    me.tip( '删除成功!');
                    me.getData(me.currentPage,me.pagesSize);
                },function(){
                    me.loadDelete = false;
                })
            }).catch(() => {

            });
        }
    }
  }
</script>