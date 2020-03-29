<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert :title="title" type="info" show-icon center :closable="false"></el-alert>
      <el-steps :active="activeName-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="goodsForm" :rules="goodsRules" ref="goodsForm" label-position="top">
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeName"
          :before-leave="tabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name" width="180px"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsForm.goods_price" style="width:'10px'" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodsForm.goods_number" width="180px" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" width="180px" type="number">
              <el-input v-model="goodsForm.goods_weight" width="180px"></el-input>
            </el-form-item>
            <!-- 商品分类级联选择器 -->
            <el-form-item label="商品分类" prop="goods_cat" width="180px">
              <!-- options是数据 props是设置 -->
              <el-cascader
                v-model="goodsForm.goods_cat"
                :options="goodsCatList"
                @change="catChange"
                :props="catProps"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in goodsParams">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="vars" v-for="(vars,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in goodsProps" :key="item.attr_id">
              <el-input v-model="item.attr_vals" width="180px"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              list-type="picture"
              :on-preview="handlePreview"
              :headers="headerObj"
              :on-success="addPic"
              :on-remove="removePic"
            >
              <el-button type="primary" size="small" :file-list="fileList">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">点击文件名实现预览</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="goodsForm.goods_introduce" />
            <el-button type="primary" class="btnAdd" @click="finish">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      tabPosition: 'left',
      title: '添加商品信息',
      activeName: '0',
      // 商品添加表单
      goodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 商品添加表单检验规则
      goodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类级联选择器
      goodsCatList: [],
      catProps: {
        value: 'cat_id',
        label: 'cat_name',
        chidren: 'children',
        expandTrigger: 'hover'
      },
      // 商品参数
      goodsParams: [],
      // 商品属性
      goodsProps: [],
      // 图片上传
      fileList: [{ name: '', url: '' }],
      dialogImageUrl: '',
      dialogVisible: false,
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created() {
    this.getGoodsCat()
  },
  methods: {
    // tabClick() {
    //   this.active = parseInt(this.activeName)
    // }
    // 获取商品分类
    async getGoodsCat() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.goodsCatList = res.data
    },
    // 选中分类
    catChange() {
      if (this.goodsForm.goods_cat.length !== 3) {
        this.goodsForm.goods_cat = []
      }
      console.log(this.goodsForm.goods_cat)
    },
    // 切换tab
    tabLeave(activeName, oldActiveName) {
      if ((oldActiveName = ' 0' && this.goodsForm.goods_cat.length !== 3)) {
        this.$message.error('请先完成基本信息')
        return false
      }
      // console.log(activeName, oldActiveName)
    },
    // 切换tab
    async tabClick() {
      if (this.activeName === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.catId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        })
        this.goodsParams = res.data
      }
      if (this.activeName === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.catId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        this.goodsProps = res.data
        console.log(this.goodsProps)
        // console.log(this.newGoodsParams)
      }
    },
    // 图片预览
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 使榜单绑定pic参数
    addPic(response) {
      const picObj = { pic: response.data.tmp_path }
      this.goodsForm.pics.push(picObj)
      console.log(this.goodsForm)
    },
    removePic(file) {
      const filePath = file.response.data.tmp_path
      const index = this.goodsForm.pics.findIndex(item => item.pic === filePath)
      this.goodsForm.pics.splice(index, 1)
      console.log(this.goodsForm.pics)
    },
    finish() {
      this.$refs.goodsForm.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        const form = _.cloneDeep(this.goodsForm)
        form.goods_cat = form.goods_cat.join(',')
        this.goodsParams.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(',')
          }
          this.goodsForm.attrs.push(newInfo)
        })
        this.goodsProps.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals
          }
          this.goodsForm.attrs.push(newInfo)
        })
        form.attrs = this.goodsForm.attrs
        // console.log(form)
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        console.log(res)
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    catId() {
      if (this.goodsForm.goods_cat.length === 3) {
        return this.goodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less">
.el-steps {
  margin: 30px 0 40px;
}
.el-checkbox {
  margin: 5px 5px;
}
.ql-editor {
  min-height: 300px;
}
.btnAdd {
  margin: 10px 10px;
}
</style>
