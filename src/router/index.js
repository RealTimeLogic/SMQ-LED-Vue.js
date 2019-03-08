import Vue from 'vue'
import Router from 'vue-router'
import SmqLed from '@/components/SMQ-LED'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'smq_led',
      component: SmqLed
    }
  ]
})
