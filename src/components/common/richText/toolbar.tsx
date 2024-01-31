'use client'
import { Toggle } from "@/components/ui/toggle"
import { type Editor } from "@tiptap/react"
import {
    Bold,
    Italic,
    Heading2
} from 'lucide-react'

interface ToolbarProps {
    editor: Editor | null
}


export default function Toolbar({ editor }: ToolbarProps) {
    if (!editor) return null
    return (
        <div className='flex gap-2'>
            <Toggle
                variant='outline'
                size='sm'
                pressed={editor.isActive('heading')}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <Heading2 className='h-4 w-4' />
            </Toggle>
            <Toggle
                variant='outline'
                size='sm'
                pressed={editor.isActive('bold')}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className='h-4 w-4' />
            </Toggle>
            <Toggle
                variant='outline'
                size='sm'
                pressed={editor.isActive('italic')}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className='h-4 w-4' />
            </Toggle>
        </div>
    )
}