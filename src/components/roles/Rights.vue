<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
        :data="rightsList.slice((pagenum-1)*pagesize,pagenum*pagesize)"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="权限路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level=='0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level=='1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level=='2'">三级</el-tag>
            <!-- <el-tag :type="gradeType[scope.row.level]">{{ grade[scope.row.level]}}</el-tag> -->
            <!-- <span>{{scope.row['level']}}</span> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[8, 10, 12, 16]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="48"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
      type: 'list',
      grade: {
        0: '一级',
        1: '二级',
        2: '三级'
      },
      gradeType: {
        0: '',
        1: 'success',
        2: 'warning'
      },
      pagesize: 8,
      pagenum: 1
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取用户列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/' + this.type)
      this.rightsList = res.data
      // console.log(res.data)
    },
    // 监听pagesize 改变的事件
    handleSizeChange(newSize) {
      this.pagesize = newSize
      // console.log(`每页 ${val} 条`)
      // 重新获取数据
      this.getRightsList()
    },
    // 监听页码值改变
    handleCurrentChange(val) {
      this.pagenum = val
      // 重新获取数据
      this.getRightsList()
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
