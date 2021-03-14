<template>
  <div id="header-wrap">
    <div class="pull-left header-icon" @click="navMenustate"><svg-icon iconClass="menu" className="menu" /></div>
    <div class="pull-right">
      <div class="user-info pull-left">{{username}}</div>
      <div class="header-icon pull-left" @click="exit">
        <svg-icon iconClass="exit" className="exit" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api"
export default{
  name: 'layoutHeader',
  setup(props,{ root }){
    const username = computed(() => root.$store.state.app.username);
    const navMenustate = () => {
      root.$store.commit('app/SET_COLLAPSE');
    }

    // 退出
    const exit = () => {
      root.$store.dispatch('app/exit').then(() => {
        root.$router.push({
          name: 'Login'
        })
      })
    }

    return{
      navMenustate,
      username,
      exit
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/main.scss";
#header-wrap {
  position: fixed;
  left: $navMenu;
  top: 0;
  right: 0;
  height: 75px;
  background-color: #fff;
  @include webkit(box-shadow,0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition,all 0.3s ease 0s);
  line-height: 75px;
}

.header-icon {
  padding: 0 32px;
  svg {
    margin-bottom: -3px;
    font-size: 18px;
    cursor: pointer;
  }
}

.user-info{
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  + .header-icon{
    padding: 0 28px;
  }
}

.open{
  #header-wrap{
    left: $navMenu;
  }
}

.close{
  #header-wrap{
    left: $navMenuMin;
  }
}
</style>