import React, { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export default function TaskPage(){
  const { tasks, setTasks } = useStore()
  const [title, setTitle] = useState('')
  const [showCompleted, setShowCompleted] = useState(true)

  useEffect(()=>{
    const s = localStorage.getItem('focus_tasks')
    if(s) setTasks(JSON.parse(s))
  }, [])

  useEffect(()=>{
    localStorage.setItem('focus_tasks', JSON.stringify(tasks))
  }, [tasks])

  function add(){
    if(!title.trim()) return
    setTasks([{id:Date.now(), title: title.trim(), done:false}, ...tasks])
    setTitle('')
  }

  function toggle(id){
    setTasks(tasks.map(t=> t.id===id? {...t, done:!t.done}:t))
  }

  function remove(id){
    setTasks(tasks.filter(t=>t.id!==id))
  }

  const total = tasks.length
  const completed = tasks.filter(t=>t.done).length
  const visible = tasks.filter(t=> showCompleted ? true : !t.done)

  return (
    <div className="h-full glass p-6 flex flex-col">
      <div className="mb-4 glass rounded-lg px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold title-gradient headline">Tasks</h2>
          <div className="text-sm text-[var(--muted)]">{completed}/{total} done</div>
        </div>
        <div className="mt-3 flex gap-2 flex-wrap">
          <input value={title} onChange={e=>setTitle(e.target.value)} className="input flex-1" placeholder="Add a new task..." />
          <button onClick={add} className="btn btn-shine">Add</button>
          <button onClick={()=>setShowCompleted(v=>!v)} className="btn-ghost" title="Toggle completed visibility">{showCompleted? 'Hide done' : 'Show done'}</button>
        </div>
      </div>
      <div className="overflow-auto">
        {tasks.length===0 && <div className="text-sm text-[var(--muted)]">No tasks yet — start by adding one above.</div>}
        <motion.ul className="space-y-2 slide-up"
          variants={{ hidden:{opacity:1}, show:{opacity:1, transition:{staggerChildren:0.07, delayChildren:0.05}} }}
          initial="hidden" animate="show">
          {visible.map(t=> (
            <motion.li key={t.id} variants={{ hidden:{opacity:0, y:8}, show:{opacity:1, y:0} }} className="p-3 rounded-md flex justify-between items-center bg-white/40 hover-lift tilt-3d">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)} />
                <span className={t.done? 'line-through text-gray-400':''}>{t.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>remove(t.id)} className="btn-ghost text-sm">Delete</button>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}