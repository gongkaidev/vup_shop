<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <el-row>
        选择商品分类:
        <el-cascader
          v-model="selectedkeys"
          :options="catList"
          :props="catProps"
          @change="CatChange"
        ></el-cascader>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            style="margin-bottom: 10px;"
            size="small"
          >添加参数</el-button>
          <el-table :data="manyTableData" style="width: 100%" border stripe>
            <!-- 下拉标签页 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disabled-transitions="false"
                  @close="handleClose(scope.row,tag)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
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
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            style="margin-bottom: 10px;"
            size="small"
          >添加属性</el-button>
          <el-table :data="onlyTableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disabled-transitions="false"
                  @close="handleClose(scope.row,tag)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagTnput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scrop.row)"
                >+New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
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
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // el-cascader
      catList: [],
      catProps: {
        value: 'cat_id',
        label: 'cat_name',
        chidren: 'children',
        expandTrigger: 'hover'
      },
      selectedkeys: [],
      // el-tab
      activeName: 'many',
      // el-table
      manyTableData: [],
      onlyTableData: [],
      // el-table-expend
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getCat()
  },
  methods: {
    // 获取商品分类
    async getCat() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      // console.log(res)
      this.$message.success('获取父级分类数据成功')
      this.catList = res.data
    },
    // 级联选择框发生变动
    CatChange() {
      if (this.selectedkeys.length !== 3) {
        this.selectedkeys = []
        return
      }
      this.getCatParams()
      // console.log(this.catId)
    },
    // 根据id获取分类参数
    async getCatParams() {
      const { data: res } = await this.$http.get(
        `categories/${this.catId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类参数失败')
      }
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }

      // this.dynamicTags = res.data[0].attr_vals.split(',')
      // console.log(this.dynamicTags)
      // console.log(res.data[0])
      // console.log(res)
    },
    // 标签页的点击切换
    handleClick() {
      this.getCatParams()
    },
    // 表格的删除修改操作
    handleEdit(index, row) {},
    handleDelete(index, row) {},
    // 表格expend的tag标签
    handleClose(row, tag) {
      row.attr_vals.splice(row.attr_vals.indexOf(tag), 1)
      this.setAttrVals(row)
      console.log(row)
      console.log(tag)
    },
    showInput(row) {
      row.inputVisible = true
      console.log(row.inputVisible)
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 失去焦点或者点击回车键触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length !== 0) {
        console.log(row)
        row.attr_vals.push(row.inputValue)
        row.inputVisible = false
        row.inputValue = ''
        this.setAttrVals(row)
      }
    },
    async setAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('提交失败')
      }
      this.$message.success('添加参数成功')
    }
  },
  computed: {
    // 如果选择的是三级标签，按钮才能启用
    isBtnDisabled() {
      if (this.selectedkeys.length !== 3) {
        return true
      }
      return false
    },
    catId() {
      if (this.selectedkeys.length === 3) {
        return this.selectedkeys[2]
      }
      return null
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
  margin: 15px;
}
.block {
  margin-top: 15px;
}
.el-tag + .el-tag {
  margin: 10px;
}
.button-new-tag {
  margin: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin: 10px;
  vertical-align: bottom;
}
</style>
