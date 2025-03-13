import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon, PlusCircleIcon, HeartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid, MagnifyingGlassIcon as SearchIconSolid,
    HeartIcon as HeartIconSolid, UserCircleIcon as UserIconSolid
} from '@heroicons/react/24/solid';

const BottomNav = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { path: '/', icon: HomeIcon, activeIcon: HomeIconSolid, label: 'Home' },
        { path: '/search', icon: MagnifyingGlassIcon, activeIcon: SearchIconSolid, label: 'Search' },
        { path: '/new', icon: PlusCircleIcon, activeIcon: PlusCircleIcon, label: 'New' },
        { path: '/activity', icon: HeartIcon, activeIcon: HeartIconSolid, label: 'Activity' },
        { path: '/profile/me', icon: UserCircleIcon, activeIcon: UserIconSolid, label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-instagram-border pb-screen-safe">
            <div className="flex justify-around items-center h-14">
                {navItems.map((item) => {
                    const isActive = currentPath === item.path;
                    const Icon = isActive ? item.activeIcon : item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex flex-col items-center justify-center w-full h-full"
                        >
                            <Icon className="h-6 w-6" />
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav; 