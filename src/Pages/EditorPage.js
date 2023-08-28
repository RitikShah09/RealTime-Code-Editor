import React, { useEffect, useRef, useState } from "react";
import Client from "../Components/Client";
import Editor from "../Components/Editor";
import { initSocket } from "../socket";
import {
  Navigate,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
import ACTIONS from "../actions";
import toast from "react-hot-toast";
const EditorPage = () => {
  const [client, setClient] = useState([]);
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        userName: location.state?.userName,
      });
      // Listening For Joined Event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, userName, socketId }) => {
          if (userName !== location.state?.userName) {
            toast.success(`${userName} joined the room`);
            console.log(`${userName} joined the room`);
          }
          setClient(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
      // Listening for disconnected

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
        toast.success(`${userName} left the room`);
        setClient((prev) => {
          return prev.filter((clients) => clients.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id Copied to your clipboard");
    } catch (error) {
      toast.error("Could not copy roomId");
      console.log(error);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex bg-[#121317] h-screen w-screen">
      <div className="flex h-full bg-[#1c1e29] w-[15%] flex-col justify-between">
        <div className=" h-4/5">
          <div className="h-1/5">
            <img src="/code-sync.png" alt="Logo" />
            <hr />
            <h3 className="text-white pt-2 pl-2 font-medium text-xl ">
              Connected
            </h3>
          </div>

          <div className="grid grid-cols-3 pl-[1.5px] no-scrollbar overflow-x-hidden overflow-y-auto py-1 h-[80%]">
            {client.map((clients) => {
              return (
                <Client key={clients.socketId} userName={clients.userName} />
              );
            })}
          </div>
        </div>
        <div className=" h-1/5 flex flex-col items-center justify-center space-y-4 font-medium">
          <button
            className="py-2 w-4/5  bg-green-600 hover:bg-green-800 text-white text-sm rounded-lg"
            onClick={copyRoomId}
          >
            Copy ROOM ID
          </button>
          <button
            className="py-2 w-4/5  bg-red-600 hover:bg-red-800 text-white text-sm rounded-lg"
            onClick={leaveRoom}
          >
            Leave
          </button>
        </div>
      </div>
      <div>
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
