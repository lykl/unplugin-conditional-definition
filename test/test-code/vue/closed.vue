<script>
export default {
  name: 'test',
}
</script>
<script setup>
import { reactive } from 'vue'
const props = defineProps()

const data = reactive({
  name: 'zhangsan',
  sex: 'male',
})
// #ifdef LABTOP
console.log(data)
// #endif

const color = ref('#f1f1f1')
</script>

<template>
  <div class="container">
    <div class="item">
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus commodi eaque ipsum, illo doloribus nesciunt
        molestiae quam cumque? Placeat, beatae accusamus. Voluptatibus odio debitis voluptates aspernatur? Molestiae,
        nisi ut. Porro.
        <!-- #ifdef MOBILE -->
        <span>voluptatum quis facilis accusantium? Saepe nostrum atque laboriosam quisquam.</span>
        <!-- #endif -->
      </p>
    </div>
    <div class="item">{{ data.name }}</div>
    <div class="item">
      <p>{{ data.sex }}</p>
    </div>
    <div class="item"></div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  --color: green;
  .item {
    display: block;
    /* #ifdef MOBILE */
    color: red;
    /* #endif */
    width: 100px;
    height: 100px;
    /* #endif */
    background-color: var(--color);
    border: 1px solid v-bind(color);
  }
}
</style>
