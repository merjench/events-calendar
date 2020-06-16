import axios from "axios";

export default axios.create({
  baseURL: "https://api.bizzabo.com/api/events",
});
