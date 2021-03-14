<template>
  <!-- svg设置图标大小,use设置使用那个图标 -->
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
import { ref, computed } from "@vue/composition-api";
export default {
  name: "svgIcon",
  // props:['className', 'iconClass'],
  props: {
    iconClass: {
      type: String, //定义接收的值类型
      default: "", //默认值
      // required: true,  //设置必填项
      // validator: (value) => {  //校验（验证传入的值是否符合规则）
      //     return value >= 0;
      // }
    },
    className: {
      type: String,
      dafault: "",
    },
  },
  setup(props) {
    const msg = ref("手把手撸码前端");

    // 计算属性,得出最终结果,并返回
    const iconName = computed(() => `#icon-${props.iconClass}`);

    const svgClass = computed(() => {
      if (props.className) {
        return `svg-icon ${props.className}`;
      } else {
        return `svg-icon`;
      }
    });

    return {
      msg,
      iconName,
      svgClass,
    };
  },
};
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>