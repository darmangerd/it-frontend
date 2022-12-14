<script lang="ts">
    export default {
        data: () => ({
        form: false,
        email: null,
        password: null,
        loading: false,
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
    
    <v-btn
        :disabled="!form"
        :loading="loading"
        type="submit"
      class="my-5"
      id="btn"
      depressed
        large
      color="success"
      to="/home"
    >Login</v-btn>
    </v-form>
  </v-responsive>
</template>

<style scoped>
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

</style>