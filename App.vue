<template>
  <div id="app">
    <todo-app />
  </div>
</template>

<script>
import TodoApp from './components/TodoApp'
export default {
  components: {
    TodoApp
  }
}
</script>

<style lang="scss">
@import "scss/reset";
@import "scss/style";
#app{
  width:100vw;
  height:100vh;
  position:relative;
}
</style>
