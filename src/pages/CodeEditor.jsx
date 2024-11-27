import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/Untitled 1.png";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Avatar from "react-avatar";

function CodeEditor() {
  const [users, setUsers] = useState([]);
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const param = useParams();
  const roomId = param.roomId;
  console.log(param);
  const codeRef = useRef(null);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("roomId has been copied")
    } catch (error) {
      toast.error("could not copy roomId");
      console.log("failed to copy roomId");
    }
  }

  const leaveRoom = () => {
    socketRef.current.emit(ACTIONS.LEAVE, { roomId });
    navigate('/');
  }

  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();

        // Centralized error handling
        const handleError = (err) => {
          console.error('Socket error:', err);
          toast.error("Socket connection failed. Try again later.");
          navigate('/');
        };

        // Listen for socket connection errors
        socketRef.current.on('connect_error', handleError);
        socketRef.current.on('connect_failed', handleError);

        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          userName: location.state?.userName,
        });

        // Listen for join event
        socketRef.current.on(ACTIONS.JOINED, ({ clients, userName, socketId }) => {
          if (userName !== location.state?.userName) {
            toast.success(`${userName} joined the room.`);
          }
          setUsers(clients);

          // Request code for newly joined user
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        });

        // Listen for disconnect event
        socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
          toast.info(`${userName} left the room.`);
          setUsers((prev) => prev.filter((user) => user.socketId !== socketId));
        });
      } catch (error) {
        console.error("Initialization error:", error);
        toast.error("Failed to initialize connection.");
        navigate('/');
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, [navigate, location.state?.userName, roomId]);


  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      
      <aside className="w-1/5 bg-gray-800 p-6 flex flex-col justify-between">
        {/* Logo and Title */}
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={logo}
              alt="Code Sync Logo"
              className="w-12 h-12 rounded-full border-2 border-gray-700"
            />
            <div>
              <h1 className="text-xl font-bold text-teal-400">Code Sync</h1>
              <p className="text-sm text-gray-400">Realtime Collaboration</p>
            </div>
          </div>

          {/* Connected Users */}
          <div>
            <h2 className="text-lg font-semibold text-teal-300 mb-4">Connected</h2>
            <div className="space-y-4">
              {/* Current User */}
              {
                users.map((user) => {
                  // console.log(user);
                  return (
                    <div className="flex items-center space-x-3">
                      {/* React Avatar for the profile */}
                      <Avatar
                        name={user.userName}
                        size="40"
                        round={true}
                        className="border-2 border-teal-400"
                        textSizeRatio={2} // Adjusts the font size of initials
                      />
                      <p className="font-medium text-teal-300">{user.userName}</p>
                    </div>
                  )
                })
              }
              {/* Placeholder for upcoming users */}
              <div className="text-gray-500 italic">Waiting for other users...</div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="mt-6">
          <button onClick={copyRoomId} className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium px-4 py-2 rounded-lg mb-4 transition">
            Copy ROOM ID
          </button>
          <button onClick={leaveRoom} className="w-full bg-red-500 hover:bg-red-600 text-gray-900 font-medium px-4 py-2 rounded-lg transition">
            Leave
          </button>
        </div>
      </aside>

      {/* Code Editor (80% width) */}
      <main className="w-4/5 bg-gray-900 p-4" style={{ height: "100vh" }}>
        <div className="h-full">
          <Editor socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
      </main>

    </div>
  );
}

export default CodeEditor;
