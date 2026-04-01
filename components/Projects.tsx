import { ArrowUpRight, Clock } from 'lucide-react'
import React from 'react'

const Projects = () => {
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
            <div className='project-card group'>
                <div className='preview'>
                    <img src="/rendered.png" alt="" />
                      <div className="badge">
                                      <span>Community</span>
                                  </div>
                </div>
                <div className='card-body'>
                    <div>
                        <h3>Project Zwolle</h3>
                        <div className='meta'>
                            <Clock size={12}/>
                            <span>{new Date('01.01.2026').toLocaleDateString()}</span>
                            <span>By Omar</span>
                        </div>
                    </div>
                     <div className="arrow">
                        <ArrowUpRight size={18} />
                    </div>
                </div>
            </div>
        </div>
    </div>
    </section>
  )
}

export default Projects