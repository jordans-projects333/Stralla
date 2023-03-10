'use client'
import { useStore } from "@/Zustand/store"
import { useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const AddComponentFolder = ({currentTitle}) => {
    const { addComponentFolderToggle } = useStore()
    let componentFolderTitle = useRef('')
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async () => await fetch('/api/Components/ComponentFolder',{
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({
                title: componentFolderTitle.current,
                parent:  currentTitle.replaceAll('%20', ' ')
            })
        }),
        onMutate: async () => {
            // cancel outgoing fetches
            await queryClient.cancelQueries({ queryKey: ['ComponentsFolders']})
            // get snapshot
            const previousState = queryClient.getQueryData({queryKey: ['ComponentsFolders']})
            await queryClient.setQueryData(['ComponentsFolders'], [...previousState, 
            {
                id: previousState.length + 1,
                title: componentFolderTitle.current,
            }]
            )
            return { previousState }
        },
        onError: (err, post, context) => {
            queryClient.setQueryData(['ComponentsFolders'], context.previousState)
        },
        onSettled: () => {
            queryClient.invalidateQueries(['ComponentsFolders'])
        }
    })
    const createFolder = () => {
        useStore.setState((state) => ({
            addComponentFolderToggle : false,
            bluredBackgroundToggle : false
        }))
        mutation.mutate()
    }
    return (
        <div className={`absolute flex flex-col z-20 border-black bg-white border top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[80%] h-[80%] ${!addComponentFolderToggle && 'opacity-0 pointer-events-none'}`}>
            <h3>Add Folder</h3>
            <input type={'text'} placeholder={'Title'} className='border border-black' onChange={(e) => componentFolderTitle.current = e.target.value}/>
            <button onClick={() => createFolder()} className='border border-black'>Create</button>
        </div>
    )
}

export default AddComponentFolder