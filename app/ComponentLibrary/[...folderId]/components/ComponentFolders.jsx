'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useState, useRef } from 'react'
import { useStore } from "@/Zustand/store"

const fetchComponentFolders = async (currentTitle) => {
    const res = await fetch(`/api/Components/ComponentFolder/${currentTitle}`)
      const data = await res.json()
      data.ComponentFolders.sort(function(a, b) {
          return (a.id - b.id);
      })
      return data.ComponentFolders
  }

const ComponentsFolders = ({currentId, prevParam, currentTitle}) => {
    const queryClient = useQueryClient()
    const {data, isLoading, isError, error} = useQuery({
        queryKey: ['ComponentsFolders'],
        queryFn: () => fetchComponentFolders(currentTitle)
    }) 
    return (
        <>
            {data.map((item) => (
                <FolderElement key={item.id} data={item} prevParam={prevParam} queryClient={queryClient}/>
            ))}
        </>
    )
}

export default ComponentsFolders

const FolderElement = ({data, prevParam, queryClient}) => {
    const [editClicked, setEditClicked] = useState(false)
    const [editing, setEditing] = useState(false)
    let titleInput = useRef(null)
    const editedNote = () => {
      setEditing(true)
    }
    const saveChanges = async (e, queryClient) => {
      e.preventDefault(); 
      setEditClicked(false)
      setEditing(false)
      await fetch('/api/Components/ComponentFolder',{
        method: 'PUT',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({
            id: data.id,
            title: titleInput.current.value,
        })
      })
      
      queryClient.invalidateQueries(['ComponentsFolders'])
    }
    const editClickedOn = (e) => {
      let clickAway = (event) => {
        if(event.target.parentNode !== e.target.parentNode){
          setEditClicked(false)
          window.removeEventListener('click', clickAway)
        }
      }
      e.preventDefault()
      if(!editClicked){
        setEditClicked(true)
        window.addEventListener('click', clickAway)
      }
    }
    const deleteNote = async (e) => {
      if(componentsDeleteToggle){
        e.preventDefault()
        mutation.mutate()
      }
    }
    const mutation = useMutation({
      mutationFn: async () => await fetch('/api/Components/ComponentFolder',{
        method: 'DELETE',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({
            id: data.id,
        })
      }),
      onMutate: async () => {
        // cancel outgoing fetches
        await queryClient.cancelQueries({ queryKey: ['ComponentsFolders']})
        // get snapshot
        const previousState = queryClient.getQueryData({queryKey: ['ComponentsFolders']})
        await queryClient.setQueryData(
          ['ComponentsFolders'], 
          previousState.filter((item) => item.id !== data.id)
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
    const { componentsEditToggle, componentsDeleteToggle } = useStore()
    if(componentsEditToggle === false){
      if(editClicked)setEditClicked(false)
      if(editing)setEditing(false)
    }
    return (
      <Link href={`/ComponentLibrary/${prevParam+data.title}`}>
        <div className={`aspect-square relative shadow ${editClicked && 'border border-black'} ${componentsDeleteToggle && 'hover:bg-red-500'}`} onClick={(e) => deleteNote(e)}>
            <textarea ref={titleInput} className={`bg-transparent border-none outline-none ${!componentsEditToggle && 'pointer-events-none'}`} defaultValue={data.title}  
                      onClick={(e) => editClickedOn(e)} onChange={() => editedNote()}/>
            <button className={`border-black border absolute bottom-0 bg-white px-2 m-1 right-0 ${!editing && 'opacity-0 pointer-events-none'}`} onClick={(e) => saveChanges(e, queryClient)}>Save</button>
        </div>
    </Link>
    )
  }