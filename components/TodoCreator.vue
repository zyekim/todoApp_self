<template>
  <div>
    <button class="btn" type="button" @click="createTodo">+</button>
    <label>
      <input
        type="text"
        :placeholder="placeholder"
        :value="title"
        @input="title = $event.target.value"
        @keypress.enter="createTodo"
      />

    </label>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      placeholder: '할일을 추가하세요'
    }
  },
  methods: {
    // trim은 공백 제거 ltrim은 공백 생성
    createTodo () {
      const validatedTitle = this.title && this.title.trim()
      if (!validatedTitle) {
        alert('유효하지 않은 제목입니다.')
        this.title = this.title.trim()
        return
      }
      // 생성
      this.$emit('create-todo', this.title)
      // this.$store.dispatch('todoApp/createTodo', this.title)
      this.title = ''// 초기화
    }
  }
}
</script>

<style scoped>
.btn{
  font-family: 'Permanent Marker', cursive;
  font-size:2rem
}

</style>
