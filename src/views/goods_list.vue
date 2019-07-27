<template>
  <div class="goods_list">
    <!-- 搜索框部分(包含添加商品按钮) -->
    <el-row style="margin-bottom:10px">
      <el-input
        placeholder="请输入内容"
        v-model="goodsPagination.query"
        style="width:300px"
        @keyup.enter.native="init"
      >
        <!-- 搜索按钮 -->
        <el-button slot="append" icon="el-icon-search" @click.native="init"></el-button>
      </el-input>
      <!-- 添加商品按钮 -->
      <el-button
        type="primary"
        round
        style="margin-left:10px"
        @click="showGoodsAdd"
      >添加商品</el-button>
    </el-row>

    <!-- 商品列表 -->
    <el-table :data="goodsList" style="width: 100%" border>
      <!-- 索引项 -->
      <el-table-column type="index" width="50" align="center" label="编号"></el-table-column>
      <!-- 商品名称项 -->
      <el-table-column label="商品名称" width="300" align="center">
        <template slot-scope="scope">{{ scope.row.goods_name }}</template>
      </el-table-column>
      <!-- 商品价格项 -->
      <el-table-column label="商品价格" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.goods_price }}</template>
      </el-table-column>
      <!-- 商品状态项 -->
      <el-table-column label="商品状态" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.goods_state | changeState }}</template>
      </el-table-column>
      <!-- 商品重量项 -->
      <el-table-column label="商品重量" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.goods_weight }}</template>
      </el-table-column>
      <!-- 创建时间项 -->
      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.upd_time | timeFormat('-',':') }}</template>
      </el-table-column>
      <!-- 操作项 -->
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button size="mini" type="success" @click="handleAudit(scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页显示部分 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsPagination.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="goodsPagination.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.goodsTotal"
    ></el-pagination>
  </div>
</template>

<script>

import { getGoodsData } from '../api/goods_axios.js'
import { changeTimeFormat } from '../utils/filters.js'

export default {
  data () {
    return {
      //   分页相关参数
      goodsPagination: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsTotal: 0,
      //  商品列表数据
      goodsList: [],
      //   添加商品弹出框是否展示参数
      dialogAddFormVisible: false,
      newTime: ''
    }
  },
  methods: {
    // 初始化商品列表函数
    async init () {
      let result = await getGoodsData(this.goodsPagination)
      //   console.log(result)
      if (result.data.meta.status === 200) {
        this.goodsList = result.data.data.goods
        this.goodsTotal = result.data.data.total
      }
    },

    // 分页相关函数
    handleSizeChange (val) {
      this.goodsPagination.pagesize = val
      console.log(this.getDate())
      this.init()
    },
    handleCurrentChange (val) {
      this.goodsPagination.pagenum = val
      this.init()
    },

    // 跳转到添加商品页面
    showGoodsAdd () {
      this.$router.push({ name: 'goods_add' })
    },

    // 编辑商品函数
    handleEdit (row) {},

    // 删除商品函数
    handleDelete (row) {},

    // 审核商品函数
    handleAudit (row) {}
  },

  //   将毫秒转换为日期格式
  filters: {
    timeFormat: changeTimeFormat,
    changeState (value) {
      if (value === 0) {
        return '未通过'
      } else if (value === 1) {
        return '审核中'
      } else if (value === 2) {
        return '已审核'
      }
    }
  },

  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
</style>
