'use client'
import { useStore } from "@/Zustand/store"
import { useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const AddComponents = ({currentTitle}) => {
    const { addComponentToggle } = useStore()
    let componentTitle = useRef('')
    let componentDescription = useRef('')
    let componentContent = useRef('')
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async () => await fetch('/api/Components/Component',{
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({
                title: componentTitle.current,
                description: componentDescription.current,
                content: componentContent.current,
                parent: currentTitle.replaceAll('%20', ' ')
            })
        }),
        onMutate: async () => {
            // cancel outgoing fetches
            await queryClient.cancelQueries({ queryKey: ['Components']})
            // get snapshot
            const previousState = queryClient.getQueryData({queryKey: ['Components']})
            await queryClient.setQueryData(['Components'], [...previousState, 
            {
                id: previousState.length + 1,
                title: componentTitle.current,
                description: componentDescription.current,
                content: componentContent.current
            }]
            )
            return { previousState }
        },
        onError: (err, post, context) => {
            queryClient.setQueryData(['Components'], context.previousState)
        },
        onSettled: () => {
            queryClient.invalidateQueries(['Components'])
        }
    })
    const createComponent = () => {
        useStore.setState((state) => ({
            addComponentToggle : false,
            bluredBackgroundToggle : false
        }))
        mutation.mutate()
    }
    return (
        <div className={`absolute flex flex-col z-20 border-black bg-white border top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[80%] h-[80%] ${!addComponentToggle && 'opacity-0 pointer-events-none'}`}>
            <h3>Add Note</h3>
            <input type={'text'} placeholder={'Title'} className='border border-black' onChange={(e) => componentTitle.current = e.target.value}/>
            <textarea className="border border-black" placeholder="description" onChange={(e) => componentDescription.current = e.target.value}/>
            <textarea className="border border-black" placeholder="Content" onChange={(e) => componentContent.current = e.target.value}/>
            <button onClick={() => createComponent()} className='border border-black'>Create</button>
        </div>
    )
}

export default AddComponents