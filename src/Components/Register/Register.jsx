import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import HomeBg from "../../assets/images/Rectangle1.png";
import { createUserProfile } from "../../services/userService";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from '../../Firebase/Firebase.init';

const Register = () => {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      setSubmitError("Email and password are required.");
      setSubmitting(false);
      return;
    }

    try {
      await createUser(email, password);

      const payload = {
        name: "",
        email,
        // Backend should hash this password before persisting.
        password,
        phoneNumber: "",
        address: "",
        profileImage: "",
        role: "user",
        travelStyle: "",
        preferences: [],
        wishlist: [],
        bookingHistory: [],
        createdAt: new Date().toISOString(),
      };

      const saved = await createUserProfile(payload);
      if (!saved) {
        setSubmitError("Account created, but failed to save user in database.");
        return;
      }

      e.target.reset();
      navigate("/profile");
    } catch (error) {
      setSubmitError(error?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
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
                  className="input input-bordered bg-white/95 text-black"
                  placeholder="Email"
                  required
                />
                <label className="label text-slate-700">Password</label>
                <input
                  name="password"
                  type="password"
                  className="input input-bordered bg-white/95 text-black"
                  placeholder="Password"
                  minLength={6}
                  required
                />
                <div>
                  <a className="link link-hover text-cyan-900">
                    Forgot password?
                  </a>
                </div>
                <button
                  disabled={submitting}
                  className="btn mt-4 border-none bg-cyan-900 text-white hover:bg-cyan-800 disabled:opacity-60"
                >
                  {submitting ? "Signing up..." : "Register"}
                </button>
              </fieldset>
            </form>
            {submitError ? (
              <p className="mt-2 text-sm font-medium text-rose-700">
                {submitError}
              </p>
            ) : null}
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
