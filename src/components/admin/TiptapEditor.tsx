'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import React, { useCallback } from 'react'
import { uploadImage } from '@/lib/storage'

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-[4px] my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-vp-accent underline cursor-pointer',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'vp-input min-h-[400px] font-serif text-[16px] leading-relaxed py-4 vp-scroll focus:outline-none',
      },
    },
  })

  const addImage = useCallback(async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (input.files?.[0]) {
        try {
          const url = await uploadImage(input.files[0], 'articles')
          editor?.chain().focus().setImage({ src: url }).run()
        } catch (error) {
          console.error('Error uploading editor image:', error)
        }
      }
    }
    input.click()
  }, [editor])

  if (!editor) {
    return <div className="vp-input min-h-[400px] animate-pulse bg-vp-surface" />
  }

  return (
    <div className="border border-vp-border rounded-[4px] overflow-hidden">
      <div className="bg-vp-surface border-b border-vp-border p-2 flex flex-wrap gap-1">
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          active={editor.isActive('bold')}
        >
          B
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          active={editor.isActive('italic')}
        >
          I
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          active={editor.isActive('heading', { level: 2 })}
        >
          H2
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          active={editor.isActive('heading', { level: 3 })}
        >
          H3
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          active={editor.isActive('bulletList')}
        >
          List
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          active={editor.isActive('blockquote')}
        >
          &quot;
        </MenuButton>
        <div className="w-px h-6 bg-vp-border mx-1 self-center" />
        <MenuButton onClick={addImage}>
          📸
        </MenuButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

const MenuButton = ({ children, onClick, active }: { children: React.ReactNode, onClick: () => void, active?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-2.5 py-1 text-[11px] font-bold rounded transition-colors ${active ? 'bg-vp-accent text-white' : 'hover:bg-vp-border-2 text-vp-text-2'}`}
  >
    {children}
  </button>
)
