<template>
  <div class="app">
    <transition name="slide-left">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="less">
.slide-left-enter{
  transform:translateX(100px);
}
.slide-left-enter-active{
  transition:all .3s;
}
.slide-left-enter-to{
  transform:translateX(0px);
}
</style>
