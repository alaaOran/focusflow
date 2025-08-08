import React from 'react'
export default function TaskItem({task, onToggle, onDelete}){
  return (
    <div className="p-3 bg-white/40 rounded-md flex justify-between items-center">
      <div><input type="checkbox" checked={task.done} onChange={()=>onToggle(task.id)} /> <span className={task.done?'line-through text-gray-400':''}>{task.title}</span></div>
      <div><button onClick={()=>onDelete(task.id)} className="text-sm">Delete</button></div>
    </div>
  )
}