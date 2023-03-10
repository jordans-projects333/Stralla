'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useState, useRef } from 'react'
import { useStore } from "@/Zustand/store"

const fetchFolders = async (currentTitle) => {
    const res = await fetch(`/api/Notes/Folder/${currentTitle}`)
      const data = await res.json()
      data.folders.sort(function(a, b) {
          return (a.id - b.id);
      })
      return data.folders
  }

const Folders = ({currentId, prevParam, currentTitle}) => {
    const queryClient = useQueryClient()
    const {data, isLoading, isError, error} = useQuery({
        queryKey: ['NotesPageFolders'],
        queryFn: () => fetchFolders(currentTitle)
    }) 
    return (
        <>
            {data.map((item) => (
                <FolderElemnt key={item.id} data={item} prevParam={prevParam} queryClient={queryClient}/>
            ))}
        </>
    )
}

export default Folders

const FolderElemnt = ({data, prevParam, queryClient}) => {
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
      await fetch('/api/Notes/Folder',{
        method: 'PUT',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({
            id: data.id,
            title: titleInput.current.value,
        })
      })
      
      queryClient.invalidateQueries(['NotesPageFolders'])
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
      if(notesDeleteToggle){
        e.preventDefault()
        mutation.mutate()
      }
    }
    const mutation = useMutation({
      mutationFn: async () => await fetch('/api/Notes/Folder',{
        method: 'DELETE',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({
            id: data.id,
        })
      }),
      onMutate: async () => {
        // cancel outgoing fetches
        await queryClient.cancelQueries({ queryKey: ['NotesPageFolders']})
        // get snapshot
        const previousState = queryClient.getQueryData({queryKey: ['NotesPageFolders']})
        await queryClient.setQueryData(
          ['NotesPageFolders'], 
          previousState.filter((item) => item.id !== data.id)
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
    const { notesEditToggle, notesDeleteToggle } = useStore()
    if(notesEditToggle === false){
      if(editClicked)setEditClicked(false)
      if(editing)setEditing(false)
    }
    return (
      <Link href={`/Notes/${prevParam+data.title}`}>
        <div className={`aspect-square relative shadow ${editClicked && 'border border-black'} ${notesDeleteToggle && 'hover:bg-red-500'}`} onClick={(e) => deleteNote(e)}>
            <textarea ref={titleInput} className={`bg-transparent border-none outline-none ${!notesEditToggle && 'pointer-events-none'}`} defaultValue={data.title}  
                      onClick={(e) => editClickedOn(e)} onChange={() => editedNote()}/>
            <button className={`border-black border absolute bottom-0 bg-white px-2 m-1 right-0 ${!editing && 'opacity-0 pointer-events-none'}`} onClick={(e) => saveChanges(e, queryClient)}>Save</button>
        </div>
    </Link>
    )
  }