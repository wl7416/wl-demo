<template>
  <div class="container-article">
    <el-card>
      <!-- 头部 -->
      <!-- 面包屑 -->
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>

      <el-form label-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <!-- <my-channel :value="reqParams.channel_id" @input="reqParams.channel_id = $event"></my-channel> -->
          <!-- 简写 -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
          <!-- -抽离出去了--封装为组件 -->
          <!-- <el-select
            @change="selectClear"
            clearable
            v-model="reqParams.channel_id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            @change="changeDate"
            value-format="yyyy-MM-dd"
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 内容筛选 -->
    <el-card style="margin-top:20px">
      <div slot="header">
        <span>根据筛选条件共查询到 {{total}} 条结果：</span>
      </div>
      <el-table :data="articles" fit>
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image style="width:180px;height:120px" :src="scope.row.cover.images[0]">
              <!-- 每有图片是显示的 -->
              <div slot="error" class="image-slot">
                <img style="width:180px;height:120px" src="../../assets/error.gif" alt />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" style="width:400px"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              @click="toEdit(scope.row.id)"
              type="primary"
              plain
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="delArticle(scope.row.id)"
              type="danger"
              plain
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:20px"
        @current-change="changePager"
        :current-page="reqParams.page"
        :page-size="reqParams. per_page"
        background
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "page-article",

  data() {
    return {
      reqParams: {
        // 状态
        status: null,
        // 频道
        channel_id: null,
        // 日期范围
        begin_pubdate: "",
        end_pubdate: "",
        // 页数
        page: 1,
        // 每页条数
        per_page: 10,
      },
      // 饿了没-ui 支持的日期范围数据
      time: [],
      // 文章列表
      articles: [],
      // // 频道选项
      // channelOptions: [],
      // 总条数
      total: 0,
    };
  },
  created() {
    this.getArticlesData();
    // this.getChannelOptions();
  },
  methods: {
    // 获取文章数据
    async getArticlesData() {
      const res = await this.$http.get("articles", { params: this.reqParams });
      // console.log(res);
      this.articles = res.data.data.results;
      this.total = res.data.data.total_count;
    },
    // // 获取频道数据---抽离出去了
    // async getChannelOptions() {
    //   const res = await this.$http.get("channels");
    //   this.channelOptions = res.data.data.channels;
    // },
    // 获取当前页--切换分页
    changePager(newPage) {
      this.reqParams.page = newPage;
      this.getArticlesData();
    },
    // // 频道清空时 处理筛选时报错---抽离出去了
    // selectClear(val) {
    //   if (val === "") return (this.reqParams.channel_id = null);
    // },
    // 处理时间
    changeDate(arrTime) {
      this.reqParams.begin_pubdate = arrTime[0];
      this.reqParams.end_pubdate = arrTime[1];
    },
    // 筛选
    search() {
      this.reqParams.page = 1;
      this.getArticlesData();
    },
    // 编辑
    toEdit(id) {
      this.$router.push({ path: "/publish", query: { id } });
    },
    // 删除
    delArticle(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$http.delete(`articles/${id}`);
            this.$message.success("删除文章成功");
            // 删除成功就要刷新文章列表
            this.getArticlesData();
          } catch (error) {
            this.$message.error("删除文章失败");
          }
        })
        .catch(() => {
          //  点击取消不需要任何操作
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
