import React, { memo } from 'react'
import { CFooter } from '@coreui/react'

const Footer = () => {
  return (
    <CFooter className="px-4">
      <div>
      </div>
      <div className="ms-auto">
      <a href="https://www.facebook.com/Nhan7tuoi" target="_blank" rel="noopener noreferrer">
          IUH
        </a>
        <span className="ms-1">&copy; 2024</span>
      </div>
    </CFooter>
  )
}

export default memo(Footer)
