import { useEditor, EditorContent } from '@tiptap/react'
import Heading from "@tiptap/extension-heading"
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './toolbar'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

interface RichTextProps {
    description: string
    onChange: (richText: string) => void
}

export default function RichText({ description, onChange }: RichTextProps) {
    const editor = useEditor({
        extensions: [StarterKit.configure({

        }), Heading.configure({
            HTMLAttributes: {
                class: 'text-xl font-bold',
                level: [2]
            }
        })],
        content: description,
        editorProps: {
            attributes: {
                class: 'max-h-80 h-80 overflow-auto bg-background-soft p-4 rounded-lg border-2 scrollbar-thin'
            }
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML())
        }
    })

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant='secondary' leftIcon='MessageCircle'>
                        {editor?.getText() ? 'Edit Email' : 'Write Email'}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-5xl">
                    <div className="grid gap-4 py-4">
                        <Toolbar editor={editor} />
                        <EditorContent editor={editor} />
                    </div>
                    <DialogFooter>
                        <Button
                            variant='secondary'
                            onClick={() => {
                                editor?.commands.clearContent()
                                onChange('')
                            }}
                        >Clear</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}