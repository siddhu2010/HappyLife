import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { chatMessages, users, CRUSH_ID, messagePatterns } from '../data/mockData';
import { PaperAirplaneIcon, PhotoIcon, HeartIcon } from '@heroicons/react/24/solid';

const Chat = () => {
    const { id } = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(chatMessages[id] || []);
    const [isTyping, setIsTyping] = useState(false);
    const [contextMenu, setContextMenu] = useState(null); // { x, y, message }
    const messagesEndRef = useRef(null);
    const longPressTimerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Hide context menu when clicking outside
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getResponse = (message) => {
        const lowercaseMsg = message.toLowerCase();
        for (const pattern of messagePatterns) {
            if (pattern.patterns.some(p => lowercaseMsg.includes(p))) {
                const responses = pattern.responses;
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        return "Thanks for your message! 😊";
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newUserMessage = {
            id: messages.length + 1,
            senderId: 'me',
            text: message,
            timestamp: new Date().toISOString(),
            status: 'sent'
        };

        setMessages(prev => [...prev, newUserMessage]);
        setMessage('');

        // Simulate typing delay before crush responds
        setIsTyping(true);
        setTimeout(() => {
            const response = getResponse(message);
            const crushResponse = {
                id: messages.length + 2,
                senderId: CRUSH_ID,
                text: response,
                timestamp: new Date().toISOString(),
                status: 'read'
            };
            setMessages(prev => [...prev, crushResponse]);
            setIsTyping(false);
        }, 1500);
    };

    // Helper functions for long press detection
    const startLongPress = (event, msg) => {
        event.stopPropagation();
        // Determine the coordinates
        const isTouchEvent = event.type === 'touchstart';
        const x = isTouchEvent ? event.touches[0].clientX : event.clientX;
        const y = isTouchEvent ? event.touches[0].clientY : event.clientY;
        longPressTimerRef.current = setTimeout(() => {
            setContextMenu({ x, y, message: msg });
        }, 600); // Adjust time (ms) for long press as needed
    };

    const cancelLongPress = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    // Also handle right-click (context menu) for desktop
    const handleContextMenu = (event, msg) => {
        event.preventDefault();
        event.stopPropagation();
        const x = event.clientX;
        const y = event.clientY;
        setContextMenu({ x, y, message: msg });
    };

    // When an option is selected from the context menu
    const handleOptionSelect = (option, msg) => {
        console.log(`${option} selected for message:`, msg);
        // TODO: Implement the desired functionality for each option.
        setContextMenu(null);
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === 'me';
                    const user = users[msg.senderId];

                    return (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                            onMouseDown={(e) => startLongPress(e, msg)}
                            onTouchStart={(e) => startLongPress(e, msg)}
                            onMouseUp={cancelLongPress}
                            onTouchEnd={cancelLongPress}
                            onContextMenu={(e) => handleContextMenu(e, msg)}
                        >
                            {!isMe && (
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                            )}
                            <div
                                className={`max-w-[75%] px-4 py-2 rounded-2xl ${isMe
                                    ? 'bg-instagram-blue text-white rounded-br-none'
                                    : 'bg-gray-100 dark:bg-instagram-elevated rounded-bl-none'
                                    }`}
                            >
                                <p className="text-sm">{msg.text}</p>
                                <p className="text-xs mt-1 opacity-70">{formatTime(msg.timestamp)}</p>
                            </div>
                        </div>
                    );
                })}
                {isTyping && (
                    <div className="flex items-center gap-2">
                        <img
                            src={users[CRUSH_ID].avatar}
                            alt={users[CRUSH_ID].username}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="bg-gray-100 dark:bg-instagram-elevated px-4 py-2 rounded-2xl">
                            <p className="text-sm italic text-gray-500">{users[CRUSH_ID].username} is typing...</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form onSubmit={handleSend} className="p-4 border-t dark:border-instagram-border">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="p-2 text-instagram-blue hover:bg-gray-100 dark:hover:bg-instagram-elevated rounded-full"
                    >
                        <PhotoIcon className="w-6 h-6" />
                    </button>

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Message..."
                        className="flex-1 bg-gray-100 dark:bg-instagram-input rounded-full px-4 py-2 focus:outline-none"
                    />

                    {message.trim() ? (
                        <button
                            type="submit"
                            className="p-2 text-instagram-blue hover:bg-gray-100 dark:hover:bg-instagram-elevated rounded-full"
                        >
                            <PaperAirplaneIcon className="w-6 h-6" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="p-2 text-instagram-blue hover:bg-gray-100 dark:hover:bg-instagram-elevated rounded-full"
                        >
                            <HeartIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </form>

            {/* Floating Context Menu */}
            {contextMenu && (
                <div
                    className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the menu
                >
                    <button
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                        onClick={() => handleOptionSelect("Edit Message", contextMenu.message)}
                    >
                        Edit Message
                    </button>
                    <button
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                        onClick={() => handleOptionSelect("Like", contextMenu.message)}
                    >
                        Like
                    </button>
                    <button
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                        onClick={() => handleOptionSelect("Unsend", contextMenu.message)}
                    >
                        Unsend
                    </button>
                    <button
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                        onClick={() => handleOptionSelect("Report", contextMenu.message)}
                    >
                        Report
                    </button>
                </div>
            )}
        </div>
    );
};

export default Chat;
