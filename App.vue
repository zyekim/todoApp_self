<template>
  <div id="app">
    <!-- <h1 class="title">ToDo List</h1> -->
    <todo-app />
    <!-- <div class="circle circle--top"/>
    <div class="circle circle--bottom"/> -->
  </div>
</template>

<script>
import TodoApp from './views/TodoApp'
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
  // display:flex;
  // flex-direction: column;
  // justify-content: center;
  // align-items: center;
  position:relative;

}
.title{
  font-family: 'Permanent Marker', cursive;
  color: #222;
  font-size: 3rem;
  position: relative;
  margin-bottom: 20px;
  // top:40px;
  &:after{
    content: '';
    width:100%;
    height:10px;
    background-color: rgba(0,0,255,0.2);
    position: absolute;
    left:0;
    bottom:1px;
  }
}
</style>
