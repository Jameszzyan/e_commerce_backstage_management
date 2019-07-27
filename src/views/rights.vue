<template>
  <div class="right_lsit">
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/home/rights/rights'}">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 权限列表部分 -->
     <el-table :data="rightList" style="width: 100%" border>
         <!-- 索引项 -->
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <!-- 权限名称项 -->
        <el-table-column label="权限名称" width="180" align="center">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.authName }}</el-tag>
          </template>
        </el-table-column>
        <!-- 路径项 -->
        <el-table-column label="路径" width="180" align="center">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.path }}</el-tag>
          </template>
        </el-table-column>
        <!-- 层级项 -->
        <el-table-column label="层级" width="180" align="center">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.level | levelFormat }}</el-tag>
          </template>
        </el-table-column>
     </el-table>
  </div>
</template>

<script>

import { getAllRights } from '../api/role_axios.js'

export default {
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    async init () {
    //   返回所有权限数据
      let result = await getAllRights()
      /* console.log(result) */
      if (result.data.meta.status === 200) {
        this.rightList = result.data.data
      }
    }
  },
  filters: {
    //   根据返回的权限等级进行格式转换
    levelFormat (val) {
      if (val === '0') {
        return '层级一'
      } else if (val === '1') {
        return '层级二'
      } else if (val === '2') {
        return '层级三'
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
