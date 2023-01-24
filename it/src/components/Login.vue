<script lang="ts">
import axios from 'axios'
import { useRegisterStore } from '../store'
import { mapWritableState } from 'pinia'

    export default {
        data: () => ({
          form: false,
          username: "",
          userId: null,
          password: null,
          loading: false,
          error: false,
          register: false,
        }),

        computed: { 
          ...mapWritableState(useRegisterStore, ["hasRegister"]), 
        },

        created() {
          // redirect if user is still logged in
          if (localStorage.getItem('token')) {
              this.$router.push('/main')
          }
          // show register message if user has registered
          if (this.hasRegister) {
            this.register = true
            setTimeout(() => {
              this.register = false
            }, 3000)
            this.hasRegister = false
          }
        },

        methods: {
          required (v: any) {
              return !!v || 'Field is required'
          },

          async login() {
          try {
            const response = await axios.post('http://127.0.0.1:8000/auth/login/', {
              username: this.username,
              password: this.password
            })
            // save token and username in local storage
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('username', this.username)
            // get user id from backend
            await this.getUserIdByUsername()
            this.$router.push('/main')
          } catch (error) {
            // show error message
            this.error = true
            setTimeout(() => {
              this.error = false
            }, 3000)
          }
        },

        async getUserIdByUsername() {
        const token = localStorage.getItem('token')
        try {
          const response = await axios.get('/users/', {
            headers: {
              'Authorization': `Token ${token}`
            },
            params: {
              username: this.username
            }
          })
          // save id from user in local storage
          localStorage.setItem('user_id', response.data[0].id)
        } catch (error) {
          // further error handling here -> next release
          console.error(error);
        }
      },
    },
  }

</script>

<template>
  <h1 id="title" >Eat good, live better<br>that's <span>it.</span></h1>
  <v-alert class="mx-auto" v-if="register" width="70%" type="info" :value="true">
      Register completed successfully! Please login.
  </v-alert>

  <v-responsive class="mx-auto px-5" max-width="300">
    <h2 id="formIcon"><v-icon icon="mdi-account"></v-icon></h2>

    <v-form v-model="form" @submit.prevent="login">
      <v-text-field :readonly="loading" :rules="[required]" clearable
      class="my-5" label="Username" type="text" hint="Enter your username to login"
      v-model="username"></v-text-field>

      <v-text-field :readonly="loading" :rules="[required]" clearable
      label="Password" type="password" hint="Enter your password to login"
      v-model="password"></v-text-field>

      <div id="formButtons">
        <v-btn :disabled="!form" :loading="loading" type="submit" class="mx-2"
        id="btnPrimary" depressed large>Login</v-btn>

        <v-btn to="/register" type="submit" id="btnSecondary"
        depressed large>Register</v-btn>
      </div>
    </v-form>
    <v-alert v-if="error" type="warning" :value="true">
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

#btnPrimary {
  color: white;
  font-weight: bolder;
  background: rgb(66, 199, 140);
  transition: all 0.5s ease;
}

#btnSecondary {
  color: white;
  font-weight: bolder;
  background: rgb(87, 87, 87);
  transition: all 0.5s ;
}

#formIcon {
  text-align: center;
  font-size: 2em;
}

#formButtons {
  display: flex;
  justify-content: center;
  margin-top: 5%;
}

.v-alert {
  margin-top: 2%;
  margin-bottom: 5%;
}

</style>