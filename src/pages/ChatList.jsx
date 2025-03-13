import React from 'react';
import { Link } from 'react-router-dom';
import { chatList, users } from '../data/mockData';
import { VideoCameraIcon } from '@heroicons/react/24/solid';

const ChatList = () => {
    console.log(chatList);
    console.log(users);

    console.log("Rendering ChatList...");

    return (
        <div className="flex flex-col h-full">
            {/* Search bar */}
            <div className="px-4 py-2">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-gray-100 dark:bg-instagram-input rounded-lg px-4 py-2 focus:outline-none"
                    />
                </div>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto">
                {chatList.map((chat) => {
                    const user = users[chat.id];
                    if (!user) return null; // Skip if user is not found
                    return (
                        <div key={chat.id} className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-instagram-elevated">
                            {/* Avatar */}
                            <div className="relative">
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                                {chat.isOnline && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black"></div>
                                )}
                            </div>

                            {/* Chat info */}
                            <div className="flex-1 ml-4">
                                <div className="flex items-center justify-between">
                                    <Link to={`/chat/${chat.id}`} className="font-semibold">{user.username}</Link>
                                    <span className="text-xs text-gray-500">
                                        {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                {chat.unread > 0 && (
                                    <span className="text-red-500 text-xs">{chat.unread} unread</span>
                                )}
                            </div>

                            {/* Video call button */}
                            <Link
                                to={`/video-call/${chat.id}`}
                                className="ml-2 p-2 text-instagram-blue hover:bg-gray-100 dark:hover:bg-instagram-elevated rounded-full"
                            >
                                <VideoCameraIcon className="w-5 h-5" />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChatList; 