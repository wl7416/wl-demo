<template>
  <div class="container-publish">
    <el-card>
      <!-- 面包屑插件 -->
      <div slot="header">
        <my-bread>{{$route.query.id?'修改文章':'发布文章'}}</my-bread>
      </div>
      <el-form
        label-width="120px"
        :model="articleForm"
        :rules="rulesarticleForm"
        ref="articleFormEle"
      >
        <el-form-item label="标题:" prop="title">
          <el-input v-model=" articleForm.title" placeholder="请输入文章标题" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <!-- 富文本插件使用 -->
          <quill-editor @blur="deitorRules" v-model="articleForm.content" :options="editorOption" />
        </el-form-item>
        <el-form-item label="封面:" prop="cover.type">
          <el-radio-group @change="articleForm.cover.images=[]" v-model="articleForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 封面组件 -->
          <!-- 测试封面组件-----测试代码 -->
          <!-- <div style="margin-top:20px">
          <! <my-image :value="testImgUrl" @input="testImgUrl = $event"></my-image>-->
          <!-- <my-image v-model="testImgUrl"></my-image>
          </div>-->
          <!-- 选中上传单图时 -->
          <div style="margin-top:20px" v-if="articleForm.cover.type === 1">
            <my-image @confirm="checkCover" v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <!-- 选中上传三图时 -->
          <div style="margin-top:20px" v-if="articleForm.cover.type === 3">
            <my-image
              @confirm="checkCover"
              v-for="i in 3"
              :key="i"
              v-model="articleForm.cover.images[i-1]"
            ></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道:" prop="channel_id">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="$route.query.id">
          <el-button type="success" @click="editArticle">修改文章</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="saveArticle(false)">发布文章</el-button>
          <el-button @click="saveArticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入富文本及其样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  // 局部注册富文本
  components: {
    quillEditor,
  },
  name: "page-publish",
  data() {
    // 自定义封面图项数的校验
    const validCoverFn = (rule, value, callback) => {
      const reulsImg = this.articleForm.cover.images;
      // 单图校验
      if (value === 1) {
        if (reulsImg[0] && reulsImg.length == 1) {
          callback();
        } else {
          callback(new Error("请选择一张封面图"));
        }
      } else if (value === 3) {
        // 三图校验
        if (reulsImg[0] && reulsImg[1] && reulsImg[2]) {
          callback();
        } else {
          callback(new Error("请选择三张封面图"));
        }
      } else {
        callback();
      }
    };
    return {
      // 测试关于封面图组件之间传值
      // testImgUrl: null,

      // 文章表单数据对象
      articleForm: {
        // 标题
        title: null,
        // 内容
        content: null,
        //频道
        channel_id: null,
        // 关于封面
        cover: {
          type: 1,
          // 发布文章需要的图片
          images: [],
        },
      },
      // form表单的校验
      rulesarticleForm: {
        // 标题校验
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          {
            min: 5,
            max: 8,
            message: "长度在 5 到 8 个字符",
            trigger: "blur",
          },
        ],
        // 内容的校验
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
        // 封面图片类型的校验
        "cover.type": [{ validator: validCoverFn, trigger: "change" }],
        // 频道校验
        channel_id: [
          { required: true, message: "请选择文章频道", trigger: "change" },
        ],
      },

      // 富文本配置项
      editorOption: {
        placeholder: "请输入文章内容",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            ["image"],
          ],
        },
      },
    };
  },
  created() {
    //如果是编辑文章
    if (this.$route.query.id) {
      this.getArticle();
    }
  },
  watch: {
    // 侦听地址栏的变化--当点击编辑文章到发布文章页面--在点击发布文章 --会有编辑文章遗留的数据 --应该是干净的页面才可以
    "$route.query.id": function () {
      if (this.$route.query.id) {
        // 如果路径上存在id 表示是编辑页面过来的--需要获取对应的编辑的数据并渲染在页面
        this.getArticle();
      } else {
        // 是发布文章页面 需要重置表单 清空表单+重新校验
        this.$refs.articleFormEle.resetFields();
        // 因为图片是复杂数据 此时无法用饿了没组件中的方法直接重置表单 需要手动清除
        this.articleForm.cover.images = [];
      }
    },
  },
  methods: {
    // 点击修改文章
    editArticle() {
      // 整体表单校验
      this.$refs.articleFormEle.validate(async (valid) => {
        if (valid) {
          try {
            // 进行修改请求
            await this.$http.put(
              `articles/${this.$route.query.id}?draft=false`,
              this.articleForm
            );
            this.$message.success("修改文章成功");
            this.$router.push("/article");
          } catch (e) {
            this.$message.error("修改文章失败");
          }
        }
      });
    },
    // 编辑文章操作----获取文章+填充表单
    async getArticle() {
      const res = await this.$http.get(`articles/${this.$route.query.id}`);
      // console.log(res);
      this.articleForm = res.data.data;
    },
    // 点击发布文章/存入草稿--先进行表单整体校验
    saveArticle(draft) {
      this.$refs.articleFormEle.validate(async (valid) => {
        try {
          if (valid) {
            // 调用接口发布文章
            await this.$http.post(
              `articles?draft = ${draft}`,
              this.articleForm
            );
            // 提示成功
            this.$message.success(draft ? "存入草稿成功" : "发布文章成功");
            // 跳转路径
            this.$router.push("/article");
          }
        } catch (error) {
          this.$message.error(draft ? "存入草稿失败" : "发布文章失败");
        }
      });
    },
    // 失去焦点触发富文本校验
    deitorRules() {
      this.$refs.articleFormEle.validateField("content");
    },
    // 校验图片
    checkCover() {
      this.$refs.articleFormEle.validateField("cover.type");
    },
  },
};
</script>

<style lang="less" scoped>
.container-publish {
  ::v-deep .ql-editor {
    height: 250px;
  }
  ::v-deep .ql-toolbar.ql-snow {
    padding: 0 8px;
  }
}
</style>