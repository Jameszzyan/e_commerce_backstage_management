<template>
    <div class="login">
        <div class="container">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <img src="../assets/avatar.jpg" alt="" class="avatar">
                 <el-form-item prop="username">
                     <el-input v-model="ruleForm.username" placeholder="请输入用户名" prefix-icon="myicon myicon-user"></el-input>
                 </el-form-item>
                  <el-form-item prop="password">
                     <el-input type="password" v-model="ruleForm.password" placeholder="请输入用户密码" prefix-icon="myicon myicon-key"></el-input>
                 </el-form-item>
                  <el-form-item>
                     <el-button type="primary" class="login-btn" @click='getAdminData("ruleForm")'>登录</el-button>
                  </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

import { sendAdminData } from '../api/admin_axios'

export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: { required: true, message: '请输入用户名', trigger: 'blur' },
        password: { required: true, message: '请输入密码', trigger: 'blur' }
      }
    }
  },
  methods: {
    getAdminData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          sendAdminData(this.ruleForm).then((result) => {
            if (result.data.meta.status === 200) {
              // 将后台传过来的token值以vuex的形式存储
              var token = result.data.data.token
              sessionStorage.setItem('token', token)
              this.$store.dispatch('token/storeTokenCommit', token)
              /*   this.$message({
                message: '恭喜你成功登录！',
                type: 'success'
              }) */
              this.$router.push({
                name: 'home'
              })
            } else {
              this.$message({
                message: '登陆失败，请重新输入',
                type: 'error'
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.$message({
            message: '用户或者密码不能为空',
            type: 'error'
          })
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      margin-bottom: 30px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
