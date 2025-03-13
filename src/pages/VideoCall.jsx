import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { users } from '../data/mockData';
import { PhoneXMarkIcon, MicrophoneIcon, VideoCameraIcon } from '@heroicons/react/24/solid';

const VideoCall = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const otherUser = users[id];

  const handleEndCall = () => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="relative h-full bg-black">
      {/* Main video (other person) */}
      <div className="absolute inset-0">
        <img
          src={otherUser.avatar}
          alt={otherUser.username}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Self video preview */}
      <div className="absolute top-4 right-4 w-32 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
        <img
          src={users.me.avatar}
          alt="You"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Call duration */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1 rounded-full">
        <span className="text-white text-sm">00:42</span>
      </div>

      {/* Call controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6">
        <button className="p-4 bg-gray-600 rounded-full hover:bg-gray-700">
          <MicrophoneIcon className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={handleEndCall}
          className="p-4 bg-red-500 rounded-full hover:bg-red-600"
        >
          <PhoneXMarkIcon className="w-6 h-6 text-white" />
        </button>
        <button className="p-4 bg-gray-600 rounded-full hover:bg-gray-700">
          <VideoCameraIcon className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Username */}
      <div className="absolute bottom-32 left-0 right-0 text-center">
        <h2 className="text-white text-xl font-semibold">{otherUser.username}</h2>
        <p className="text-gray-300 text-sm">Video call</p>
      </div>
    </div>
  );
};

export default VideoCall; 