
<script lang="ts">


export default {
        data: () => ({
          hasToken: !!localStorage.getItem('token'),
          username: localStorage.getItem('username'),
          theme: 'light',
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
              localStorage.removeItem('token');
              localStorage.removeItem('username');
              localStorage.removeItem('user_id');
              this.hasToken = false;
              this.$router.push('/');
            }
          },
          toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
          }
        }
    }
</script>

<template>
  <v-app :theme="theme">
    <div v-if="hasToken" >
      <div class="fixed-top">
        <v-btn @click="logout" id="btnLogout" class="ma-4" color="black" dark>
          <v-icon icon="mdi-logout"></v-icon>
        </v-btn>
      </div>
      <h3 id="titleApp">Hello <span>{{ username }}</span>  :)</h3>
      <div id="nav">
        <v-btn color="black" id="homeBtn" class="btn-css"  to="/main"><v-icon class="pr-3" icon="mdi-home"></v-icon>Home</v-btn>
        <v-btn color="black" to="/food" class="mx-4 btn-css"><v-icon class="pr-3" icon="mdi-food"></v-icon>Add food</v-btn>
        <v-btn color="black" to="/history" class="btn-css"><v-icon class="pr-3" icon="mdi-calendar"></v-icon> History</v-btn>
      </div>
    </div>
    <router-view></router-view>
    <v-btn v-if="hasToken" class="mx-auto my-8" icon="mdi-calendar" @click="toggleTheme"></v-btn>
  </v-app>
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
    transition: all 0.1s ease;
}

#nav {
  display: flex;
  justify-content: center;
  margin-bottom: 4em;
  text-align: center;
  margin: 0 auto;
}

.btn-css {
  font-weight: bolder;
  color: white;
  transition: all 0.3s ease;
}

.btn-css:hover {
  background-color: #2c3e50;
  transform: scale(1.07)
}

.btn-css:active {
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


@media only screen and (max-width: 870px) {
  #titleApp {
    font-size: 1.5em;
  }
}
/* make #titleApp span disapear on phone screen */
@media only screen and (max-width: 500px) {
  #titleApp {
    color : transparent;    
  }
  #titleApp span {
    font-size: 0.9em;
    /* color : transparent; 
    color: linear-gradient(transparent, transparent);
    background: -webkit-linear-gradient(transparent, transparent); */
  }
}


</style>

