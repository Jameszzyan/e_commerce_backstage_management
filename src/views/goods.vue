<template>
  <div class="goods">
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/home/goods/goods'}">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 子组件部分（包括列表和新增） -->
    <router-view></router-view>
  </div>
</template>

<script>

export default {

}
</script>

<style lang="less">
</style>
