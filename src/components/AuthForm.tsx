import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import OAuth from "./OAuth";
import Input from "./Input";
import Icon from "./Icon";
import Button from "./Button";

function AuthForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  function onChange(e: any) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e: any) {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Bad user credentials");
    }
  }

  return (
    <div className="flex justify-center flex-wrap items-center  px-6 py-12 max-w-6xl mx-auto">
      <div className="md:w-[67%] lg:w-[50%] mb-12 md:b-6">
        <img
          src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Key"
          className="w-full rounded-2xl "
        />
      </div>
      <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
        <form onSubmit={onSubmit}>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={onChange}
            name="email address"
            className="mb-6"
          />

          <div className="relative mb-6">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={onChange}
              name="password"
            />
            {showPassword ? (
              <Icon
                IconName={AiFillEyeInvisible}
                onClick={() => setShowPassword((prevState) => !prevState)}
                className="absolute right-3 top-3 "
              />
            ) : (
              <Icon
                IconName={AiFillEye}
                onClick={() => setShowPassword((prevState) => !prevState)}
                className="absolute right-3 top-3 "
              />
            )}
          </div>
          <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
            <p className="mb-6">
              Don't have a account?
              <Link
                to="/sign-up"
                className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1"
              >
                Register
              </Link>
            </p>
            <p>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
              >
                {" "}
                Forgot password?
              </Link>
            </p>
          </div>
          <Button type="submit" text="Sign In" />

          <div className="my-4 flex items-center before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
            <p className="text-center font-semibold mx-4">OR</p>
          </div>
          <OAuth />
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
