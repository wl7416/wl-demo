<template>
  <div class="container-comment">
    <el-card>
      <!-- 面包屑 -->
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <!-- 表格 -->
      <el-table :data="comments" style="width: 100%">
        <el-table-column prop="title" label="文章标题"></el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
        <el-table-column prop="comment_status" label="状态">
          <template slot-scope="scope">{{scope.row.comment_status? '已打开':'已关闭'}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="danger"
              v-if="scope.row.comment_status"
              @click="toggleStatus(scope.row)"
            >关闭评论</el-button>
            <el-button @click="toggleStatus(scope.row)" size="small" type="success" v-else>打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next, sizes"
        :total="total"
        style="margin-top:20px"
        @current-change="changePager"
        :page-sizes="[10,20,30,40,50]"
        @size-change="changeSize"
        :current-page="reqParams.page"
        :page-size="reqParams. per_page"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "page-comment",
  data() {
    return {
      // 关于文章
      reqParams: {
        page: 1,
        per_page: 10,
        // 获取文章的评论相关信息
        response_type: "comment",
      },
      // 评论数据
      comments: [],
      // 总条数
      total: 0,
    };
  },
  created() {
    this.getComment();
  },
  methods: {
    // 获取评论列表---其实就是文章列表 只是里面展示的方式变了
    async getComment() {
      const res = await this.$http.get("articles", { params: this.reqParams });
      this.comments = res.data.data.results;
      this.total = res.data.data.total_count;
    },
    // 分页
    changePager(newPage) {
      this.reqParams.page = newPage;
      this.getComment();
    },
    // 改变尺码
    changeSize(size) {
      this.reqParams.page = 1;
      this.reqParams.per_page = size;
      this.getComment();
    },
    // 点击打开或者关闭按钮--弹出对话框操作
    toggleStatus(row) {
      const text1 = "此操作会开启文章评论功能，您确认吗?";
      const text2 =
        "此操作会关闭该文章的评论功能，关闭后用户将无法对该文章进行评论，您确认吗？";
      const text = row.comment_status ? text2 : text1;
      this.$confirm(text, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$http({
              method: "put",
              url: "/comments/status",
              params: {
                article_id: row.id.toString(),
              },
              data: {
                allow_comment: row.comment_status,
              },
            });
            this.$message.success(row.comment_status ? "关闭成功" : "打开成功");
            row.comment_status = !row.comment_status;
          } catch (error) {
            this.$message.error(row.comment_status ? "关闭失败" : "打开失败");
          }
        })
        .catch(() => {
          //  点击取消不操作
        });
    },
  },
};
</script>

<style lang = "less" scoped>
</style>