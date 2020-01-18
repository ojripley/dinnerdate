// react
import React, {useState, useEffect } from 'react';

// hooks
import { useSocket } from './hooks/useSocket';

// components
import Login from './components/login/Login';
import Nav from './components/nav/Nav';
import Dash from './components/dash/Dash';
import Loading from './components/Loading';

// styling
import './components/styles/App.scss'; 

export default function App() {
  
  // global modes
  const DASH = 'DASH';
  const PROFILE = 'PROFILE';

  // states
  const { socket, socketOpen } = useSocket();
  const [mode, setMode] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
  
        socket.on('cookieResponse', data => {
          console.log('data');
          console.log(data);
          if(data) {
            setUser(data);
            setMode(DASH);
          }
          console.log('turning off the loading bar');
          setLoading(false);
        });
      }
    }
  }, [socket, socketOpen, user, mode]);
  
  return (
    <div id={'app'}>
      { loading ? <Loading /> 
      : !user ? <Login setUser={setUser} socket={socket} socketOpen={socketOpen} loginError={loginError} setLoginError={setLoginError} />
      : <>
        <Nav></Nav>
        <Dash user={user} socket={socket} socketOpen={socketOpen}/>
      </>
      }
    </div>
  );
}
