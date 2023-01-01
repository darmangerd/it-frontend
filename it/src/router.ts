import { createRouter, createWebHashHistory } from "vue-router";
import HelloWorldVue from "./components/HelloWorld.vue";
import HelloWorldVueTest from "./components/HelloWorld2.vue";
import ErrorVueVue from "./components/ErrorVue.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: HelloWorldVue },
  { path: '/about', component: HelloWorldVueTest },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: ErrorVueVue },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})

export {router};

// Now the app has started!