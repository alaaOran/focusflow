import React, {useEffect, useMemo, useState} from 'react'
import { motion } from 'framer-motion'
import RichEditor from '../editors/RichEditor'
import { useStore } from '../store/useStore'

export default function DiaryPage(){
  const { diary, setDiary } = useStore()
  const today = new Date().toISOString().slice(0,10)
  const [selectedId, setSelectedId] = useState(null)
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(today)
  // Keep prompts available if we want to re-enable later
  const prompts = useMemo(()=> [], [])

  useEffect(()=>{
    const s = localStorage.getItem('focus_diary')
    if(s){
      const parsed = JSON.parse(s)
      // Migrate legacy object-based storage { [date]: string | {content, mood} }
      let entries = []
      if(Array.isArray(parsed)){
        entries = parsed
      } else if(parsed && typeof parsed === 'object'){
        entries = Object.entries(parsed).map(([d, v]) => ({
          id: Date.now() + Math.random(),
          date: d,
          title: '',
          content: typeof v === 'string' ? v : (v?.content || ''),
          mood: typeof v === 'string' ? '' : (v?.mood || ''),
        }))
      }
      // If empty after migration, create today's entry automatically
      if(entries.length === 0){
        const entry = { id: Date.now(), date: today, title: 'Untitled', content: '', mood: '' }
        entries = [entry]
        setSelectedId(entry.id)
        setTitle(entry.title)
        setContent(entry.content)
        setMood(entry.mood)
        setDate(entry.date)
      } else {
        // Select today's entry if exists or first
        const todayEntry = entries.find(e=> e.date===today)
        const first = todayEntry || entries[0]
        if(first){
          setSelectedId(first.id)
          setTitle(first.title||'')
          setContent(first.content||'')
          setMood(first.mood||'')
          setDate(first.date)
        }
      }
      setDiary(entries)
      localStorage.setItem('focus_diary', JSON.stringify(entries))
    } else if(Array.isArray(diary) && diary.length){
      const todayEntry = diary.find(e=> e.date===today)
      const first = todayEntry || diary[0]
      if(first){
        setSelectedId(first.id)
        setTitle(first.title||'')
        setContent(first.content||'')
        setMood(first.mood||'')
        setDate(first.date)
      }
    } else if(Array.isArray(diary) && diary.length===0){
      // No saved entries anywhere; create today's entry
      const entry = { id: Date.now(), date: today, title: 'Untitled', content: '', mood: '' }
      setDiary([entry])
      setSelectedId(entry.id)
      setTitle(entry.title)
      setContent(entry.content)
      setMood(entry.mood)
      setDate(entry.date)
      localStorage.setItem('focus_diary', JSON.stringify([entry]))
    }
  }, [])

  // Persist on diary list changes
  useEffect(()=>{
    if(Array.isArray(diary)){
      localStorage.setItem('focus_diary', JSON.stringify(diary))
    }
  }, [diary])

  function addEntry(){
    const entry = { id: Date.now(), date: today, title: 'Untitled', content: '', mood: '' }
    const next = [entry, ...(Array.isArray(diary)? diary: [])]
    setDiary(next)
    setSelectedId(entry.id)
    setTitle(entry.title)
    setContent('')
    setMood('')
    setDate(today)
  }

  function updateEntry(id, patch){
    setDiary((Array.isArray(diary)? diary: []).map(e=> e.id===id ? { ...e, ...patch } : e))
  }

  function removeEntry(id){
    const next = (Array.isArray(diary)? diary: []).filter(e=> e.id!==id)
    setDiary(next)
    if(selectedId===id){
      setSelectedId(null)
      setTitle(''); setContent(''); setMood(''); setDate(today)
    }
  }

  // Keep selected entry state in sync when user edits
  useEffect(()=>{
    if(selectedId!=null){
      updateEntry(selectedId, { title, content, mood, date })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, mood, date])

  const entries = Array.isArray(diary)? diary : []
  const sorted = entries.slice().sort((a,b)=> (b.date||'').localeCompare(a.date||''))
  const selected = entries.find(e=> e.id===selectedId) || null

  return (
    <div className="h-full glass p-6 flex flex-col diary">
      <div className="mb-4 glass rounded-lg px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold title-gradient headline">Diary</h2>
          <div className="flex items-center gap-2">
            {sorted.length > 1 && (
              <select className="input" value={selectedId||''} onChange={e=>{
                const id = e.target.value ? Number(e.target.value) : null
                setSelectedId(id)
                const ent = entries.find(x=> x.id===id)
                if(ent){
                  setTitle(ent.title||'')
                  setContent(ent.content||'')
                  setMood(ent.mood||'')
                  setDate(ent.date||today)
                }
              }}>
                <option value="">Select entry…</option>
                {sorted.map(e=> (
                  <option key={e.id} value={e.id}>{e.date} — {e.title||'Untitled'}</option>
                ))}
              </select>
            )}
            <button className="btn btn-shine hover-lift" onClick={addEntry}>New</button>
            {selected && <button className="btn-ghost" onClick={()=>removeEntry(selectedId)}>Delete</button>}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        {!selected && (
          <div className="text-sm text-[var(--muted)]">Create or select an entry to start writing</div>
        )}
        {selected && (
          <div className="flex flex-col gap-3 h-full">
            <input className="input text-2xl md:text-3xl font-semibold" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
            <div className="flex items-center gap-2 flex-wrap">
              <input type="date" className="input" value={date} onChange={e=>setDate(e.target.value)} />
              <select className="input py-2" value={mood} onChange={e=>setMood(e.target.value)} title="Mood">
                <option value="">Mood</option>
                <option value="😀">😀 Happy</option>
                <option value="🙂">🙂 Calm</option>
                <option value="😌">😌 Content</option>
                <option value="😕">😕 Unsure</option>
                <option value="😟">😟 Stressed</option>
              </select>
              <div className="text-sm text-[var(--muted)]">Words: {content.split(/\s+/).filter(Boolean).length}</div>
            </div>
            <div className="flex-1 min-h-[500px] overflow-auto">
              <RichEditor className="diary-editor" value={content} onChange={setContent} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}