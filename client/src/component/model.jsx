import React from 'react'
import './model.scss'
const Model = ({modelImage,setModel}) => {
  return (
    <div className='model'>
      <h2>View Image</h2>
      <h1 onClick={()=>setModel(false)} >✖</h1>
      <div className="image-console">

        <img src={`http://localhost:3001/images/${modelImage}`} alt="" />
      </div>
    </div>
  )
}

export { Model }