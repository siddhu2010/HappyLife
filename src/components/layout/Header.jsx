import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeftIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const location = useLocation();
  const path = location.pathname;

  const getHeaderTitle = () => {
    if (path === '/') return <span style={{ fontFamily: "'Satisfy', cursive " }}>HappyLife</span>;
    if (path.startsWith('/chat/')) return 'I.n.a.y.a';
    if (path === '/chat') return 'Messages';
    if (path === '/stories') return 'Stories';
    if (path.startsWith('/profile/')) return 'Profile';
    if (path.startsWith('/video-call/')) return 'Video Call';
    return 'Instagram';
  };

  const showBackButton = path !== '/';
  const showChatButton = path === '/';

  // Number of unread messages
  const unreadMessagesCount = 2;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-instagram-border">
      <div className="flex items-center justify-between h-14 px-4">
        {showBackButton ? (
          <button className="p-1" onClick={() => window.history.back()}>
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        ) : null}

        <h1 className={`text-xl font-semibold ${showBackButton ? 'flex-1 text-center' : ''}`}>
          {getHeaderTitle()}
        </h1>

        {showChatButton && (
          <Link to="/chat" className="relative p-1">
            <ChatBubbleOvalLeftIcon className="h-6 w-6" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header; 