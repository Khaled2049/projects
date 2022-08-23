import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Join = () => {
  const [name, setname] = useState('');
  const [room, setRoom] = useState('');

  return (
    <div>
      <input
        placeholder="Name"
        type="text"
        onChange={(event: any) => {
          setname(event.target.value);
        }}
      ></input>
      <input
        placeholder="Room"
        type="text"
        onChange={(event: any) => {
          setRoom(event.target.value);
        }}
      ></input>
      <Link
        onClick={(event: any) => {
          !name || !room ? event.preventDefault() : null;
        }}
        to={`/chat?name=${name}&room=${room}`}
      >
        <button>Sign In</button>
      </Link>
    </div>
  );
};

export default Join;
