import axios from "axios";

function LandingPage({ currentUser }) {
  return currentUser ? <h1>You are logged in</h1>:<h1>You are not logged in</h1>
}

export async function getServerSideProps({ req, res }) {
  const response = await axios.get(
    "http://localhost:4000/api/users/currentuser",
    {
      headers: req.headers,
    }
  );
  return {
    props: response.data,
  };
}

export default LandingPage;
