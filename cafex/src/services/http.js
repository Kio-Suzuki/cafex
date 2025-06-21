import Axios from 'axios'

const axios = Axios.create({
  baseURL: 'http://localhost:3334/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axios
