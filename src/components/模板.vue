<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 查询和添加用户 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" style="margin-left: 15px;" @click="addVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="List" border stripe style="width: 100%">
        <!-- 索引 -->
        <el-table-column type="index"></el-table-column>
        <!-- 表格头 -->
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="Edit(scope.$index, scope.row)"
              style="margin-left: 10px;"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="Delete(scope.$index, scope.row)"
              style="margin-left: 10px;"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 对话框 -->
    <el-dialog title="添加用户" :visible.sync="addVisible" :before-close="addFormClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" status-icon>
        <el-form-item label="用户名称" label-width="120px" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分页
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      // 数据列表
      // 添加
      getAddList: [],
      addVisible: false,
      addForm: [],
      addFormRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 渲染列表
      List: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    async getList() {},
    submitAddForm() {
      // this.$refs.addForm
    },
    // 表格内修改功能
    async Edit(index, row) {},
    // 删除功能
    async Delete(index, row) {},

    // 分页
    // 监听pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      // console.log(`每页 ${val} 条`)
      // 重新获取数据
      this.getList()
    },
    // 监听页码值改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      // 重新获取数据
      this.getList()
    },
    // 关闭对话框的表单
    addFormClose() {
      this.$refs.addForm.resetFields()
    }
  }
}
</script>

<style lang="less">
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
