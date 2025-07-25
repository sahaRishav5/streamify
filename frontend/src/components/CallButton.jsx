import React from 'react'
import { VideoIcon } from 'lucide-react'
const CallButton = ({handleVideoCall}) => {
  return (
    <div className='p-3 border-b items-center justify-end  absolute top-0 right-0'>
      <button onClick={handleVideoCall} className='btn btn-success btn-sm text-white'>
        <VideoIcon className='size-6' />
      </button>
    </div>
  )
}

export default CallButton
