<template>
    <div class="P-shop">
        <el-tabs v-model="activeName">
            <el-tab-pane label="轮播图" name="bar"></el-tab-pane>
            <el-tab-pane label="门店列表" name="shop"></el-tab-pane>
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
            <div>
                <el-button class="M-Btn" type="primary" @click="saveBroadcasts()">保存 </el-button>
            </div>
        </div>
        <div v-show="activeName==='shop'">
             <div class="addBtn M-Con-left" >
                <el-button class="M-Btn" type="primary" @click="shopEdit()">新增 </el-button>
            </div>
            <el-table
            :data="shopList"
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
                prop="address"
                label="地址">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.provice||""}}
                        {{scope.row.city||""}}
                        {{scope.row.district||""}}
                        {{scope.row.address||""}}
                    </div>
                </template>
                </el-table-column>
                <el-table-column
                prop="market"
                label="商场">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="shopEdit(scope)"  size="small">编辑</el-button>
                        <el-button type="text" @click="deleteShop(scope)"  size="small">删除</el-button>
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
        </div>
        <el-dialog
            :title="pop.title"
            :visible.sync="pop.visible"
            :width="pop.type==='bar'? '60%':'90%'"
            :before-close="pop.close"
            center>
            <div v-show="pop.type==='bar'">
                <el-form ref="form" :model="form" label-width="150px">
                    <el-form-item label="图片" required>
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
                            <i v-if="form.bar&&form.bar.picture" @click="upload.remove()" class="el-icon-close pic-uploader-icon picIcon"></i>
                        </div>
                    </el-form-item>
                    <el-form-item label="跳转链接" >
                        <el-input v-model="form.bar.link" placeholder="请输入跳转链接"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-show="pop.type==='shop'">
                <el-form ref="form" :model="form" label-width="150px">
                    <el-form-item label="排序号" required>
                        <el-input v-model="form.shop.orderNumber" placeholder="请输入排序号"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" required>
                        <el-input v-model="form.shop.phone" placeholder="请输入电话号码"></el-input>
                    </el-form-item>
                    <el-form-item label="省市区" required>
                        <el-select v-model="form.shop.province" placeholder="省" @change="areaChange('province','city',form.shop.province)">
                            <el-option
                            v-for="item in province"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select v-model="form.shop.city" placeholder="市" @change="areaChange('city','district',form.shop.city)">
                            <el-option
                            v-for="item in city"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select v-model="form.shop.district" placeholder="区" @change="setDistrict">
                            <el-option
                            v-for="item in district"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="详细地址" required>
                        <el-input v-model="form.shop.address"  @change="setDistrict" placeholder="请输入详细地址"></el-input>
                    </el-form-item>
                    <el-form-item label="位置">
                        <qqmap ref="qqmap" :geo="geo" :data="form.shop.dat" @updateGeo="updateGeo" @updateData="updateData"></qqmap>
                        <div class="positionTip">
                            当前位置：{{demogeo||''}} ({{demodat.lng||0}},{{demodat.lat||0}})
                            <el-button class="positionBtn" type="primary" size="small" @click="setShop"> 设置门店坐标</el-button></div>
                        <div class="positionInput">
                           <span class="positionRequire"> 经度：</span> <el-input v-model="form.shop.dat.lng" placeholder="请输入经度" class="position"></el-input>
                            <span class="positionRequire"> 纬度：</span><el-input v-model="form.shop.dat.lat" placeholder="请输入纬度" class="position"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="商场">
                        <el-input v-model="form.shop.market" placeholder="请输入商场"></el-input>
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
    </div>
</template>


