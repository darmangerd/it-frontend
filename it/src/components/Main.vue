<script>
import axios from 'axios'

// TO CHANGE IN FINAL VERSION
localStorage.setItem('user_id', 1)

export default {
  data() {
    return {
      // initalization
      username: localStorage.getItem('username'),
      userId: localStorage.getItem('user_id'),
      date : new Date().toISOString().slice(0, 10),
      hasToken: !!localStorage.getItem('token'),

      // client information
      client : [],
      caloriesLeft : null,
      hasCaloriesLeft : null,

      // fetch food datas and display
      hasNoMeal : false,
      meal_id : null,
      food_id : [],
      food : [],
      quantity : [],
      foodItems : [],
      dataTable: [],

      // summary
      totalCalories : 0,
      totalProtein : 0,
      totalFat : 0,
      totalCarbs : 0,

      // add food dialog
      allFoods: [],
      allFoodsData: [],
      selectedFood: null,
      selectedFoodId: null,
      quantityInput: null,
      quantityRules: [
          v => !!v || 'Energy is required',
          v => !isNaN(v) || 'Energy must be a number',
          v => v>0 || 'Energy must be greater than 0',
          v => v.length <= 5 || 'Energy must be less than 5 characters',
      ],
      foodSelectedRules: [
          v => !!v || 'Food is required',
      ],
      valid: false,
      successAlert: false,
    }
  },

  created() {
    if (!this.hasToken) {
      this.$router.push('/')
    }
    else {
      this.getMealByDateAndUser(),
      this.getFoods(),
      this.getClient()
    }
    // this.getUserIdByUsername(),
    // this.getUser(),
    
  },

  methods: {
    // async getUser() {
    //   try {
    //     const token = localStorage.getItem('token')
    //     const response = await axios.get('http://localhost:8000/it/auth/user/', {
    //       headers: {
    //         'Authorization': `Token ${token}`,
    //       }
    //     })
    //     console.log("main")
    //     console.log(response)
    //     // The user's primary key is stored in response.data.id
    //   } catch (error) {
    //     console.error(error)
    //   }
    // },


    // async getUserIdByUsername() {
    //   const token = localStorage.getItem('token')
    //   console.log("token: ", token)
    //   try {
    //     const response = await axios.get('/users/', {
    //       headers: {
    //         'Authorization': `Token ${token}`
    //       },
    //       params: {
    //         username: 'billy'
    //       }
    //     })
    //     console.log(response.data);

    //     // if (response.data.length > 0) {
    //     //   console.log(response.data[0].id);
    //     //   // Return the first user's ID if multiple users have the same username
    //     //   return response.data[0].id;
    //     // }
    //     // return null;
    //   } catch (error) {
    //     console.error(error);
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
            //id: localStorage.getItem('user_id')
            id: this.userId,
            //date : "2022-11-03",
            date: this.date,
          }
        })
        // console.log("date: ", this.date)
        console.log("meal_id: ", response.data)
        if (response.data.length == 0) {
          this.hasNoMeal = true
        } else {
          this.hasNoMeal = false
          this.meal_id = response.data[0].id
          // get quantity by meal from today
          this.getQuantityByMeal()
        }
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
        if (this.food_id.length == 0) {
          this.hasNoMeal = true
        } else {
          this.hasNoMeal = false
        }

        // console.log("food_id: " + this.food_id)
        // get food by id
        this.getFoodById()
        } catch (error) {
        console.error(error)
        }
    },

    async getFoods() {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get(axios.defaults.baseURL + 'food/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        })
        for (let i = 0; i < response.data.length; i++) {
          this.allFoodsData.push({
            name: response.data[i].name,
            id: response.data[i].id,
          })
          this.allFoods.push(response.data[i].name)
        }
      } catch (error) {
        console.error(error);
      }
    },

    async getClient() {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get(axios.defaults.baseURL + 'client/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
          params: {
            //id: localStorage.getItem('user_id')
            id_user: this.userId,
          }
        })
        this.client = response.data[0]
        // console.log("client: ", this.client)
      } catch (error) {
        console.error(error)
      }
    },
    
    calculateBMR() {
      // ref : https://www.calculator.net/bmr-calculator.html
      return 10 * this.client.weight_kg + 6.25 * this.client.height_cm
    },

    async createMeal() {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.post(axios.defaults.baseURL + 'meal/', {
          date: this.date,
          id_user: this.userId,
        }, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        console.log("meal_idCREATE: ", response.data.id)
        return response.data.id
      } catch (error) {
        console.error(error.response)
      }
    },

    async addFood() {
      console.log("add food")
      console.log("meal_id: ", this.meal_id)
      console.log("date: ", this.date)
      if (this.hasNoMeal) {
        this.meal_id = await this.createMeal()
        this.hasNoMeal = false
        console.log("meal_id_ADDFOOD: ", this.meal_id)
      }

      // get the id of the selected food
      for (let i = 0; i < this.allFoodsData.length; i++) {
        if (this.allFoodsData[i].name == this.selectedFood) {
          this.selectedFoodId = this.allFoodsData[i].id
        }
      }
      // console.log(`Selected food id: ${this.selectedFoodId}`)
      // console.log(`Quantity: ${this.quantityInput}`)
      // console.log("meal_idFINAL: ", this.meal_id)

      // add quantity to the database
      const token = localStorage.getItem('token')
      try {
        const response = await axios.post(axios.defaults.baseURL + 'quantity/', {
        gram: this.quantityInput,
        id_food: this.selectedFoodId,
        id_meal: this.meal_id,
      }, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (!this.hasNoMeal){
        this.clearTable()
        this.getMealByDateAndUser()
      }
      this.successAlert = true
          setTimeout(() => {
              this.successAlert = false
          }, 3000)            
      } catch (error) {
          console.error(error.response)
      }
      // add the food id and quantity to the arrays
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
            // console.log(this.food)
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
        this.caloriesLeft = this.calculateBMR() - this.totalCalories
        if (this.caloriesLeft < 0) {
          this.hasCaloriesLeft = false
        }
        else {
          this.hasCaloriesLeft = true
        }
    },

    async clearTable() {
      this.foodItems = []
      this.dataTable = []
      this.food = []
      this.food_id = []
      this.quantity = []
      this.totalCalories = 0
      this.totalProtein = 0
      this.totalFat = 0
      this.totalCarbs = 0
      this.caloriesLeft = 0
    },

    async dateChanged() {
      this.clearTable()
      const date = this.$refs.dateInput.value;
      this.date = new Date(date).toISOString().slice(0, 10);
      this.getMealByDateAndUser()
    },
  }
}
</script>

