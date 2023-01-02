<script lang="ts">
import axios from 'axios'

export default {
  data() {
    return {
      valid: false,
      errorAlert: false,
      successAlert: false,
      food: {
        name: '',
        energy_kcal: null,
        proteins_g: null,
        lipids_g: null,
        carbohydrates_g: null,
      },
        nameRules: [
            v => !!v || 'Name is required',
            v => v.length <= 50 || 'Name must be less than 50 characters',
        ],
        kcalRules: [
            v => !!v || 'Energy is required',
            v => !isNaN(v) || 'Energy must be a number',
        ],
        proteinRules: [
            v => !!v || 'Proteins are required',
            v => !isNaN(v) || 'Proteins must be a number',
        ],
        lipidRules: [
            v => !!v || 'Lipids are required',
            v => !isNaN(v) || 'Lipids must be a number',
        ],
        carbohydrateRules: [
            v => !!v || 'Carbohydrates are required',
            v => !isNaN(v) || 'Carbohydrates must be a number',
        ],
    }
    },
    methods: {
        async createFood() {
            const token = localStorage.getItem('token')
            try {
                const response = await axios.post(axios.defaults.baseURL + 'food/', this.food, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    }
                })
                this.clearForm()
                //console.log(response.data.name)
                this.successAlert = true
                setTimeout(() => {
                    this.successAlert = false
                }, 3000)
                
                //this.$router.push({ name: 'Food' })
            } catch (error) {
                if (error.response.data.name == "food with this name already exists.") {
                    this.errorAlert = true
                    setTimeout(() => {
                    this.errorAlert = false
                    }, 3000)
                }
                console.error(error.response)
            }
        },

        async clearForm() {
            this.$refs.form.reset()
        },
    },
}

</script>

<template>
    <h2 id="title2">Create a food including the nutrition facts</h2>
    <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="food.name"
      label="Name"
      :rules="nameRules"
    ></v-text-field>
    <v-text-field
      v-model="food.energy_kcal"
      label="Energy (kcal)"
      :rules="kcalRules"
    ></v-text-field>
    <v-text-field
      v-model="food.proteins_g"
      label="Proteins (g)"
      :rules="proteinRules"
    ></v-text-field>
    <v-text-field
      v-model="food.lipids_g"
      label="Lipids (g)"
      :rules="lipidRules"
    ></v-text-field>
    <v-text-field
      v-model="food.carbohydrates_g"
      label="Carbohydrates (g)"
      :rules="carbohydrateRules"
    ></v-text-field>
    <div id="formButtons">
        <v-btn class="my-5" id="btnSecondary" depressed 
        large :disabled="!valid" @click="createFood">Create Food</v-btn>
    </div>
  </v-form>
  <v-alert v-if="errorAlert" type="error" :value="true">
  Food with this name already exists.
  </v-alert>
  <v-alert v-if="successAlert" type="success" :value="true">
  Added food successfully.
  </v-alert>
</template>

<style scoped>
#title2 {
  text-align: center;
  margin-bottom: 10%;
}
</style>