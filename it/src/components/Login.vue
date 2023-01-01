<script lang="ts">
import axios from 'axios'

    export default {
        data: () => ({
        form: false,
        username: null,
        password: null,
        loading: false,
        error: false,
        }),

        methods: {
          async login() {
          try {
            const response = await axios.post('http://127.0.0.1:8000/auth/login/', {
              username: this.username,
              password: this.password
              
            })
            localStorage.setItem('token', response.data.token)
            console.log(response.data)
            //this.$router.push('/')
          } catch (error) {
            this.error = true
            setTimeout(() => {
              this.error = false
            }, 3000)
          }
        },
        required (v: any) {
            return !!v || 'Field is required'
        },
        },
    }

</script>

<template>
  <h1 id="title" >Eat good, live better<br>that's <span>it.</span></h1>

  <v-responsive class="mx-auto px-5" max-width="450">
    <h2 id="form"><v-icon icon="mdi-account"></v-icon></h2>

    <v-form v-model="form" @submit.prevent="login">
      <v-text-field :readonly="loading" :rules="[required]" clearable
      class="my-5" label="Username" type="text" hint="Enter your username to login"
      v-model="username"></v-text-field>

      <v-text-field :readonly="loading" :rules="[required]" clearable
      label="Password" type="password" hint="Enter your password to login"
      v-model="password"></v-text-field>

      <div id="form">
        <v-btn :disabled="!form" :loading="loading" type="submit" class="my-5 mx-2"
        id="btnPrimary" depressed large>Login</v-btn>

        <v-btn to="/register" type="submit" class="my-5" id="btnSecondary"
        depressed large>Register</v-btn>
      </div>
    </v-form>
    <v-alert v-if="error" type="error" :value="true">
      Invalid username or password. Please verify your credentials and try again.
    </v-alert>
  </v-responsive>
</template>

<style>
#title {
    text-align: center;
    margin-top: 10%;
    font-size: 4em;
    margin-bottom: 10%;
}
#title span {
    color: rgb(66,246,118);
    color: linear-gradient(90deg, rgba(66,246,118,1) 0%, rgba(97,245,219,1) 50%, rgba(0,188,255,1) 100%);
    background: -webkit-linear-gradient(90deg, rgba(66,246,118,1) 0%, rgba(97,245,219,1) 50%, rgba(0,188,255,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
#title span:hover {
    color: rgb(66,246,118);
}

#btnPrimary {
  color: white;
  font-weight: bolder;
  background: rgb(66,211,146);
  background: linear-gradient(90deg, rgba(66,211,146,1) 27%, rgba(100,126,255,1) 100%);
  transition: all 0.5s ease;
}

#btnSecondary {
  color: white;
  font-weight: bolder;
  background: rgb(66, 199, 140);
  transition: all 0.5s ;
}

#form {
  display: flex;
  justify-content: center;
}
</style>