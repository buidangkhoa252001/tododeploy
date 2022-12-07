import axios from "axios";

/* const BASE_URL = "https://ecommerce-laptop--app.herokuapp.com"; */
const BASE_URL = "http://localhost:8000";
const instance = axios.create({
  baseURL: BASE_URL,
});

export default instance;
