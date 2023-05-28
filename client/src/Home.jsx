import React, { useEffect, useState } from 'react'
import { Model } from './component/model'
import axios from "axios";
const Home = () => {
  const [imgName, setImgName] = useState("")
  const [progress, setProgress] = useState(0)
  const [getImages, setGetImages] = useState([{}])
  const [model, setModel] = useState(false)
  const [modelImage, setModelImage] = useState("")
  const handleImage = (event) => {
    const { name } = event.target.files[0]
    const image = event.target.files[0]
    setImgName(name)
    sendImage(image)
  }
  // console.log(progress);
  useEffect(() => {
    getAllImages()
  }, [imgName])
  const getAllImages = async () => {
    const response = await axios.get("http://localhost:3001/api/images")
    setGetImages(response.data)
  }
  const sendImage = async (image) => {
    const formData = new FormData();
    formData.append("upload_file", image)
    const response = await axios("http://localhost:3001/api/upload", {
      method: "POST",
      header: { "Content-Type": "multipart/form-data" },
      data: formData,
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        )
        setProgress(progress)
      },
    });
   
    if (response.status === 200) {
      setImgName("")
      setProgress(0)
    }
  }
 const handleImageView = (imagesName)=>{
    setModel(true)
    setModelImage(imagesName)
  } 

  return (
    <>
     {model && <Model modelImage={modelImage} setModel={setModel}/>}
 
      <div className='image-gallery-container'>
        <h1>Photo Gallery</h1>
        <p>A picture is worth thousand words.</p>
        <div className="image-list-parent">
          <div className="add-btn group">
            <input onChange={handleImage} type="file" name="image" id="image" accept="image/*" />
            <label htmlFor='image'>+</label>

          </div>

        </div>
        <p className='imageName' >{imgName}</p>
        <div className="line-parent">
          <div className="progress-bar">
            <span>{progress > 0 && progress+"%"}</span>
            <progress id='image' value={progress} max='100'></progress>

          </div>
        </div>

        <div className="gallery">
          <div className="images">
            {getImages?.map((images) => (
               <img onClick={()=>handleImageView(images.fileName)} key={images.id} src={`http://localhost:3001/images/${images.fileName}`} alt="" /> 
            ))}
          </div>
        </div>
       
      </div>
    </>
  )
}

export default Home