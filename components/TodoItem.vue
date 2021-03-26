<template>
  <div
    :class="done"
    class="todoItem"
  >
    <div
      v-if="isEditMode"
      class="todoItem__inner todoItem__inner--edit"
    >
      <input
        :value="editedTitle"
        type="text"
        @input="editedTitle = $event.target.value"
        @keypress.enter="editedTodo"
        @keypress.esc="offEditMode"
        ref="titleInput"
      />
      <div class="todoItem__actions">
        <button class="btn btn--primary"
          key="complete"
          @click="editedTodo"
        >
          <i class="fas fa-check"/>
        </button>
        <button class="btn"
          key="cancle"
          @click="offEditMode"
        >
          <i class="fas fa-times"/>
        </button>
      </div>
    </div>
    <div
      v-else
      class="todoItem__inner todoItem__inner--normal"
    >
      <label>
        <input
          v-model="done"
          type="checkbox"
        />
        <span class="checkMark" aria-label="checkMark"/>
      </label>
      <div class="todoItem__titleWrap">
        <div class="todoItem__title">
          {{todo.title}}
        </div>
        <div class="todoItem__date">
          {{date}}
        </div>
      </div>
      <div class="todoItem__actions">
        <button class="btn"
          key="update"
          @click="onEditMode"
        >
          <i class="fas fa-pen"/>
        </button>
        <button class="btn btn--danger"
        key="delete"
        @click="deleteTodo"><i class="far fa-trash-alt"/></button>
      </div>
    </div>
  </div>
</template>

<script>
import dayJs from 'dayjs'

export default {
  name: 'todoItem',
  props: {
    todo: Object
  },
  data () {
    return {
      isEditMode: false,
      editedTitle: this.todo.title
    }
  },
  computed: {
    done: {
      get () {
        return this.todo.done
      },
      set (done) {
        this.updateTodo({
          done
        })
      }
    },
    date () {
      const date = dayJs(this.todo.createdAt)
      const isSame = date.isSame(this.todo.updatedAt)

      if (isSame) {
        return date.format('YYYY-MM-DD')
      } else {
        return `${date.format('YYYY-MM-DD')} (edited)`
      }
    }
  },
  methods: {
    editedTodo () {
      if (this.todo.title !== this.editedTitle) {
        this.updateTodo({
          title: this.editedTitle,
          updatedAt: new Date()
        })
      }
      this.offEditMode()
    },
    onEditMode () {
      this.isEditMode = true
      this.editedTitle = this.todo.title
      this.$nextTick(() => {
        this.$refs.titleInput.focus()
      })// isEditMode -true 되고 나서 실행한다.
    },
    offEditMode () {
      this.isEditMode = false
    },
    updateTodo (value) {
      this.$emit('update-todo', this.todo, value)
      // this.$store.dispatch('todoApp/updateTodo', {
      //   todo: this.todo,
      //   value
      // })
    },
    deleteTodo () {
      this.$emit('delete-todo', this.todo)
      // this.$store.dispatch('todoApp/deleteTodo', this.todo)
    }
  }
}
</script>

<style lang="scss" scoped>
.todoItem{
  $self:&;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight:500;
  color:rgb(107, 107, 107);
  background: white;
  &:not(:first-child){
    border-top:1px solid lightgray;
  }
  &__inner{
    min-height: 44px;
    padding:12px 14px;
    display:flex;
    align-items: center;
    position:relative;
    transition: ease-in 300ms;
    &:hover,
    &:focus,
    &:active{
      #{$self}__actions{
        display:flex;
        transition: all .25s ease-in;
      }
    }
    label{
      margin-right:15px;
    }
    &--edit {
      input[type="text"] {
        flex: 1;
        margin-left: 44px;
        margin-right: 114px;
        font: inherit;
        outline: none;
        border: none;
        &:focus {
          color: rgba(133, 133, 236, 0.973);
        }
      }
      #{$self}__actions{
        display: flex;
      }
    }
  }
  &__actions{
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    right:14px;
    cursor: pointer;
    display:none;
  }
  &__titleWrap{
    flex:1;
  }
  &__title{
    line-height: 1.5;
    margin-bottom:5px;
    font-size:17px;
  }
  &__date{
    font-size:0.67rem;
    color:rgb(156, 156, 156);
    font-weight: 500;
  }
}
.btn{
  font-size:15px;
  text-align:center;
  width:44px;
  height:44px;
  color:#fff;
  background-color: lightgray;
  border-radius: 100%;
  margin-right:4px;
  &--danger{
    background-color: rgb(224, 104, 100);
  }
  &--primary{
    background-color: rgba(0,0,255,0.2)
  }
}
</style>
