'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-border-primary rounded-lg overflow-hidden bg-bg-secondary">
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-1 p-2 border-b border-border-primary bg-bg-elevated"
      >
        {/* Headings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`text-text-secondary hover:text-text-primary hover:bg-bg-hover ${
            editor.isActive('heading', { level: 1 }) ? 'bg-accent-secondary text-white hover:bg-accent-secondary/90' : ''
          }`}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`text-text-secondary hover:text-text-primary hover:bg-bg-hover ${
            editor.isActive('heading', { level: 2 }) ? 'bg-accent-secondary text-white hover:bg-accent-secondary/90' : ''
          }`}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`text-text-secondary hover:text-text-primary hover:bg-bg-hover ${
            editor.isActive('heading', { level: 3 }) ? 'bg-accent-secondary text-white hover:bg-accent-secondary/90' : ''
          }`}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border-primary mx-1" />

        {/* Text Formatting */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`text-text-secondary hover:text-text-primary hover:bg-bg-hover ${
            editor.isActive('bold') ? 'bg-accent-secondary text-white hover:bg-accent-secondary/90' : ''
          }`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`text-text-secondary hover:text-text-primary hover:bg-bg-hover ${
            editor.isActive('italic') ? 'bg-accent-secondary text-white hover:bg-accent-secondary/90' : ''
          }`}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border-primary mx-1" />

        {/* Lists */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`text-text-secondary hover:text-text-primary hover:bg-bg-hover ${
            editor.isActive('bulletList') ? 'bg-accent-secondary text-white hover:bg-accent-secondary/90' : ''
          }`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`text-text-secondary hover:text-text-primary hover:bg-bg-hover ${
            editor.isActive('orderedList') ? 'bg-accent-secondary text-white hover:bg-accent-secondary/90' : ''
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border-primary mx-1" />

        {/* Quote */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`text-text-secondary hover:text-text-primary hover:bg-bg-hover ${
            editor.isActive('blockquote') ? 'bg-accent-secondary text-white hover:bg-accent-secondary/90' : ''
          }`}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border-primary mx-1" />

        {/* Link and Image */}
        <Button
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={`text-text-secondary hover:text-text-primary hover:bg-bg-hover ${
            editor.isActive('link') ? 'bg-accent-secondary text-white hover:bg-accent-secondary/90' : ''
          }`}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={addImage}
          className="text-text-secondary hover:text-text-primary hover:bg-bg-hover"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border-primary mx-1" />

        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="text-text-secondary hover:text-text-primary hover:bg-bg-hover disabled:opacity-50"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="text-text-secondary hover:text-text-primary hover:bg-bg-hover disabled:opacity-50"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="bg-bg-secondary">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .ProseMirror {
          min-height: 400px;
          padding: 1rem;
          color: #FFFFFF;
        }

        .ProseMirror:focus {
          outline: none;
        }

        .ProseMirror p {
          margin: 0.5rem 0;
          color: #FFFFFF;
        }

        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
          color: #FFFFFF;
        }

        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.75rem 0;
          color: #FFFFFF;
        }

        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.5rem 0;
          color: #FFFFFF;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
          color: #FFFFFF;
        }

        .ProseMirror li {
          color: #FFFFFF;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #3B82F6;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #A0A0A0;
        }

        .ProseMirror a {
          color: #3B82F6;
          text-decoration: underline;
        }

        .ProseMirror a:hover {
          color: #60A5FA;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .ProseMirror code {
          background-color: #1A1A1A;
          color: #3B82F6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }

        .ProseMirror pre {
          background-color: #1A1A1A;
          color: #FFFFFF;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
        }
      `}</style>
    </div>
  );
}

