<template>
    <div class="P-ip">
        <div class="M-search">
            <el-input v-model="search.pageName" placeholder="页面"></el-input>
            <el-input v-model="search.productName" placeholder="商品"></el-input>
            <el-button  type="primary" size="large" class="M-Btn" @click="searchData">搜索</el-button>
        </div>
        <el-table
        :data="tableData"
        border
        style="width: 100%" >
            <el-table-column
            prop="ip"
            label="ip">
            </el-table-column>
            <el-table-column
            prop="pageName"
            label="页面">
            </el-table-column>
            <el-table-column
            prop="productName"
            label="商品">
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="创建时间">
                <template slot-scope="scope">
                {{scope.row.createTime|timeStr}}
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
        search:{
            pageName:"",
            productName:""
        }
      }
    },
    created:function(){
      this.getData(this.currentPage,this.pagesSize);
    },
    methods: {
        getData(pageNo,pageSize,qr){
            var me = this;
            this.$request({
                url:"/getIpAddress",
                method:"get",
                query:{
                pageNo:pageNo,
                pageSize:pageSize,
                pageName:(qr&&qr.pageName) ||'',
                productName:(qr&&qr.productName)||''
                }
            }).then(function(re){
                me.tableData = re.items;
                me.currentPage = re.pageNo;
                me.pagesSize = re.pageSize;
                me.total = re.total;
            })
        },
        handleSizeChange(val) {
            this.getData(this.currentPage,val,this.search);
        },
        handleCurrentChange(val) {
            this.getData(val,this.pagesSize,this.search);
        },
        searchData(){
            this.currentPage =1;
            this.getData(1,this.pagesSize,this.search);
        }
    }
  }
</script>