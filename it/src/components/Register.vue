<script lang="ts">
import axios from 'axios'
import { mapState, mapWritableState } from 'pinia'
import { useRegisterStore } from '../store'

    export default {
        data: () => ({
        form: false,
        username: "",
        password: null,
        loading: false,
        weight: 40,
        height: 100,
        selectedOption: 'm',
        error: false,
        id : null,
        usernameRules: [
          v => !!v || 'Username is required',
          v => v.length >= 3 || 'Username must be at least 3 characters',
          v => v.length <= 12 || 'Username must be less than 12 characters',
          //only letters and numbers
          v => /^[a-zA-Z0-9]+$/.test (v) || 'Username must contain only letters and numbers',
        ],
        passRules: [
          v => !!v || 'Pass is required',
          v => v.length >= 6 || 'Pass must be at least 6 characters',
          v => v.length <= 30 || 'Pass must be less than 30 characters',
        ],
        }),

        // redirect if user is still logged in
        created() {
        if (localStorage.getItem('token')) {
            this.$router.push('/main')
        }
        },

        computed: {
        ...mapWritableState(useRegisterStore, ["hasRegister"]),
        },

        methods: {
        async register() {
          try {
            // register user
            const response = await axios.post(axios.defaults.baseURL + 'users/', {
              username: this.username,
              password: this.password
            })

            // register client
            this.id = response.data.id

            const response2 = await axios.post(axios.defaults.baseURL + 'client/', {
              id_user: this.id,
              weight_kg: this.weight,
              height_cm: this.height,
              gender: this.selectedOption
            })
            // update hasRegister to true
            this.hasRegister = true
            // redirect to login
            this.$router.push({ path: '/' })
          } 
          catch (error) 
          {
            this.error = true
            setTimeout(() => {
              this.error = false
            }, 3000)
          }
        },
        },
    }
</script>

<template>
  <h1 id="title" >Eat good, live better<br>that's <span>it.</span></h1>

  <v-responsive class="mx-auto px-5" max-width="450">
    <h2 id="formIcon"><v-icon>mdi-account-plus</v-icon></h2>

    <v-form v-model="form" @submit.prevent="register">
      <v-text-field :readonly="loading" :rules="usernameRules" clearable
      class="my-5" label="Username" type="text" hint="Enter your username to register"
      v-model="username"></v-text-field>

      <v-text-field :readonly="loading" :rules="passRules" clearable
      label="Password" type="password" hint="Enter your password to register"
      v-model="password"></v-text-field>

      <div class="text-caption mt-5">Weight {{ weight }} kg</div>
      <v-slider v-model="weight" :min="40" :max="150" step="10"
      :thumb-size="15" color="rgb(66, 199, 140)" show-ticks="always"></v-slider>

      <div class="text-caption">Height {{ height }} cm</div>
      <v-slider v-model="height" :min="100" :max="230" step="10" 
      :thumb-size="15" color="rgb(66, 199, 140)" show-ticks="always"></v-slider>

      <div class="text-caption">Gender</div>
      <v-radio-group v-model="selectedOption">
          <v-radio label="men" value="m"></v-radio>
          <v-radio label="female" value="f"></v-radio>
      </v-radio-group>

      <div id="formButtons">
        <v-btn class="mx-2" id="btnSecondary" depressed
        large to="/">Login</v-btn>
      
        <v-btn type="submit" :disabled="!form" :loading="loading"  
        id="btnPrimary" depressed large>Register</v-btn>
      </div>
      <v-alert v-if="error" type="warning" :value="true">
      User already exists please use another username
      </v-alert>
    </v-form>

    
  </v-responsive>
</template>
<style scoped>
.v-form {
    margin-bottom: 10%;
}
</style>