<template>
  <div id="divSelect">
    <h3>Journal from <input type="date" v-bind:value="date" ref="dateInput" @input="dateChanged" /></h3>
  </div>
  <div id="divQuantity">
      <h3 class="my-4">Add a food for today's meal</h3>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-select v-model="selectedFood" :items="allFoods" :rules="foodSelectedRules"></v-select>
        <v-text-field id="quantityInput" v-model="quantityInput" label="Quantity"
        :rules="quantityRules"></v-text-field>
          <v-btn id="btnAddFood" :disabled="!valid" @click="addFood"><v-icon>mdi-plus</v-icon></v-btn>
      </v-form>
      <v-alert v-if="successAlert" type="success" :value="true">
          Added food successfully.
      </v-alert>
    </div>
  
  <h2 v-if="hasNoMeal" style="text-align:center;">No meal registered for this date <v-icon class="pl-3" icon="mdi-cancel"></v-icon></h2>
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

    <v-container id="summary" align="center" >
      <v-row>
        <v-col cols="12">
          <h2 id="summaryTitle">Nutrition score</h2>
        </v-col>
        <v-col cols="12" id="calorie">
          <v-card v-if="hasCaloriesLeft" class="elevation-1" color="primary" dark>
            <v-card-title class="headline white--text">Calories left</v-card-title>
            <v-card-text >{{ caloriesLeft }}</v-card-text>
          </v-card>
          <v-card v-else class="elevation-1" color="warning" dark>
            <v-card-title class="headline white--text">Calories surplus</v-card-title>
            <v-card-text class="white--text">{{ -1 * caloriesLeft }}</v-card-text>
          </v-card>
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

#divSelect{
  width: 40%;
  min-width: 70%;
  margin: auto;
  text-align: center;
  margin-top: 2cm;
  margin-bottom: 1.5cm;
}

#divQuantity {
  min-width: 70%;
  width: 50%;
  margin: auto;
  text-align: center;
  margin-top: 4%;
  margin-bottom: 5%;
  background-color: #1b1b1b;
  padding: 5%;
}

#btnAddFood{
  margin-top: 6%;
  font-weight: bolder;
  border-radius: 100%;
  height: 60px;
  background-color: #42c78c;
  color: white;
  transition: all 0.4s ease;
}

#btnAddFood:hover{
  transform: scale(1.07);
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

#calorie {
  display: flex;
  justify-content: center;
  color: white;
}

#summary {
  display: flex; 
  justify-content: center;
  margin-top: 8%;
  margin-bottom: 8%;
}

#summaryTitle {
  font-weight: bolder;
  font-size: 2.6em;
  margin-bottom: 2%;
  margin-top: 2%;
}

</style>