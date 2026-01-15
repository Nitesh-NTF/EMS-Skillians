import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { ButtonLoader } from "../common/Loading";
import { images } from "../constants/images";
import { ReactIcons } from "../constants/react_icons";
import {
  forgotPassword,
  login as loginApi,
  resetPassword,
} from "../../service/authentication";
import { login } from "../../store/authSlice";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");
  const password = watch("password");

  async function onSubmit(data) {
    setLoading(true);
    try {
      if (pathname === "/login") {
        const res = await loginApi(data);
        dispatch(login(res.data));
        toast.success(res.message);
        navigate("/dashboard");
      } else if (pathname === "/forget-password") {
        const res = await forgotPassword(data);
        toast.success(res.message);
        // navigate("/reset-password");
      } else if (pathname === "/reset-password") {
        const res = await resetPassword({
          password: data?.password,
          token: token,
        });
        toast.success(res.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    } finally {
      reset();
      setLoading(false);
    }
  }

  return (
    <div className="relative h-screen bg-[#DCF3FE]">
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white grid grid-cols-2 w-3/4 justify-center items-center rounded-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="col-span-1 pl-10 pr-5 sm:pr-10 lg:pr-20 pt-5 sm:pt-10 lg:pt-20 pb-5 lg:pb-28 text-sm h-full min-h-100 flex items-center"
        >
          <div className="w-full">
            {/* login */}
            {pathname === "/login" && (
              <>
                <h1 className="mb-4 text-left text-lg">
                  Employee{" "}
                  <span className="relative w-full">
                    Lo
                    <span className="absolute -bottom-0.5 left-0 h-px w-full bg-[#E7873B] rounded-[50%]"></span>
                  </span>
                  gin
                </h1>
                <div className="flex items-center border-b border-gray-300 mt-3">
                  <ReactIcons.MdEmail className="text-[#E7873B] ml-2 mr-1" />
                  <input
                    className="w-full outline-none p-3"
                    disabled={loading}
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Email is required",
                      },
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email",
                      },
                    })}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex items-center border-b border-gray-300 mt-3">
                  <ReactIcons.FaLock className="text-[#E7873B]  ml-2 mr-1" />
                  <input
                    className="w-full outline-none p-3"
                    disabled={loading}
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Password is required",
                      },
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters",
                      },
                    })}
                    placeholder="Enter your password"
                  />
                </div>
                {Object.keys(errors).length > 0 && (
                  // {errors.root && (
                  <p className="text-[10px] text-red-500 mt-2">
                    {" "}
                    {errors?.email?.message ||
                      errors?.password?.message ||
                      "Please pass email and password"}
                  </p>
                )}
              </>
            )}

            {/* forget password */}
            {pathname === "/forget-password" && (
              <>
                <h1 className="mb-4 text-left text-lg">Forget Password</h1>
                <div className="flex items-center border border-gray-300 mt-3">
                  <ReactIcons.MdEmail className="text-[#E7873B] ml-2 mr-1" />
                  <input
                    className="w-full outline-none p-3"
                    disabled={loading}
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Email is required",
                      },
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email",
                      },
                    })}
                    placeholder="Enter your email"
                  />
                </div>{" "}
                {Object.keys(errors).length > 0 && (
                  // {errors.root && (
                  <p className="text-[10px] text-red-500 mt-2">
                    {" "}
                    {errors?.email?.message}
                  </p>
                )}
              </>
            )}

            {/* reset password */}
            {pathname === "/reset-password" && (
              <>
                <div className="flex items-center border-b border-gray-300 mt-3">
                  <ReactIcons.FaLock className="text-[#E7873B] ml-2 mr-1" />
                  <input
                    className="w-full outline-none p-3"
                    disabled={loading}
                    placeholder="New password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters",
                      },
                    })}
                  />
                </div>
                <div className="flex items-center border-b border-gray-300 mt-3">
                  <ReactIcons.FaLock className="text-[#E7873B] ml-2 mr-1" />
                  <input
                    className="w-full outline-none p-3"
                    disabled={loading}
                    placeholder="Confirm password"
                    {...register("confirmPassword", {
                      required: "Confirm your password",
                      validate: (value) =>
                        value === password || "Confirm password isn't same.",
                    })}
                  />
                </div>
                {Object.keys(errors).length > 0 && (
                  // {errors.root && (
                  <p className="text-[10px] text-red-500 mt-2">
                    {" "}
                    {errors?.password?.message ||
                      errors?.confirmPassword?.message ||
                      "Please pass email and password"}
                  </p>
                )}
              </>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                if (pathname === "/login") navigate("/forget-password");
                else navigate("/login");
              }}
              className="text-[#E7873B] text-sm text-start inline-block my-3"
            >
              {pathname !== "/reset-password"
                ? pathname === "/login"
                  ? "Forget password?"
                  : "Login with password!"
                : ""}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E7873B] text-white p-2 my-2 rounded-md flex items-center justify-center"
            >
              {loading ? (
                <ButtonLoader />
              ) : pathname !== "/reset-password" ? (
                pathname === "/login" ? (
                  "Login"
                ) : (
                  "Send link"
                )
              ) : (
                "Change Password"
              )}
              {/* {loading &&} */}
            </button>
            {pathname !== "/reset-password" && (
              <p className="text-gray-500 mt-1">
                Need help? Contact your administrator
              </p>
            )}
          </div>
        </form>
        <div className="col-span-1 bg-[#215675] relative w-full h-full rounded-e-lg">
          <div className="absolute bg-[#ffffff22] w-full h-full scale-75 text-center text-white text-2xl sm:text-3xl font-bold rounded-2xl p-7">
            <p>
              Very good works <br />
              are waiting for you
            </p>
          </div>
          <div className="w-full h-full absolute overflow-hidden">
            <img
              className="absolute top-20 -left-38 scale-125 z-10"
              src={images.gradient1}
            />
          </div>
          <img
            className="absolute bottom-0 -right-22 z-30"
            src={images.young_woman_working_laptop}
            alt="Login banner"
          />
        </div>
      </div>
    </div>
  );
};
