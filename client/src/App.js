// react
import React, {useState, useEffect } from 'react';

// hooks
import { useSocket } from './hooks/useSocket';

// components
import Login from './components/Login';
import Nav from './components/Nav';
import Dash from './components/Dash';
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
  const [meals, setMeals] = useState([]);
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
            setUser(data.user);
            setMode(DASH);
            setMeals(data.meals);
          }
          console.log('turning off the loading bar');
          setLoading(false);
        });
      }
    }
  }, [socket, socketOpen, user, mode, meals]);

  useEffect(() => {
    console.log(user);
    console.log(meals);
  }, [meals, user]);
  
  return (
    <div id={'app'}>
      { loading ? <Loading /> 
      : !user ? <Login setUser={setUser} socket={socket} socketOpen={socketOpen} loginError={loginError} setLoginError={setLoginError} />
      : <>
        <Nav user={user} socket={socket} socketOpen={socketOpen} meals={meals}></Nav>
        <Dash user={user} socket={socket} socketOpen={socketOpen}/>
      </>
      }
    </div>
  );
}
