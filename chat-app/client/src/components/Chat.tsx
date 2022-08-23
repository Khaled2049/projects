import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import io from 'socket.io-client';

const ENDPOINT = 'localhost:3000';
const socket = io(ENDPOINT, {
  // extraHeaders: {
  //   test: 'test',
  // },
});

const Chat = () => {
  const [name, setname] = useState('');
  const [room, setroom] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState<string | null>(null);

  let location = useLocation();
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    // socket = io(ENDPOINT);
    // console.log(socket);

    setname(name as string);
    setroom(room as string);

    socket.emit('join', { name, room }, ({ error }: any) => {
      alert(error);
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      let date: string = new Date().toISOString();
      console.log('date', date);
      setLastPong(date);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, [ENDPOINT, location.search]);

  return (
    <div>
      {' '}
      <div>
        <p>Connected: {'' + isConnected}</p>
        <p>Last pong: {lastPong || '-'}</p>
        <button
          onClick={() => {
            socket.emit('ping');
            console.log('test');
          }}
        >
          Send ping
        </button>
      </div>
    </div>
  );
};

export default Chat;
