import React from 'react'
export default function NoteCard({note}){
  return (
    <div className="p-4 glass rounded-md">
      <h3 className="font-semibold">{note.title}</h3>
      <div className="text-sm mt-2">{note.body}</div>
    </div>
  )
}