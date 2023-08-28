import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const createNewRoom = () => {
    const id = uuidv4();
    setRoomId(id);
    toast.success("Created a New Room");
  };
  const joinRoom = () => {
    if (!roomId || !userName) {
      toast.error("ROOM ID & userName Is Required");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        userName,
      },
    });
  };
  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };
  return (
    <div className=" h-screen bg-[#1c1e29] text-white w-screen flex items-center justify-center ">
      <div className=" space-y-2">
        <img src="/code-sync.png" alt="lOGO" />
        <h4>Paste invitation Room ID</h4>
        <div className="flex  flex-col space-y-4">
          <input
            className="text-black"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            type="text"
            placeholder="ROOM ID"
            onKeyUp={handleInputEnter}
          />
          <input
            className="text-black"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            type="text"
            placeholder="USERNAME"
            onKeyUp={handleInputEnter}
          />
          <button
            className=" text-right"
            onClick={() => {
              joinRoom();
            }}
          >
            Join
          </button>
          <h5>
            If you have an invite then create &nbsp;{" "}
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
                createNewRoom();
              }}
            >
              new Room
            </a>
          </h5>
        </div>
      </div>
      <h4 className=" fixed bottom-5">
        Built with love by &nbsp; <a href="">Ritik Shah</a>
      </h4>
    </div>
  );
};

export default Home;
