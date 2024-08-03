import React from 'react'
import Navbar from '../components/Navbar'
import DeepLabV3 from './DeepLabV3'
import History from '../components/History'

const DeepLab = () => {
  return (
    <div className='flex flex-row p-4 gap-2'>
        <div className='w-1/5 bg-gray-100  rounded-lg p-2 h-[95vh]'>
        {/* History section */}
        <History history={[]} onImageClick={null} /> {/** No props are given here Fix it */}
        </div>
        <div className='w-4/5  rounded-lg bg-gray-100  h-[95vh] flex-col flex p-2'>
                   
                <div className='w-[99%]  bg-yellow-500 rounded-xl  h-18'>
                          {/* Navbar */}
                          <Navbar/>
                </div>
                <div className='w-[99%]'>
                   {/* deeplab componet */}
                   <DeepLabV3/>
                </div>
        </div>
    </div>
  )
}

export default DeepLab