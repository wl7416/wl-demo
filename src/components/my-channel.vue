<template>
  <!-- 封装频道组件 -->
  <div class="container-channel">
    <!-- 频道组件 -->
    <el-select @change="selectClear" :value="value" clearable placeholder="请选择">
      <el-option v-for="item in channelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  // 父组件传值给子组件
  props: ["value"],
  name: "my-channel",
  data() {
    return {
      //  频道选项
      channelOptions: [],
    };
  },
  created() {
    this.getChannelOptions();
  },
  methods: {
    // 获取频道数据
    async getChannelOptions() {
      const res = await this.$http.get("channels");
      this.channelOptions = res.data.data.channels;
    },
    // 频道清空时 处理筛选时报错
    selectClear(val) {
      // console.log(val);----点击频道打印出该频道选项的id
      if (val === "") val = null;
      // 子传父组件
      this.$emit("input", val);
    },
  },
};
</script>

<style lang="less" scoped>
</style>