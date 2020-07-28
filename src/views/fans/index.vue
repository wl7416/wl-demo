<template>
  <div class="container-fans">
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="list">
          <div class="list-img">
            <div class="item-img" v-for="item in fans" :key="item.id.toString()">
              <el-avatar :size="80" :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <el-button type="primary" size="small" plain>+ 关注</el-button>
            </div>
          </div>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            style="margin-top:20px"
            @current-change="changePager"
            :current-page="reqParams.page"
            :page-size="reqParams. per_page"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="img">
          <!-- echarts盒子 -->
          <div ref="bar" style="width:600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// 引入echarts图表
import echarts from "echarts";
export default {
  name: "page-fans",
  data() {
    return {
      reqParams: {
        page: 1,
        per_page: 24,
      },
      //tabs默认显示的
      activeName: "list",
      // 粉丝总数
      fans: [],
      // 总条数
      total: 0,
    };
  },
  created() {
    this.getFans();
  },
  mounted() {
    this.initBar();
  },
  methods: {
    // 分页
    changePager(newPage) {
      this.reqParams.page = newPage;
      this.getFans();
    },
    // 获取粉丝列表
    async getFans() {
      const res = await this.$http.get("followers", { params: this.reqParams });
      this.total = res.data.data.total_count;
    },
    // 设置echarts图表
    // 初始化柱状图
    async initBar() {
      try {
        // 初始化echarts
        const mychart = echarts.init(this.$refs.bar);
        const option = {
          color: ["#3398DB"],
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: [
            {
              name: "直接访问",
              type: "bar",
              barWidth: "60%",
              data: [10, 52, 200, 334, 390, 330, 220],
            },
          ],
        };
        // 需要获取数据--给option数据赋值
        const res = await this.$http.get("statistics/followers");
        const obj = res.data.data.age;
        const xAxisData = [];
        const seriesData = [];
        for (const key in obj) {
          xAxisData.push(key);
          seriesData.push(obj[key]);
        }
        option.xAxis[0].data = xAxisData;
        option.series[0].data = seriesData;
        // 使用这个配置
        mychart.setOption(option);
      } catch (error) {
        this.$message.error("网络不好，请刷新再试");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.list-img {
  .item-img {
    display: inline-block;
    width: 100px;
    height: 170px;
    margin-top: 20px;
    margin-right: 50px;
    text-align: center;
    border: 1px dashed #ddd;
    padding-top: 10px;
    p {
      font-size: 14px;
    }
  }
}
</style>