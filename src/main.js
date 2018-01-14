// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueRsource from 'vue-resource';
import App from './App';
import Goods from './components/goods/goods';
import Seller from './components/seller/Seller';
import Rating from './components/rating/Rating';

import './common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueRsource);

Vue.config.productionTip = false;
/* eslint-disable no-new */

const routes = [
  {
    path: '/goods',
    component: Goods
  },
  {
    path: '/',
    redirect: '/goods'
  },
  {
    path: '/rating',
    component: Rating
  },
  {
    path: '/seller',
    component: Seller
  }
];

const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
});
new Vue({
  router,
  components: {
    app: App
  }
}).$mount('#body');
