import { Spin } from 'antd';
import React from 'react'

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Spin size="large" tip="Đang tải..." />
    </div>
  );
}

export default Loading