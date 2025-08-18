import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <div className='text-center py-10'>
      <p className='text-2xl font-medium text-yellow-400'>Inquire Now</p>
      <p className='text-gray-300 mt-3'>
      Have technical questions? Our specialists are ready to assist.
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-yellow-600/30 pl-3 bg-gray-800 rounded'>
        <input className='w-full sm:flex-1 outline-none bg-transparent text-gray-200 placeholder-gray-400' type="email" placeholder='Enter your email' required/>
        <button type='submit' className='bg-yellow-500 text-gray-900 text-xs px-10 py-4 hover:bg-yellow-400 transition-colors font-semibold'>Send</button>
      </form>
    </div>
  )
}

export default NewsletterBox
