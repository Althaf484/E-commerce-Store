import React from 'react'
import {ShoppingCart, UserPlus, LogIn, LogOut, Lock} from "lucide-react";
import { Link } from 'react-router-dom';

const Navbar = () => {
    const user = false;
    const isAdmin = false;
    return (
        <header className='fixed top-0 left-0 w-full bg-blue-500 shadow-lg z-40 transition-all duration-300
        border-b border-amber-300'>
                                                
            <div className='container mx-auto p-3'>
                <div className='flex justify-between items-center flex-wrap'>
                    <Link to='/' className='text-2xl font-bold text-emerald-100 flex items-center space-x-2'>
                    E-commerce
                    </Link>

                    <nav className='flex flex-wrap items-center gap-4'>
                        <Link to={'/'} className='text-gray-200 hover:text-emerald-300 transition duration-300 ease-in-out'>Home</Link>
                        {user && (
                        <Link to={'/cart'} className='relative group text-gray-200 hover:text-emerald-300 transition duration-300 ease-in-out'>
                                <ShoppingCart className='inline-block mr-1 group-hover:text-emarald-300' size={25} />
                                <span className='hidden sm:inline'>Cart</span>
                                <span className='absolute -top-2 -left-2 bg-emerald-600 text-white rounded-full px-2
                                py-0.5 text-xs group-hover:bg-emarald-400 transition duration-300 ease-in-out'>
                                    3
                                </span>
                        </Link>
                        )}
                        {isAdmin && (
                            <Link to={''} className='bg-emerald-800 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium 
                            transition duration-300 ease-in-out flex items-center'>
                                <Lock className='inline-block mr-1 ' size={18} />
                                <span className='hidden sm:inline'>Dashboard</span>
                            </Link>
                        )}

                        {user ? (
                            <button className='bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md flex items-center transition 
                            duration-300 ease-in-out'>
                                <LogOut size={18} />
                                <span className='hidden sm:inline'>Log Out</span>
                            </button>
                        ) : (
                            <>
                                    
                                <Link to={"/signup"} className='bg-emerald-400 hover:bg-emerald-600 text-white py-2 px-4 rounded-md 
                                flex items-center transition duration-300 ease-in-out'>
                                        <UserPlus className='mr-2' size={18} />
                                        Sign Up
                                </Link>
                                
                                <Link to={"/login"} className='bg-emerald-400 hover:bg-emerald-600 text-white py-2 px-4 rounded-md 
                                flex items-center transition duration-300 ease-in-out'>
                                        <LogIn className='mr-2' size={18} />
                                        Login
                                </Link>
                                    
                            </>
                        )}
                    </nav>
                </div>
            </div>


        </header>
  )
}

export default Navbar