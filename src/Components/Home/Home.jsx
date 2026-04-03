import React, { useContext } from "react";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import HomeBg from "../../assets/images/Rectangle1.png";

const Home = () => {
  const authInfo = useContext(AuthContext);
  console.log(authInfo);
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
      style={{ backgroundImage: `url(${HomeBg})` }}
    >
      <div className="flex ">
        <div className="w-[90%] md:w-[80%] lg:w-[70%] mx-auto text-white bg-black/45 backdrop-blur-[1px] rounded-2xl p-6 md:p-10 shadow-2xl border border-white/20">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-wide drop-shadow-lg">
            Enjoy Your Vacations With <br></br>Travel Guru
          </h1>
          <button className="bg-[#F9A51A] hover:bg-blue-700 text-[#000000] font-bold py-2 px-6 rounded mt-4 flex items-center gap-2">
            Get Started →
          </button>
        </div>
        <div className="">

        </div>
      </div>
    </div>
  );
};

export default Home;
