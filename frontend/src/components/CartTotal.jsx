import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const {currency,delivery_fee,getCartAmount} = useContext(ShopContext);

  return (
    <div className='w-full bg-gray-800/50 p-6 rounded-lg border border-yellow-600/30'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm text-gray-300'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p className='text-yellow-400'>{currency} {getCartAmount()}.00</p>
            </div>
            <hr className='border-yellow-600/30' />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p className='text-yellow-400'>{currency} {delivery_fee}.00</p>
            </div>
            <hr className='border-yellow-600/30' />
            <div className='flex justify-between'>
                <b className='text-gray-100'>Total</b>
                <b className='text-yellow-400'>{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</b>
            </div>
      </div>
    </div>
  )
}

export default CartTotal
