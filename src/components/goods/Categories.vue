<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="4">
          <div>
            <el-button type="primary" style="margin-left: 15px;" @click="getParentCatlist">添加分类</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 使用原版table-tree -->
      <!-- <el-table
        :data="catList"
        border
        stripe
        :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
        style="width: 100%"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="cat_id"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-check"
              circle
              v-if="!scope.row.cat_deleted"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-error"
              circle
              v-if="scope.row.cat_deleted"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level=='0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.cat_level=='1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.cat_level=='2'">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              style="margin-left: 10px;"
            ></el-button>

            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
              style="margin-left: 10px;"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>-->

      <!-- 新依赖vue -table -tree -->
      <!-- 表格 -->
      <tree-table
        index-text="#"
        :data="catList"
        :columns="columns"
        tree-type
        :expand-type="false"
        :selection-type="false"
        show-index
        border
        :show-row-hover="false"
      >
        <template slot="valid" slot-scope="scope">
          <i class="el-icon-success" style="color:lightgreen;" v-if="!scope.row.cat_deleted"></i>
          <i class="el-icon-error" style="color:red;" v-if="scope.row.cat_deleted"></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level=='0'">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level=='1'">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level=='2'">三级</el-tag>
        </template>
        <template slot="settings" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
            style="margin-left: 10px;"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
            style="margin-left: 10px;"
          ></el-button>
        </template>
      </tree-table>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5,10,15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- <el-dialog title="修改分类" :visible.sync="modifyFormVisible">
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyForm" status-icon>
        <el-form-item label="分类ID" :label-width="formLabelWidth" prop="id">
          <el-input v-model="modifyForm.id" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="Catname">
          <el-input v-model="modifyForm.Catname" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="modifyForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="modifyForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyCatForm">确 定</el-button>
      </div>
    </el-dialog>-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatFormVisible"
      width="50%"
      @close="addCatDialogClear"
    >
      <el-form
        :model="addCatForm"
        ref="addCatForm"
        :rules="addCatFormRules"
        status-icon
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCatForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父类分类:">
          <el-cascader
            v-model="selectedkeys"
            :options="parentCatList"
            :props="catProps"
            @change="parentCatChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCatFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFormCat">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catList: [],
      // 分页 当前页 每页显示数量
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      CatInfo: {},
      roleList: [],
      // 对话框显示状态
      modifyFormVisible: false,
      deleteFormVisible: false,
      addCatFormVisible: false,
      addOtherVisible: false,
      formLabelWidth: '120px',
      addCatForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      parentCatList: [],
      addCatFormRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      modifyForm: {},
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'valid'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'settings'
        }
      ],
      catProps: {
        value: 'cat_id',
        label: 'cat_name',
        chidren: 'children',
        expandTrigger: 'hover',
        checkStrictly: 'true'
      },
      selectedkeys: []
    }
  },
  created() {
    this.getCatList()
  },
  methods: {
    // 监听pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      // console.log(`每页 ${val} 条`)
      // 重新获取数据
      this.getCatList()
    },
    // 监听页码值改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      // 重新获取数据
      this.getCatList()
    },
    // 提交分类修改
    modifyCatForm() {
      this.$refs.modifyForm.validate(async valid => {
        if (valid) {
          this.modifyFormVisible = false
          const { data: res } = await this.$http.put(
            'Cats/' + this.modifyForm.id,
            {
              email: this.modifyForm.email,
              mobile: this.modifyForm.mobile
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error('修改分类信息失败')
          }
          this.$message.success('修改分类信息成功')
          this.getCatList()
          console.log(res)
        } else {
          console.log('修改分类失败!!')
          return false
        }
      })
    },
    // 修改分类信息
    async handleEdit(index, row) {
      const { data: res } = await this.$http.get('Cats/' + row.id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取不到该分类信息')
      }
      this.modifyForm = res.data
      this.modifyFormVisible = true
      console.log(this.modifyForm)
    },
    // 删除分类
    handleDelete(index, row) {
      this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete('Cats/' + row.id)
          this.getCatList()
          // console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {})
    },
    // 获取分类列表
    async getCatList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status === 200) {
        this.catList = res.data.result
        this.total = res.data.total
        console.log(res.data.result)
      }
    },
    // 获取添加用户的父级数据
    async getParentCatlist() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCatList = res.data
      this.addCatFormVisible = true
      console.log(res)
    },
    parentCatChange() {
      if (this.selectedkeys.length > 0) {
        this.addCatForm.cat_pid = this.selectedkeys[
          this.selectedkeys.length - 1
        ]
        this.addCatForm.cat_level = this.selectedkeys.length
        console.log(this.selectedkeys)
      } else {
        this.addCatForm.cat_pid = 0
        this.addCatForm.cat_level = 0
      }
    },
    // 提交分类表单
    submitFormCat() {
      this.$refs.addCatForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCatForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('创建分类失败')
        }
        this.$message.success('创建分类成功')
        this.getCatList()
        this.addCatFormVisible = false
      })
    },
    addCatDialogClear() {
      this.$refs.addCatForm.resetFields()
      this.selectedkeys = []
      this.addCatForm.cat_pid = 0
      this.addCatForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  padding: 15px;
  margin-top: 25px;
}
.el-row {
  margin-bottom: 15px;
}
.block {
  margin-top: 15px;
}
</style>
