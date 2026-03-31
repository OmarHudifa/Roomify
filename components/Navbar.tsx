import { Box } from 'lucide-react'
import React from 'react'
import Button from './ui/Button';
import { useOutletContext } from 'react-router';

const Navbar = () => {
    const{isSignedIn,userName,signIn,signOut}=useOutletContext<AuthContext>()
   

    const handleAuthClick=async()=>{
      if(isSignedIn){
         try {
            await signOut()
       } catch (error) {
        console.error(`Puter signout failed${error}`)
       }
       return
      }

        try {
            await signIn()
       } catch (error) {
        console.error(`Puter signin failed${error}`)
       }
    }

  return (
    <header className='navbar'>
       <nav className='inner'>
        <div className='left'>
            <div className='brand'>
                <Box className='logo'>
                    <span className='name'> Roomify</span>
                </Box>
            </div>
            <ul className='links'>
                <a href="">Product</a>
                <a href="">Pricing</a>
                <a href="">Community</a>
                <a href="">Enterprise</a>
            </ul>
        </div>
        <div className='actions'>
            {isSignedIn?(<>
            <span className='greeting'>{userName}</span>
            <Button onClick={handleAuthClick} className='login' size="sm" variant="ghost">Log Out</Button>
            </>):
            (
             <>
            <Button onClick={handleAuthClick} className='login' size="sm" variant="ghost">Log In</Button>
            <a href="" className='cta'>Get Started</a>
            </>
            )}
           
        </div>
       </nav>
    </header>
  )
}

export default Navbar