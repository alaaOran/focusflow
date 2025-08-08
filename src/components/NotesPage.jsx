import React, {useEffect, useState} from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import RichEditor from '../editors/RichEditor'

export default function NotesPage(){
  const { notes, setNotes } = useStore()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [tagFilter, setTagFilter] = useState('')
  useEffect(()=>{
    const s = localStorage.getItem('focus_notes')
    if(s) setNotes(JSON.parse(s))
  }, [])
  useEffect(()=> localStorage.setItem('focus_notes', JSON.stringify(notes)), [notes])

  function add(){
    const note = { id:Date.now(), title:'Untitled', body:'', pinned:false, tags:[] }
    setNotes([note, ...notes])
    setSelectedId(note.id)
  }

  function updateNote(id, patch){
    setNotes(notes.map(n=> n.id===id ? {...n, ...patch} : n))
  }

  function togglePin(id){
    setNotes(notes.map(n=> n.id===id ? {...n, pinned:!n.pinned} : n))
  }

  function remove(id){
    setNotes(notes.filter(n=> n.id!==id))
    if(selectedId===id) setSelectedId(null)
  }

  const q = query.toLowerCase()
  const t = tagFilter.toLowerCase()
  const matches = (n)=> (
    (!q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)) &&
    (!t || (n.tags||[]).some(tag=> tag.toLowerCase().includes(t)))
  )
  const sorted = [...notes].sort((a,b)=> (b.pinned?1:0) - (a.pinned?1:0))
  const filtered = sorted.filter(matches)
  const selected = notes.find(n=> n.id===selectedId) || null

  return (
    <div className="h-full glass p-6 flex flex-col">
      <div className="mb-4 glass rounded-lg px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold title-gradient headline">Notes</h2>
          <div className="text-sm text-[var(--muted)]">{filtered.length}/{notes.length} shown</div>
        </div>
        <div className="mt-3 flex gap-2 flex-wrap">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search..." className="input" />
          <input value={tagFilter} onChange={e=>setTagFilter(e.target.value)} placeholder="Filter by tag" className="input" />
          <button onClick={add} className="btn btn-shine hover-lift">New</button>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
        <div className="overflow-auto pr-1">
          {filtered.length===0 && <div className="text-sm text-[var(--muted)]">No notes match your search</div>}
          <motion.div className="grid grid-cols-1 gap-3"
            variants={{ hidden:{opacity:1}, show:{opacity:1, transition:{staggerChildren:0.06, delayChildren:0.04}} }}
            initial="hidden" animate="show">
            {filtered.map(n=> (
              <motion.button key={n.id} variants={{ hidden:{opacity:0, y:8}, show:{opacity:1, y:0} }} onClick={()=>setSelectedId(n.id)} className={`text-left p-4 glass rounded-md transition-all card-hover hover-lift tilt-3d ${selectedId===n.id?'ring-2 ring-[var(--ring)]':''}`}>
                <div className="flex items-center justify-between">
                  <input
                    value={n.title}
                    onChange={e=>updateNote(n.id,{title:e.target.value})}
                    className="bg-transparent font-semibold outline-none w-full"
                  />
                  <div className="flex items-center gap-2 ml-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${n.pinned? 'bg-white/60':'bg-white/30'}`}
                      onClick={(e)=>{ e.stopPropagation(); togglePin(n.id) }}
                      title={n.pinned? 'Unpin':'Pin'}
                    >{n.pinned? 'Pinned':'Pin'}</span>
                    <span
                      className="text-xs px-2 py-1 rounded-full bg-white/30"
                      onClick={(e)=>{ e.stopPropagation(); remove(n.id) }}
                      title="Delete"
                    >Delete</span>
                  </div>
                </div>
                <div className="mt-2 text-sm overflow-hidden max-h-24" dangerouslySetInnerHTML={{__html: n.body}} />
                {n.tags && n.tags.length>0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {n.tags.map((tag,i)=> (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/40">#{tag}</span>
                    ))}
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div className="overflow-auto pl-1">
          {!selected && <div className="text-sm text-[var(--muted)]">Select a note to edit</div>}
          {selected && (
            <div className="flex flex-col gap-3 h-full">
              <input
                value={selected.title}
                onChange={e=>updateNote(selected.id,{title:e.target.value})}
                className="input"
                placeholder="Note title"
              />
              <div className="text-xs text-[var(--muted)]">Tags (comma separated)</div>
              <input
                value={(selected.tags||[]).join(', ')}
                onChange={e=> updateNote(selected.id, { tags: e.target.value.split(',').map(t=>t.trim()).filter(Boolean) })}
                className="input"
                placeholder="e.g. ideas, work, personal"
              />
              <div className="flex-1 min-h-[200px] overflow-auto">
                <RichEditor value={selected.body} onChange={v=>updateNote(selected.id,{body:v})} />
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-ghost" onClick={()=>togglePin(selected.id)}>{selected.pinned? 'Unpin' : 'Pin'}</button>
                <button className="btn-ghost" onClick={()=>remove(selected.id)}>Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}