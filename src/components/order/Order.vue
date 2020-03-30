<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
            @clear="getOrderList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderList" border stripe style="width: 100%">
        <!-- 索引 -->
        <el-table-column type="index"></el-table-column>
        <!-- 表格头 -->
        <el-table-column prop="order_number" label="订单编号" width="300px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status!=='0'" type="success">付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="username" label="下单时间" width="200px">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              icon="el-icon-edit"
              @click="orderEdit(scope.$index, scope.row)"
              style="margin-left: 10px;"
            ></el-button>
            <el-button
              size="mini"
              type="info"
              plain
              icon="el-icon-location-outline"
              @click="showProcessBox"
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
          :page-sizes="[6,8,12,16]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 对话框 -->
    <el-dialog title="修改地址" :visible.sync="modifyVisible">
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyForm" status-icon>
        <el-form-item label="省市区县" label-width="120px" prop="address1">
          <el-cascader
            v-model="modifyForm.address1"
            :options="cityData"
            @close="addDialogClosed"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="120px" prop="address2">
          <el-input v-model="modifyForm.address2" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitmodifyForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="物流进度" :visible.sync="processVisible">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in processInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      // 物流信息
      processInfo: [],
      // 分页
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8
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
      orderList: [],
      // 修改数据
      modifyVisible: false,
      modifyForm: {
        address1: [],
        address2: ''
      },
      modifyFormRules: {
        address1: [
          { required: true, message: '请输入省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      processVisible: false
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      this.orderList = res.data.goods
      this.total = res.data.total
      // console.log(res)
    },
    submitAddForm() {
      // this.$refs.addForm
    },
    // 表格内修改功能
    async orderEdit(index, row) {
      const { data: res } = await this.$http.get('orders/' + row.order_id)
      console.log(res)
      this.modifyVisible = true
    },
    // 删除功能
    Delete(index, row) {},
    // 分页
    // 监听pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      // console.log(`每页 ${val} 条`)
      // 重新获取数据
      this.getOrderList()
    },
    // 监听页码值改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      // 重新获取数据
      this.getOrderList()
    },
    // 关闭对话框的表单
    addDialogClosed() {
      this.$refs.addForm.resetFields()
    },
    submitmodifyForm() {},
    async showProcessBox() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      this.processInfo = res.data
      console.log(res.data)
      this.processVisible = true
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
