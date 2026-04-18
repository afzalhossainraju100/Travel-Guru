import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import HomeBg from "../../assets/images/Rectangle1.png";

const Login = () => {
  const authInfo = useContext(AuthContext);
  const { signInUser, resetPassword } = authInfo || {};
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from?.pathname || location.state?.from || "/";

  const handleLogin = (e) => {
    e.preventDefault();

    signInUser(email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        e.target.reset();
        setEmail("");
        setPassword("");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const resetEmail = email.trim() || window.prompt("Enter your email address for password reset");

    if (!resetEmail) {
      return;
    }

    try {
      await resetPassword(resetEmail);
      alert(`Password reset email sent to ${resetEmail}`);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className="hero min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${HomeBg})` }}
    >
      <div className="hero-overlay bg-slate-950/30 backdrop-blur-sm" />
      <div className="hero-content flex-col gap-10 lg:flex-row-reverse">
        <div className="text-center text-white lg:text-left max-w-xl">
          <h1 className="text-5xl font-bold drop-shadow-lg">Login now!</h1>
          <p className="py-6 text-slate-100/90">
            Continue your travel journey, explore Bangladesh packages, and keep
            your trip plans ready in one place.
          </p>
        </div>
        <div className="card w-full max-w-sm shrink-0 border border-white/25 bg-white/80 shadow-2xl backdrop-blur-xl">
          <div className="card-body">
            <form action="" onSubmit={handleLogin}>
              <fieldset className="fieldset">
                <label className="label text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered bg-white/95 text-black"
                  placeholder="Email"
                />
                <label className="label text-slate-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered bg-white/95 text-black"
                  placeholder="Password"
                />
                <div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="link link-hover text-left text-cyan-900"
                  >
                    Forgot password?
                  </button>
                </div>
                <button className="btn mt-4 border-none bg-cyan-900 text-white hover:bg-cyan-800">
                  Login
                </button>
              </fieldset>
            </form>
            <p className="text-slate-700">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-cyan-900 underline hover:text-cyan-700"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
