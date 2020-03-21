<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="60">
        <el-col :span="4" :push="18">
          <el-button
            type="primary"
            style="margin-left: 15px;"
            @click="dialogFormVisible = true"
          >添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
              :class="['bottom',index1==0?'top ':'']"
            >
              <!-- 一级标题 -->
              <el-col :span="6">
                <el-tag
                  closable
                  @close="removeRoleById(scope.row,item1.id)"
                  :disable-transitions="true"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级 三级标题 -->
              <el-col :span="18">
                <el-row
                  :key="item2.id"
                  v-for="(item2,index2) in item1.children"
                  :class="[index2==0?'':'top']"
                >
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRoleById(scope.row,item2.id)"
                      :disable-transitions="true"
                    >{{item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag
                      :key="item3.id"
                      v-for="(item3) in item2.children"
                      type="warning"
                      closable
                      @close="removeRoleById(scope.row,item3.id)"
                      :disable-transitions="true"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
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
            <el-button
              size="mini"
              type="warning"
              @click="setRight(scope.$index, scope.row)"
              style="margin-left: 10px;"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="修改角色" :visible.sync="modifyFormVisible">
      <el-form :model="modifyForm" ref="modifyForm" status-icon>
        <el-form-item label="角色ID" :label-width="formLabelWidth" prop="roleId">
          <el-input v-model="modifyForm.roleId" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="modifyForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="modifyForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyUserForm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="setRightVisible" @close="clearCheckedRoleList">
      <el-tree
        :data="rightList"
        show-checkbox
        default-expand-all
        :props="defaultProps"
        node-key="id"
        ref="tree"
        :default-checked-keys="checkedRoleList"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightForm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
      <el-form :model="addForm" ref="addForm" status-icon>
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      rightList: [],
      roleId: 0,
      checkedRoleList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      dialogFormVisible: false,
      modifyFormVisible: false,
      deleteFormVisible: false,
      setRightVisible: false,
      formLabelWidth: '120px',
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      modifyForm: {}
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 移除角色权限
    async removeRoleById(role, rightId) {
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      // console.log(res)
      role.children = res.data
    },
    // 修改用户信息
    async handleEdit(index, row) {
      const { data: res } = await this.$http.get('roles/' + row.id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取不到该用户信息')
      }
      this.modifyForm = res.data
      this.modifyFormVisible = true
      // console.log(this.modifyForm)
    },
    // 删除用户
    async handleDelete(index, row) {
      await this.$http.delete('roles/' + row.id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getRoleList()
    },
    // 清空已选中的选项框
    clearCheckedRoleList() {
      this.checkedRoleList = []
    },
    // 分配权限
    async setRight(index, row) {
      const { data: res } = await this.$http.get('rights/tree')
      this.rightList = res.data
      this.roleId = row.id
      this.getTreeKeys(row, this.checkedRoleList)
      this.setRightVisible = true
      console.log(this.roleId)
      console.log(row)

      // 三层for循环过于麻烦
      // for (var item1 in row.children) {
      //   for (var item2 in row.children[item1].children) {
      //     for (var item3 in row.children[item1].children[item2].children) {
      //       this.checkedRoleList.push(
      //         row.children[item1].children[item2].children[item3].id
      //       )
      //     }
      //   }
      // this.checkedRoleList.push(row.children[item1].id)
      // }
      // console.log(this.checkedRoleList)
    },
    // 通过递归的形式，获取角色下所有三级权限的id,并保存到defKeys数组中
    getTreeKeys(node, arr) {
      // 如果没有children 则是第三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getTreeKeys(item, arr))
    },
    async setRightForm() {
      const idKeys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]

      const idStr = idKeys.join(',')

      await this.$http.post(`roles/${this.roleId}/rights`, {
        roldId: this.roleId,
        rids: idStr
      })
      this.getRoleList()
      this.setRightVisible = false
      // console.log(res)
    },
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      this.roleList = res.data
      // console.log(res)
    },
    // 添加角色提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.dialogFormVisible = false
          const { data: res } = await this.$http.post('roles', this.addForm)
          console.log(res)
          if (res.meta.status !== 201) {
            return this.$message.error('添加角色失败')
          }
          this.$message.success('添加角色成功')
          this.addForm.roleName = ''
          this.addForm.roleDesc = ''
          this.getRoleList()
        } else {
          console.log('添加角色失败!!')
          return false
        }
      })
    },
    // 提交用户修改
    modifyUserForm() {
      this.$refs.modifyForm.validate(async valid => {
        if (valid) {
          this.modifyFormVisible = false
          const { data: res } = await this.$http.put(
            'roles/' + this.modifyForm.roleId,
            {
              roleName: this.modifyForm.roleName,
              roleDesc: this.modifyForm.roleDesc
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error('修改用户信息失败')
          }
          this.$message.success('修改用户信息成功')
          this.getRoleList()
          // console.log(res)
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
  display: flex;
  align-items: center;
}
.block {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
  display: inline-block;
}
.top {
  border-top: 1px solid #eee;
}
.bottom {
  border-bottom: 1px solid #eee;
}
</style>
