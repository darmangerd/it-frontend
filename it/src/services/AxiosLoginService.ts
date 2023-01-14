import axios from "axios";

export default {
    methods: {
        async login(user: any, pass: any, userId: any) {
            try {
              const response = await axios.post('http://127.0.0.1:8000/auth/login/', {
                username: user,
                password: pass
              })
  
              localStorage.setItem('token', response.data.token)
              localStorage.setItem('username', user)
              await this.getUserIdByUsername(user)
              // localStorage.setItem('user_id', this.userId)
              // console.log("user_id: ", this.userId)
              console.log(localStorage.getItem('token'))
              console.log(localStorage.getItem('username'))
              console.log(localStorage.getItem('user_id'))
              return true
              //this.$router.push('/main')
            } 
            catch (error) 
            {
                console.error(error)
                return false
            }
          },

          async getUserIdByUsername(user:any) {
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
            catch (error) 
            {
              console.error(error)
            }
          },

    },
}