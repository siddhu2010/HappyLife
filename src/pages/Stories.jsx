import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { users, CRUSH_ID } from '../data/mockData';

const Stories = () => {
    const navigate = useNavigate();
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const user = users[CRUSH_ID];
    const stories = user.stories;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentStoryIndex < stories.length - 1) {
                setCurrentStoryIndex(currentStoryIndex + 1);
            } else {
                navigate(-1);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [currentStoryIndex, stories.length, navigate]);

    const handleTap = (e) => {
        const x = e.clientX;
        const width = window.innerWidth;

        if (x < width / 2) {
            // Tapped left side
            if (currentStoryIndex > 0) {
                setCurrentStoryIndex(currentStoryIndex - 1);
            }
        } else {
            // Tapped right side
            if (currentStoryIndex < stories.length - 1) {
                setCurrentStoryIndex(currentStoryIndex + 1);
            } else {
                navigate(-1);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black" onClick={handleTap}>
            {/* Story content */}
            <div className="relative h-full">
                <img
                    src={stories[currentStoryIndex].url}
                    alt="Story"
                    className="w-full h-full object-contain"
                />

                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 flex gap-1 p-2">
                    {stories.map((_, index) => (
                        <div
                            key={index}
                            className="h-0.5 flex-1 bg-gray-600 overflow-hidden"
                        >
                            <div
                                className={`story-progress ${index === currentStoryIndex ? 'story-progress-complete' : index < currentStoryIndex ? 'story-progress-complete' : 'story-progress-incomplete'
                                    }`}
                            />
                        </div>
                    ))}
                </div>

                {/* User info */}
                <div className="absolute top-4 left-0 right-0 flex items-center px-4">
                    <div className="flex items-center">
                        <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="ml-2 text-white font-semibold">{user.username}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stories; 