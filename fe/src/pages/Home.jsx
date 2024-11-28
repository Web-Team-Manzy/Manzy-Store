import React from 'react'
import Header from '../components/Header'
import LatestCollect from '../components/LatestCollect'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'

const Home = () => {
  return (
    <div>
      <Header />
      <LatestCollect />
      <BestSeller />
      <OurPolicy />
    </div>
  )
}

export default Home