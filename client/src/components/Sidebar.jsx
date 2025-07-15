import { Protect, useClerk, useUser } from '@clerk/clerk-react';
import {
    Eraser,
    FileText,
    Hash,
    House,
    Scissors,
    SquarePen,
    Users,
    Image,
    LogOut,
} from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/ai', label: 'Dashboard', icon: House },
    { to: '/ai/write-article', label: 'Write Article', icon: SquarePen },
    { to: '/ai/blog-titles', label: 'Blog Titles', icon: Hash },
    { to: '/ai/generate-images', label: 'Generate Images', icon: Image },
    { to: '/ai/remove-background', label: 'Remove Background', icon: Eraser },
    { to: '/ai/remove-object', label: 'Remove Object', icon: Scissors },
    { to: '/ai/review-resume', label: 'Review Resume', icon: FileText },
    { to: '/ai/community', label: 'Community', icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
    const { user } = useUser();
    const { signOut, openUserProfile } = useClerk();

    return (
        <div
            className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center 
        max-sm:fixed top-14 bottom-0 z-50 
        ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} 
        transition-transform duration-300 ease-in-out`}
        >
            {/* User Profile Section */}
            <div className="my-7 w-full">
                <img
                    src={user.imageUrl}
                    alt="user avatar"
                    className="w-14 h-14 rounded-full mx-auto"
                />
                <h1 className="mt-1 text-center font-medium">{user.fullName}</h1>
            </div>

            {/* Navigation Links */}
            <div className="w-full px-4 flex flex-col gap-2">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/ai'}
                        onClick={() => setSidebar(false)}
                        className={({ isActive }) =>
                            `px-3.5 py-2.5 flex items-center gap-3 rounded transition-all duration-200 ${isActive
                                ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                                <span>{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
            <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between' >
                
                    <div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>
                        <img src={user.imageUrl} className='w-8 rounded-full' alt="" />
                        <div>
                            <h1 className='text-sm font-medium'>{user.fullName}</h1>
                            <p className='text-xs text-gray-500'>
                                <Protect plan='premium' fallback="Free">
                                    Premium
                                </Protect>
                                 Plan
                            </p>
                        </div>
                    </div>
                    <LogOut className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer' onClick={signOut}/>
                

            </div>



        </div>
    );
};

export default Sidebar;
