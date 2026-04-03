import React, { useContext } from "react";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import HomeBg from "../../assets/images/Rectangle1.png"; 

const Home = () => {
  const authInfo = useContext(AuthContext);
  console.log(authInfo);
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${HomeBg})` }}
    >
      <h1>Hy I am home</h1>
    </div>
  );
};

export default Home;
