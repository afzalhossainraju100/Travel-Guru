import React, { useContext } from "react";
import AuthContext from "../../Contextx/AuthContext/AuthContext";

const Home = () => {
  const authInfo = useContext(AuthContext);
  console.log(authInfo);
  return (
    <div>
      <h1>Hy I am home</h1>
    </div>
  );
};

export default Home;
