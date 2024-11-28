import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import logo from "../assets/Untitled 1.png";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const navigate = useNavigate();

  // Google login handler
  const loginHandler = useGoogleLogin({
    onSuccess: (codeResp) => {
      console.log("Login Success:", codeResp);
      getProfileDetails(codeResp.access_token);
    },
    onError: (err) => {
      console.error("Login Error:", err);
      toast.error("Google Login failed. Please try again.");
    },
  });

  // Fetch profile details using the access token
  const getProfileDetails = async (accessToken) => {
    try {
      const response = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Profile Details:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Logged in successfully!");
      setShowGoogleLogin(false);
      navigateToEditor(); // Proceed to room join after login
    } catch (error) {
      console.error("Error fetching profile details:", error);
      toast.error("Error fetching profile details. Please try again.");
    }
  };

  // Create a new room with a random ID
  const createRoom = () => {
    const randomId = uuidv4();
    setRoomId(randomId);
    toast.success("New Room created");
  };

  // Check if user can join the room
  const checkAndJoinRoom = () => {
    if (!roomId || !userName) {
      toast.error("ROOM ID & Username are required", {
        position: "top-center",
      });
      return;
    }
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    console.log("stored user", storedUser);
    if (!storedUser) {
      toast.info("Please log in with Google to continue.");
      setShowGoogleLogin(true);
      return;
    }
    console.log("showGoogleLogin", showGoogleLogin);

    navigateToEditor(); // Navigate if already logged in
  };

  // Navigate to editor page
  const navigateToEditor = () => {
    navigate(`/editor/${roomId}`, {
      state: { userName },
    });
  };

  // Handle Enter key event to join room
  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      checkAndJoinRoom();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center">
      {/* Header Section */}
      <div className="flex flex-col items-center space-y-4">
        <img
          src={logo}
          alt="Code Sync Logo"
          className="w-20 h-20 rounded-full border-2 border-gray-700"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-teal-400">Code Sync</h1>
          <p className="text-gray-300 text-sm mt-2">Realtime Collaboration</p>
        </div>
      </div>

      {/* Room Join Section */}
      <div className="bg-gray-800 mt-10 px-6 py-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-teal-300 text-center mb-4">
          Join a Room
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyDown={handleEnterKey}
            placeholder="ROOM ID"
            className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-500"
          />
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={handleEnterKey}
            placeholder="USERNAME"
            className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-500"
          />
          <button
            onClick={checkAndJoinRoom}
            className="w-full bg-teal-500 hover:bg-teal-600 text-gray-900 font-semibold py-2 rounded-md transition"
          >
            Join Room
          </button>
        </div>
      </div>

      {/* Google Login Section */}
      {showGoogleLogin && (
        <div className="mt-6 text-sm text-gray-400">
          <button
            onClick={() => {
              console.log("Google Login button clicked");
              loginHandler(); // Make sure login handler is called
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Log in with Google
          </button>
        </div>
      )}

      {/* Create Room Section */}
      <div className="mt-6 text-sm text-gray-400">
        If you don't have an invite, create a{" "}
        <span
          onClick={createRoom}
          className="text-teal-300 font-semibold cursor-pointer hover:underline"
        >
          new room
        </span>
      </div>
    </div>
  );
}

export default Home;
