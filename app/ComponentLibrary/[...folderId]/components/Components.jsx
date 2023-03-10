'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useStore } from "@/Zustand/store"
import { useState, useRef, useEffect } from "react"

const fetchFolders = async (currentTitle) => {
    const res = await fetch(`/api/Components/ComponentFolder/${currentTitle}`)
      const data = await res.json()
      data.Components.sort(function(a, b) {
          return (a.id - b.id);
      })
      return data.Components
  }

const Components = ({prevParam, currentTitle}) => {
  const queryClient = useQueryClient()
  const {data, isLoading, isError, error} = useQuery({
    queryKey: ['Components'],
    queryFn: () => fetchFolders(currentTitle)
  }) 
  return (
    <>
      {data.map((item) => (
        <ComponentElement key={item.id} data={item} prevParam={prevParam} queryClient={queryClient}/>
      ))}
    </>
  )
}

export default Components

const ComponentElement = ({data, prevParam, queryClient}) => {
  const [editClicked, setEditClicked] = useState(false)
  const [editing, setEditing] = useState(false)
  let titleInput = useRef(null)
  let descriptonInput = useRef(null)
  const editedNote = () => {
    setEditing(true)
  }
  const saveChanges = async (e, queryClient) => {
    e.preventDefault(); 
    setEditClicked(false)
    setEditing(false)
    await fetch('/api/Components/Component',{
      method: 'PUT',
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify({
          id: data.id,
          title: titleInput.current.value,
          description: descriptonInput.current.value
      })
    })
    
    queryClient.invalidateQueries(['Components'])
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
  const copyCode = (e, componentCode) => {
    e.preventDefault()
    navigator.clipboard.writeText(componentCode)

  }
  const mutation = useMutation({
    mutationFn: async () => await fetch('/api/Components/Component',{
      method: 'DELETE',
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify({
          id: data.id,
      })
    }),
    onMutate: async () => {
      // cancel outgoing fetches
      await queryClient.cancelQueries({ queryKey: ['Components']})
      // get snapshot
      const previousState = queryClient.getQueryData({queryKey: ['Components']})
      await queryClient.setQueryData(
        ['Components'], 
        previousState.filter((item) => item.id !== data.id)
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
  const { componentsEditToggle, componentsDeleteToggle } = useStore()
  if(componentsEditToggle === false){
    if(editClicked)setEditClicked(false)
    if(editing)setEditing(false)
  }
  return (
    <Link href={{pathname: `/ComponentLibrary/${prevParam + data.title}`,query: {components: 'true'}}}>
      <div className={`aspect-square relative shadow ${editClicked && 'border border-black'} ${componentsDeleteToggle && 'hover:bg-red-500'}`} onClick={(e) => deleteNote(e)}>
        <textarea ref={titleInput} className={`bg-transparent border-none outline-none ${!componentsEditToggle && 'pointer-events-none'}`} defaultValue={data.title}  
                  onClick={(e) => editClickedOn(e)} onChange={() => editedNote()}/>
        <textarea ref={descriptonInput} className={`bg-transparent border-none outline-none ${!componentsEditToggle && 'pointer-events-none'}`} defaultValue={data.description} 
                  onClick={(e) => editClickedOn(e)} onChange={() => editedNote()}/>
        <button onClick={(e) => copyCode(e, data.content)}><svg className="h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg></button>
        <button className={`border-black border absolute bottom-0 bg-white px-2 m-1 right-0 ${!editing && 'opacity-0 pointer-events-none'}`} onClick={(e) => saveChanges(e, queryClient)}>Save</button>
      </div>
    </Link>
  )
}