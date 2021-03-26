import Vue from 'vue'
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import shortid from 'shortid'
import _cloneDeep from 'lodash/cloneDeep' //
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'

const state = () => ({
  db: null,
  todos: [],
  filter: 'all'
})

// computed 같은. (computed에 바인딩)
const getters = {
  filteredTodos (state) {
    switch (state.filter) {
      case 'all':
      default:
        return state.todos
      case 'active':
        return state.todos.filter(todo => !todo.done)
      case 'completed':
        return state.todos.filter(todo => todo.done)
    }
  },
  total (state) {
    return state.todos.length
  },
  activeCount (state) {
    return state.todos.filter(todo => !todo.done).length
  },
  completedCount (state, getters) {
    return getters.total - getters.activeCount
  }
}

// methods- data
const mutations = {
  assignDB (state, db) {
    state.db = db// localstorage에 들어있는 todoapp을 반환함
  },
  createDB (state, newTodo) {
    state.db
      .get('todos') // lodash
      .push(newTodo) // lodash
      .write() // lowdb
  },
  pushDB (state, newTodo) {
    state.todos.push(newTodo)
  },
  updateDB (state, { todo, value }) {
    state.db
      .get('todos')
      .find({ id: todo.id })
      .assign(value)
      .write()
  },
  deleteDB (state, todo) {
    state.db
      .get('todos')
      .remove({ id: todo.id })
      .write()
  },
  assginTodo (state, { foundTodo, value }) {
    _assign(foundTodo, value)
  },
  deleteTodo (state, foundIndex) {
    Vue.delete(state.todos, foundIndex)
  },
  // 모두 체크
  assignTodos (state, todos) {
    state.todos = todos
  },
  updateFilter (state, filter) {
    state.filter = filter
  }
}
// methods dataX
const actions = {
  initDB ({ state, commit }) {
    const adapter = new LocalStorage('todo-app') // DB이름
    commit('assignDB', lowdb(adapter))

    const hasTodos = state.db
      .has('todos') // Collection name
      .value() // 로대시 메소드로 체크하고 밸류로 뽑아냄

    if (hasTodos) {
      state.todos = _cloneDeep(state.db.getState().todos) // todos만 필요
      // 깊은 복사는 참조관계들 제거한체 복사 한다?
    } else {
      // localDB 초기화
      state.db
        .defaults({
          todos: [] // collection
          // date: new Date()
        })
        .write()
    }
  },
  createTodo ({ state, commit }, title) {
    const newTodo = {
      id: shortid.generate(), // shortid로 id 생성
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      done: false
    }
    // localDB
    commit('createDB', newTodo)
    // clientDB
    commit('pushDB', newTodo)

    state.$nextTick(() => {
      state.$refs.list.scrollTo({
        left: 0,
        top: state.$refs.list.scrollHeight,
        behavior: 'smooth'
      })
    })
  },
  updateTodo ({ state, commit }, { todo, value }) {
    commit('updateDB', value)
    const foundTodo = _find(state.todos, { id: todo.id })
    // assignTodo
    commit('assignTodo', { foundTodo, value })
  },
  deleteTodo ({ state, commit }, todo) {
    // deleteDB
    commit('deleteDB', todo)

    const foundIndex = _findIndex(state.todos, { id: todo.id })
    // deleteTodo
    commit('deleteTodo', foundIndex)
  },
  clearCompleted ({ state, dispatch }) {
    // this.todos
    //   .reduce((list, todo, index) => {
    //     if (todo.done) {
    //       list.push(index)
    //     }
    //     return list
    //   }, [])
    //   .reverse()
    //   .forEach(index => {
    //     this.deleteTodo(this.todos[index])
    //   })

    _forEachRight(state.todos, todo => {
      if (todo.done) dispatch('deleteTodo', todo)
    })
  },
  completedAll ({ state, commit }, checked) {
    const newTodos = state.db
      .get('todos')
      .forEach(todo => {
        todo.done = checked
      })
      .write()

    commit('assignTodos', _cloneDeep(newTodos))
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
  // data()
}
