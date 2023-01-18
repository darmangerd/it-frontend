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

        // localStorage.setItem('user_id', response.data[0].id)

        // if (response.data.length > 0) {
        //   console.log(response.data[0].id);
        //   // Return the first user's ID if multiple users have the same username
        //   return response.data[0].id;
        // }
        // return null;
      }
      catch (error) {
        console.error(error)
      }
    },

  },
}