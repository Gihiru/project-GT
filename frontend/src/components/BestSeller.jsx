import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import { assets } from '../assets/assets';

const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const [bestSeller,setBestSeller] = useState([]);

    useEffect(()=>{
        const bestProduct = products.filter((item)=>(item.bestseller));
        setBestSeller(bestProduct.slice(0,5))
    },[products])

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'OUR'} text2={'SERVICES'}/>
        <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
              
              <div>
                <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
                <p className=' font-semibold'>Buy Products</p>
                <p className=' text-gray-400'>Visit us or buy online</p>
              </div>
              <div>
                <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
                <p className=' font-semibold'>Industrial Wiring</p>
                <p className=' text-gray-400'>We provide quality with expertice</p>
              </div>
              <div>
                <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
                <p className=' font-semibold'>Surge Arrestor</p>
                <p className=' text-gray-400'>we provide 24/7 customer support</p>
              </div>
              <div>
                <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
                <p className=' font-semibold'>Lighting Arrestor</p>
                <p className=' text-gray-400'>we provide 24/7 customer support</p>
              </div>
        
            </div>
            <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
              
              <div>
                <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
                <p className=' font-semibold'>All Electrical Maintain</p>
                <p className=' text-gray-400'>Visit us or buy online</p>
              </div>
              <div>
                <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
                <p className=' font-semibold'>Panel Board</p>
                <p className=' text-gray-400'>We provide quality with expertice</p>
              </div>
              <div>
                <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
                <p className=' font-semibold'>Electrical Design / Construction</p>
                <p className=' text-gray-400'>we provide 24/7 customer support</p>
              </div>
              <div>
                <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
                <p className=' font-semibold'>Charted Engineer Test Reports</p>
                <p className=' text-gray-400'>we provide 24/7 customer support</p>
              </div>
            </div>
      </div>
      

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
            bestSeller.map((item,index)=>(
                <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} />
            ))
        }
      </div>
    </div>
  )
}

export default BestSeller
