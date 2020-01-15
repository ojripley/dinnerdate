// react
import React, {useState, useEffect } from 'react';

// hooks
import { useSocket } from './hooks/useSocket';

// components
import Login from './components/login/Login';
import Dash from './components/dash/Dash';

// styling
import './App.css'; 

export default function App() {
  
  // global modes
  const DASH = 'DASH';
  const PROFILE = 'PROFILE';
  const RECIPES = 'RECIPES';

  // states
  const { socket, socketOpen } = useSocket();
  const [mode, setMode] = useState(null);
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(false);
  
  useEffect(() => {
    if (socketOpen) {
      socket.on('msg', data => {
        console.log(data)
      });
      
      return () => {
        socket.off('msg');
      }
    }
  }, [socket, socketOpen]);

  useEffect(() => {
    if (socketOpen) {
      if(!user) {
        console.log('asking for a cookie check!');
        socket.emit('checkCookie', document.cookie);
  
        socket.on('cookieConfirmed', data => {
          console.log('data');
          console.log(data);
          if(data) {
            setUser(data);
            setMode(DASH);
          }
        });
      }
    }
  }, [socket, socketOpen, user, mode]);
  
  return (
    <>
      {!user ?
        <Login setUser={setUser} socket={socket} socketOpen={socketOpen} loginError={loginError} setLoginError={setLoginError} />
        : <Dash user={user} socket={socket} socketOpen={socketOpen}/>
      }
    </>
  );
}
