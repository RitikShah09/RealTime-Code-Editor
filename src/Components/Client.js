import React from 'react'
import Avatar from 'react-avatar';


const Client = ({ userName }) => {
  return (
    <div className="text-white w-[20vw] flex flex-col m-1">
      <Avatar name={userName} size={50} round="14px" />
      <span>{userName.substring(0, 5)}</span>
    </div>
  );
}

export default Client;
