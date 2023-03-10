'use client'
import { useStore } from "@/Zustand/store"
import { useRef, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const AddSvgs = () => {
    let svgTitle = useRef(null)
    let svgCode = useRef(null)
    let svgEditedTitle = useRef(null)
    let svgEditedCode = useRef(null)
    const addSvg = async () => {
        closeSvgAdd()
        let fontTemp = svgCode.current.value.replace('<!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->', '')
        fontTemp = fontTemp.slice(0, 5) + "className='h-6' " + fontTemp.slice(5);
        console.log(fontTemp)
        await fetch('/api/svgLibrary', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({
                title: svgTitle.current.value,
                code: fontTemp
            })
        })
        svgTitle.current.value = ''
        svgCode.current.value = ''
    }
    const { addToggledTo, editClicked, editableSvgTitle, editableSvgCode, editableSvgId }  = useStore()
    const editSvg = async () => {
        useStore.setState((state) => ({
            editClicked: false,
            editSvgToggle: false
        }))
        await fetch('/api/svgLibrary',{
            method: 'PUT',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({
                id: editableSvgId,
                title: svgEditedTitle.current.value,
                code: svgEditedCode.current.value
            })
        })
    }
    useEffect(() => {
        svgEditedTitle.current.value = editableSvgTitle
        svgEditedCode.current.value = editableSvgCode
    },[editClicked])
    const closeSvgAdd = () => {
        useStore.setState((state) => ({
            addToggledTo: ''
        }))
        useStore.setState((state) => ({
            editClicked: false
        }))
    }
    const queryClient = useQueryClient()
    const mutation = useMutation({
    mutationFn: addSvg,
    onMutate: async () => {
        // cancel outgoing fetches
        await queryClient.cancelQueries({ queryKey: ['Svgs']})
        // get snapshot
        const previousState = await queryClient.getQueryData({queryKey: ['Svgs']})
        queryClient.setQueryData(
        ['Svgs'], 
        [...previousState, {id: previousState.length + 1, title: svgTitle.current.value, code: svgCode.current.value}]
        )
        return { previousState }
    },
    onError: (err, post, context) => {
        queryClient.setQueryData(['Svgs'], context.previousState)
    },
    onSettled: () => {
        queryClient.invalidateQueries({queryKey: ['Svgs']})
    }
    })
    const editMutation = useMutation({
        mutationFn: editSvg,
        onMutate: async () => {
            // cancel outgoing fetches
            await queryClient.cancelQueries({ queryKey: ['Svgs']})
            // get snapshot
            const previousState = await queryClient.getQueryData({queryKey: ['Svgs']})
            previousState.map((item, index) => {
                if(item.id === editableSvgId){
                    console.log(previousState[index], 'before')
                    previousState[index] = {id: previousState[index].id, title: svgEditedTitle.current.value, code: svgEditedCode.current.value}
                    console.log(previousState[index], 'after')
                }
            })
            console.log(previousState)
            queryClient.setQueryData(
            ['Svgs'], 
            previousState
            )
            return { previousState }
        },
        onError: (err, post, context) => {
            queryClient.setQueryData(['Svgs'], context.previousState)
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['Svgs']})
        }
        })
    return (
        <>
        <div onClick={() => closeSvgAdd()} className={`${addToggledTo !== 'svgLibrary' && editClicked !== true && 'opacity-0 pointer-events-none'} h-full duration-100 w-full fixed top-0 backdrop-blur-sm z-20`}></div>
        <div className={`${addToggledTo !== 'svgLibrary' && 'opacity-0 pointer-events-none'} duration-100 flex flex-col absolute top-[50%] left-[50%] translate-x-[-50%] z-20 translate-y-[-50%] h-[80%] w-[80%] bg-white border border-black`}>
            <input ref={svgTitle} type='text' className="border border-black"/>
            <textarea ref={svgCode} className="border border-black"></textarea>
            <button onClick={() => mutation.mutate()}>Create</button>
        </div>
        <div className={`${editClicked !== true && 'opacity-0 pointer-events-none'} duration-100 flex flex-col absolute top-[50%] left-[50%] translate-x-[-50%] z-20 translate-y-[-50%] h-[80%] w-[80%] bg-white border border-black`}>
            <input ref={svgEditedTitle} type='text' className="border border-black"/>
            <textarea ref={svgEditedCode} className="border border-black"></textarea>
            <button onClick={() => editMutation.mutate()}>Edit</button>
        </div>
        
        </>
    )
}

export default AddSvgs