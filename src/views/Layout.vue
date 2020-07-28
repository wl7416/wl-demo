<template>
  <el-container class="container-layout">
    <!-- 左侧区域 -->
    <el-aside :width="isOpen?'200px':'77px'">
      <div class="logo" :class="{'logomin':!isOpen,}"></div>
      <el-menu
        router
        style="border:none"
        :collapse="!isOpen"
        :collapse-transition="false"
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        background-color="#002233"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <span
          class="icon"
          :class="{' el-icon-s-fold':isOpen,'el-icon-s-unfold':!isOpen}"
          @click="isOpen=!isOpen"
        ></span>
        <span class="text">自媒体项目</span>
        <el-dropdown @command="clickItem">
          <span>
            <img class="head" :src="userInfo.photo" alt />
            <span class="name">{{userInfo.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="setting" icon="el-icon-setting">个人设置</el-dropdown-item>
            <el-dropdown-item command="logout" icon="el-icon-unlock">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <!-- 下部欢迎界面 -->
      <!-- 二级路由对应的组件渲染区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Auth from "@/unitls/auth";
import eventBus from "@/eventBus";
export default {
  name: "layout",
  data() {
    return {
      isOpen: true,
      userInfo: {
        name: "",
        photo: "",
      },
    };
  },
  created() {
    let { name, photo } = Auth.getUser();
    this.userInfo = { name, photo };
    eventBus.$on("updateUserName", (data) => {
      this.userInfo.name = data;
    });
    eventBus.$on("updateUserPhoto", (data) => {
      this.userInfo.photo = data;
    });
  },
  methods: {
    clickItem(command) {
      if (command === "setting") {
        this.$router.push("/setting");
      } else if (command === "logout") {
        // 删除用户信息
        Auth.delUser();
        // 返回登录页面
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container-layout {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-aside {
    background: #002233;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url("../assets/03.png") no-repeat center / 130px auto;
    }
    .logomin {
      background-image: url("../assets/logo_admin_01.png");
      background-size: 36px auto;
    }
  }
  .el-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .icon {
      font-size: 24px;
      vertical-align: middle;
    }
    .text {
      margin-left: 10px;
      vertical-align: middle;
    }
    .el-dropdown {
      float: right;
      .head {
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      .name {
        font-weight: 700;
        color: #333;
        vertical-align: middle;
        margin-left: 5px;
      }
    }
  }
}
</style>