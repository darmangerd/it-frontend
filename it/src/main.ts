import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import {router} from "./router";
import axios from "axios";
import 'vuetify/dist/vuetify.min.css';
import Vue from 'vue';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
  },
  
})

// Pinia
import { createPinia } from 'pinia'
const pinia = createPinia()

createApp(App).use(vuetify).use(router).use(pinia).mount('#app')

axios.defaults.baseURL = "http://127.0.0.1:8000/it/";
