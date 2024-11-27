import React, { useState } from "react";
import logo from "../assets/Untitled 1.png";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Home() {
    const [roomId, setRoomId] = useState("");
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    const createRoom = (e) => {
        const randomId = uuidv4();
        console.log(randomId);
        setRoomId(randomId);
        toast.success("New Room created");
    }
    const joinRoom = (e) => {
        if(!roomId || !userName){
            toast.error("ROOM ID & userName is required", {
                position: "top-center"
            })
        }
        else navigate(`/editor/${roomId}`, {
            state: {
                userName
            }
        });
    }
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center">
      {/* Header Section */}
      <div className="flex flex-col items-center space-y-4">
        <img src={logo} alt="Code Sync Logo" className="w-20 h-20 rounded-full border-2 border-gray-700" />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-teal-400">Code Sync</h1>
          <p className="text-gray-300 text-sm mt-2">Realtime Collaboration</p>
        </div>
      </div>

      {/* Room Join Section */}
      <div className="bg-gray-800 mt-10 px-6 py-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-teal-300 text-center mb-4">Join a Room</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="ROOM ID"
            className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-500"
          />
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="USERNAME"
            className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-500"
          />
          <button onClick={joinRoom} className="w-full bg-teal-500 hover:bg-teal-600 text-gray-900 font-semibold py-2 rounded-md transition">
            Join Room
          </button>
        </div>
      </div>

      {/* Create Room Section */}
      <div className="mt-6 text-sm text-gray-400">
        If you don't have an invite, create a{" "}
        <span onClick={createRoom} className="text-teal-300 font-semibold cursor-pointer hover:underline">
          new room
        </span>
      </div>
    </div>
  );
}

export default Home;
