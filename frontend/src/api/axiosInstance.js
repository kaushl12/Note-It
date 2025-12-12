import axios from "axios"
import axois from "axios"

const api=axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials:true
})
export default api;