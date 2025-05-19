import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000";

const MessageIcon = (props) => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.00003 16C8.59557 16 8.23093 16.2437 8.07615 16.6173C7.92137 16.991 8.00692 17.4211 8.29292 17.7071L11.2929 20.7071C11.4805 20.8947 11.7348 21 12 21C12.2653 21 12.5196 20.8947 12.7071 20.7071L15.7071 17.7071C15.9931 17.4211 16.0787 16.991 15.9239 16.6173C15.7691 16.2436 15.4045 16 15 16L9.00003 16Z"
      fill="#152C70"
    />
    <path
      d="M7 2C4.23858 2 2 4.23858 2 7V13C2 15.7614 4.23858 18 7 18H17C19.7614 18 22 15.7614 22 13V7C22 4.23858 19.7614 2 17 2H7Z"
      fill="#4296FF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 8C6 7.44772 6.44772 7 7 7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H7C6.44772 9 6 8.55228 6 8Z"
      fill="#152C70"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z"
      fill="#152C70"
    />
  </svg>
);

const VoiceCallIcon = (props) => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 32 32"
    enableBackground="new 0 0 32 32"
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <g id="Home" />
    <g id="Print" />
    <g id="Mail" />
    <g id="Camera" />
    <g id="Video" />
    <g id="Film" />
    <g id="Message" />
    <g id="Telephone">
      <path
        d="M30,22.3l-2.5-2.5c-1.3-1.3-3.5-1.3-4.8,0l-0.8,0.8c-0.5,0.5-1.4,0.5-2,0l-4.2-4.2l-4.2-4.2   c-0.3-0.3-0.4-0.6-0.4-1s0.1-0.7,0.4-1l0.9-0.8c1.3-1.3,1.3-3.5,0-4.8L9.7,2C8.5,0.7,6.2,0.7,4.9,2L4.1,2.8c-2,2-3.1,4.6-3.1,7.5   s1.1,5.5,3.1,7.5l5.1,5.1l5.1,5.1c2,2,4.7,3.1,7.5,3.1s5.5-1.1,7.5-3.1l0.9-0.8c0.6-0.6,1-1.5,1-2.4C31,23.8,30.7,22.9,30,22.3z"
        fill="#4DAF50"
      />
      <g>
        <path
          d="M16,5c-0.5,0-1,0.5-1,1s0.5,1,1,1c2.5,0,4.7,1,6.4,2.6C24,11.3,25,13.5,25,16c0,0.5,0.5,1,1,1s1-0.5,1-1    c0-3-1.2-5.8-3.2-7.8C21.8,6.2,19,5,16,5z"
          fill="#FE9803"
        />
        <path
          d="M27.8,4.2C25.8,2.2,23,1,20,1c-0.5,0-1,0.5-1,1s0.5,1,1,1c2.5,0,4.7,1,6.4,2.6C28,7.3,29,9.5,29,12    c0,0.5,0.5,1,1,1s1-0.5,1-1C31,9,29.8,6.2,27.8,4.2z"
          fill="#FE9803"
        />
      </g>
    </g>
    <g id="User" />
    <g id="File" />
    <g id="Folder" />
    <g id="Map" />
    <g id="Download" />
    <g id="Upload" />
    <g id="Video_Recorder" />
    <g id="Schedule" />
    <g id="Cart" />
    <g id="Setting" />
    <g id="Search" />
    <g id="Pencils" />
    <g id="Group" />
    <g id="Record" />
    <g id="Headphone" />
    <g id="Music_Player" />
    <g id="Sound_On" />
    <g id="Sound_Off" />
    <g id="Lock" />
    <g id="Lock_open" />
    <g id="Love" />
    <g id="Favorite" />
    <g id="Film_1_" />
    <g id="Music" />
    <g id="Puzzle" />
    <g id="Turn_Off" />
    <g id="Book" />
    <g id="Save" />
    <g id="Reload" />
    <g id="Trash" />
    <g id="Tag" />
    <g id="Link" />
    <g id="Like" />
    <g id="Bad" />
    <g id="Gallery" />
    <g id="Add" />
    <g id="Close" />
    <g id="Forward" />
    <g id="Back" />
    <g id="Buy" />
    <g id="Mac" />
    <g id="Laptop" />
  </svg>
);

const VideoCallIcon = (props) => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 48 48"
    {...props}
  >
    <path
      fill="#4CAF50"
      d="M8,12h22c2.2,0,4,1.8,4,4v16c0,2.2-1.8,4-4,4H8c-2.2,0-4-1.8-4-4V16C4,13.8,5.8,12,8,12z"
    />
    <polygon fill="#388E3C" points="44,35 34,29 34,19 44,13" />
  </svg>
);
const App = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const usernameRef = useRef("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to server:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });

    newSocket.on("users", (users) => {
      console.log("📥 Received users from server:", users);
      setOnlineUsers(users.filter((u) => u !== usernameRef.current));
    });

    newSocket.onAny((event, data) => {
      console.log("🔔 Event:", event, data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleLogin = () => {
    if (username.trim() && socket) {
      const cleaned = username.trim().toLowerCase();
      usernameRef.current = cleaned;
      setUsername(cleaned);
      socket.emit("login", cleaned);
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10 font-sans">
      {!isLoggedIn ? (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Enter your username
          </h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">
            Welcome, <span className="capitalize">{username}</span>
          </h2>
          <h3 className="text-xl font-medium mb-4 text-gray-700">Online Users:</h3>

          {onlineUsers.length > 0 ? (
            <ul className="space-y-3">
              {onlineUsers.map((user, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm hover:shadow-md transition"
                >
                  <span className="text-gray-800 capitalize font-medium">{user}</span>
                  <div className="flex space-x-4">
                    <MessageIcon />
                    <VoiceCallIcon />
                    <VideoCallIcon />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-600 font-semibold">
              🛑 No other users online or failed to filter correctly.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
