import { createRouter, createWebHashHistory } from "vue-router";
import ErrorVueVue from "./components/ErrorVue.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Main from "./components/Main.vue";
import Food from "./components/Food.vue";
import history from "./components/History.vue";


// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: Login },
  { path: '/register', component: Register },
  { path: '/main', component: Main },
  { path: '/food', component: Food },
  { path: '/history', component: history },
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

// contrôler l'accès aux pages en fonction de l'authentification
router.beforeEach((to, from, next) => {
  const publicPages = ["/", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("token");

  if (authRequired && !loggedIn) {
    return next("/");
  }

  next();
});

export {router};

// Now the app has started!