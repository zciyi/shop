<template>
    <div class="P-collectionList">
        <div class="addBtn M-Con-left" >
            <el-button class="M-Btn" type="primary" @click="add()">新增 </el-button>
        </div>
        <el-table
        :data="tableData"
        border
        style="width: 100%" >
            <el-table-column
            prop="title"
            label="">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button type="text" @click="add(scope)" v-model="scope.row" size="small">编辑</el-button>
                    <el-button type="text" @click="deleteCollection(scope)" v-model="scope.row" size="small">删除</el-button>
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
    </div>
</template>

<script>
import './list.less'
export default {
    data() {
        var me = this;
        return {
            tableData: [],
            currentPage:1,
            total:0,
            pagesSize:5,
            pagesSizes:[5,10,20,30,40,50]
        }
    },
    created:function(){
      this.getData(this.currentPage,this.pagesSize);
    },
    methods: {
        getData(pageNo,pageSize){
            var me = this;
            this.$request({
                url:"/getCollectionList",
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
            var query = {};
            if(scope){
                query.id = scope.row.id
            }
            this.$router.push({path:"/collection",query:query})
        },
        tip(title,type,duration){
            this.$notify({
                title: title || '',
                type: type||'success',
                duration:duration||1000
            });

        },
        deleteCollection(scope){
            this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
            var me = this;
            var params={}
            params.id = scope.row.id
            if(me.loadDelete)return
            me.loadDelete = true;
            me.$request({
                url:"/deleteCollection",
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
    ,components:{
    }
  }

</script>