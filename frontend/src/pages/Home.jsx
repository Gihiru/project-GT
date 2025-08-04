import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <Hero />
      </div>
      <div className="bg-gray-900">
        <BestSeller />
      </div>
      <div className="bg-gray-800">
        <LatestCollection/>
      </div>
      <div className="bg-gray-900">
        <OurPolicy/>
      </div>
      <div className="bg-gradient-to-t from-gray-900 to-gray-800">
        <NewsletterBox/>
      </div>
    </div>
  )
}

export default Home
