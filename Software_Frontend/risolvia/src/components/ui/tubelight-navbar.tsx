
"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const currentItem = items.find(item => item.url === location.pathname)
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [location.pathname, items])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleNavClick = (itemName: string) => {
    setActiveTab(itemName)
    // Hacer scroll al inicio de la página después de un pequeño delay para asegurar que la navegación se complete
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  }

  return (
    <nav
      className={cn(
        // Corrige la posición y tamaño: z index, fixed sólo abajo/superior, NO cubre el centro de la pantalla.
        "fixed left-1/2 -translate-x-1/2 z-50",
        isMobile ? "bottom-0 mb-4 w-auto" : "top-4 w-auto",
        className
      )}
      // Asegura que el div SOLO tenga el tamaño de la barra y no de toda la pantalla
      style={{
        pointerEvents: "auto",
        width: "auto",
        maxWidth: "calc(100vw - 1rem)",
      }}
      aria-label="barra de navegación"
    >
      <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => handleNavClick(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                isActive
                  ? "bg-white dark:bg-gray-700 text-primary dark:text-white"
                  : "text-muted-foreground hover:text-primary dark:text-gray-300 dark:hover:text-white",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-orange-300/10 dark:bg-orange-300/20 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-orange-300 dark:bg-orange-400 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-orange-300/40 dark:bg-orange-300/50 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-orange-300/35 dark:bg-orange-300/45 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-orange-300/30 dark:bg-orange-300/40 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
