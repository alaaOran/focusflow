import React, { useEffect, useState } from 'react'
import { List, FileText, BookOpen, Sun, Moon } from 'lucide-react'

export default function Sidebar({page, setPage}){
  const [theme, setTheme] = useState('light')

  useEffect(()=>{
    const stored = localStorage.getItem('focus_theme') || 'light'
    setTheme(stored)
    document.documentElement.setAttribute('data-theme', stored === 'dark' ? 'dark' : 'light')
  }, [])

  useEffect(()=>{
    localStorage.setItem('focus_theme', theme)
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
  }, [theme])

  const NavButton = ({id, icon:Icon, label}) => (
    <button
      onClick={()=>setPage(id)}
      className={`btn-ghost hover-lift flex items-center justify-between ${page===id? 'ring-2 ring-[var(--ring)] bg-white/40':'hover:bg-white/30'}`}
    >
      <span className="flex items-center gap-2"><Icon size={18}/> {label}</span>
      {page===id && <span className="w-2 h-2 rounded-full" style={{background:'var(--accent)'}} />}
    </button>
  )

  return (
    <aside className="w-72 p-6 glass-xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold tracking-tight title-gradient">FocusFlow</div>
        <button
          aria-label="Toggle theme"
          className="btn-ghost hover-lift"
          onClick={()=> setTheme(t=> t==='light' ? 'dark' : 'light')}
          title="Toggle theme"
        >
          {theme==='dark' ? <Sun size={18}/> : <Moon size={18}/>}    
        </button>
      </div>

      <nav className="flex flex-col gap-2 mt-2">
        <NavButton id="TASKS" icon={List} label="Tasks" />
        <NavButton id="NOTES" icon={FileText} label="Notes" />
        <NavButton id="DIARY" icon={BookOpen} label="Diary" />
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm text-[var(--muted)]">
          <span>Accent</span>
          <div className="flex items-center gap-2">
            {['violet','peach','teal','blue'].map(opt => (
              <button
                key={opt}
                className={`accent-dot ${opt}`}
                title={`Accent: ${opt}`}
                onClick={()=>{
                  document.documentElement.setAttribute('data-accent', opt)
                  localStorage.setItem('focus_accent', opt)
                }}
              />
            ))}
          </div>
        </div>
        {/** Parallax toggle removed per user request **/}
        {/** Export removed per user request **/}
        <div className="text-xs text-[var(--muted)]">Tip: Press Ctrl+K to search quickly</div>
      </div>
    </aside>
  )
}