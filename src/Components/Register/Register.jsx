import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import HomeBg from "../../assets/images/Rectangle1.png";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from '../../Firebase/Firebase.init';

const Register = () => {
  const { createUser } = useContext(AuthContext);

  const handleRegister = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    createUser(email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        e.target.reset();
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  // const handleRegister = (e) =>{
  //     e.preventDefault();
  //     const email = e.target.email.value;
  //     const password = e.target.password.value;
  //     console.log(email, password);

  //     createUserWithEmailAndPassword(auth,email,password)
  //     .then(result=>{
  //         const user = result.user;
  //         console.log(user);
  //     })
  //     .catch(error=>{
  //         alert(error.message);
  //     })
  // }
  return (
    <div
      className="hero min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${HomeBg})` }}
    >
      <div className="hero-overlay bg-slate-950/30 backdrop-blur-sm" />
      <div className="hero-content flex-col gap-10 lg:flex-row-reverse">
        <div className="text-center text-white lg:text-left max-w-xl">
          <h1 className="text-5xl font-bold drop-shadow-lg">Register Now!</h1>
          <p className="py-6 text-slate-100/90">
            Create your account to explore Bangladesh packages, plan trips, and
            keep your travel details in one place.
          </p>
        </div>
        <div className="card w-full max-w-sm shrink-0 border border-white/25 bg-white/80 shadow-2xl backdrop-blur-xl">
          <div className="card-body">
            <form action="" onSubmit={handleRegister}>
              <fieldset className="fieldset">
                <label className="label text-slate-700">Email</label>
                <input
                  name="email"
                  type="email"
                  className="input input-bordered bg-white/95"
                  placeholder="Email"
                />
                <label className="label text-slate-700">Password</label>
                <input
                  name="password"
                  type="password"
                  className="input input-bordered bg-white/95"
                  placeholder="Password"
                />
                <div>
                  <a className="link link-hover text-cyan-900">
                    Forgot password?
                  </a>
                </div>
                <button className="btn mt-4 border-none bg-cyan-900 text-white hover:bg-cyan-800">
                  Register
                </button>
              </fieldset>
            </form>
            <p className="text-slate-700">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-cyan-900 underline hover:text-cyan-700"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