<script>
import qqmap from "@/components/map"
import './shop.less'
export default {
    name:"shop",
    components:{
        qqmap
    },
    data(){
        let me = this;
        return{
            activeName:"bar",
            pop:{
                visible:false,
                item:{},
                type:"",
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
                                me.$tip('跳转链接格式不正确','warning')
                                return
                            }
                            break
                        case "shop":
                            type = "shop";
                            break
                    }
                    var tip = me.checkData(validate,me.form[me.pop.type])
                    if(!tip){
                        return false
                    }
                    if(type==='shop'){
                        me.saveShop()
                        return
                    }
                    if(me.pop.item.index||me.pop.item.index===0){
                        me.$set(me[type],me.pop.item.index,me.form[me.pop.type])
                    }else{
                        var addIndex = me[type].length
                        me[type].push(me.form[me.pop.type])
                    }
                    
                    me.pop.visible =false;

                }
            },
            broadcasts:[],
            shopList:[],
            form:{
                bar:{
                    picture:""
                    ,link:""

                },
                shop:{
                    province:"",
                    city:"",
                    district:"",
                    address:"",
                    dat:{
                        // 纬度
                        lat:"",
                        // 经度
                        lng:"",
                    }
                
                }

            },
            upload:{
                headers:{
                    'Content-Type': null
                    ,'X-Authorization':this.$Token
                },
                url:this.$config.protocol+"://"+this.$config.biServer+this.$config.apis["/uploadFile"]||'',                
                success:(res, file)=>{
                    me.form[me.activeName]['picture'] = res.result.url;
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
                remove(){
                    me.form[me.pop.type]['picture']="";
                }
            }
            ,dialogVisible:false
            ,dialogImageUrl:""
            ,province:[]
            ,city:[]
            ,district:[]
            ,geo:""
            ,demodat:{
                // 纬度
                lat:"",
                // 经度
                lng:""
            }
            ,demogeo:"",
            currentPage:1,
            total:0,
            pagesSize:5,
            pagesSizes:[5,10,20,30,40,50],
        }
    },
    beforeCreate(){
        this.$request({
            url:"/getRegion",
            method:"get",
            query:{
                parentId:0
            }
        }).then((re)=>{
            this.province = re
        })
        
        
    },
    created(){
        this.getData(this.currentPage,this.pagesSize)
        this.getBroadcast();
       
    },
    methods:{
        updateGeo(dat){
            this.demogeo = dat
        },
        updateData(dat){
            this.demodat = dat
        },
        handleSizeChange(val) {
            this.getData(this.currentPage,val);
        },
        handleCurrentChange(val) {
            this.getData(val,this.pagesSize);
        },
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
                me.shopList = re.items;
                me.currentPage = re.pageNo;
                me.pagesSize = re.pageSize;
                me.total = re.total;
            })
        },
        getBroadcast(){
            this.$request({
                url:"/getBarStore",
                method:"get"
            }).then((re)=>{
                if(re){
                    this.broadcasts= re||[];
                }
            })
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
                    picture:"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1409224092,1124266154&fm=26&gp=0.jpg"
                    ,link:""
                }
            }
            
        },
        saveBroadcasts(){
            this.$request({
                url:"/saveBarStore",
                method:"post",
                data:{
                    broadcasts:this.broadcasts
                }
            }).then((re)=>{
                this.$tip("保存成功")
            })
        },
        areaChange(curkey,key,val,type){
            if(curkey==='city'&&!type){
                this.form.shop.district = ""  
                this.setDistrict()
                  
            }else if(curkey==='province'&&!type){
                this.form.shop.district = ""  
                this.form.shop.city = ""  
                this.setDistrict()

            }
            if(!type){
                this.form.shop[key]  = ""
            }
            if(!val)return
            this.$request({
                url:"/getRegion",
                method:"get",
                query:{
                    parentId:val||0
                }
            }).then((re)=>{
                this[key] = re
            })
        },
        setShop(){
            this.form.shop.dat = this.demodat
        },
        getDistrictVal(){
            let province = this.province.filter((k)=>{
                return k.id === this.form.shop.province
            })
            let city = this.city.filter((k)=>{
                return k.id === this.form.shop.city
            })
            let district = this.district.filter((k)=>{
                return k.id === this.form.shop.district
            })
            return{
                province:province.length?province[0]:null,
                city:city.length?city[0]:null,
                district:district.length?district[0]:null,
            }
        },
        setDistrict(){
            let shop = this.form.shop
            let area = this.getDistrictVal()
            this.geo = ((area.province&&area.province.name)||'')+((area.city&&area.city.name)||'')
            +((area.district&&area.district.name)||'')+(shop.address||'');
        },
        shopEdit(scope){
            this.pop.visible = true;
            this.pop.title = scope?"编辑门店":"新增门店"
            this.pop.type ="shop"
            if(scope){
                var row = scope.row
                this.pop.item = row;
                this.form.shop ={
                    province:row.proviceCode||"",
                    city:row.cityCode||"",
                    district:row.districtCode||"",
                    address:row.address||"",
                    dat:{
                        // 纬度
                        lat:row.lat||"",
                        // 经度
                        lng:row.lon||"",
                    },
                    orderNumber:row.orderNumber||"",
                    phone:row.phone||"",
                    market:row.market||""

                }
                if(row.proviceCode){
                    this.areaChange("province","city",row.proviceCode,1)
                }
                if(row.cityCode){
                    this.areaChange("city","district",row.cityCode,1)
                }
                this.setDistrict();
                this.demodat={
                    // 纬度
                    lat:row.lat||"",
                    // 经度
                    lng:row.lon||""
                }
            }else{
                this.pop.item = {};
                
                this.form.shop ={
                    province:"",
                    city:"",
                    district:"",
                    address:"",
                    dat:{
                        // 纬度
                        lat:"",
                        // 经度
                        lng:"",
                    },
                    orderNumber:"",
                    phone:"",
                    market:""
                }
                this.geo ="";
                this.demogeo = ""
                this.demodat={
                    // 纬度
                    lat:"",
                    // 经度
                    lng:""
                }
            }
        },
        saveShop(){
            let me = this
            let shop = this.form.shop
            var validate ={
                phone:"请输入电话号码",
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
            var isPass = me.checkData(validate,me.form.shop)
            if(isPass){
                if(!shop.province){
                    return this.$tip("请选择省",2)
                }
                if(!shop.city){
                    return this.$tip("请选择市",2)
                }
                if(!shop.address){
                    return this.$tip("请输入详细地址",2)
                }
                
                if(!shop.dat.lng){
                    return this.$tip("请输入经度",2)
                }
                if(!shop.dat.lat){
                    return this.$tip("请输入纬度",2)
                }
            }
            if(!isPass||me.load) return
            var params = !me.pop.item.id?{}:{id:me.pop.item.id}
            var url=!me.pop.item.id?"/saveShop":"/updateShop"
            me.load = true;
            let area = this.getDistrictVal()
            let data = {
                "address":shop.address ,
                "city": (area.city&&area.city.name)||'',
                "cityCode":  (area.city&&area.city.id)||'',
                "district":  (area.district&&area.district.name)||'',
                "districtCode":  (area.district&&area.district.id)||'',
                "lat": shop.dat.lat,
                "lon": shop.dat.lng,
                "market": shop.market,
                "orderNumber": shop.orderNumber,
                "phone": shop.phone,
                "provice":  (area.province&&area.province.name)||'',
                "proviceCode": (area.province&&area.province.id)||'',
            }
            me.$request({
                url:url,
                method:"post",
                params:params,
                data:data
            }).then(function(re){
                if(re){
                    me.$tip('保存成功');
                    me.getData(me.currentPage,me.pagesSize);
                    me.pop.visible =false
                }
                me.load = false;
            },function(){
                me.$tip('保存失败','warning');
                me.load = false;
            })
        },
        deleteShop(scope){
             this.$confirm('此操作将删除该门店, 是否继续?', '提示', {
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
                    me.$tip( '删除成功!');
                    me.getData(me.currentPage,me.pagesSize);
                },function(){
                    me.loadDelete = false;
                })
            }).catch(() => {

            });
        },
        deleteRow(row,type){
            this[type].splice(row.$index,1)
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
                this.$tip(tip,2)
                return false
            }
            return true
        },
        handlePictureCardPreview(url) {
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        }
    }
}
</script>

