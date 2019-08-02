<template>
  <!-- 头部提示 -->
  <div class="goods_add">
    <div class="add_header">添加商品信息</div>

    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success" style="margin-bottom:30px">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>

    <!-- 添加项标签页 -->
    <el-tabs
      tab-position="left"
      v-model="activeName"
      :before-leave="handleLeave"
      @tab-click="active=Number(activeName)"
    >
      <!-- 步骤一 -->
      <el-tab-pane label="基本信息" name="0" style="padding-top:10px">
        <!-- 商品基本信息表单 -->
        <el-form :model="goodsBaseForm" ref="goodsBaseForm" :rules="rules" label-width="120px">
          <!-- 商品名称项 -->
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="goodsBaseForm.goods_name"></el-input>
          </el-form-item>
          <!-- 商品价格项 -->
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="goodsBaseForm.goods_price"></el-input>
          </el-form-item>
          <!-- 商品重量项 -->
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="goodsBaseForm.goods_weight"></el-input>
          </el-form-item>
          <!-- 商品数量项 -->
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="goodsBaseForm.goods_number"></el-input>
          </el-form-item>

          <!-- 商品分类项 -->
          <el-form-item label="商品分类">
            <el-cascader
              v-model="selected"
              :options="category_options"
              :props="{ expandTrigger: 'hover' ,value:'cat_id',label:'cat_name'}"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>

          <!-- 是否促销项 -->
          <el-form-item label="是否促销">
            <el-radio value="true" label="是" v-model="onSale" border></el-radio>
            <el-radio value="false" label="否" v-model="onSale" border></el-radio>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 步骤二 -->
      <el-tab-pane label="商品参数" name="1" style="padding-top:10px">
        <el-row :gutter="20" v-for="(first,index) in dynamicAttrList" :key="first.attr_id" style="margin-bottom:10px">
          <el-col :span="2">
            <el-tag style="font-size:14px;height:40px;line-height:40px">
              {{first.attr_name}}
              <span>:</span>
            </el-tag>
          </el-col>
          <el-col :span="22">
            <el-checkbox-group v-model="dynamicOutputAttrList[index].attr_vals">
              <el-checkbox :label="second" v-for="(second,index) in first.attr_vals"
              :key="index" border style="margin-bottom:5px;background-color:rgb(236, 245, 255)"></el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <!-- 当没有动态属性时进行提醒 -->
        <div v-show="dynamicShow">该商品分类没有动态属性</div>
      </el-tab-pane>
      <!-- 步骤三 -->
      <el-tab-pane label="商品属性" name="2" style="padding-top:10px">
        <!-- 商品静态属性表单 -->
        <el-form label-width="200px">
          <el-form-item
            :label="value.attr_name + ' :'"
            v-for="value in staticAttrList"
            :key="value.attr_id"
          >
            <el-input v-model="value.attr_vals"></el-input>
          </el-form-item>
        </el-form>
        <!-- 当没有动态属性时进行提醒 -->
        <div v-show="staticShow">该商品分类没有静态属性</div>
      </el-tab-pane>
      <!-- 步骤四 -->
      <el-tab-pane label="商品图片" style="padding-left:100px" name="3">
        <!-- 图片上传 -->
        <el-upload
          class="upload-demo"
          action="http://127.0.0.1:8888/api/private/v1/upload"
          :headers="getToken()"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-upload="handleBeforeUpload"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">点击上传文件</div>
        </el-upload>
      </el-tab-pane>
      <!-- 步骤五 -->
      <el-tab-pane label="商品内容" name="4" style="padding-top:10px">
        <!-- 富文本框项 -->
        <quill-editor v-model="goodsBaseForm.goods_introduce"></quill-editor>
        <!-- 确定和取消相关操作 -->
        <div style="margin-top:10px">
          <el-button @click="goBackToList">取 消</el-button>
          <el-button type="primary" @click="addGoods">确 定</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  getAllCategories,
  getAttrs,
  addGoodsData
} from '../api/goods_axios.js'

