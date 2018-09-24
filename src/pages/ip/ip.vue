<template>
    <div class="P-ip">
        <el-table
        :data="tableData"
        border
        style="width: 100%" >
            <el-table-column
            prop="ip"
            label="ip">
            </el-table-column>
            <el-table-column
            prop="requestName"
            label="请求名称">
            </el-table-column>
            <el-table-column
            prop="requestUrl"
            label="请求路径">
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
</template>
<script>
import './ip.less'
  export default {
    data() {
        var me = this;
        return {
            ips:[]
        }
    },
    data() {
      return {
        tableData: [],
        currentPage:1,
        total:0,
        pagesSize:5,
        pagesSizes:[5,10,20,30,40,50],
      }
    },
    created:function(){
      this.getData(this.currentPage,this.pagesSize);
    },
    methods: {
        getData(pageNo,pageSize){
            var me = this;
            this.$request({
                url:"/getIpAddress",
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
        
    }
  }
</script>