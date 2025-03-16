import React from 'react';
import { Link } from 'react-router-dom';
import { posts, users, CRUSH_ID } from '../data/mockData';
import { HeartIcon, ChatBubbleOvalLeftIcon, PaperAirplaneIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const Home = () => {
    // Create an array of story items.
    // First item is for "Add Your Story" and then include some user stories.
    const storyItems = [
        { id: 'add', isAdd: true },
        users[CRUSH_ID],
        users.me,
        users.girl1,
    ];

    return (
        <div className="pb-16">
            {/* Stories */}
            <div className="border-b dark:border-instagram-border overflow-x-auto">
                <div className="flex px-4 py-4 space-x-4">
                    {storyItems.map((item) =>
                        item.isAdd ? (
                            <Link
                                key={item.id}
                                to="/add-story"
                                className="flex flex-col items-center space-y-1"
                            >
                                <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                    <span className="text-2xl text-gray-400">+</span>
                                </div>
                                <span className="text-xs truncate w-16 text-center">Add Your Story</span>
                            </Link>
                        ) : (
                            <Link
                                key={item.id}
                                to={`/stories`}
                                className="flex flex-col items-center space-y-1"
                            >
                                <div className="w-16 h-16 rounded-full ring-2 ring-pink-500 p-0.5">
                                    <img
                                        src={item.avatar}
                                        alt={item.username}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <span className="text-xs truncate w-16 text-center">{item.username}</span>
                            </Link>
                        )
                    )}
                </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
                {posts.map((post) => {
                    const user = users[post.userId];
                    return (
                        <article key={post.id} className="border-b dark:border-instagram-border pb-4">
                            {/* Post header */}
                            <div className="flex items-center px-4 py-3">
                                <Link to={`/profile/${user.username}`} className="flex items-center flex-1">
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="ml-3 flex items-center">
                                        <span className="font-semibold">{user.username}</span>
                                        {user.isVerified && (
                                            <svg className="w-4 h-4 ml-1 text-instagram-blue" viewBox="0 0 24 24">
                                                <path
                                                    fill="currentColor"
                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </Link>
                                <button className="p-1">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Post image */}
                            <div className="relative pb-[100%]">
                                <img
                                    src={post.image}
                                    alt={post.caption}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>

                            {/* Post actions */}
                            <div className="px-4 pt-4">
                                <div className="flex justify-between mb-2">
                                    <div className="flex space-x-4">
                                        <button>
                                            <HeartIcon className="w-7 h-7" />
                                        </button>
                                        <button>
                                            <ChatBubbleOvalLeftIcon className="w-7 h-7" />
                                        </button>
                                        <button>
                                            <PaperAirplaneIcon className="w-7 h-7 rotate-45" />
                                        </button>
                                    </div>
                                    <button>
                                        <BookmarkIcon className="w-7 h-7" />
                                    </button>
                                </div>

                                {/* Likes */}
                                <p className="font-semibold mb-2">{post.likes.toLocaleString()} likes</p>

                                {/* Caption */}
                                <p className="mb-2">
                                    <Link to={`/profile/${user.username}`} className="font-semibold mr-2">
                                        {user.username}
                                    </Link>
                                    {post.caption}
                                </p>

                                {/* Comments */}
                                <button className="text-gray-500 text-sm mb-2">
                                    View all {post.comments} comments
                                </button>

                                {/* Timestamp */}
                                <p className="text-gray-500 text-xs uppercase">
                                    {new Date(post.timestamp).toLocaleDateString(undefined, {
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
