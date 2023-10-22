import "bootstrap/dist/css/bootstrap.css";
import Header from "../components/header";
import axios from "axios";

const AppComponent = ({ Component, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const { req } = appContext.ctx;
  const { data } = await axios.get(
    "http://localhost:4000/api/users/currentuser",
    {
      headers: req.headers,
    }
  );

  return {
    ...data,
  };
};

export default AppComponent;
