import { useState, useEffect } from "react";
import io from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [socketOpen, setSocketOpen] = useState(false);

  // for local devlopment
  const ip = 'localhost:8080';

  // for deployment
  // const ip = "https://thedrawingboard-backend.herokuapp.com/";

  useEffect(() => {
    const server = io(ip);

    setSocket(server);
    setSocketOpen(true);

    return () => {
      server.close(ip);
    }
  }, [ip]);

  return {
    socket,
    socketOpen
  };
};

