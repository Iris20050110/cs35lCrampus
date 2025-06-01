import React from "react";
import NavBar from "./navbar";

export default function LoginRequired({
  message = "You must be signed in with a UCLA email to view this page.",
}) {
  return (
    <div className="w-screen h-screen bg-tan flex flex-col overflow-hidden font-[lexend]">
      <div className="pt-6">
        <NavBar />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <div className="bg-ash p-6 rounded-lg shadow-md w-full max-w-xl">
          <h2 className="text-2xl font-semibold text-[#305252] mb-4">
            UCLA Login Required
          </h2>
          <p className="text-gray-700 mb-6">{message}</p>
          <a
            href="http://localhost:5000/api/auth/google"
            className="bg-[#305252] text-white hover:text-white font-medium py-2 px-4 rounded transform transition duration-200 hover:bg-[#203534] no-underline"
          >
            Sign in with Google
          </a>
        </div>
      </div>
    </div>
  );
}
