<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
    data() {
        return {
            // initalization
            username: localStorage.getItem('username'),
            userId: localStorage.getItem('user_id'),
            date: new Date().toISOString().slice(0, 10),
            hasToken: !!localStorage.getItem('token'),

            // client information
            client: [],
            caloriesLeft: null,
            hasCaloriesLeft: null,

            // fetch food datas and display
            hasNoMeal: false,
            meal_id: null,
            food_id: [],
            food: [],
            quantity: [],
            quantityId: [],
            foodItems: [],
            dataTable: [],

            // summary
            totalCalories: 0,
            totalProtein: 0,
            totalFat: 0,
            totalCarbs: 0,

            // add food dialog
            allFoods: [],
            allFoodsData: [],
            selectedFood: null,
            selectedFoodId: null,
            quantityInput: null,
            quantityRules: [
                v => !!v || 'Quantity is required',
                v => !isNaN(v) || 'Quantity must be a number',
                v => v > 0 || 'Quantity must be greater than 0',
                v => v.length <= 5 || 'Quantity must be less than 5 characters',
            ],
            foodSelectedRules: [
                v => !!v || 'Food is required',
            ],
            valid: false,
            successAlert: false,

            // delete food dialog
            confirmationDialog: false,
            quantityToDelete: null,

            // edit food dialog
            errorEditAlert: false,

            // food count for plot
            foodCount: [],

            // plot
            chart: null,
        }
    },

    created() {
        this.userId = localStorage.getItem('user_id')
        this.getMealByDateAndUser(),
            this.getFoods(),
            this.getClient()

        // plot
        this.getFoodCount()
    },

    methods: {
        async getMealByDateAndUser() {
            const token = localStorage.getItem('token')
            try {
                const response = await axios.get('meal/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                    params: {
                        id_user: this.userId,
                        date: this.date,
                    }
                })
                // if there is no meal for today
                if (response.data.length == 0) {
                    this.hasNoMeal = true
                } else {
                    this.hasNoMeal = false
                    this.meal_id = response.data[0].id
                    // get quantity by meal from today
                    this.getQuantityByMeal()
                }
            } catch (error) {
                // further error handling here -> next release
                console.error(error);
            }
        },

        async getQuantityByMeal() {
            const token = localStorage.getItem('token')
            try {
                const response = await axios.get('quantity/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                    params: {
                        id_meal: this.meal_id,
                    }
                })
                // get food id and quantity information
                for (let i = 0; i < response.data.length; i++) {
                    this.food_id.push(response.data[i].id_food)
                    this.quantity.push(response.data[i].gram)
                    this.quantityId.push(response.data[i].id)
                }
                // if there no food for today -> delete meal
                if (this.food_id.length == 0) {
                    this.hasNoMeal = true
                    await this.deleteMeal()
                } else {
                    this.hasNoMeal = false
                }
                // get food by id
                this.getFoodById()
            } catch (error) {
                // further error handling here -> next release
                console.error(error)
            }
        },

        async getFoods() {
            const token = localStorage.getItem('token')
            try {
                const response = await axios.get('food/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                })
                // get food name and id
                for (let i = 0; i < response.data.length; i++) {
                    this.allFoodsData.push({
                        name: response.data[i].name,
                        id: response.data[i].id,
                    })
                    this.allFoods.push(response.data[i].name)
                }
            } catch (error) {
                // further error handling here -> next release
                console.error(error);
            }
        },

        async getClient() {
            const token = localStorage.getItem('token')
            try {
                const response = await axios.get('client/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                    params: {
                        id_user: this.userId,
                    }
                })
                // save client information
                this.client = response.data[0]
            } catch (error) {
                // further error handling here -> next release
                console.error(error)
            }
        },

        calculateBMR() {
            // used to calculate calories left for the day adapted for the userå
            // ref : https://www.calculator.net/bmr-calculator.html
            return 10 * this.client.weight_kg + 6.25 * this.client.height_cm
        },

        async createMeal() {
            const token = localStorage.getItem('token')
            try {
                const response = await axios.post('meal/', {
                    id_user: this.userId,
                    date: this.date,
                }, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                // return the id of the meal created
                return response.data.id
            } catch (error) {
                // further error handling here -> next release
                console.error(error.response)
            }
        },

        async addFood() {
            // if there is no meal for today -> create one
            if (this.hasNoMeal) {
                this.meal_id = await this.createMeal()
                this.hasNoMeal = false
            }

            // get the id of the selected food
            for (let i = 0; i < this.allFoodsData.length; i++) {
                if (this.allFoodsData[i].name == this.selectedFood) {
                    this.selectedFoodId = this.allFoodsData[i].id
                }
            }

            // add quantity to the database
            const token = localStorage.getItem('token')
            try {
                const response = await axios.post('quantity/', {
                    gram: this.quantityInput,
                    id_food: this.selectedFoodId,
                    id_meal: this.meal_id,
                }, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });

                if (!this.hasNoMeal) {
                    // deactivate add button for security purposes
                    // for 3 seconds -> not to add the same food twice
                    this.valid = false
                    setTimeout(() => {
                        this.valid = true
                    }, 3000)

                    // clear the table
                    this.clearTable()
                    // add elements to the table
                    this.getMealByDateAndUser()
                    // plot the graph
                    this.createChart()
                }
                // show that the food was added
                this.successAlert = true
                setTimeout(() => {
                    this.successAlert = false
                }, 3000)
            } catch (error) {
                // further error handling here -> next release
                console.error(error.response)
            }
        },

        async getFoodById() {
            const token = localStorage.getItem('token')
            try {
                for (let i = 0; i < this.food_id.length; i++) {
                    const response = await axios.get('food/', {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                        params: {
                            id: this.food_id[i],
                        }
                    })
                    // save the food in an array
                    this.food.push(response.data[0])
                }
                // create a new object that contains the food and the quantity and calories per 100g
                this.foodItems = this.food.map((food, i) => {
                    return {
                        id: food.id,
                        name: food.name,
                        quantity: this.quantity[i],
                        quantityId: this.quantityId[i],
                        calories: food.energy_kcal,
                        protein: food.proteins_g,
                        fat: food.lipids_g,
                        carbs: food.carbohydrates_g,
                    }
                })
                // calculate the total calories, protein, fat and carbs
                this.summary()
            } catch (error) {
                // further error handling here -> next release
                console.error(error)
            }
        },

        async summary() {
            // calculate the total calories, protein, fat and carbs for the day and calories left
            for (let i = 0; i < this.foodItems.length; i++) {
                this.totalCalories += Math.round(this.foodItems[i].calories * this.foodItems[i].quantity / 100)
                this.totalProtein += Math.round(this.foodItems[i].protein * this.foodItems[i].quantity / 100)
                this.totalFat += Math.round(this.foodItems[i].fat * this.foodItems[i].quantity / 100)
                this.totalCarbs += Math.round(this.foodItems[i].carbs * this.foodItems[i].quantity / 100)
            }
            this.caloriesLeft = this.calculateBMR() - this.totalCalories
            // if the user has no calories left switch the color of the calories left
            if (this.caloriesLeft < 0) {
                this.hasCaloriesLeft = false
            } else {
                this.hasCaloriesLeft = true
            }
        },

        async clearTable() {
            this.foodItems = []
            this.dataTable = []
            this.food = []
            this.food_id = []
            this.quantity = []
            this.quantityId = []
            this.totalCalories = 0
            this.totalProtein = 0
            this.totalFat = 0
            this.totalCarbs = 0
            this.caloriesLeft = 0
            this.quantityToDelete = null
        },

        async dateChanged() {
            // if date is changed -> clear the table and get the meal for the new date
            this.clearTable()
            const date = this.$refs.dateInput.value;
            this.date = new Date(date).toISOString().slice(0, 10);
            this.getMealByDateAndUser()
        },

        // dialog for deleting food
        openConfirmationDialog(itemId) {
            this.confirmationDialog = true;
            this.selectedId = itemId;
        },
        deleteItem(itemId) {
            this.confirmationDialog = false;
            this.deleteFood(itemId);
        },

        async deleteFood(itemId) {
            // delete food quantity from the database
            this.quantityToDelete = this.foodItems.find(x => x.id === itemId).quantityId
            const token = localStorage.getItem('token')
            try {
                const response = await axios.delete('quantity/' + this.quantityToDelete, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                })
                // clear the table
                this.clearTable()
                // add changed elements to the table
                // if there is no food left it automatically deletes the meal
                this.getMealByDateAndUser()
                // plot the graph
                this.createChart()
            } catch (error) {
                // further error handling here -> next release
                console.error(error)
            }
        },

        async deleteMeal() {
            // delete meal from the database
            this.mealToDelete = this.meal_id
            const token = localStorage.getItem('token')
            try {
                const response = await axios.delete('meal/' + this.meal_id, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                })
                this.clearTable()
                this.getMealByDateAndUser()
                if (this.foodItems.length == 0) {
                    this.hasNoMeal = true
                }
            } catch (error) {
                // further error handling here -> next release
                console.error(error)
            }
        },

        async updateQuantity(id, quantity) {
            // update the quantity of the food in the database

            // quantity must be between 1 and 99999 and a number
            if (quantity < 1 || quantity > 99999 || quantity == null || isNaN(quantity)) {
                // show alert
                this.errorEditAlert = true
                setTimeout(() => {
                    this.errorEditAlert = false
                }, 3000)
            } else {
                // get the quantity id
                const quantityId = this.foodItems.find(x => x.id === id).quantityId

                const token = localStorage.getItem('token')
                try {
                    const response = await axios.patch('quantity/' + quantityId + '/', {
                        gram: quantity,
                        id_food: id,
                        id_meal: this.meal_id,
                    }, {
                        headers: {
                            'Authorization': `Token ${token}`,
                        }
                    })
                } catch (error) {
                    // further error handling here -> next release
                    console.error(error)
                }
            }
        },

        async getFoodCount() {
            // get food count for plot
            const token = localStorage.getItem('token')
            try {
                const response = await axios.get('foodcount?id_user=' + this.userId, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                })
                // save the counts in the foodCount array
                this.foodCount = response.data
            } catch (error) {
                // further error handling here -> next release
                console.error(error)
            }
        },

        async createChart() {
            await this.getFoodCount()

            // get the names of the foods
            const foods = this.foodCount.map((food) => food.name);
            // get the counts of the foods
            const counts = this.foodCount.map((food) => food.count);

            // on crée le graphe
            const ctx = document.getElementById('chart');

            // if the chart already exists -> destroy it and create a new one
            // necessary for the plot to update
            if (this.chart) {
                this.chart.destroy();
            }

            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: foods,
                    datasets: [{
                        label: 'Count all your food',
                        data: counts,
                        backgroundColor: 'rgba(75, 235, 165, 0.2)',
                        borderColor: 'rgba(75, 235, 165, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    },
    mounted() {
        this.createChart()
    },
}
</script>

<template>
<div class="plot">
    <canvas id="chart"></canvas>
</div>
<div id="divSelect">
    <h3>Journal from <input type="date" v-bind:value="date" ref="dateInput" @input="dateChanged" /></h3>
</div>
<div id="divQuantity">
    <h3 class="my-4">Add a food for today's meal</h3>
    <v-form ref="form" v-model="valid" lazy-validation>
        <v-select v-model="selectedFood" :items="allFoods" :rules="foodSelectedRules"></v-select>
        <v-text-field id="quantityInput" v-model="quantityInput" label="Quantity" :rules="quantityRules"></v-text-field>
        <v-btn id="btnAddFood" :disabled="!valid" @click="addFood">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
    </v-form>
    <v-alert v-if="successAlert" type="success" :value="true">
        Added food successfully.
    </v-alert>
</div>

<h2 v-if="hasNoMeal" style="text-align:center;">No meal registered for this date <v-icon class="pl-3" icon="mdi-cancel"></v-icon>
</h2>
<div id="content" v-else>
    <v-dialog v-model="confirmationDialog" max-width="290">
        <v-card>
            <v-card-title class="headline">Confirmation</v-card-title>
            <v-card-text>Are you sure you want to delete this item?</v-card-text>
            <v-card-actions>
                <v-btn color="green darken-1" text @click="confirmationDialog = false">Cancel</v-btn>
                <v-btn color="red darken-1" text @click="deleteItem(selectedId)">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-alert class="mx-auto" v-if="errorEditAlert" type="error" :value="true" width="70%">
        Please enter a valid quantity.
        Must be a number between 1 and 99999.
    </v-alert>
    <v-table id="table" fixed-header height="300px" :items="dataTable">
        <thead>
            <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Quantity [g]</th>
                <th class="text-left hide-small">Calories</th>
                <th class="text-left hide">Protein</th>
                <th class="text-left hide">Carbs</th>
                <th class="text-left hide">Fat</th>
                <th class="text-left">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in foodItems" :key="item.name">
                <td id="pop">{{ item.name }}</td>
                <td>
                    <b>
                        <input v-model.number="item.quantity" @input="updateQuantity(item.id, item.quantity)" type="number" min="1" max="99999" step="10">
                    </b>
                </td>
                <td class="hide-small"><b>{{ item.calories * item.quantity / 100 }} kcal</b></td>
                <td class="hide">{{ item.protein * item.quantity / 100 }}g</td>
                <td class="hide">{{ item.carbs * item.quantity / 100 }}g</td>
                <td class="hide">{{ item.fat * item.quantity / 100 }}g</td>
                <td>
                    <v-btn color="error" @click="openConfirmationDialog(item.id)">x</v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>

    <v-container id="summary" align="center">
        <v-row>
            <v-col cols="12">
                <h2 id="summaryTitle">Nutrition score</h2>
            </v-col>
            <v-col cols="12" id="calorie">
                <v-card v-if="hasCaloriesLeft" class="elevation-1" color="primary" dark>
                    <v-card-title class="headline white--text">Calories left</v-card-title>
                    <v-card-text>{{ caloriesLeft }}</v-card-text>
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

#divSelect {
    width: 80%;
    min-width: 50%;
    margin: auto;
    text-align: center;
    margin-top: 2cm;
}

#divQuantity {
    width: 60%;
    min-width: 50%;
    margin: auto;
    text-align: center;
    margin-top: 1%;
    margin-bottom: 5%;
    padding: 5%;
}

#btnAddFood {
    margin-top: 6%;
    font-weight: bolder;
    border-radius: 100%;
    height: 60px;
    background-color: #42c78c;
    color: white;
    transition: all 0.4s ease;
}

#btnAddFood:hover {
    transform: scale(1.07);
}

input[type="date"] {
    padding: 0.5rem;
    border-radius: 4px;
    background-color: #1e1e1e;
    transition: all 0.6s ease;
    color: white;
    font-weight: bolder;
}

input[type="date"]:hover {
    cursor: pointer;
    scale: 1.04;
}

#table {
    width: 85%;
    min-width: 50%;
    margin: auto;
    border-radius: 3px;
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

.plot {
    margin-top: 30px;
    width: 72%;
    margin: auto;
}

#chart {
    margin-top: 10%;
    margin-bottom: 5%;
}

@media only screen and (max-width: 600px) {
    .hide {
        display: none;
    }
}

@media only screen and (max-width: 400px) {
    .hide-small {
        display: none;
    }
}
</style>
