<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse? '56px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409bff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu :key="menu.id" v-for="menu in menuList" :index="''+menu.id">
            <template slot="title">
              <i :class="iconList[menu.id]"></i>
              <span>{{menu.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+submenu.path"
              :key="submenu.id"
              v-for="submenu in menu.children"
              @click="saveNavState('/'+submenu.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{submenu.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-View></router-View>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconList: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-check',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的连接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
      // window.sessionStorage.setItem('index', this)
      // console.log(this.menuList)
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #334455;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #545c64;
  color: #333;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
.toggle-button {
  background-color: #4a5064;
  color: #fff;
  text-align: center;
  font-size: 14px;
  line-height: 30px;
  cursor: pointer;
}
</style>
