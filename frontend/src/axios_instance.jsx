import axios from "axios";

let axiosInstance= axios.create({
  baseURL: "http://localhost:8000",  // your backend URL
});
export default axiosInstance;
