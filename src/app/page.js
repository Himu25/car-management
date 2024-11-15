"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? `${baseURL}/api/v1/signin/user`
      : `${baseURL}/api/v1/register/user`;

    const body = isLogin
      ? { email, password }
      : { first_name: firstName, last_name: lastName, email, password };

    try {
      const response = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        if (isLogin && response.data.token) {
          // Login: Set the token in a cookie and redirect to dashboard
          Cookies.set("authToken", response.data.token, { expires: 7 });
          router.push("/dashboard");
        } else if (!isLogin) {
          // Signup: Redirect to login page
          alert("Signup successful! Please log in.");
          setIsLogin(true);
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleAuth}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 border border-gray-300 rounded mb-4"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 border border-gray-300 rounded mb-4"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="mt-4 text-center">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-blue-500"
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-500"
                onClick={() => setIsLogin(true)}
              >
                Log in
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
