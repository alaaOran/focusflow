import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function RichEditor({ value='', onChange=()=>{}, className='' }){
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    // Debounce updates to reduce typing lag when parent state is heavy
    onUpdate: (() => {
      let t = null
      return ({ editor }) => {
        const html = editor.getHTML()
        if (t) clearTimeout(t)
        t = setTimeout(() => onChange(html), 200)
      }
    })()
  })

  useEffect(()=>{
    if(editor && value !== editor.getHTML()) editor.commands.setContent(value || '')
  }, [value])

  return (
    <div className={`prose max-w-full ${className}`}>
      <EditorContent editor={editor} />
    </div>
  )
}