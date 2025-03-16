import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { users, CRUSH_ID } from "../data/mockData"; // Removed chatMessages
import {
  PaperAirplaneIcon,
  PhotoIcon,
  HeartIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/solid";

// ----------------- Custom VoiceMessage Component -----------------
const VoiceMessage = ({ audioUrl }) => {
  const audioRef = useRef(new Audio(audioUrl));
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!playing) {
      audioRef.current.play();
      setPlaying(true);
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  useEffect(() => {
    const audioEl = audioRef.current;
    const handleEnded = () => setPlaying(false);
    audioEl.addEventListener("ended", handleEnded);
    return () => {
      audioEl.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="voice-message flex items-center bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
      <button onClick={togglePlay} className="mr-4 focus:outline-none">
        {playing ? (
          // Pause icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-800 dark:text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
          </svg>
        ) : (
          // Play icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-800 dark:text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-5.197-3.034A1 1 0 008 9.028v5.944a1 1 0 001.555.832l5.197-3.034a1 1 0 000-1.664z" />
          </svg>
        )}
      </button>
      <div className="waveform flex-grow">
        <svg viewBox="0 0 100 20" className="w-full h-6">
          <rect x="0" y="5" width="5" height="10" fill="#4A5568" />
          <rect x="10" y="2" width="5" height="16" fill="#4A5568" />
          <rect x="20" y="4" width="5" height="12" fill="#4A5568" />
          <rect x="30" y="1" width="5" height="18" fill="#4A5568" />
          <rect x="40" y="3" width="5" height="14" fill="#4A5568" />
          <rect x="50" y="5" width="5" height="10" fill="#4A5568" />
          <rect x="60" y="2" width="5" height="16" fill="#4A5568" />
          <rect x="70" y="4" width="5" height="12" fill="#4A5568" />
          <rect x="80" y="1" width="5" height="18" fill="#4A5568" />
          <rect x="90" y="3" width="5" height="14" fill="#4A5568" />
        </svg>
      </div>
    </div>
  );
};
// ----------------- End of VoiceMessage Component -----------------

const Chat = () => {
  const { id } = useParams();
  // Initialize with an empty array for messages
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // Normal conversation states
  const [isTyping, setIsTyping] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const messagesEndRef = useRef(null);
  const longPressTimerRef = useRef(null);
  // Fixed-script conversation state:
  // conversationStage: index of current stage,
  // expectedPartIndex: index of next expected sender message bubble in current stage.
  const [conversationStage, setConversationStage] = useState(0);
  const [expectedPartIndex, setExpectedPartIndex] = useState(0);

  // === New Conversation Stages for Voice Message Interaction ===
  // For stages 1–4, the expected sender input is now the string "voice message"
  const conversationStagesFinal = [
    // Stage 0: Auto-trigger receiver's automated message when chat opens.
    {
      expectedSender: [], // No sender input required
      receiverReplies: [
        { text: "Hey Yatharth!!", delay: 3000 }
      ]
    },
    // Stage 1: Sender is expected to send a voice message.
    {
      expectedSender: ["voice message"],
      receiverReplies: [
        { text: "Yatharth...just be calm....", delay: 3000 }
      ]
    },
    // Stage 2: Sender sends another voice message.
    {
      expectedSender: ["voice message"],
      receiverReplies: [
        { text: "Meri awaaz sun naa hai??", delay: 3000 }
      ]
    },
    // Stage 3: Sender sends a voice message.
    {
      expectedSender: ["voice message"],
      receiverReplies: [
        { text: "toh pehle bolo mujh pe gussa nhi karoge..", delay: 3000 }
      ]
    },
    // Stage 4: Sender sends a voice message; receiver sends multiple voice message replies.
    {
      expectedSender: ["voice message"],
      receiverReplies: [
        { audioUrl: "https://www.example.com/receiver-voice1.mp3", delay: 3000 },
        { audioUrl: "https://www.example.com/receiver-voice2.mp3", delay: 3000 },
        { audioUrl: "https://www.example.com/receiver-voice3.mp3", delay: 3000 }
      ]
    }
  ];

  // Auto-trigger Stage 0 on Chat Open
  useEffect(() => {
    if (conversationStage === 0 && conversationStagesFinal[0].expectedSender.length === 0) {
      const timer = setTimeout(() => {
        triggerFixedReply(0);
        setConversationStage(1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [conversationStage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ----------------- Fixed Script Reply Trigger Function -----------------
  // Handles both text and voice message replies.
  const triggerFixedReply = (stageIndex) => {
    const stage = conversationStagesFinal[stageIndex];
    setIsTyping(true);
    let cumulativeDelay = 0;
    const lineGap = 500;
    stage.receiverReplies.forEach((replyObj) => {
      cumulativeDelay += replyObj.delay;
      if (replyObj.audioUrl) {
        // For voice message replies:
        setTimeout(() => {
          const newReply = {
            id: messages.length + 1,
            senderId: CRUSH_ID,
            type: "voice",
            audioUrl: replyObj.audioUrl,
            timestamp: new Date().toISOString(),
            status: "read",
          };
          setMessages((prev) => [...prev, newReply]);
          setTimeout(() => setIsTyping(false), 500);
        }, cumulativeDelay);
      } else {
        // For text replies:
        const lines = replyObj.text.split("\n").filter((line) => line.trim() !== "");
        lines.forEach((line, index) => {
          setTimeout(() => {
            const newReply = {
              id: messages.length + 1,
              senderId: CRUSH_ID,
              type: "text",
              text: line,
              timestamp: new Date().toISOString(),
              status: "read",
            };
            setMessages((prev) => [...prev, newReply]);
            if (index === lines.length - 1) {
              setTimeout(() => setIsTyping(false), 500);
            }
          }, cumulativeDelay + index * lineGap);
        });
      }
    });
    setTimeout(() => setIsTyping(false), cumulativeDelay + 500);
  };

  // ----------------- Message Handlers -----------------
  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const userMessage = message.trim();
    const newUserMessage = {
      id: messages.length + 1,
      senderId: "me",
      type: "text",
      text: userMessage,
      timestamp: new Date().toISOString(),
      status: "sent",
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setMessage("");

    // For stages expecting text input:
    if (conversationStage < conversationStagesFinal.length) {
      const expectedParts = conversationStagesFinal[conversationStage].expectedSender;
      // If the expected input is NOT "voice message", compare text
      if (expectedParts.length > 0 && expectedParts[expectedPartIndex] !== "voice message" && userMessage === expectedParts[expectedPartIndex].trim()) {
        const newIndex = expectedPartIndex + 1;
        setExpectedPartIndex(newIndex);
        if (newIndex === expectedParts.length) {
          triggerFixedReply(conversationStage);
          setConversationStage(conversationStage + 1);
          setExpectedPartIndex(0);
          return;
        }
      }
    }
    // Fallback auto-reply if not matching fixed script
    setTimeout(() => {
      const response = "Thanks for your message! 😊";
      const crushResponse = {
        id: messages.length + 2,
        senderId: CRUSH_ID,
        type: "text",
        text: response,
        timestamp: new Date().toISOString(),
        status: "read",
      };
      setMessages((prev) => [...prev, crushResponse]);
    }, 3000);
  };

  // ----------------- Voice Message Handler -----------------
  // When the mic icon is clicked, a voice message is sent.
  const handleVoiceMessage = () => {
    const newVoiceMessage = {
      id: messages.length + 1,
      senderId: "me",
      type: "voice",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      timestamp: new Date().toISOString(),
      status: "sent",
    };
    setMessages((prev) => [...prev, newVoiceMessage]);
    if (conversationStage < conversationStagesFinal.length) {
      const expectedParts = conversationStagesFinal[conversationStage].expectedSender;
      if (expectedParts.length > 0 && expectedParts[expectedPartIndex] === "voice message") {
        const newIndex = expectedPartIndex + 1;
        setExpectedPartIndex(newIndex);
        if (newIndex === expectedParts.length) {
          triggerFixedReply(conversationStage);
          setConversationStage(conversationStage + 1);
          setExpectedPartIndex(0);
          return;
        }
      }
    }
  };

  // ----------------- Context Menu & Long Press Functions -----------------
  const startLongPress = (event, msg) => {
    event.stopPropagation();
    const isTouchEvent = event.type === "touchstart";
    const x = isTouchEvent ? event.touches[0].clientX : event.clientX;
    const y = isTouchEvent ? event.touches[0].clientY : event.clientY;
    longPressTimerRef.current = setTimeout(() => {
      setContextMenu({ x, y, message: msg });
    }, 600);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleContextMenu = (event, msg) => {
    event.preventDefault();
    event.stopPropagation();
    const x = event.clientX;
    const y = event.clientY;
    setContextMenu({ x, y, message: msg });
  };

  const handleOptionSelect = (option, msg) => {
    if (option === "Unsend") {
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      setContextMenu(null);
      return;
    }
    console.log(`${option} selected for message:`, msg);
    setContextMenu(null);
  };

  // ----------------- Render -----------------
  return (
    <div className="flex flex-col h-full relative">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === "me";
          const user = users[msg.senderId] || { avatar: "", username: msg.senderId };
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}
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
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  isMe
                    ? "bg-instagram-blue text-white rounded-br-none"
                    : "bg-gray-100 dark:bg-instagram-elevated rounded-bl-none"
                }`}
              >
                {msg.type === "voice" ? (
                  <VoiceMessage audioUrl={msg.audioUrl} />
                ) : (
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                )}
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
              <p className="text-sm italic text-gray-500">
                {users[CRUSH_ID].username} is typing...
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 border-t dark:border-instagram-border">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 text-instagram-blue hover:bg-gray-100 dark:hover:bg-instagram-elevated rounded-full"
          >
            <PhotoIcon className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="p-2 text-instagram-blue hover:bg-gray-100 dark:hover:bg-instagram-elevated rounded-full"
            onClick={handleVoiceMessage}
          >
            <MicrophoneIcon className="w-6 h-6" />
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
          onClick={(e) => e.stopPropagation()}
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
