'use client'
import { useStore } from "@/Zustand/store"
import { useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const AddFolder = ({currentTitle}) => {
    const { addFolderToggle } = useStore()
    let folderTitle = useRef('')
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async () => await fetch('/api/Notes/Folder',{
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({
                title: folderTitle.current,
                parent:  currentTitle.replaceAll('%20', ' ')
            })
        }),
        onMutate: async () => {
            // cancel outgoing fetches
            await queryClient.cancelQueries({ queryKey: ['NotesPageFolders']})
            // get snapshot
            const previousState = queryClient.getQueryData({queryKey: ['NotesPageFolders']})
            await queryClient.setQueryData(['NotesPageFolders'], [...previousState, 
            {
                id: previousState.length + 1,
                title: folderTitle.current,
            }]
            )
            return { previousState }
        },
        onError: (err, post, context) => {
            queryClient.setQueryData(['NotesPageFolders'], context.previousState)
        },
        onSettled: () => {
            queryClient.invalidateQueries(['NotesPageFolders'])
        }
    })
    const createFolder = () => {
        useStore.setState((state) => ({
            addFolderToggle : false,
            bluredBackgroundToggle : false
        }))
        mutation.mutate()
    }
    return (
        <div className={`absolute flex flex-col z-20 border-black bg-white border top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[80%] h-[80%] ${!addFolderToggle && 'opacity-0 pointer-events-none'}`}>
            <h3>Add Folder</h3>
            <input type={'text'} placeholder={'Title'} className='border border-black' onChange={(e) => folderTitle.current = e.target.value}/>
            <button onClick={() => createFolder()} className='border border-black'>Create</button>
        </div>
    )
}

export default AddFolder