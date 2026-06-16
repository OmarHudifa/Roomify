import Button from 'components/ui/Button'
import { generate3DView } from 'lib/ai.action'
import { createProject, getProjectById } from 'lib/puter.action'
import { Box, Download, RefreshCcw, Share2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router'

const visualizerId = () => {
  const {id}=useParams()
  const navigate=useNavigate()
  const location =useLocation()
  const {userId}=useOutletContext<AuthContext>()
  

  const hasInitialGenerated=useRef(false)

  const[project,setProject]=useState<DesignItem|null>(null)
  const[isProjectLoading,setIsProjectLoading]=useState(true)

  const [isProcessing,setIsProcessing]=useState(false)
  const[currentImage,setCurrentImage]=useState<string|null>(null)

  const handleBack=()=>navigate('/')
  const handleExport = () => {
        if (!currentImage) return;

        const link = document.createElement('a');
        link.href = currentImage;
        link.download = `roomify-${id || 'design'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    const handleShare = async () => {
    const imageUrl = currentImage ?? project?.renderedImage
    if (!imageUrl) return

    const shareData: ShareData = {
        title: project?.name ?? `Residence ${id}`,
        text: 'Check out my room visualization made with Roomify!',
        url: window.location.href,
    }

    // If it's a base64 image, convert to a File for native share sheet
    if (imageUrl.startsWith('data:')) {
        try {
            const res = await fetch(imageUrl)
            const blob = await res.blob()
            const file = new File([blob], `roomify-${id}.png`, { type: 'image/png' })

            if (navigator.canShare?.({ files: [file] })) {
                await navigator.share({ ...shareData, files: [file] })
                return
            }
        } catch (e) {
            console.warn('File share failed, falling back', e)
        }
    }

    // Native share (URL only) — triggers WhatsApp, Bluetooth, etc on mobile
    if (navigator.share) {
        try {
            await navigator.share(shareData)
            return
        } catch (e) {
            if ((e as DOMException).name !== 'AbortError') {
                console.warn('Share failed', e)
            }
            return
        }
    }

    // Desktop fallback — copy link to clipboard
    try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
    } catch {
        alert(`Share this link: ${window.location.href}`)
    }
}

  const runGeneration=async (item:DesignItem)=>{
    if(!id||!item.sourceImage) return

    try {
      setIsProcessing(true)
      const result=await generate3DView({sourceImage:item.sourceImage})

      if(result.renderedImage){
        setCurrentImage(result.renderedImage)

        const updatedItem={...item,
          renderedImage:result.renderedImage,
          renderedPath:result.renderedPath,
          timestamp:Date.now(),
          ownerId:item.ownerId??userId??null,
          isPublic:item.isPublic??false
        }

        const saved=await createProject({item:updatedItem,visibility:"private"})
        if(saved){
          setProject(saved)
          setCurrentImage(saved.renderedImage||result.renderedImage)
        }

      }

    } catch (error) {
      console.error('Generating fail',error)
    }finally{
      setIsProcessing(false)
    }
  }


    useEffect(() => {
        let isMounted = true;

        const loadProject = async () => {
            if (!id) {
                setIsProjectLoading(false);
                return;
            }

            setIsProjectLoading(true);

            const fetchedProject = await getProjectById({ id });

            if (!isMounted) return;

            setProject(fetchedProject);
            setCurrentImage(fetchedProject?.renderedImage || null);
            setIsProjectLoading(false);
            hasInitialGenerated.current = false;
        };

        loadProject();

        return () => {
            isMounted = false;
        };
    }, [id]);

    useEffect(() => {
        if (
            isProjectLoading ||
            hasInitialGenerated.current ||
            !project?.sourceImage
        )
            return;

        if (project.renderedImage) {
            setCurrentImage(project.renderedImage);
            hasInitialGenerated.current = true;
            return;
        }

        hasInitialGenerated.current = true;
        void runGeneration(project);
    }, [project, isProjectLoading]);


  return (
    <div className='visualizer'>
      <nav className='topbar'>
        <div className='brand'>
          <Box className='logo'/>
          <span className='name'>Roomify</span>
        </div>
        <Button variant='ghost' size='sm' onClick={handleBack} className='exit'><X className='icon'>Exit Editor</X></Button>
      </nav>
      <section className='content'>
        <div className='panel'>
        <div className='panel-header'>
          <div className='panel-meta'>
            <p>Project</p>
            <h2>{project?.name||`Residence ${id}`}</h2>
            <p className='note'>Created by you</p>
          </div>

          <div className='panel-actions'>
            <Button size='sm' onClick={handleExport} className='export' disabled={!currentImage}><Download className='w-4 h-4 mr-2'/>Export </Button>
            <Button size='sm' onClick={handleShare} className='share'><Share2 className='w-4 h-4 mr-2'/>Share</Button>
          </div>

        </div>

        <div className={`render-area ${isProcessing? 'isProcessing':""}`}>
          {currentImage?(<img src={currentImage} alt='Alt Render' className='render-img'/>
        ):(<div className='render-placeholder'>
            {project?.sourceImage &&(<img src={project.sourceImage} alt='original' className='render-fallback'></img>)}
          </div>)}

          {isProcessing&&(
            <div className='render-overlay'>
              <div className='rendering-card'>
                <RefreshCcw className='spinner'/>
                <span className='title'>Rendering ...</span>
                <span className='subtitle'>Generating Your 3D Visualization ...</span>
              </div>
            </div>
          )}

        </div>
        </div>

        <div className='panel compare'>
          <div className='panel-header'>
            <div className="panel-meta">
              <p>Comparison</p>
              <h3>Before and After</h3>
            </div>
             <div className="hint">Drag to compare</div>
          </div>
          <div className="compare-stage">
            {project?.sourceImage&& currentImage?(
              <ReactCompareSlider
              defaultValue={50}
              style={{width:'100%',height: '100%', objectFit:'cover'}}
              itemOne={
                  <ReactCompareSliderImage src={project.sourceImage} alt='before' className='compare-img'/>}
                
                itemTwo={
                  <ReactCompareSliderImage src={currentImage ?? project?.renderedImage ?? undefined} alt='after' className='compare-img'/>
                }
              />
            ):(
              <div className='compare-fallback'>
                {project?.sourceImage&&(<img src={project.sourceImage} alt='before' className='compare-img'/>)}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>

  )
}

export default visualizerId