<template>
  <div id="nav-wrap">
    <div class="logo-vue">
      <svg-icon iconClass="vue" className="vue font" />
    </div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <template v-for="(item, index) in routers">
        <el-submenu v-if="!item.hidden" :key="item.id" :index="index + ''">
          <!-- 一级菜单 -->
          <template slot="title">
            <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
            <span>{{ item.meta.name }}</span>
          </template>
          <!-- 子菜单 -->
          <template v-for="subItem in item.children">
            <el-menu-item
              v-if="!subItem.hidden"
              :key="subItem.id"
              :index="subItem.path"
            >{{ subItem.meta.name }}</el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import {
  reactive,
  ref,
  isRef,
  toRefs,
  onMounted,
  computed,
} from "@vue/composition-api";
export default {
  name: "navMenu",
  setup(props, { root }) {
    /*
     *data 数据
     */
    const routers = reactive(root.$router.options.routes);

    /*
     * computed 监听
     */
    const isCollapse = computed(() => root.$store.state.app.isCollapse);

    return {
      isCollapse,
      routers,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/elementui.scss";
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
  @include webkit(transition, all 0.3s ease 0s);
}
svg {
  font-size: 20px;
  margin-right: 10px;
  @include webkit(transition, all 0.3s ease 0s);
}
.logo-vue {
  padding-top: 10px;
  text-align: center;
}
.svg-icon {
  &.font {
    font-size: 68px;
    @include webkit(transition, all 0.3s ease 0s);
  }
}

.open {
  #nav-wrap {
    width: $navMenu;
  }
  .svg-icon {
    &.font {
      font-size: 68px;
    }
  }
}
.close {
  #nav-wrap {
    width: 64px;
  }
  .svg-icon {
    &.font {
      font-size: 50px;
      margin-right: 0;
      margin-top: 10px;
    }
  }
}
</style>