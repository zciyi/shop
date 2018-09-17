<template>
    <div class="P-menu">
        <el-table
            :data="tableData"
            border
            style="width: 100%" >
            <el-table-column
            prop="menuName"
            label="菜单名称">
            </el-table-column>
            <el-table-column
            prop="backgroundColor"
            label="色值">
                <template slot-scope="scope">
                    <div class="colorS">
                        <div class="colorShow" :style="{background:scope.row.backgroundColor}"></div>
                        {{scope.row.backgroundColor}}
                    </div>
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

        <div class="btnCtrl">
            <el-button  type="primary" size="large" class="M-Btn" @click="onSubmit">保存</el-button>
        </div>
        <el-dialog
        :title="pop.title"
        :visible.sync="pop.visible"
        width="60%"
        :before-close="pop.close"
        center>
            <el-form ref="form" :model="form" label-width="150px">
                <el-form-item label="颜色设置" required>
                <el-color-picker v-model="form.backgroundColor" show-alpha></el-color-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="M-Btn" @click="pop.visible = false">取 消</el-button>
                <el-button class="M-Btn" type="primary" @click="pop.confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import './menu.less'
  export default {
    data() {
        var me =this
        return {
            tableData: [],
            form:{
                backgroundColor:"rgba(225, 225, 225, 1)"
            }
            ,pop:{
                visible:false,
                item:{},
                close:(done)=>{
                    done()
                },
                confirm:function(){
                    if(!me.form.backgroundColor){
                        me.tip("请设置颜色")
                        return
                    }
                    me.pop.item.backgroundColor = me.form.backgroundColor
                    var index = me.pop.item.index
                    delete me.pop.item.index
                    me.$set(me.tableData,index,me.pop.item)
                    
                    me.pop.visible =false;

                }
            }
        }
    },
    created:function(){
        var me = this;
        this.$request({
            url:"/getMenu",
            method:"get",
            query:{
            }
        }).then(function(re){
            me.tableData = re;
        })
    },
    methods: {
        add(scope){
            this.pop.visible = true;
            this.pop.title =  "编辑菜单";
            if(scope){
                scope.row.index = scope.$index;
                var row = scope.row
                this.pop.item = row;
                this.form.backgroundColor = row.backgroundColor;
            }else{
                this.form.backgroundColor = "";
            }
        }
        ,tip(title,type,duration){
            this.$notify({
                title: title || '',
                type: type||'success',
                duration:duration||1000
            });

        },
        onSubmit(){
            var me =this;
            if(me.load)return
            me.load=true
            this.$request({
                url:"/updateMenu",
                method:"post",
                params:{
                    id:this.id
                },
                data:{
                    menuConfigDtos:me.tableData
                }
            }).then(function(re){
                if(re){
                    me.tip('保存成功');
                }
                me.load=false
            },function(){
                me.load=false
            })
        }
    }
}
</script>