<template>
  <div class="role_lsit">
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/home/rights/roles'}">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加角色按钮 -->
    <el-row>
      <el-button type="primary" @click.native="dialogAddRoleVisible=true">添加角色</el-button>
    </el-row>

    <!-- 角色列表 -->
    <el-table :data="roleList" style="width: 100%" border>
      <!-- 展开项 -->
      <el-table-column type="expand" width="50" align="center">
        <template slot-scope="scope">
          <el-row :gutter="20" v-for="(first,firstIndex) in scope.row.children" :key="first.id">
            <!-- 一级权限 -->
            <el-col :span="3">
              <el-tag
                type="success"
                @close="deleteRight(scope.row.id,first.id,scope.$index,firstIndex)"
                closable
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="1">
              <i class="el-icon-arrow-right" style="font-size:30px"></i>
            </el-col>
            <el-col :span="20">
              <!-- 需要用el-row包裹最后二级和三级权限 -->
              <el-row :gutter="20" v-for="(second,secondIndex) in first.children" :key="second.id">
                <!-- 二级权限 -->
                <el-col :span="3">
                  <el-tag
                    type="info"
                    @close="deleteRight(scope.row.id,second.id,scope.$index,firstIndex,secondIndex)"
                    closable
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="1">
                  <i class="el-icon-arrow-right" style="font-size:30px"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag
                    type="warning"
                    v-for="(third,thirdIndex) in second.children"
                    :key="third.id"
                    style="margin:0px 5px 10px 0px"
                    @close="deleteRight(scope.row.id,third.id,scope.$index,firstIndex,secondIndex,thirdIndex)"
                    closable
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">
              <div style="text-align:center">尚未进行权限授权</div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引项 -->
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <!-- 角色名称项 -->
      <el-table-column label="角色名称" width="180" align="center">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.roleName }}</el-tag>
        </template>
      </el-table-column>
      <!-- 角色描述项 -->
      <el-table-column label="角色描述" width="500" align="center">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.roleDesc }}</el-tag>
        </template>
      </el-table-column>
      <!-- 操作项 -->
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button size="mini" type="success" @click="handleAllot(scope.row)">授权角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色弹出框部分 -->
    <el-dialog title="添加角色" :visible.sync="dialogAddRoleVisible">
      <el-form :model="addRole" ref="addRole" :rules="rules">
        <!-- 角色名称项 -->
        <el-form-item label="角色名称" label-width="120px" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <!-- 角色描述项 -->
        <el-form-item label="角色描述" label-width="120px" prop="roleDesc">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 确定和取消相关操作 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleData('addRole')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色弹出框部分 -->
    <el-dialog title="添加角色" :visible.sync="dialogEditRoleVisible">
      <el-form :model="editRole" ref="editRole">
        <!-- 角色名称项 -->
        <el-form-item label="角色名称" label-width="120px" prop="roleName">
          <el-input v-model="editRole.roleName"></el-input>
        </el-form-item>
        <!-- 角色描述项 -->
        <el-form-item label="角色描述" label-width="120px" prop="roleDesc">
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 确定和取消相关操作 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleData">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 授权角色弹出框部分 -->
    <el-dialog title="授权角色" :visible.sync="dialogAuthorizeRoleVisible">
      <!-- 树状图展示编辑的权利 -->
      <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        ref="rightTree"
        default-expand-all
        :default-checked-keys="rightIds"
        :props="defaultProps"
      ></el-tree>
      <!-- 确定和取消相关操作 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAuthorizeRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="authorizeRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllRoleData,
  deleteUserRight,
  addRoleInfo,
  getRoleDataById,
  updateRoleData,
  deleteRole,
  getAllRightsInDegree,
  updateRoleRights
} from '../api/role_axios.js'

