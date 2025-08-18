import React from 'react'
import { Button } from './ui/Button'
import { Typography } from './ui/Typography'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <div className='text-center py-10'>
      <Typography variant='h2' className='text-2xl font-medium'>Inquire Now</Typography>
      <Typography variant='p' className='mt-3'>
      Have technical questions? Our specialists are ready to assist.
      </Typography>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-yellow-600/30 pl-3 bg-gray-800 rounded'>
        <input className='w-full sm:flex-1 outline-none bg-transparent text-gray-200 placeholder-gray-400' type="email" placeholder='Enter your email' required/>
        <Button type='submit' size='lg' className='text-xs px-10'>Send</Button>
      </form>
    </div>
  )
}

export default NewsletterBox
