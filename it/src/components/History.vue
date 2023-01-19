<script lang="ts">
import * as c3 from 'c3'
import * as d3 from 'd3'
import axios from 'axios'

export default {
  data() {
    return {
      foodList: [],
      foodCount: [
        {name: 'concombre', value: 30},
        {name: 'pizza quatro fromagi', value: 200},
        {name: 'spaghetti', value: 100},
        {name: 'kinder', value: 400},
        {name: 'pizza margaritte', value: 150},
        {name: 'steak de boeuf', value: 250}
      ]
    }
  },
  created() {
    this.getCount()
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
        } catch (error) {
        console.error(error)
        }
    },
  },
  mounted() {
    let data = {
      x: 'x',
      columns: [
        ['x'].concat(this.foodCount.map(item => item.name)),
        ['data1'].concat(this.foodCount.map(item => item.value))
      ],
      type: 'bar'
    };

    let chart = c3.generate({
      bindto: '#chart',
      data: data,
      axis: {
        x: {
          type: 'category',
        }
      }
    });
  }
}
</script>
<template>
  <div id="contain">
    <h2>My Chart</h2>
    <div id="chart"></div>
  </div>
</template>

<style scoped>
#chart {
  width: 100%;
}

#contain {
  display: flex;
  margin-top: 10%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 800px;
  padding: 2em;
  background-color: rgb(56, 56, 56);
  border-radius: 20px;
}


</style>
