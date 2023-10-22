import axios from "axios";
import Link from "next/link";
import { Router } from "next/router";
import useRequest from "../hooks/use-request";

export default ({ currentUser }) => {
  const onSignOut = async (event) => {
    event.preventDefault();
    try {
      const { response } = await axios.post(
        "http://localhost:4000/api/users/signout",
        {},
        { withCredentials: true }
      );
      Router.push('/')
    } catch (err) {
      console.log(err);
    }
  };
  const validationButtons = !currentUser ? (
    <div>
      <Link className="nav-link" href="/auth/signin">
        Sign In
      </Link>
      <Link className="nav-link" href="/auth/signup">
        Sign Up
      </Link>
    </div>
  ) : (
    <button className="btn btn-primary" onClick={onSignOut}>
      Sign Out
    </button>
  );

  return (
    <nav className="navbar navbar-light bg-light">
      <Link className="navbar-brand" href="/">
        GitTix
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{validationButtons}</ul>
      </div>
    </nav>
  );
};
