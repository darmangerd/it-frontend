import axios from "axios";

export default {
  methods: {
    async getUserIdByUsername(user: any) {
      const token = localStorage.getItem('token')
      console.log("token: ", token)
      try {
        const response = await axios.get('/users/', {
          headers: {
            'Authorization': `Token ${token}`
          },
          params: {
            username: user
          }
        })

        localStorage.setItem('user_id', response.data[0].id)
      }
      catch (error) {
        console.error(error)
      }
    },

  },
}