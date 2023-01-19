<template>
  <v-container>
    <div id="contain">
      <div v-if="hasMeal" id="chart">
        <h2>Food count</h2>
      </div>
      <div v-else>
        <h2>No meals registered yet</h2>
      </div>
      <h2 id="smallScreen">Only available for bigger screen for now :(</h2>
    </div>
</v-container>
</template>

<script lang="ts">
import * as c3 from 'c3'
import axios from 'axios'

export default {
  data() {
    return {
      foodList: [],
      hasMeal: true,
    }
  },
  created() {
    this.getCount()
  },
  mounted() {
    this.chart = c3.generate({
      bindto: '#chart',
      data: {
        json: this.foodList,
        keys: {
          x: 'name',
          value: ['count']
        },
        type: 'bar'
      },
      axis: {
        x: {
          type: 'category'
        }
      }
    });
  },
  methods: {
    async getCount() {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get('foodcount/', {
          headers: {
            'Authorization': `Token ${token}`,
          }
        })
        this.foodList = response.data
        console.log(this.foodList)
        //reload chart
        this.chart.load({
          json: this.foodList,
          keys: {
            x: 'name',
            value: ['count']
          },
          type: 'bar'
        })

        } catch (error) {
        console.error(error)
        }
    },
  },
  beforeDestroy() {
    this.chart.destroy();
  }
}
</script>

<style scoped>
* :not(h2){
  font-size: 0.94em;
}

#chart {
  width: 100%;
}

#chart text {
  stroke: white;
  display: none;
}

.c3-axis line {
  stroke: white;
}

#contain {
  display: flex;
  margin-top: 10%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 900px;
  padding-top: 4px;
  height: 100%;
  background-color: rgb(56, 56, 56);
  border-radius: 8px;
}

#smallScreen {
  display: none;
  margin: 4px;
}

@media only screen and (max-width: 950px) {
  #contain {
    width: 700px;
  }
}

@media only screen and (max-width: 700px) {
  #contain {
    width: 100%;
    margin-top: 0;
  }

  #smallScreen {
    display: block;
  }

  #chart {
    display: none;
  }
}


</style>
