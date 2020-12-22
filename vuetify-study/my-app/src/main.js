import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
Vue.use(VueRouter);

const Foo = { template: '<div>foo</div>' };
// const Bar = { 
//   template: `
//     <div class="bar">
//       <h2>Bar</h2>
//       <router-view></router-view>
//     </div>
//   `
// };

// const Menu = {
//   template:`
//     <div class="menu">
//       <ul>
//         <li>item1</li>
//         <li>item2</li>
//         <li>item3</li>
//       </ul>
//     </div>
//   `
// };

const routes = [
  { path: '/foo', component: Foo },
  // { path: '/bar', component: Bar, children: [
  //     {
  //       path: 'menu',
  //       component: Menu
  //     }
  //   ]
  // }
  // {
  //   path: "*",
  //   redirect: "/"
  // },
];

const router = new VueRouter({
  routes
});

new Vue({
  // el: '#app',
  vuetify,
  router,
  render: h => h(App),
  // components: { App }
}).$mount('#app')
