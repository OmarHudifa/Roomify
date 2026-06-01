import Navbar from "components/Navbar";
import type { Route } from "./+types/home";
import Hero from "components/Hero";
import Projects from "components/Projects";
import { useNavigate } from "react-router";
import { useState } from "react";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roomify" },
    { name: "description", content: "Roomify is an AI-first design environment that helps you visualize, render, and ship architectural projects faster than ever." },
  ];
}

export default function Home() {
 
 const [projects,setProjects]=useState<DesignItem[]>([])

  
  return( 
  <div className="home">
    <Navbar/>
    <Hero onProjectCreated={(p) => setProjects(prev => [p, ...prev])}/>
    <Projects projects={projects}/>
 
  </div>
  )
}
