import { LoaderIcon } from 'lucide-react'
import React from 'react'
import { HashLoader } from 'react-spinners'
import {useThemeStore} from '../store/useThemeStore'
const PageLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div className='min-h-screen flex items-center justify-center' data-theme={theme}>
      {/* <LoaderIcon className='animate-spin size-10 text-primary'/> */}
      <HashLoader color="#55c7c7" />
    </div>
  )
}

export default PageLoader
