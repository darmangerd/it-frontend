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
      dataTable: [],
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
        if (this.food_id.length == 0) {
          this.noMeal = true
        } else {
          this.noMeal = false
        }

        console.log("food_id: " + this.food_id)
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
            // create a new object that contains the food and the quantity and calories per 100g
            this.foodItems = this.food.map((food, i) => {
              return {
                id: food.id,
                name: food.name,
                quantity: this.quantity[i],
                calories: food.energy_kcal,
                protein: food.proteins_g,
                fat: food.lipids_g,
                carbs: food.carbohydrates_g,
              }
            })
            this.summary()
            console.log(this.food)
        } catch (error) {
        console.error(error)
        }
    },

    async summary() {
        for (let i = 0; i < this.foodItems.length; i++) {
            this.totalCalories += Math.round(this.foodItems[i].calories * this.foodItems[i].quantity / 100)
            this.totalProtein += Math.round(this.foodItems[i].protein * this.foodItems[i].quantity / 100)
            this.totalFat += Math.round(this.foodItems[i].fat * this.foodItems[i].quantity / 100)
            this.totalCarbs += Math.round(this.foodItems[i].carbs * this.foodItems[i].quantity / 100)
        }

    },

    async dateChanged() {
      this.clearTable()
      this.foodItems = []
      this.dataTable = []
      this.food = []
      this.food_id = []
      this.quantity = []
      

      const date = this.$refs.dateInput.value;
      this.date = new Date(date).toISOString().slice(0, 10);
      this.getMealByDateAndUser()
    },

    async clearTable() {
      this.foodItems = []
      this.dataTable = []

      // A COMPLETER
    }
  }
}
</script>

<template>
  <h3 style="text-align:center; margin-top:2cm; margin-bottom: 2cm;">Journal from <input type="date" ref="dateInput" @input="dateChanged" /></h3>

  <h2 v-if="noMeal" style="text-align:center;">No meal registered for this date <v-icon class="pl-3" icon="mdi-cancel"></v-icon></h2>
  
  <div id="content" v-else>
      <v-table fixed-header height="300px" theme="dark" :items="dataTable">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Quantity</th>
          <th class="text-left">Calories</th>
          <th class="text-left">Protein</th>
          <th class="text-left">Carbs</th>
          <th class="text-left">Fat</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in foodItems" :key="item.name">
          <td id="pop">{{ item.name }}</td>
          <td><b>{{ item.quantity }}g</b></td>
          <td><b>{{ item.calories * item.quantity / 100 }} kcal</b></td>
          <td>{{ item.protein }}g</td>
          <td>{{ item.carbs }}g</td>
          <td>{{ item.fat }}g</td>
        </tr>
      </tbody>
    </v-table>

    <v-container align="center" style="display: flex; justify-content: center; margin-top: 2cm;">
      <v-row>
        <v-col cols="12">
          <h2>Summary</h2>
          <br/>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-card class="elevation-1" color="#77D88F" dark>
            <v-card-title class="headline white--text">Total calories</v-card-title>
            <v-card-text class="white--text">{{ totalCalories }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-card class="elevation-1" color="#3BC39F" dark>
            <v-card-title class="headline white--text">Total protein</v-card-title>
            <v-card-text class="white--text">{{ totalProtein }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-card class="elevation-1" color="#00A49E" dark>
            <v-card-title class="headline white--text">Total fat</v-card-title>
            <v-card-text class="white--text">{{ totalFat }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-card class="elevation-1" color="#0091A1" dark>
            <v-card-title class="headline white--text">Total carbs</v-card-title>
            <v-card-text class="white--text">{{ totalCarbs }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
  
<style scoped>

#pop {
  color: #42c78c;
  font-weight: bolder;
}

.elevation-1 {
  transition: all 0.4s ease;
  font-weight: bolder;
}

.elevation-1:hover {
  transform: scale(1.05);
}

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