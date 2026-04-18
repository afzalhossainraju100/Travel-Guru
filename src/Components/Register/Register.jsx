import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../Contextx/AuthContext/AuthContext";
import HomeBg from "../../assets/images/Rectangle1.png";
import {
  createUserProfile,
  upsertGoogleUserProfile,
} from "../../services/userService";
import { FaGoogle } from "react-icons/fa6";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from '../../Firebase/Firebase.init';

const Register = () => {
  const { createUser, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const getGoogleAuthErrorMessage = (error) => {
    if (error?.code === "auth/operation-not-allowed") {
      return "Google sign-in is disabled in Firebase. Enable Google provider in the Firebase Console, then try again.";
    }

    return error?.message || "Google sign-in failed.";
  };

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

  const handleGoogleSignIn = async () => {
    setSubmitError("");
    setGoogleSubmitting(true);

    try {
      const result = await signInWithGoogle();
      const savedProfile = await upsertGoogleUserProfile(result?.user);

      if (!savedProfile) {
        throw new Error(
          "Google sign-up worked, but user profile could not be saved to the database.",
        );
      }

      navigate("/profile", { replace: true });
    } catch (error) {
      setSubmitError(getGoogleAuthErrorMessage(error));
    } finally {
      setGoogleSubmitting(false);
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
                <button
                  disabled={submitting}
                  className="btn mt-4 border-none bg-cyan-900 text-white hover:bg-cyan-800 disabled:opacity-60"
                >
                  {submitting ? "Signing up..." : "Register"}
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleSubmitting}
                  className="btn mt-2 border-none bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  <FaGoogle className="mr-2" />
                  {googleSubmitting ? "Signing up..." : "Sign Up with Google"}
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
