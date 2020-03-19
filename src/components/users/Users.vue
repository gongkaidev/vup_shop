<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            style="margin-left: 15px;"
            @click="dialogFormVisible = true"
          >添加用户</el-button>
          <el-dialog title="添加用户" :visible.sync="dialogFormVisible" :before-close="addFormClose">
            <el-form :model="addForm" :rules="addFormRules" ref="addForm" status-icon>
              <el-form-item label="用户名称" :label-width="formLabelWidth" prop="username">
                <el-input v-model="addForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="用户密码" :label-width="formLabelWidth" prop="password">
                <el-input v-model="addForm.password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                <el-input v-model="addForm.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
                <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeUserStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
                style="margin-left: 5px;"
              ></el-button>
            </el-tooltip>
            <el-dialog title="修改用户" :visible.sync="modifyFormVisible">
              <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyForm" status-icon>
                <el-form-item label="用户ID" :label-width="formLabelWidth" prop="id">
                  <el-input v-model="modifyForm.id" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" :label-width="formLabelWidth" prop="username">
                  <el-input v-model="modifyForm.username" autocomplete="off" :disabled="true"></el-input>
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
                <el-button type="primary" @click="modifyUserForm">确 定</el-button>
              </div>
            </el-dialog>
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
                style="margin-left: 5px;"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top" :hide-after="500">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="setRole(scope.$index, scope.row)"
                style="margin-left: 5px;"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱提交规则
    var checkEmail = (rule, value, callback) => {
      var regEmail = /^([a-zA-Z0-9_-])+@[a-zA-Z0-9_-]+\.([a-zA-Z]{2,4})$/
      if (!regEmail.test(value)) {
        return callback(new Error('请输入正确的邮箱地址'))
      }
      callback()
    }
    // 自定义手机号提交规则
    var checkMoblie = (rule, value, callback) => {
      var regMobile = /^1[0-9]{10}$/
      if (!regMobile.test(value)) {
        return callback(new Error('请输入11的手机号码'))
      }
      callback()
      // console.log(regMobile.test(value))
    }
    return {
      userList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      dialogFormVisible: false,
      modifyFormVisible: false,
      deleteFormVisible: false,
      formLabelWidth: '120px',
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度6到15个字符',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            validator: checkEmail,
            trigger: ['blur', 'change']
          }
        ],
        mobile: [{ validator: checkMoblie, trigger: ['blur', 'change'] }]
      },
      modifyForm: {},
      modifyFormRules: {
        email: [
          {
            validator: checkEmail,
            trigger: ['blur', 'change']
          }
        ],
        mobile: [{ validator: checkMoblie, trigger: ['blur', 'change'] }]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 监听pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      // console.log(`每页 ${val} 条`)
      // 重新获取数据
      this.getUserList()
    },
    // 监听页码值改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      // 重新获取数据
      this.getUserList()
    },
    // 修改用户信息
    async handleEdit(index, row) {
      const { data: res } = await this.$http.get('users/' + row.id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取不到该用户信息')
      }
      this.modifyForm = res.data
      this.modifyFormVisible = true
      console.log(this.modifyForm)
    },
    // 删除用户
    handleDelete(index, row) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete('users/' + row.id)
          this.getUserList()
          // console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {})
    },
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 修改用户状态
    async changeUserStatus(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
      console.log(res)
    },
    // 添加用户提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.dialogFormVisible = false
          const { data: res } = await this.$http.post('users', this.addForm)
          // console.log(res)
          if (res.meta.status !== 201) {
            return this.$message.error('创建用户失败')
          }
          this.$message.success('创建用户成功')
          this.getUserList()
        } else {
          console.log('创建用户失败!!')
          return false
        }
      })
    },
    addFormClose() {
      this.$refs.addForm.resetFields()
    },
    // 提交用户修改
    modifyUserForm() {
      this.$refs.modifyForm.validate(async valid => {
        if (valid) {
          this.modifyFormVisible = false
          const { data: res } = await this.$http.put(
            'users/' + this.modifyForm.id,
            {
              email: this.modifyForm.email,
              mobile: this.modifyForm.mobile
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error('修改用户信息失败')
          }
          this.$message.success('修改用户信息成功')
          this.getUserList()
          console.log(res)
        } else {
          console.log('修改用户失败!!')
          return false
        }
      })
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
