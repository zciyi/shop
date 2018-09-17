<template>
    <div class="P-campaign">
      <div class="addBtn M-Con-left" >
          <el-button type="primary"  class="M-Btn"  @click="add()">新增 </el-button>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%" >
        <el-table-column
        prop="picture"
        label="图片">
          <template slot-scope="scope">
              <img  :src="scope.row.picture" v-if="scope.row.picture" class="pic">
          </template>
        </el-table-column>
        <el-table-column
        prop="title"
        label="标题">
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
    </div>
</template>

<script>
import './campaign.less'
  export default {
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
            url:"/getCampaignList",
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
          this.$router.push({path:"/campaignEdit",query:query})
      }
    }
  }
</script>