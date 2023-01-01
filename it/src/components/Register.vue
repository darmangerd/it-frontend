<script lang="ts">
    export default {
        data: () => ({
        form: false,
        username: null,
        password: null,
        loading: false,
        radios: null,
        weight: 40,
        height: 100,
        selectedOption: 'm',
        }),

        methods: {
        onSubmit () {
            if (!this.form) return

            this.loading = true

            setTimeout(() => (this.loading = false), 2000)
        },
        required (v) {
            return !!v || 'Field is required'
        },
        },
    }
</script>

<template>
  <h1 id="title" >Eat good, live better<br>that's <span>it.</span></h1>

  <v-responsive class="mx-auto px-5" max-width="450">
    <h2 id="form"><v-icon>mdi-account-plus</v-icon></h2>

    <v-form v-model="form" @submit.prevent="onSubmit">
      <v-text-field :readonly="loading" :rules="[required]" clearable
      class="my-5" label="Username" type="text" hint="Enter your username to login"
      v-model="username"></v-text-field>

      <v-text-field :readonly="loading" :rules="[required]" clearable
      label="Password" type="password" hint="Enter your password to login"
      v-model="password"></v-text-field>

      <div class="text-caption">Weight {{ weight }} kg</div>
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

      <div id="form">
        <v-btn class="my-5 mx-2" id="btnSecondary" depressed
        large to="/login">Login</v-btn>
      
        <v-btn type="submit" :disabled="!form" :loading="loading" class="my-5" 
        id="btnPrimary" depressed to="/register" large>Register</v-btn>
      </div>
    </v-form>
  </v-responsive>
</template>