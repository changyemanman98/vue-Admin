<template>
  <div id="main-wrap">
    <div class="main-content">
      <div class="content">
        <!-- <button @click='testClick'>test</button> -->
        <router-view />
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
    height: 100vh;
    background-color: rgba(20, 20, 20, 0.1);
//   position: fixed;
//   top: 75px;
//   left: $navMenu;
//   right: 0;
//   bottom: 0;
//   -webkit-box-sizing: border;
//   border: 30px solid #f7f7f7;
//   border-bottom: none;
}

.main-content {
  width: 100%;
  height: 100%;
  padding-top: $layoutHeader + 30;
  padding-left: $navMenu + 30;
  padding-right: 30px;
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