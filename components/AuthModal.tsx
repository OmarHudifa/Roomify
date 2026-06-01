import { LogIn, X } from 'lucide-react'
import Button from './ui/Button'
import { useOutletContext } from 'react-router'

interface AuthModalProps {
    onClose: () => void
}

const AuthModal = ({ onClose }: AuthModalProps) => {
    const { signIn } = useOutletContext<AuthContext>()

    const handleSignIn = async () => {
        await signIn()
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={18} />
                </button>

                <div className="modal-icon">
                    <LogIn size={22} />
                </div>

                <h2>Sign in to continue</h2>
                <p>You need a free Puter account to upload and save your projects.</p>

                <div className="modal-actions">
                    <Button size="lg" onClick={handleSignIn} className="w-full">
                        Sign in with Puter
                    </Button>
                    <Button size="lg" variant="ghost" onClick={onClose} className="w-full">
                        Maybe later
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AuthModal