<template>
  <div class="user_list">
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/home/users/users'}">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框部分(包含添加用户按钮) -->
    <el-row style="margin-bottom:10px">
      <el-input
        placeholder="请输入内容"
        v-model="userCheck.query"
        style="width:300px"
        @keyup.enter.native="getData"
      >
        <!-- 搜索按钮 -->
        <el-button slot="append" icon="el-icon-search" @click.native="getData"></el-button>
      </el-input>
      <!-- 添加用户按钮 -->
      <el-button
        type="primary"
        round
        style="margin-left:10px"
        @click="dialogAddFormVisible=true"
      >添加用户</el-button>
    </el-row>

    <!-- 用户信息表格部分 -->
    <el-table :data="userList" style="width: 100%" border>
      <!-- 索引项 -->
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <!-- 用户名 -->
      <el-table-column label="用户名" width="180" align="center">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.username }}</el-tag>
        </template>
      </el-table-column>
      <!-- 邮箱项 -->
      <el-table-column label="邮箱" width="300" align="center">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.email }}</el-tag>
        </template>
      </el-table-column>
      <!-- 电话项 -->
      <el-table-column label="电话" width="250" align="center">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.mobile }}</el-tag>
        </template>
      </el-table-column>
      <!-- 状态项 -->
      <el-table-column label="状态" width="180" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatus(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- 操作项 -->
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button size="mini" type="success" @click="handleAllot(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页显示部分 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userCheck.pagenum"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="userCheck.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.relatedData.total"
    ></el-pagination>

    <!-- 添加用户弹出框部分 -->
    <el-dialog title="添加用户" :visible.sync="dialogAddFormVisible">
      <el-form :model="addForm" ref="addForm" :rules="rules">
        <!-- 用户名项 -->
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码项 -->
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 邮箱项 -->
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <!-- 手机号码项 -->
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 确定和取消相关操作 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户弹出框部分 -->
    <el-dialog title="编辑用户" :visible.sync="dialogEditFormVisible">
      <el-form :model="editForm" ref="editForm" :rules="rules">
        <!-- 用户名项(禁止编辑) -->
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!-- 邮箱项 -->
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <!-- 手机号码项 -->
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 确定和取消相关操作 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser('editForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 角色分配弹出框部分 -->
    <el-dialog title="角色分配" :visible.sync="dialogRoleFormVisible">
      <el-form :model="roleForm" ref="roleForm" :rules="rules" :label-width="formLabelWidth">
        <!-- 用户名项(禁止编辑) -->
        <el-form-item label="用户名">
          <el-input v-model="roleForm.username" disabled></el-input>
        </el-form-item>
        <!-- 角色分配项 -->
        <el-form-item label="角色分配">
          <el-select clearable placeholder="请选择" v-model="roleForm.rid">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 确定和取消相关操作 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="userAllot">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 获取用户相关信息的接口方法
import {
  getUserListData,
  addUserData,
  editUserData,
  changeUserStatus,
  deleteUser
} from '../api/admin_axios.js'

// 获取角色相关信息的接口方法
import { getAllRoleData, changeRole } from '../api/role_axios.js'

export default {
  data () {
    return {
      // 用户信息存储数组
      userList: [],
      // 分页相关数据
      userCheck: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      // 分页页数以及数据总数
      relatedData: {},
      // 弹出添加框是否展示参数
      dialogAddFormVisible: false,
      // 绑定弹出框表单的相关内容
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 弹出编辑框是否展示参数
      dialogEditFormVisible: false,
      // 编辑对应用户的相关数据
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 弹出角色分配框是否展示参数
      dialogRoleFormVisible: false,
      roleForm: {
        username: '',
        id: '',
        rid: ''
      },
      // 下拉列表角色分配数据
      roleOptions: [],
      // 表单标签的宽度
      formLabelWidth: '120px',
      // 添加弹出框表单输入验证
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          {
            pattern: /^\w+[@]\w+[.]\w+$/gi,
            message: '请输入正确格式的邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '电话号码不能为空', trigger: 'blur' },
          {
            pattern: /^[1][35678]\d{9}$/,
            message: '请输入11位的合法电话号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 分页器相关函数
    handleSizeChange (val) {
      this.userCheck.pagesize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.userCheck.pagenum = val
      this.getData()
    },

    // 发送添加用户数据
    addUser (formName) {
      this.dialogAddFormVisible = false
      this.$refs[formName].validate(valid => {
        if (valid) {
          addUserData(this.addForm)
            .then(result => {
              console.log(result)
              if (result.data.meta.status === 201) {
                this.$message({
                  message: '新用户添加成功',
                  type: 'success'
                })
                this.getData()
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$message({
            message: '新用户添加失败',
            type: 'error'
          })
          return false
        }
      })
    },

    // 编辑用户展示按钮相关函数
    handleEdit (row) {
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.dialogEditFormVisible = true
    },
    // 发送编辑完成的用户数据到后台进行更新
    editUser (formName) {
      this.dialogEditFormVisible = false
      this.$refs[formName].validate(valid => {
        if (valid) {
          editUserData(this.editForm)
            .then(result => {
              /* console.log(result) */
              if (result.data.meta.status === 200) {
                this.$message({
                  message: '用户信息编辑成功',
                  type: 'success'
                })
                this.getData()
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$message({
            message: '用户信息编辑失败',
            type: 'error'
          })
          return false
        }
      })
    },

    // 更改用户的状态（访问权限）
    changeStatus (id, status) {
      changeUserStatus(id, status)
        .then(result => {
          /* console.log(result) */
          if (result.data.meta.status === 200) {
            this.$message({
              message: '用户状态修改成功',
              type: 'success'
            })
            this.getData()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 删除按钮相关函数
    handleDelete (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser(id)
            .then(result => {
              /* console.log(result) */
              if (result.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                if (
                  this.userList.length === 1 &&
                  this.userCheck.pagenum !== 1
                ) {
                  this.userCheck.pagenum--
                }
                this.getData()
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 分配角色展示按钮相关函数
    handleAllot (row) {
      this.roleForm.username = row.username
      this.roleForm.id = row.id
      getAllRoleData().then(result => {
        console.log(result)
        if (result.data.meta.status === 200) {
          // console.log(result)
          this.roleOptions = result.data.data
          if (row.rid !== null) {
            this.roleForm.rid = row.rid
          } else {
            this.roleForm.rid = ''
          }
        }
      })
      this.dialogRoleFormVisible = true
    },

    // 分配角色确认按钮相关函数
    userAllot () {
      if (!this.roleForm.rid) {
        this.$message({
          message: '请选择角色名称',
          type: 'error'
        })
      } else {
        changeRole(this.roleForm)
          .then(result => {
            if (result.data.meta.status === 200) {
              this.$message({
                message: '角色分配成功',
                type: 'success'
              })
              this.dialogRoleFormVisible = false
              this.getData()
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },

    // 获取分页数据方法
    getData () {
      getUserListData(this.userCheck)
        .then(result => {
          console.log(result)
          if (result.data.meta.status === 200) {
            this.userList = result.data.data.users
            this.relatedData = result.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },

  mounted () {
    this.getData()
  }
}
</script>

<style lang="less">
</style>