export default {
  data () {
    return {
      //   角色相关权限汇总
      roleList: [],
      //   弹出添加角色是否展示参数
      dialogAddRoleVisible: false,
      //   角色添加绑定对象
      addRole: {},
      //   弹出编辑角色是否展示参数
      dialogEditRoleVisible: false,
      //   角色编辑绑定对象
      editRole: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      //   角色添加验证相关规则
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      },
      //  弹出授权角色是否显示参数
      dialogAuthorizeRoleVisible: false,
      // 所有权限列表
      rightList: [],
      // 角色对应权限id数组
      rightIds: [],
      // 角色id
      roleId: '',
      // 树状图相关参数
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },

  methods: {
    // 初始化角色列表方法
    async init () {
      let result = await getAllRoleData()
      // console.log(result)
      if (result.data.meta.status === 200) {
        this.roleList = result.data.data
      }
    },

    // 删除角色对应授权
    async deleteRight (id, rid, index, first, second, third) {
      let result = await deleteUserRight(id, rid)
      /* console.log(result) */
      if (result.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '权限删除成功!'
        })
        if (arguments.length === 4) {
          this.roleList[index].children.splice(first, 1)
        } else if (arguments.length === 5) {
          this.roleList[index].children[first].children.splice(second, 1)
        } else if (arguments.length === 6) {
          this.roleList[index].children[first].children[second].children.splice(
            third,
            1
          )
        }
      }
    },

    // 添加角色相关函数
    addRoleData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addRoleInfo(this.addRole).then(result => {
            /* console.log(result) */
            if (result.data.meta.status === 201) {
              this.$message({
                type: 'success',
                message: '新角色添加成功!'
              })
              this.dialogAddRoleVisible = false
              this.init()
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '用户名称或者用户描述有误，请重新输入'
          })
          return false
        }
      })
    },

    // 编辑角色相关信息
    async handleEdit (id) {
      this.dialogEditRoleVisible = true
      let result = await getRoleDataById(id)
      if (result.data.meta.status === 200) {
        this.editRole.roleName = result.data.data.roleName
        this.editRole.roleDesc = result.data.data.roleDesc
        this.editRole.id = result.data.data.roleId
      }
    },

    // 发送编辑完成的角色数据到后台进行更新
    editRoleData () {
      if (this.editRole.roleName && this.editRole.roleDesc) {
        updateRoleData(this.editRole)
          .then(result => {
            if (result.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '角色编辑完成'
              })
              this.dialogEditRoleVisible = false
              this.init()
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$message({
          type: 'error',
          message: '角色名称或者描述不能为空'
        })
      }
    },

    // 删除角色
    handleDelete (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRole(id)
            .then(result => {
              /* console.log(result) */
              if (result.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.init()
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

    // 寻找对象中层级三所有属性为id的值
    getIdValue (arr) {
      var original = this
      arr.forEach(function (item) {
        item.children.forEach(function (item) {
          if (item.children) {
            item.children.forEach(function (item) {
              original.rightIds.push(item.id)
            })
          }
        })
      })
    },

    // 授权角色弹出框展示
    async handleAllot (row) {
      let result = await getAllRightsInDegree()
      if (result.data.meta.status === 200) {
        this.rightList = result.data.data
        this.roleId = row.id
        this.rightIds = []
        this.getIdValue(row.children)
        // console.log(this.rightList)
        // console.log(this.rightIds)
      }
      this.dialogAuthorizeRoleVisible = true
    },

    // 更改角色权限
    async authorizeRole () {
      var rightArray = this.$refs.rightTree.getCheckedKeys()
      var str = ''
      if (rightArray.length !== 0) {
        str += rightArray[0]
        for (var i = 1; i < rightArray.length; i++) {
          str += ',' + rightArray[i]
        }
        var fatherRightArray = this.$refs.rightTree.getHalfCheckedKeys()
        fatherRightArray.forEach(function (item) {
          str += ',' + item
        })
      }
      // console.log(rightArray)
      // console.log(str)
      let result = await updateRoleRights(this.roleId, str)
      if (result.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '更改角色权限成功'
        })
      }
      this.dialogAuthorizeRoleVisible = false
      this.init()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
</style>
