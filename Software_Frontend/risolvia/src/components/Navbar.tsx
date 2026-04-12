
import { Home, User, Briefcase, Send, Sparkles } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Badge } from "@/components/ui/badge"

const Navbar = () => {
  const navItems = [
    { name: 'Inicio', url: '/', icon: Home },
    { name: 'Soluciones', url: '/soluciones', icon: User },
    { name: 'Socios', url: '/socios', icon: Briefcase },
    { name: 'Contáctenos', url: '/contactenos', icon: Send }
  ]

  return (
    <>
      <div className="navbar-wrapper transition-all duration-300 ease-in-out [body[data-form-open]_&]:opacity-0 [body[data-form-open]_&]:pointer-events-none [body[data-form-open]_&]:translate-y-[-100%]">
        <NavBar items={navItems} />
      </div>
      
      {/* Badge BETA - No interactivo */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 pointer-events-none">
        <Badge 
          variant="default" 
          className="
            px-3 py-1.5 md:px-4 md:py-2
            text-xs md:text-sm
            font-bold
            text-white
            bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700
            border-0
            shadow-[0_0_20px_rgba(249,115,22,0.6)]
          "
        >
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1.5 animate-pulse" />
          BETA
        </Badge>
      </div>
    </>
  )
}

export default Navbar
