import Vue from 'vue'
import App from './App.vue'
import DownLoad from './downLoad.vue'

const routes = {
  '/': App,
  '/about': DownLoad
}

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
})
