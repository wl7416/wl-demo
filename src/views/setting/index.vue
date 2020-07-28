<template>
  <div class="container-setting">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form label-width="120px">
            <el-form-item label="编号：">{{user.id}}</el-form-item>
            <el-form-item label="手机：">{{user.mobile}}</el-form-item>
            <el-form-item label="媒体名称：">
              <el-input v-model="user.name" placeholder="请输入媒体名称"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍：">
              <el-input v-model="user.intro" placeholder="请输入媒体介绍" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="user.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSetting()">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-upload
            class="avatar-uploader"
            action
            :http-request="uploadAvatar"
            :show-file-list="false"
          >
            <img v-if="user.photo" :src="user.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="text">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import eventBus from "@/eventBus";
import auth from "@/unitls/auth";
export default {
  name: "page-setting",
  data() {
    return {
      // 用户信息
      user: {
        name: "",
        intro: "",
        email: "",
        photo: "",
      },
      // 图片地址
      imageUrl: "",
    };
  },
  created() {
    this.getUserProfile();
  },
  methods: {
    // 选择图片后触发
    async uploadAvatar({ file }) {
      // console.log(infoObj) === {file:File就是图片文件对象}
      // 图片对应的file对象
      // 实例化formdata对象
      try {
        const formdata = new FormData();
        formdata.append("photo", file);
        // 自己通过axios上传图片
        const res = await this.$http.patch("user/photo", formdata);
        this.$message.success("修改头像成功");
        // 预览
        this.user.photo = res.data.data.photo;
        // 同步头像到Layout
        eventBus.$emit("updateUserPhoto", this.user.photo);
        // 同步头像到本地
        const localUser = auth.getUser();
        localUser.photo = this.user.photo;
        auth.setUser(localUser);
      } catch (e) {
        this.$message.error("修改头像失败");
      }
    },
    // 保存设置函数
    async saveSetting() {
      try {
        // 获取编辑的时候需要的三个字段
        const { name, intro, email } = this.user;
        // 发起编辑请求
        await this.$http.patch("user/profile", { name, intro, email });
        // 编辑资料成功
        this.$message.success("保存设置成功");
        // 同步用户名称给Layout组件
        eventBus.$emit("updateUserName", name);
        // 同步用户名称给本地存储
        // 获取信息
        const localUser = auth.getUser();
        // 修改信息
        localUser.name = name;
        // 保存信息
        auth.setUser(localUser);
      } catch (e) {
        if (e.response && e.response.status === 409) {
          this.$message.error("媒体名称已存在");
        } else {
          this.$message.error("保存设置失败");
        }
      }
    },
    // 获取个人资料
    async getUserProfile() {
      const res = await this.$http.get("user/profile");
      this.user = res.data.data;
    },
  },
};
</script>

<style lang="less" scoped>
.text {
  font-size: 12px;
  text-align: center;
}
</style>