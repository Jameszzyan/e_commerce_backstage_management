<template>
  <div class="home">
    <el-container>

      <!-- 左侧栏（包括logo和菜单栏） -->
      <el-aside width="auto">
        <div class="logo"></div>
        <el-menu
          :unique-opened="true"
          :router="true"
          :collapse="iscollapse"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="first.id + ''" v-for="first in menuList" :key="first.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{first.authName}}</span>
            </template>
            <el-menu-item :index="'/home/' + first.path + '/' + second.path" v-for="second in first.children" :key="second.id">
              <i class="el-icon-menu"></i>
              <span>{{second.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 包括页眉以及主要内容 -->
      <el-container>
        <!-- 页眉部分 -->
        <el-header>
          <span class="myicon myicon-menu toggle-btn" @click="iscollapse = !iscollapse"></span>
          <span class="system-title">电商后台管理系统</span>
          <a href="javascrpt:;" class="welcome">退出</a>
        </el-header>

        <!-- 主要内容（根据不同页面跳转路由渲染组件生成） -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getMenus } from '../api/home_axios'
export default {
  data () {
    return {
      iscollapse: false,
      menuList: []
    }
  },
  methods: {
    async init () {
      let result = await getMenus()
      // console.log(result)
      if (result.data.meta.status === 200) {
        this.menuList = result.data.data
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
.home {
  height: 100%;
  background-color:rgb(233, 238, 243);
  .el-menu {
    width: auto;
  }
  // 如果是展开状态,那么宽度就是200px,如果是合并状态,宽度:auto
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 600px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: black;
  }
}
</style>
