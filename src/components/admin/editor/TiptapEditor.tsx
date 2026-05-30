"use client";

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

interface TiptapEditorProps {
  content: JSONContent | string | null;
  onChange: (content: JSONContent) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] font-serif text-[18px] leading-relaxed',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Mini-toolbar for quick actions */}
      <div className="flex items-center gap-1 p-2 mb-4 border-b border-vp-border sticky top-0 bg-[#141413] z-20">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-vp-surface ${editor.isActive('bold') ? 'text-vp-accent' : 'text-vp-text-3'}`}
          title="Negrito"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-vp-surface ${editor.isActive('italic') ? 'text-vp-accent' : 'text-vp-text-3'}`}
          title="Itálico"
        >
          <em>I</em>
        </button>
        <div className="w-[1px] h-4 bg-vp-border mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 text-[12px] font-bold rounded hover:bg-vp-surface ${editor.isActive('heading', { level: 2 }) ? 'text-vp-accent' : 'text-vp-text-3'}`}
          title="Título 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 text-[12px] font-bold rounded hover:bg-vp-surface ${editor.isActive('heading', { level: 3 }) ? 'text-vp-accent' : 'text-vp-text-3'}`}
          title="Título 3"
        >
          H3
        </button>
        <div className="w-[1px] h-4 bg-vp-border mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-vp-surface ${editor.isActive('bulletList') ? 'text-vp-accent' : 'text-vp-text-3'}`}
          title="Lista"
        >
          •
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-vp-surface ${editor.isActive('blockquote') ? 'text-vp-accent' : 'text-vp-text-3'}`}
          title="Citação"
        >
          &quot;
        </button>
      </div>

      <EditorContent editor={editor} />
      
      <style jsx global>{`
        .prose blockquote {
          border-left: 4px solid var(--vp-accent);
          padding-left: 1.5rem;
          font-style: italic;
          color: var(--vp-text-2);
        }
        .prose h2 {
          font-family: var(--vp-display);
          font-size: 24px;
          font-weight: 900;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose h3 {
          font-family: var(--vp-display);
          font-size: 20px;
          font-weight: 800;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .prose p {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
}
