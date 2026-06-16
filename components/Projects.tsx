import { getProjects } from 'lib/puter.action'
import { ArrowUpRight, Clock } from 'lucide-react'
import React, { useEffect, type Dispatch, type SetStateAction } from 'react'
import { useNavigate } from 'react-router'

const Projects = ({ projects, setProjects }: { 
    projects: DesignItem[]
    setProjects: Dispatch<SetStateAction<DesignItem[]>>
}) => {

   useEffect(()=>{
    const fetchProjects=async()=>{
        const items=await getProjects()
        setProjects(items)
    }
    fetchProjects()
   },[]) 

   const navigate=useNavigate()
  return (
 <section className="projects">
              <div className="section-inner">
                  <div className="section-head">
                      <div className="copy">
                          <h2>Projects</h2>
                          <p>Your latest work and shared community projects, all in one place.</p>
                      </div>
                  </div>
        <div className='projects-grid'>
            {projects.map(({id,name,renderedImage,sourceImage,timestamp})=>(
                        <div key={id} className='project-card group' onClick={()=>navigate(`/visualizer/${id}`)}>
                    <div className='preview'>
                        <img src={renderedImage||sourceImage} alt="project" />
                        <div className="badge">
                                        <span>Community</span>
                                    </div>
                    </div>
                    <div className='card-body'>
                        <div>
                            <h3>{name}</h3>
                            <div className='meta'>
                                <Clock size={12}/>
                                <span>{new Date(timestamp).toLocaleDateString()}</span>
                                <span>By Omar</span>
                            </div>
                        </div>
                        <div className="arrow">
                            <ArrowUpRight size={18} />
                        </div>
                    </div>
                </div>
            ))
            }
        </div>
    </div>
    </section>
  )
}

export default Projects