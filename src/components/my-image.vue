<template>
  <!-- 发布文章封面组件 -->
  <div class="myImage">
    <!-- 显示的图片按钮 -->
    <div class="img-list" @click="showDialog">
      <img :src="value || previewImg" alt />
    </div>
    <!-- 点击图片按钮显示的对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="720px">
      <!-- Tabs标签页   v-model="activeName"---于name属性有关-->
      <el-tabs v-model="activeName" type="card" style="margin-top:10px">
        <el-tab-pane label="素材库" name="images">
          <!-- 单选按钮组 -->
          <div class="btn-box">
            <el-radio-group @change="toggleRadio" v-model="reqFormData.collect" size="small">
              <el-radio-button :label="false">全部</el-radio-button>
              <el-radio-button :label="true">收藏</el-radio-button>
            </el-radio-group>
          </div>
          <!-- 图片列表 -->
          <div
            @click="coverImg(item.url)"
            :class="{'selected': imgSelect === item.url}"
            class="img-box"
            v-for="item in resultsImage"
            :key="item.id"
          >
            <img :src="item.url" alt />
          </div>
          <!-- 分页 -->
          <el-pagination
            @current-change="togglePage"
            :current-page="reqFormData.page"
            :page-size="reqFormData.per_page"
            background
            layout="prev, pager, next"
            :total="total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <!-- 上传组件 -->
          <el-upload
            :headers="header"
            name="image"
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :on-success="uploadSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入封装的关于用户信息的文件
import auth from "@/unitls/auth";
// 导入图片资源
import img from "../assets/default.png";
export default {
  name: "my-image",
  // 接受父组件传过来的封面图片
  props: ["value"],
  data() {
    return {
      // 控制对话框的显示与否---默认不显示
      dialogVisible: false,
      // Tabs默认选中项
      activeName: "images",
      // 查询图片素材时需要携带的参数
      reqFormData: {
        // 收藏与否 默认没收藏
        collect: false,
        // 页数
        page: 1,
        // 每页数量
        per_page: 8,
      },
      // 图片数据
      resultsImage: [],
      // 总条数
      total: 0,
      // 请求头
      header: {
        Authorization: `Bearer ${auth.getUser().token}`,
      },
      // 上传图片显示的图片
      imageUrl: null,
      // 图片遮罩层
      imgSelect: null,
      previewImg: img,
    };
  },
  methods: {
    // 点击确认时-----也需要校验图片
    confirmImg() {
      if (this.activeName == "images") {
        if (!this.imgSelect) return this.$message.warning("请选择一张图片");
        // this.previewImg = this.imgSelect;
        // 给父组件传图片数据
        this.$emit("input", this.imgSelect);
      } else if (this.activeName == "upload") {
        if (!this.imageUrl) return this.$message.warning("请上传图片");
        // this.previewImg = this.imageUrl;
        // 给父组件传图片数据
        this.$emit("input", this.imageUrl);
      }
      // 选择/上传了图片后 点击确定关闭对话框
      this.dialogVisible = false;
      // 触发自定义事件
      this.$emit("confirm");
    },
    // 点击图片选中时的遮罩层
    coverImg(img) {
      this.imgSelect = img;
    },
    // 上传图片成功
    uploadSuccess(response) {
      // 预览
      this.imageUrl = response.data.url;
      // 提示
      this.$message.success("上传图片成功");
    },
    // 切换全部和收藏
    toggleRadio() {
      this.reqFormData.page = 1;
      this.getImages();
    },
    // 切换分页
    togglePage(newPage) {
      this.reqFormData.page = newPage;
      // 刷新列表
      this.getImages();
    },
    // 获取图片素材渲染在页面
    async getImages() {
      const res = await this.$http.get("user/images", {
        params: this.reqFormData,
      });
      this.resultsImage = res.data.data.results;
      this.total = res.data.data.total_count;
    },
    // 显示对话框
    showDialog() {
      this.dialogVisible = true;
      this.getImages();
      // 让对话框默认显示素材库
      this.activeName = "images";
      // 清空上次选中的图片
      this.imgSelect = null;
      // 清空上次上传的图片
      this.imageUrl = null;
    },
  },
};
</script>

<style lang = "less" scoped>
.myImage {
  display: inline-block;
  margin-top: 15px;
  .img-list {
    width: 150px;
    height: 150px;
    border: 1px dashed #ddd;
    margin-right: 15px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .img-box {
    position: relative;
    display: inline-block;
    margin-top: 15px;
    margin-right: 15px;
    width: 150px;
    height: 120px;
    &.selected::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 150px;
      height: 120px;
      background: rgba(0, 0, 0, 0.3) url(../assets/selected.png) no-repeat
        center/45px auto;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  ::v-deep .el-dialog__header {
    padding: 0 20px;
  }

  ::v-deep .avatar-uploader {
    margin-top: 30px;
  }
}
</style>