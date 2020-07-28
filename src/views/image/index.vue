<template>
  <div class="container-image">
    <el-card>
      <!-- 面包屑插件 -->
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 单选按钮 和按钮区域-->
      <div class="btn-box">
        <el-radio-group @change="toggleList" v-model="reqFormData.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button @click="addImages" type="success" size="small" style="float:right">添加素材</el-button>
      </div>
      <!-- 列表区域 -->
      <div class="list-box">
        <div class="item-box" v-for="item in resultsImage" :key="item.id">
          <img :src="item.url" alt />
          <div class="option" v-if="!reqFormData.collect">
            <span
              @click="selectCollect(item)"
              class="el-icon-star-off"
              :class="{'red':item.is_collected}"
            ></span>
            <span @click="delImages(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        @current-change="changePage"
        :current-page="reqFormData.page"
        :page-size="reqFormData.per_page"
        background
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 点击添加素材时应该弹出的对话框 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <!-- 上传组件 -->
      <!-- 饿了没-ui--通过 action来发送请求 不是通过axios发送请求的---此时地址也要写全因为全局适配的地址是对于axios来说的 -->
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        name="image"
        :headers="header"
        :on-success="uploadSuccess"
        :show-file-list="false"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
// 导入封装的关于用户信息的文件
import auth from "@/unitls/auth";
export default {
  name: "page-image",
  data() {
    return {
      // 查询图片素材时需要携带的参数
      reqFormData: {
        // 收藏与否 默认没收藏
        collect: false,
        // 页数
        page: 1,
        // 每页数量
        per_page: 10,
      },
      // 图片素材相关信息
      resultsImage: [],
      // 总条数
      total: 0,
      // 控制对话框显示与否的数据--默认不显示
      dialogVisible: false,
      // 上传的图片
      imageUrl: null,
      // 上传图片是需要携带请求头因为是饿了没-ui自身的组件在发送请求
      header: {
        Authorization: `Bearer ${auth.getUser().token}`,
      },
    };
  },
  created() {
    this.getImages();
  },
  methods: {
    // 获取图片素材渲染在页面
    async getImages() {
      const res = await this.$http.get("user/images", {
        params: this.reqFormData,
      });
      this.resultsImage = res.data.data.results;
      this.total = res.data.data.total_count;
    },
    // 切换分页
    changePage(newPage) {
      this.reqFormData.page = newPage;
      this.getImages();
    },
    // 全部与收藏选框的切换
    toggleList() {
      this.reqFormData.page = 1;
      this.getImages();
    },
    // 判断收藏--因为收藏与取消收藏是同一个小星星 点击时需要在原本状态下取反
    async selectCollect(item) {
      const is_collectedReserve = !item.is_collected;
      try {
        await this.$http.put(`user/images/${item.id}`, {
          // 点击时取反
          collect: is_collectedReserve,
        });
        // 红色样式点击时取反
        item.is_collected = is_collectedReserve;
        // 收藏成功/取消收藏时的提示
        this.$message.success(
          is_collectedReserve ? "收藏图片成功" : "取消收藏成功"
        );
      } catch (erroe) {
        this.$message.error(
          is_collectedReserve ? "收藏图片失败" : "取消收藏图片失败"
        );
      }
    },
    // 删除图片素材
    delImages(id) {
      this.$confirm("小可爱是要永久删除该图片吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            // 点击确定调用接口删除图片刷新页面
            await this.$http.delete(`user/images/${id}`);
            // 刷新列表
            this.getImages();
            this.$message.success("删除图片成功");
          } catch (error) {
            this.$message.error("删除图片失败");
          }
        })
        .catch(() => {
          // 点击取消不需要任何操作
        });
    },
    // 点击添加素材
    addImages() {
      // 弹出对话框
      this.dialogVisible = true;
      // 再次打开时内容是清空的
      this.imageUrl = null;
    },
    // 上传图片成功时的回调函数
    uploadSuccess(response) {
      // 提示
      this.imageUrl = response.data.url;
      this.$message.success("上传图片成功");
      // 3秒过后关闭弹窗----刷新列表
      window.setTimeout(() => {
        this.dialogVisible = false;
        this.getImages();
      }, 3000);
    },
  },
};
</script>

<style lang="less" scoped>
.list-box {
  margin-top: 20px;
  .item-box {
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    width: 180px;
    height: 180px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .option {
      position: absolute;
      width: 100%;
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: #fff;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>