import { ArrowRight, Layers} from 'lucide-react'
import React, { useRef, useState } from 'react'
import Button from './ui/Button'
import Upload from './Upload'
import { useNavigate } from 'react-router'
import { createProject } from 'lib/puter.action'




const Hero = ({ onProjectCreated }: { onProjectCreated: (p: DesignItem) => void }) => {
  const navigate=useNavigate()
   const isCreatingProjectRef=useRef(false)


  const handleUploadComplete=async(base64Image:string)=>{
    try {

    if(isCreatingProjectRef.current)return false

    isCreatingProjectRef.current=true

    const newId=Date.now().toString()
    const name=`residence ${newId}`

    const newItem={
      id:newId,name,sourceImage:base64Image,renderedImage:undefined,timestamp:Date.now()
    }

    const saved=await createProject({item:newItem,visibility:'private'
    })

    if(!saved){
      console.error("Failed to create project")
      return false
    }

    onProjectCreated(newItem)

      navigate(`/visualizer/${newId}`,{
        state:{
          initialImage:saved?.sourceImage,
          initialRendered:saved?.renderedImage||null,
          name
        }
      })
    return true

    } finally{
      isCreatingProjectRef.current=false
    }
  
  }
   
  return (
   <section className="hero"> 
      <div className="announce">
        <div className="dot">
          <div className="pulse"></div>
        </div>
        <p>Introducing Roomify 2.0</p>
      </div>
      <h1>Build beautiful spaces at the speed of thought with Roomify</h1>
         <p className="subtitle">
                  Roomify is an AI-first design environment that helps you visualize, render, and ship architectural projects faster than ever.
        </p>
    <div className="actions">
      <a href="#upload" className="cta">Start Building <ArrowRight className="icon"/></a>
      <Button variant="outline" size="lg" className="demo">Watch Demo</Button>
    </div>

    <div id="upload" className="upload-shell">
      <div className="grid-overlay"/>
      <div className="upload-card">
        <div className="upload-head">
          <div className="upload-icon">
            <Layers className="icon"/>
          </div>
            <h3>Upload your floor plan</h3>
            <p>Supports JPG,PNG, formats up to 10MB</p>
        </div>
        <Upload onComplete={handleUploadComplete} />
      </div>
    </div>

    </section>
  )
}

export default Hero