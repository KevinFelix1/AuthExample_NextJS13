'use client';
import { useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";

import { FcGoogle } from "react-icons/fc";

export default function Home() {
  const [message, setMessage] = useState('');

  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(true);

  const toggleVariant = () => {
    setLogin(!login);
  };

  const loginUser = async () => {
    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/dashboard'
      });
    } catch (error) {
      console.log(error);
    };
  };

  const registerUser = async () => {
    try {
      const response = await axios.post('/api/auth/register', {
        email,
        name,
        password
      });

      if(response.status === 400) {
        setMessage(response?.statusText);
      };

      if(response.status === 200) {
        loginUser();
      }

      setTimeout(() => {
        setMessage('');
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-1/2 lg:w-2/6 mx-auto h-fit p-2 border m-10 bg-neutral-100 shadow" >
      <h1 className="text-xl md:text-2xl font-bold m-0 p-0 text-center text-neutral-800">
      {login ? 'Login' : 'Register'}
      </h1>
      {message && 
      <div className="my-2 bg-zinc-800 rounded-md p-2">
        <p className="text-white font-bold text-center ">{message}</p>
      </div>
      }
      <div className="flex flex-col gap-3">
        {!login && 
        <div>
          <label htmlFor="name" className="block text-sm md:text-xl font-light">Name</label>
          <input id="name" onChange={(e) => setName(e.target.value)} type="text" placeholder="Name input" className="shadow mt-2 rounded w-full border-2 border-neutral-300 p-2 h-10"/>
        </div>
        }
        <div>
          <label htmlFor="email" className="block text-sm md:text-xl font-light">Email</label>
          <input id="email" onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email input" className="shadow mt-2 rounded w-full border-2 border-neutral-300 p-2 h-10"/>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm md:text-xl font-light">Password</label>
          <input id="password" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password input" className="shadow mt-2 rounded w-full border-2 border-neutral-300 p-2 h-10"/>
        </div>
        <div className="flex items-center justify-between">
          <button 
            className="bg-blue-600 hover:bg-blue-700 shadow text-white font-bold uppercase text-2xl py-2 px-3 w-fit rounded-md"
            onClick={login ? loginUser : registerUser}
            >Submit</button>
          <p onClick={toggleVariant} className="text-xl cursor-pointer text-neutral-600">{login ? 'Register' : 'is there an account? sign In'}</p>
        </div>
        <p className="text-neutral-600 text-center text-xl">Or sign with Google</p>
        <div className="flex justify-center items-center p-1">
          <FcGoogle onClick={() => signIn('google', {callbackUrl: '/dashboard'})} size={40} className="cursor-pointer hover:bg-neutral-300 rounded-full"/>
        </div>
      </div>
    </div>
  )
}
