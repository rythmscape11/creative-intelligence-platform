'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Start writing your blog post...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-amber-600 underline hover:text-amber-700',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  // Update editor content when prop changes (for autosave)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const inactiveButtonClass =
    'bg-white dark:bg-bg-secondary hover:bg-gray-100 dark:hover:bg-bg-hover text-gray-700 dark:text-text-primary';
  const getToggleClass = (isActive: boolean) =>
    isActive ? 'bg-amber-600 text-white' : inactiveButtonClass;

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

  const addCalloutBox = (type: 'pro-tip' | 'expert-insight' | 'cta-box') => {
    const content = window.prompt(`Enter ${type.replace('-', ' ')} content:`);
    if (content) {
      editor.chain().focus().insertContent(`<div class="${type}">${content}</div>`).run();
    }
  };

  return (
    <div className="border border-border-primary rounded-lg overflow-hidden bg-white dark:bg-bg-tertiary">
      {/* Toolbar */}
      <div className="border-b border-border-primary bg-gray-50 dark:bg-bg-secondary p-2 flex flex-wrap gap-1">
        {/* Headings */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor.isActive('heading', { level: 1 })
                ? 'bg-amber-600 text-white'
                : inactiveButtonClass
              }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor.isActive('heading', { level: 2 })
                ? 'bg-amber-600 text-white'
                : inactiveButtonClass
              }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor.isActive('heading', { level: 3 })
                ? 'bg-amber-600 text-white'
                : inactiveButtonClass
              }`}
            title="Heading 3"
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor.isActive('heading', { level: 4 })
                ? 'bg-amber-600 text-white'
                : inactiveButtonClass
              }`}
            title="Heading 4"
          >
            H4
          </button>
        </div>

        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded text-sm font-bold transition-colors ${editor.isActive('bold')
                ? 'bg-amber-600 text-white'
                : inactiveButtonClass
              }`}
            title="Bold"
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded text-sm italic transition-colors ${editor.isActive('italic')
                ? 'bg-amber-600 text-white'
                : inactiveButtonClass
              }`}
            title="Italic"
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1 rounded text-sm underline transition-colors ${editor.isActive('underline')
                ? 'bg-amber-600 text-white'
                : inactiveButtonClass
              }`}
            title="Underline"
          >
            U
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded text-sm transition-colors ${editor.isActive('bulletList')
                ? 'bg-amber-600 text-white'
                : inactiveButtonClass
              }`}
            title="Bullet List"
          >
            • List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded text-sm transition-colors ${editor.isActive('orderedList')
                ? 'bg-amber-600 text-white'
                : inactiveButtonClass
              }`}
            title="Numbered List"
          >
            1. List
          </button>
        </div>

        {/* Links & Images */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={addLink}
            className={`px-3 py-1 rounded text-sm transition-colors ${editor.isActive('link')
                ? 'bg-amber-600 text-white'
                : inactiveButtonClass
              }`}
            title="Add Link"
          >
            🔗 Link
          </button>
          <button
            onClick={addImage}
            className={`px-3 py-1 rounded text-sm transition-colors ${inactiveButtonClass}`}
            title="Add Image"
          >
            🖼️ Image
          </button>
        </div>

        {/* Code Block */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-3 py-1 rounded text-sm transition-colors ${editor.isActive('codeBlock')
                ? 'bg-amber-600 text-white'
                : inactiveButtonClass
              }`}
            title="Code Block"
          >
            &lt;/&gt; Code
          </button>
        </div>

        {/* Callout Boxes */}
        <div className="flex gap-1">
          <button
            onClick={() => addCalloutBox('pro-tip')}
            className={`px-3 py-1 rounded text-sm transition-colors ${inactiveButtonClass}`}
            title="Add Pro Tip"
          >
            💡 Pro Tip
          </button>
          <button
            onClick={() => addCalloutBox('expert-insight')}
            className={`px-3 py-1 rounded text-sm transition-colors ${inactiveButtonClass}`}
            title="Add Expert Insight"
          >
            🎯 Expert
          </button>
          <button
            onClick={() => addCalloutBox('cta-box')}
            className={`px-3 py-1 rounded text-sm transition-colors ${inactiveButtonClass}`}
            title="Add CTA"
          >
            📢 CTA
          </button>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
