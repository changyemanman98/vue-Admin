<template>
  <div id="main-wrap">
    <div class="main-content">
      <div class="content">
        <!-- 子路由显示区 -->
        <keep-alive>
          <!-- 需要缓存 -->
          <router-view v-if="$route.meta.keepAlice" />
        </keep-alive>
        <!-- 不需要缓存 -->
          <router-view v-if="!$route.meta.keepAlice" />
      </div>
    </div>
  </div>
</template>

<script>
import {ref, reactive} from "@vue/composition-api";
export default {
  name: 'LayoutMain',
  setup(props, {root}){
    // const testClick = () => {
    //   root.$store.dispatch('test');
    // }

    return {
      // testClick
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/main.scss";
#main-wrap {
    height:100%;
    background-color: rgba(20, 20, 20, 0.1);
}

.main-content {
  width: 100%;
  height: 100%;
  padding-top: $layoutHeader + 30;
  padding-left: $navMenu + 30;
  padding-right: 30px;
  padding-bottom: 30px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  @include webkit(transition,all 0.3s ease 0s)
}

.content {
  width: 100%;
  height: 100%;
  padding: 30px 30px 0 30px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #fff;
}

.open{
  .main-content{
    padding-left: $navMenu + 30;
  }
}

.close{
  .main-content{
    padding-left: $navMenuMin + 30;
  }
}
</style>