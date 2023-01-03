
<script lang="ts">
export default {
        data: () => ({
          hasToken: !!localStorage.getItem('token'),
          username: localStorage.getItem('username'),
        }),
        created() {
          // reload everythime a page is loaded
          this.hasToken = !!localStorage.getItem('token');
          this.$router.afterEach((to, from) => {
            this.hasToken = !!localStorage.getItem('token');
            this.username = localStorage.getItem('username');
          });
        },
        methods: {
          async logout() {
            // confirm logout
            const confirm = window.confirm('Are you sure you want to logout?');
            if (confirm) {
              localStorage.clear();
              this.hasToken = false;
              this.$router.push('/');
            }
          }
        }
    }
</script>

<template>
  <div v-if="hasToken" >
    <div class="fixed-top">
      <v-btn @click="logout" id="btnLogout" class="ma-4" color="black" dark>
        <v-icon icon="mdi-logout"></v-icon>
      </v-btn>
    </div>
    <h3 id="titleApp">Hello <span>{{ username }}</span>  :)</h3>
    <div id="nav">
      <v-btn color="black" id="homeBtn" to="/main"><v-icon class="pr-3" icon="mdi-home"></v-icon>Home</v-btn>
      <v-btn color="black" to="/food" class="mx-4"><v-icon class="pr-3" icon="mdi-food"></v-icon>Add food</v-btn>
      <v-btn color="black" to="/history"><v-icon class="pr-3" icon="mdi-calendar"></v-icon> History</v-btn>
    </div>
  </div>
  
  <router-view></router-view>
</template>

<style scoped>
#titleApp {
    text-align: center;
    margin-top: 1.5cm;
    font-size: 3em;
    margin-bottom: 1.3cm;

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

#btnLogout {
  border-radius: 100%;
  height: 60px;
  position: absolute;
  top: 0;
  right: 0;
}

</style>