export default {
  data () {
    return {
      // 步骤条状态
      active: 0,
      // 标签页状态
      activeName: '0',
      //   商品基本信息
      goodsBaseForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      //   是否促销参数
      onSale: '',
      //   商品基本信息填写验证规则
      rules: {
        goods_name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '商品价格不能为空', trigger: 'blur' },
          {
            pattern: /^\d*[.]?\d+$/,
            message: '商品价格只能为数字',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          { required: true, message: '商品重量不能为空', trigger: 'blur' },
          {
            pattern: /^\d*[.]?\d+$/,
            message: '商品重量只能为数字,默认单位为kg',
            trigger: 'blur'
          }
        ],
        goods_number: [
          { required: true, message: '商品数量不能为空', trigger: 'blur' },
          {
            pattern: /^\d*[.]?\d+$/,
            message: '商品数量只能为数字',
            trigger: 'blur'
          }
        ]
      },
      //   所有商品分类数据
      category_options: [],
      //  选择的商品分类数据
      selected: [],
      // 动态属性列表
      dynamicAttrList: [],
      dynamicShow: false,
      staticShow: false,
      // 用于传送的动态属性列表
      attrsSendList: [],
      // 获取用户选择的动态属性的列表
      dynamicOutputAttrList: [],

      // 静态属性列表
      staticAttrList: [],
      // 用于传送的静态属性列表
      staticOutputAttrList: []
    }
  },

  methods: {
    //   将所有分类渲染到级联表
    async initCategories () {
      let result = await getAllCategories()
      console.log(result)
      if (result.data.meta.status === 200) {
        this.category_options = result.data.data
      }
    },
    // 选中的商品分类数据
    handleChange (selected) {
      var str = ''
      selected.forEach(item => {
        str = str + item + ','
      })
      this.goodsBaseForm.goods_cat = str.substring(0, str.length - 1)
    },

    // 标签页切换函数
    handleLeave (activeName, oldActiveName) {
      if (oldActiveName === '0') {
        var just = true
        this.$refs['goodsBaseForm'].validate(valid => {
          if (valid) {
            if (this.selected.length === 0) {
              this.$message({
                type: 'error',
                message: '需要选择商品分类'
              })
              just = false
            }
          } else {
            this.$message({
              type: 'error',
              message: '请完善你的商品信息'
            })
            just = false
          }
        })
        return just
      }
    },

    // 图片上传相关函数
    getToken () {
      var token = sessionStorage.getItem('token')
      return { Authorization: token }
    },
    handleRemove (file, fileList) {
      this.goodsBaseForm.pics = []
      fileList.forEach(item => {
        var obj = {}
        obj.pic = item.response.data.tmp_path
        this.goodsBaseForm.pics.push(obj)
      })
    },
    handleSuccess (response, file, fileList) {
      // console.log(response)
      if (response.meta.status === 200) {
        var obj = {}
        obj.pic = response.data.tmp_path
        this.goodsBaseForm.pics.push(obj)
      }
    },
    handleBeforeUpload (file) {
      if (file.type.indexOf('image/') !== 0) {
        this.$message.error('请上传图片格式')
        return false
      }
    },

    // 跳转回去商品列表
    goBackToList () {
      this.$router.push({
        name: 'goods_list'
      })
    },

    // 将新增的商品相关数据发送给后台进行添加
    async addGoods () {
      this.goodsBaseForm.attrs = [
        ...this.attrsSendList,
        ...this.staticOutputAttrList
      ]
      // console.log(this.goodsBaseForm)
      let result = await addGoodsData(this.goodsBaseForm)
      if (result.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: '商品添加成功'
        })
        this.$router.push({
          name: 'goods_list'
        })
      }
    }
  },

  watch: {
    // 当商品分类变化时更新动态和静态属性
    selected (val) {
      if (this.selected.length !== 0) {
        var id = this.selected[this.selected.length - 1]
        // 动态属性获取
        getAttrs(id, 'many').then(result => {
          // console.log(result)
          if (result.data.meta.status === 200) {
            this.dynamicOutputAttrList = []
            this.dynamicShow = false
            this.dynamicAttrList = result.data.data
            this.dynamicAttrList.forEach((item, index) => {
              item.attr_vals = item.attr_vals.split(',')
              var arr = []
              var obj = {}
              obj.attr_id = item.attr_id
              obj.attr_vals = arr
              this.dynamicOutputAttrList.push(obj)
            })
            console.log(this.dynamicAttrList)
            // this.attrsSendList = [...this.dynamicOutputAttrList]
            this.attrsSendList = JSON.parse(JSON.stringify(this.dynamicOutputAttrList))
            this.attrsSendList.forEach((item) => {
              item.attr_vals = ''
            })
            // console.log(this.dynamicOutputAttrList[0].attr_vals)
            if (this.dynamicAttrList.length === 0) {
              this.dynamicShow = true
            }
          }
        })
        // 静态属性获取
        getAttrs(id, 'only').then(result => {
          // console.log(result)
          if (result.data.meta.status === 200) {
            this.staticShow = false
            this.staticAttrList = result.data.data
            if (this.staticAttrList.length === 0) {
              this.staticShow = true
            }
          }
        })
      }
    },

    // 当商品动态属性变化时进行更新
    dynamicOutputAttrList: {
      handler (newValue, oldValue) {
        this.dynamicOutputAttrList.forEach((item, index) => {
          var str = ''
          item.attr_vals.forEach((item) => {
            str += item + ','
          })
          this.attrsSendList[index].attr_vals = str.substring(0, str.length - 1)
        })
        // console.log(this.attrsSendList)
      },
      deep: true
    },

    // 当商品静态属性变化时更新
    staticAttrList (val) {
      this.staticOutputAttrList = []
      val.forEach(item => {
        var obj = {}
        obj.attr_id = item.attr_id
        obj.attr_value = item.attr_vals
        this.staticOutputAttrList.push(obj)
      })
    }
  },

  mounted () {
    this.initCategories()
    this.dynamicShow = true
    this.staticShow = true
    // console.log(this.$route)
  },

  updated () {

  }
}
</script>

<style lang="less">
.add_header {
  font-size: 16px;
  padding-left: 20px;
  margin-bottom: 20px;
  background-color: rgb(215, 226, 239);
  height: 50px;
  line-height: 50px;
}
</style>
