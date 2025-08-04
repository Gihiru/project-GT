import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const [visible,setVisible] = useState(false)
    const location = useLocation();

    useEffect(()=>{
        if (location.pathname.includes('collection')) {
            setVisible(true);
        }
        else {
            setVisible(false)
        }
    },[location])
    
  return showSearch && visible ? (
    <div className='border-t border-b border-yellow-600/30 bg-gray-800 text-center'>
      <div className='inline-flex items-center justify-center border border-yellow-500 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 bg-gray-700 shadow-lg'>
        <input value={search} onChange={(e)=>setSearch(e.target.value)} className='flex-1 outline-none bg-inherit text-sm text-gray-100 placeholder-gray-400' type="text" placeholder='Search'/>
        <img className='w-4 gold-icon' src={assets.search_icon} alt="" />
      </div>
      <img onClick={()=>setShowSearch(false)} className='inline w-3 cursor-pointer gold-icon hover:scale-110 transition-transform duration-300' src={assets.cross_icon} alt="" />
    </div>
  ) : null
}

export default SearchBar
