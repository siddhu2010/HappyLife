import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { users, posts } from '../data/mockData';

// FollowButton component with toggle functionality
const FollowButton = () => {
    const [isFollowing, setIsFollowing] = useState(false);

    return (
        <div className="flex gap-2 mt-4">
            <button
                className={`flex-1 py-1.5 rounded-lg font-semibold ${
                    isFollowing ? "bg-green-500 text-white" : "bg-instagram-blue text-white"
                }`}
                onClick={() => setIsFollowing(!isFollowing)}
            >
                {isFollowing ? (
                    <>
                        Following
                        <svg
                            className="w-3 h-3 inline-block ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </>
                ) : (
                    "Follow"
                )}
            </button>
            <button className="flex-1 bg-gray-100 dark:bg-instagram-elevated py-1.5 rounded-lg font-semibold">
                Message
            </button>
        </div>
    );
};

const Profile = () => {
    const { username } = useParams();
    const user = Object.values(users).find(u => u.username === username);

    if (!user) return <div>User not found</div>;

    const userPosts = posts.filter(post => users[post.userId].username === username);

    return (
        <div className="pb-16">
            {/* Profile header */}
            <div className="px-4 pt-4">
                <div className="flex items-start">
                    {/* Avatar */}
                    <div className="w-20 h-20 md:w-24 md:h-24">
                        <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>

                    {/* Stats */}
                    <div className="flex-1 ml-4">
                        <div className="flex items-center mb-2">
                            <h1 className="text-xl font-semibold mr-2">{user.username}</h1>
                            {user.isVerified && (
                                <svg className="w-4 h-4 text-instagram-blue" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                    />
                                </svg>
                            )}
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <div>
                                <span className="font-semibold">{user.posts}</span> posts
                            </div>
                            <div>
                                <span className="font-semibold">{user.followers}</span> followers
                            </div>
                            <div>
                                <span className="font-semibold">{user.following}</span> following
                            </div>
                        </div>
                        <div>
                            <h2 className="font-semibold">{user.fullName}</h2>
                            <p className="whitespace-pre-line">{user.bio}</p>
                        </div>
                    </div>
                </div>

                {/* Replaced inline action buttons with FollowButton */}
                <FollowButton />
            </div>

            {/* Highlights */}
            {user.highlights && (
                <div className="mt-6 px-4 overflow-x-auto">
                    <div className="flex space-x-4">
                        {user.highlights.map((highlight) => (
                            <div key={highlight.id} className="flex flex-col items-center space-y-1">
                                <div className="w-16 h-16 rounded-full ring-2 ring-gray-200 dark:ring-instagram-border p-0.5">
                                    <img
                                        src={highlight.cover}
                                        alt={highlight.title}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <span className="text-xs">{highlight.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Posts grid */}
            <div className="mt-6 grid grid-cols-3 gap-0.5">
                {userPosts.map((post) => (
                    <div key={post.id} className="relative pb-[100%]">
                        <img
                            src={post.image}
                            alt={post.caption}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
