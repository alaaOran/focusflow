import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import TaskPage from './components/TaskPage'
import NotesPage from './components/NotesPage'
import DiaryPage from './components/DiaryPage'
import { AnimatePresence, motion } from 'framer-motion'

const pages = { TASKS: 'TASKS', NOTES: 'NOTES', DIARY: 'DIARY' }

export default function App(){
  const [page, setPage] = useState(pages.TASKS)
  const variants = {
    initial: { opacity: 0, y: 24, scale: 0.985, filter: 'blur(2px)' },
    enter:   { opacity: 1, y: 0,  scale: 1,     filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] } },
    exit:    { opacity: 0, y: -16, scale: 0.985, filter: 'blur(2px)', transition: { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] } },
  }

  // Parallax removed per user request

  // Accent palette setup
  useEffect(()=>{
    const root = document.documentElement
    const accent = localStorage.getItem('focus_accent') || 'violet'
    root.setAttribute('data-accent', accent)
  }, [])
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Aurora background */}
      <div className="aurora">
        <div className="blob p1" />
        <div className="blob p2" />
        <div className="blob p3" />
      </div>

      {/* Main layout above aurora */}
      <div className="absolute inset-0 flex z-10">
        <Sidebar page={page} setPage={setPage} />
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {page === pages.TASKS && (
              <motion.div key="tasks" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full">
                <TaskPage />
              </motion.div>
            )}
            {page === pages.NOTES && (
              <motion.div key="notes" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full">
                <NotesPage />
              </motion.div>
            )}
            {page === pages.DIARY && (
              <motion.div key="diary" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full">
                <DiaryPage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer credit */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-xs text-[var(--muted)] opacity-80 select-none">
        made by nouioua alaa
      </div>
    </div>
  )
}