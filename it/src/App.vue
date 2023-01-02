
<script lang="ts">
export default {
        data: () => ({
          hasToken: !!localStorage.getItem('token'),
          username: localStorage.getItem('username'),
        }),
        
        // created() {
        // if (localStorage.getItem('token')) {
        //     this.$router.push('/main')
        // }
        // },

        // methods: {
        
        // },
    }

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

</script>



<template>
  <template v-if="hasToken" >
    <h3 id="titleApp">Hello <span>{{ username }}</span>  :)</h3>
    <div id="nav">
      <v-btn color="black" id="homeBtn" class="mx-4" to="/main"><v-icon icon="mdi-home"></v-icon></v-btn>
      <v-btn color="black" to="/food"><v-icon class="pr-3" icon="mdi-plus"></v-icon>Add food</v-btn>
      <v-btn color="black" to="/meal" class="mx-4"><v-icon class="pr-3" icon="mdi-food"></v-icon>Meals</v-btn>
      <v-btn color="black" to="/history"><v-icon class="pr-3" icon="mdi-calendar"></v-icon> History</v-btn>
    </div>
      
  </template>
  
  <router-view></router-view>
</template>

<style scoped>
#titleApp {
    text-align: center;
    margin-top: 6%;
    font-size: 3em;
    margin-bottom: 6%;
}
#titleApp span {
    color: rgb(66,246,118);
    color: linear-gradient(90deg, rgba(66,246,118,1) 0%, rgba(97,245,219,1) 50%, rgba(0,188,255,1) 100%);
    background: -webkit-linear-gradient(90deg, rgba(66,246,118,1) 0%, rgba(97,245,219,1) 50%, rgba(0,188,255,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}


#nav {
  display: flex;
  justify-content: center;
  margin-bottom: 4em;
}

.v-btn {
  font-weight: bolder;
  color: white;
  transition: all 0.3s ease;
}

.v-btn:hover {
  background-color: #2c3e50;
  transform: scale(1.07)
}

.v-btn:active {
  background-color: #0376e8;
  transform: scale(1.07)
}

</style>

