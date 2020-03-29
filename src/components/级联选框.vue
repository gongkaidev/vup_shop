<template>
  <div>
    <el-form-item label="父类分类:">
      <el-cascader
        v-model="selectedkeys"
        :options="parentCatList"
        :props="catProps"
        @change="parentCatChange"
        clearable
      ></el-cascader>
    </el-form-item>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedkeys: [],
      parentCatList: [],
      catProps: {
        value: 'cat_id',
        label: 'cat_name',
        chidren: 'children',
        expandTrigger: 'hover',
        checkStrictly: 'true'
      }
    }
  },
  methods: {
    addCatDialogClear() {
      this.$refs.addCatForm.resetFields()
      this.selectedkeys = []
      this.addCatForm.cat_pid = 0
      this.addCatForm.cat_level = 0
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
    }
  }
}
</script>
