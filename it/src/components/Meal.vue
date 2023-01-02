<script>
import axios from 'axios'

const dateToday = new Date().toISOString().slice(0, 10)

export default {
  data() {
    return {
      data: [],
      username: localStorage.getItem('username'),
      date : dateToday,
      noMeal : false,
      meal_id : null,
      food_id : [],
      food : [],
      quantity : [],
      foodItems : [],
      totalCalories : 0,
      totalProtein : 0,
      totalFat : 0,
      totalCarbs : 0,
      selectedDate: null,
    }
  },

  created() {
    this.getMealByDateAndUser()
  },

  methods: {
    async getMealByDateAndUser() {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get(axios.defaults.baseURL + 'meal/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
          params: {
            //id: localStorage.getItem('user_id')
            id: 1,
            //date : "2022-11-03",
            date: this.date,
          }
        })
        console.log("meal_id: ", response.data)
        if (response.data.length == 0) {
          this.noMeal = true
        } else {
          this.noMeal = false
          this.meal_id = response.data[0].id
          // get quantity by meal from today
          this.getQuantityByMeal()
        }
        } catch (error) {
        console.error(error)
        console.log(this.token)
        }
    },

    // dateChanged() {
    //   this.date = this.selectedDate
    //   this.getMealByDateAndUser()
    // },
  }
}
</script>

<template>
    <h2>Meal</h2>
    <v-date-picker v-model="selectedDate" @input="dateChanged" />
    <input type="date" @input="dateChanged" />
</template>

<style scoped>
input[type="date"] {
    padding: 0.5rem;
    border-radius: 4px;
    background-color: #1b1b1b;
    transition: all 0.6s ease;
    color: white;
    font-weight: bolder;
}
input[type="date"]:hover {
    cursor: pointer;
    scale: 1.04;
}
</style>