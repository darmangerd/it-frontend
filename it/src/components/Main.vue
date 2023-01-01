<template>
    <div>
      <ul>
        <li v-for="item in data" :key="item.id_user">{{ item.height_cm + item.gender }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        data: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        const token = localStorage.getItem('token')
        try {
          const response = await axios.get(axios.defaults.baseURL + 'client/', {
            headers: {
              'Authorization': `Token ${token}`
            }
          })
          this.data = response.data
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
  </script>
  