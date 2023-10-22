import axios from "axios";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log("LANDING PAGE!");
  const { req } = context;
  const { data } = await axios.get(
    "http://localhost:4000/api/users/currentuser",
    {
      headers: req.headers,
    }
  );

  return data;
};

export default LandingPage;
