import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import MessageIcon from "./assets/Icons/MessageIcon";
import VoiceCallIcon from "./assets/Icons/VoiceCallIcon";
import VideoCallIcon from "./assets/Icons/VideoCallIcon";

const SOCKET_SERVER_URL = "http://localhost:3000";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const usernameRef = useRef("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messageToUser, setMessageToUser] = useState(null);
  const [messageText, setMessageText] = useState("");

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
    newSocket.on("private_message", ({ from, message }) => {
      alert(`📨 Message from ${from}: ${message}`);
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
          <h3 className="text-xl font-medium mb-4 text-gray-700">
            Online Users:
          </h3>
          {messageToUser && (
            <div className="mt-6 p-4 border rounded bg-blue-50">
              <h4 className="text-lg font-semibold mb-2 text-gray-700">
                Send message to{" "}
                <span className="capitalize">{messageToUser}</span>
              </h4>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2"
                placeholder="Type your message..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-300 px-4 py-1 rounded"
                  onClick={() => {
                    setMessageText("");
                    setMessageToUser(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                  onClick={() => {
                    if (messageText.trim() && socket) {
                      console.log(">>>>>>>>>>", {
                        to: messageToUser,
                        message: messageText.trim(),
                      });
                      socket.emit("private_message", {
                        to: messageToUser,
                        message: messageText.trim(),
                      });
                      setMessageText("");
                      setMessageToUser(null);
                    }
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          )}
          {onlineUsers.length > 0 ? (
            <ul className="space-y-3">
              {onlineUsers.map((user, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm hover:shadow-md transition"
                >
                  <span className="text-gray-800 capitalize font-medium">
                    {user}
                  </span>
                  <div className="flex space-x-4">
                    {/* <MessageIcon /> */}
                    <MessageIcon
                      onClick={() => setMessageToUser(user)}
                      className="cursor-pointer"
                    />
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
