import axios from "axios";

const API = axios.create({
  baseURL: "https://bitcoin-investment-platform-ovvr.onrender.com/api",
});

export default API;