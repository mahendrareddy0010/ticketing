import axios from "axios";

export default ({ req }) => {
  console.log("buildClient req.session: ", req.session);
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: "http://localhost:4000",
      headers: req.headers,
      withCredntials: true,
      credentials: "include",
    });
  } else {
    return axios.create({
      baseURL: "http://localhost:4000",
      withCredntials: true,
      credentials: "include",
    });
  }
};