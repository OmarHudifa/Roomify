import Navbar from "components/Navbar";
import type { Route } from "./+types/home";
import Hero from "components/Hero";
import Projects from "components/Projects";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roomify" },
    { name: "description", content: "Roomify is an AI-first design environment that helps you visualize, render, and ship architectural projects faster than ever." },
  ];
}

export default function Home() {
  return( 
  <div className="home">
    <Navbar/>
    <Hero/>
    <Projects/>
 
  </div>
  )
}
