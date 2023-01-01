<script lang="ts">
    export default {
        data: () => ({
        form: false,
        email: null,
        password: null,
        loading: false,
        radios: null,
        weight: 40,
        height: 100,
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
    <h2>Register page</h2>
  <v-responsive
    class="mx-auto"
    max-width="384"
  >
  <v-form
    v-model="form"
    @submit.prevent="onSubmit"
  >
    <v-text-field 
    :readonly="loading"
    :rules="[required]"
    clearable
    class="my-5"
      label="Username"
      type="text"
      hint="Enter your username to login"
    ></v-text-field>

    <v-text-field
    :readonly="loading"
          :rules="[required]"
          clearable
      label="Password"
      type="password"
      hint="Enter your password to login"
    ></v-text-field>

    <div class="text-caption">Weight [kg]</div>
    <v-slider
    v-model="weight"
    :min="40"
    :max="150"
      step="10"
      show-ticks="always"
    ></v-slider>

    <div class="text-caption">Height [cm]</div>
    <v-slider
    v-model="height"
    :min="100"
    :max="230"
    step="10"
    show-ticks="always"
    ></v-slider>

    <div class="text-caption">Gender</div>
    <v-radio-group>
        <v-radio label="men" value="m" selected></v-radio>
        <v-radio label="female" value="f"></v-radio>
    </v-radio-group>

      <v-btn
        class="my-5 mx-2"
        id="btnSecondary"
        depressed
        large
        to="/login"
      >Login</v-btn>
      
      <v-btn
        type="submit"
        :disabled="!form"
        :loading="loading"
        class="my-5"
        id="btnPrimary"
        depressed
        to="/register"
        large>Register</v-btn>
    </v-form>
  </v-responsive>
</template>

<style>
</style>