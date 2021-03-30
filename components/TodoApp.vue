<template>
  <div class="todoApp">
    <div class="todoApp__actions">
    <h1 class="todoApp__title">ToDo List</h1>
      <div class="todoApp__filter">
        <button
          class="btn"
          :class="{active:filter==='all'}"
          @click="changeFilter('all')"
        >
          All({{total}})
        </button>
        <button
          class="btn"
          :class="{active:filter==='active'}"
          @click="changeFilter('active')"
        >
          Have to({{activeCount}})
        </button>
        <button
          class="btn"
          :class="{active:filter==='completed'}"
          @click="changeFilter('completed')"
        >
          Completed({{completedCount}})
        </button>
      </div>
      <div class="todoApp__actionButton ">
        <label>
          <input type="checkbox" v-model="allDone"/>
          <span class="checkMark" aria-label="checkMark"/>
        </label>
        <div class="float-right">
          <button class="btn btn--danger" @click="clearCompleted" title="모두지우기"><i  class="fas fa-ban"/></button>
          <button class="btn btn--scroll" @click="scrollToTop" title="첫번째리스트"><i class="fas fa-chevron-up"/></button>
          <button class="btn btn--scroll" @click="scrollToBottom" title="마지막리스트"><i class="fas fa-chevron-down"/></button>
        </div>
      </div>
    </div>

    <div class="todoApp__list" ref="list">
      <todo-item
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @update-todo="updateTodo"
        @delete-todo="deleteTodo"
      />
    </div>
    <todo-creator
      class="todoApp__creator"
      @create-todo="createTodo"
    />
  </div>
</template>

<script>
// 모듈에서 가져오는 것
// import _ from 'lodash' // -> 용량이 커짐
// _.cloneDeep()
import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import shortid from 'shortid'
import _find from 'lodash/find'
import _findIndex from 'lodash/findIndex'
import _assign from 'lodash/assign'
import _cloneDeep from 'lodash/cloneDeep'
import _forEachRight from 'lodash/forEachRight'

// local
import TodoItem from './TodoItem'
import TodoCreator from './TodoCreator'

export default {
  name: 'todoApp',
  components: {
    TodoCreator,
    TodoItem
  },
  data () {
    return {
      db: null,
      todos: [],
      filter: 'all'
    }
  },
  computed: {
    filteredTodos () {
      switch (this.filter) {
        case 'all':
        default:
          return this.todos
        case 'active':
          return this.todos.filter(todo => !todo.done)
        case 'completed':
          return this.todos.filter(todo => todo.done)
      }
    },
    total () {
      return this.todos.length
    },
    activeCount () {
      return this.todos.filter(todo => !todo.done).length
    },
    completedCount () {
      return this.total - this.activeCount
    },
    allDone: {
      get () {
        return this.total === this.completedCount && this.total > 0
      },
      set (checked) {
        this.completedAll(checked)
      }
    }
  },
  created () {
    this.initDB()
  },
  methods: {
    initDB () {
      const adapter = new LocalStorage('todo-app') // DB name
      this.db = low(adapter)

      const hasTodos = this.db
        .has('todos')
        .value()

      if (hasTodos) {
        this.todos = _cloneDeep(this.db.getState().todos)
      } else {
        this.db
          .defaults({
            todos: []
          })
          .write()
      }
    },
    createTodo (title) {
      const newTodo = {
        id: shortid.generate(),
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }

      this.db
        .get('todos')
        .push(newTodo)
        .write()

      this.todos.push(newTodo)

      this.$nextTick(() => {
        this.$refs.list.scrollTo({
          left: 0,
          top: this.$refs.list.scrollHeight,
          behavior: 'smooth'
        })
      })
    },
    updateTodo (todo, value) {
      this.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write()

      const foundTodo = _find(this.todos, { id: todo.id })
      _assign(foundTodo, value)
    },
    deleteTodo (todo) {
      this.db
        .get('todos')
        .remove({ id: todo.id })
        .write()

      const foundIndex = _findIndex(this.todos, { id: todo.id })
      this.$delete(this.todos, foundIndex)
    },
    clearCompleted () {
      _forEachRight(this.todos, todo => {
        if (todo.done) this.deleteTodo(todo)
      })
    },
    completedAll (checked) {
      const newTodos = this.db
        .get('todos')
        .forEach(todo => {
          todo.done = checked
        })
        .write()

      this.todos = _cloneDeep(newTodos)
    },
    changeFilter (filter) {
      this.filter = filter
    },
    scrollToTop () {
      this.$refs.list.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
      // console.log(this.$refs.list.scrollHeight, this.$refs.list.scrollTop, this.$refs.list.clientHeight)
      // console.log(this.$refs.list.scrollHeight - this.$refs.list.scrollTop === this.$refs.list.clientHeight)
    },
    scrollToBottom () {
      this.$refs.list.scrollTo({
        left: 0,
        top: this.$refs.list.scrollHeight,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style>

</style>
