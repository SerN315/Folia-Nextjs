"use client";

import { useState, useEffect, useRef } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "../firebase/authenciation";
// TODO Step 2: Firestore streak → replace with backend API call to /api/folia/streaks/:userId
import Link from "next/link";
export default function Login() {
  // State for login form

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State for sign-up form
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState(""); // New state for login error message

  // Refs for DOM manipulation
  const wrapperRef = useRef(null);
  const backgroundRef = useRef(null);
  const bodyscrollingRef = useRef(null);
  const loginFormRef = useRef(null);
  const signupFormRef = useRef(null);

  // Handle login form submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError(""); // Reset error before trying to log in
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((cred) => {
        console.log("User logged in:", cred.user);
        backgroundRef.current.classList.remove("active");
        document.querySelector(".streak").classList.remove("active");
        // document.querySelector(".fav_list").classList.remove("hidden");
        document.querySelector(".profile").style.display = "block";
        document.querySelector(".open-popup").classList.add("hidden");
        wrapperRef.current.classList.remove("active-popup");
        // bodyscrollingRef.current.classList.remove("disable-ov");
      })
      .catch((err) => {
        console.error("Login error:", err.message);
        setLoginError("Invalid email or password. Please try again."); // Set error message
      });
  };

  // Handle sign-up form submit
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Pass username directly so the backend stores it in user_metadata on creation.
    createUserWithEmailAndPassword(auth, registerEmail, registerPassword, registerUsername)
      .then(() => console.log("Sign-up successful"))
      .catch((err) => console.error("Sign-up error:", err.message));
  };

  // Handle logout

  // Handle authentication state changes
  useEffect(() => {
    const handleAuthStateChange = (user) => {
      if (user) {
        document.querySelector(".streak").classList.remove("hidden");
        document.querySelector(".ranking").classList.remove("hidden");
        // document.querySelector(".fav_list").classList.remove("hidden");
        document.querySelector(".profile__btn").classList.remove("hidden");
        document.querySelector(".login-button").classList.add("hidden");
        document.querySelector(".wrapper").classList.remove("active-popup");
        document.querySelector(".logout").classList.remove("hidden");
        document.querySelector(".user-name").textContent = user.displayName;
        document.querySelector(".user-email").textContent = user.email;
        // TODO Step 2: fetch streak from /api/folia/streaks/:userId and update .streak-cnt
        if (user.photoURL) {
          document.querySelector(".avatar").src = user.photoURL;
          document.querySelector(".detail__avatar").src = user.photoURL;
        } else {
          // If no photoURL is available, you can set a default avatar if needed
          document.querySelector(".avatar").src = "/img/avatar.png";
          document.querySelector(".detail__avatar").src = "/img/avatar.png";
        }
      }
    };

    const authListener = onAuthStateChanged(auth, handleAuthStateChange);

    // TODO Step 2: getStreak moved to backend API (/api/folia/streaks/:userId)

    // const dayStart = () => {
    //   const now = new Date();
    //   now.setHours(0, 0, 0, 0);
    //   return now.getTime();
    // };

    const attachEventListeners = () => {
      document
        .querySelector(".register-link")
        ?.addEventListener("click", () => {
          wrapperRef.current.classList.add("active");
        });
      document.querySelector(".forgot-link")?.addEventListener("click", () => {
        wrapperRef.current.classList.add("active2");
      });
      document.querySelector(".login-link")?.addEventListener("click", () => {
        wrapperRef.current.classList.remove("active");
        wrapperRef.current.classList.remove("active2");
        wrapperRef.current.classList.remove("active3");
        wrapperRef.current.classList.remove("active4");
      });
      document.querySelector(".open-popup")?.addEventListener("click", () => {
        wrapperRef.current.classList.add("active-popup");
        backgroundRef.current.classList.add("active");
        // bodyscrollingRef.current.classList.add("disable-ov");
      });
      document.querySelector(".btnFg")?.addEventListener("click", () => {
        wrapperRef.current.classList.add("active3");
        wrapperRef.current.classList.remove("active2");
      });
      document.querySelector(".btnotp")?.addEventListener("click", () => {
        wrapperRef.current.classList.add("active4");
        wrapperRef.current.classList.remove("active3");
      });
      document.querySelector(".closebtn")?.addEventListener("click", () => {
        wrapperRef.current.classList.remove("active-popup");
        backgroundRef.current.classList.remove("active");
        // bodyscrollingRef.current.classList.remove("disable-ov");
      });
    };

    attachEventListeners();

    return () => {
      authListener(); // Cleanup auth listener on component unmount
    };
  }, []);

  return (
    <>
      <div className="wrapper-background" ref={backgroundRef} />
      <div className="wrapper" ref={wrapperRef}>
        <div className="closebtn">
          <i className="fa-solid fa-xmark fa-2xl" />
        </div>
        <div className="form-box rpassword">
          <h2>Set New Password</h2>
          <form id="rpassword">
            <div className="input-box">
              <input
                type="password"
                id="newPassword"
                minLength={6}
                required
                placeholder="New Password"
              />
            </div>
            <div className="input-box">
              <input
                type="password"
                id="newconfirmPassword"
                minLength={6}
                required
                placeholder="Confirm Password"
              />
            </div>
            <button
              id="btn__reset"
              className="btnDn btn__reset btn btn-primary"
            >
              Reset Password
            </button>
            <div className="login-register">
              <p>
                <Link href="#" className="login-link">
                  Back to log in
                </Link>
              </p>
            </div>
          </form>
        </div>
        <div className="form-box OTP">
          <h2>Password Reset</h2>
          <h3>We sent a verification code to example@email</h3>
          <form id="OTP">
            <div className="input-box">
              <input type="number" id="OTPnumb1" required placeholder="Code" />
            </div>
            <div className="input-box">
              <input type="number" id="OTPnumb2" required placeholder="Code" />
            </div>
            <div className="input-box">
              <input type="number" id="OTPnumb3" required placeholder="Code" />
            </div>
            <div className="input-box">
              <input type="number" id="OTPnumb4" required placeholder="Code" />
            </div>
          </form>
          <button id="btn__forgot" className="btnotp btn__otp">
            Continue
          </button>
          <div className="login-register">
            <Link href="#" className="login-link">
              Back to log in
            </Link>
          </div>
        </div>
        <div className="form-box forgot">
          <h2>Forgot password?</h2>
          <form id="forgot">
            <div className="input-box">
              <input
                type="email"
                id="floginEmail"
                required
                placeholder="Enter your email"
              />
            </div>
            <button id="btn__forgot" className="btnFg btn__forgot">
              Send Verification Email
            </button>
            <div className="login-register">
              <Link href="#" className="login-link">
                Back to log in
              </Link>
            </div>
          </form>
        </div>
        <div className="form-box login" ref={loginFormRef}>
          <h2>LOGIN</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="input-box">
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                placeholder="Email"
              />
            </div>
            <div className="input-box">
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                minLength={8}
                required
                placeholder="Password"
              />
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <Link href="#" className="forgot-link">
                Forgot Password
              </Link>
            </div>
            {loginError && (
              <div
                id="loginAlert"
                className="alert alert-danger"
                style={{
                  marginTop: "10px",
                  color: "red",
                  fontSize: "0.9rem",
                }}
              >
                {loginError}
              </div>
            )}
            <button
              type="submit"
              id="btn__login"
              className="btnDn btn__login btn btn-primary"
            >
              Log in
            </button>
            <div className="login-register">
              <p>
                Do not have an account?
                <Link href="#" className="register-link">
                  SIGN UP
                </Link>
              </p>
            </div>
          </form>
        </div>
        <div className="form-box register" ref={signupFormRef}>
          <h2>SIGN UP</h2>
          <form onSubmit={handleSignUpSubmit}>
            <div className="input-box">
              <input
                type="text"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                required
                placeholder="Username"
              />
            </div>
            <div className="input-box">
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                placeholder="Email"
              />
            </div>
            <div className="input-box">
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Password"
              />
            </div>
            <div className="input-box">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Confirm Password"
              />
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" />I agree to the terms and conditions
              </label>
            </div>
            <div
              id="signupAlert"
              className="alert"
              role="alert"
              style={{ display: "none" }}
            >
              {/* Notification message will be set here */}
            </div>
            <button
              type="submit"
              id="btn__register"
              className="btnDk btn__register"
            >
              Sign Up
            </button>
            <div className="login-register">
              <p>
                Already have an account?
                <Link href="#" className="login-link">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
