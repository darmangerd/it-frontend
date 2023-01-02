<script>
import axios from 'axios'

const dateToday = new Date().toISOString().slice(0, 10)

export default {
  data() {
    return {
      data: [],
      username: localStorage.getItem('username'),
      date : dateToday,
      meal_id : null,
      food_id : [],
      food : [],
      quantity : [],
    }
  },
  created() {
    //this.fetchData(),
    this.getMealByDateAndUser()
    //this.getMeal_UserId()
  },
  methods: {
    // async fetchData() {
    //   const token = localStorage.getItem('token')
    //   try {
    //     const response = await axios.get(axios.defaults.baseURL + 'client/', {
    //       headers: {
    //         'Authorization': `Token ${token}`
    //       }
    //     })
    //     this.data = response.data
    //   } catch (error) {
    //     console.error(error)
    //   }
    // },

    async getMealByDateAndUser() {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get(axios.defaults.baseURL + 'meal/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
          params: {
            id: 1,
            //date : "2022-11-03",
            date: this.date,
          }
        })
        console.log("meal_id: ", response.data[0].id)
        this.meal_id = response.data[0].id
        // get quantity by meal from today
        this.getQuantityByMeal()
        } catch (error) {
        console.error(error)
        }
    },

    async getQuantityByMeal() {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get(axios.defaults.baseURL + 'quantity/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
          params: {
            id_meal: this.meal_id,
          }
        })
        for (let i = 0; i < response.data.length; i++) {
          this.food_id.push(response.data[i].id_food)
          this.quantity.push(response.data[i].gram)       
        }
        console.log("food_id: " + this.food_id)
        // console.log(this.quantity)
        // get food by id
        this.getFoodById()
        } catch (error) {
        console.error(error)
        }
    },

    async getFoodById() {
      const token = localStorage.getItem('token')
      try {
        for (let i = 0; i < this.food_id.length; i++) {
          const response = await axios.get(axios.defaults.baseURL + 'food/', {
            headers: {
                'Authorization': `Token ${token}`,
            },
            params: {
                id: this.food_id[i],
            }
            })
            this.food.push(response.data[0])
            }
            console.log(this.food)
        } catch (error) {
        console.error(error)
        }
    },

    // async getMeal_UserId() {
    //   const token = localStorage.getItem('token')
    //   try {
    //     const response = await axios.get(axios.defaults.baseURL + 'meal/', {
    //       headers: {
    //         'Authorization': `Token ${token}`,
    //       },
    //       params: {
    //         id: 2,
    //       }
    //     })
    //     //console.log(response.data)
    //     } catch (error) {
    //     console.error(error)
    //     }
    // },
  }
}
</script>

<template>
    <div>
        <br/>
        <h2>Hello {{ username }} !</h2>
        <br/>
      <ul>
        <li v-for="(item, index) in food" :key="item.id_food">{{ item.name + " " + item.energy_kcal * quantity[index] / 100 + " kcal" }}</li>
      </ul>
    </div>
  </template>
  
 
  