import axios from "axios";

let axiosInstance= axios.create({
  baseURL: "https://backend-crud-mern-gules.vercel.app",  // your backend URL
});
export default axiosInstance;
