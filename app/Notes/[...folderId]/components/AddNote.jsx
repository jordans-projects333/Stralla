'use client'
import { useStore } from "@/Zustand/store"
import { useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const AddNote = ({currentTitle}) => {
    const { addNoteToggle } = useStore()
    let noteTitle = useRef('')
    let noteDescription = useRef('')
    let noteContent = useRef('')
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async () => await fetch('/api/Notes/Note',{
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({
                title: noteTitle.current,
                description: noteDescription.current,
                content: noteContent.current,
                parent: currentTitle.replaceAll('%20', ' ')
            })
        }),
        onMutate: async () => {
            // cancel outgoing fetches
            await queryClient.cancelQueries({ queryKey: ['NotesPageNotes']})
            // get snapshot
            const previousState = queryClient.getQueryData({queryKey: ['NotesPageNotes']})
            await queryClient.setQueryData(['NotesPageNotes'], [...previousState, 
            {
                id: previousState.length + 1,
                title: noteTitle.current,
                description: noteDescription.current,
                content: noteContent.current
            }]
            )
            return { previousState }
        },
        onError: (err, post, context) => {
            queryClient.setQueryData(['NotesPageNotes'], context.previousState)
        },
        onSettled: () => {
            queryClient.invalidateQueries(['NotesPageNotes'])
        }
    })
    const createNote = () => {
        useStore.setState((state) => ({
            addNoteToggle : false,
            bluredBackgroundToggle : false
        }))
        mutation.mutate()
    }
    return (
        <div className={`absolute flex flex-col z-20 border-black bg-white border top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[80%] h-[80%] ${!addNoteToggle && 'opacity-0 pointer-events-none'}`}>
            <h3>Add Note</h3>
            <input type={'text'} placeholder={'Title'} className='border border-black' onChange={(e) => noteTitle.current = e.target.value}/>
            <textarea className="border border-black" placeholder="description" onChange={(e) => noteDescription.current = e.target.value}/>
            <textarea className="border border-black" placeholder="Content" onChange={(e) => noteContent.current = e.target.value}/>
            <button onClick={() => createNote()} className='border border-black'>Create</button>
        </div>
    )
}

export default AddNote