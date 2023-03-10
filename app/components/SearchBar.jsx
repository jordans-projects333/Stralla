'use client'
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/Zustand/store';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from 'next/link';

const SearchBar = () => {
    const queryClient = useQueryClient()
    const pathname = usePathname();
    const [visible, setVisible] = useState(false)
    const [placeholder, setPlaceholder] = useState('')
    const [searchEmpty, setSearchEmpty] = useState(true)
    const [searchItems, setSearchItems] = useState([])
    if(pathname.indexOf(`/Notes`) === 0){
        if(!visible)setVisible(true)
        if(placeholder !== 'Search Notes')setPlaceholder('Search Notes')
    }else if(pathname.indexOf(`/SvgLibrary`) === 0){
        if(!visible)setVisible(true)
        if(placeholder !== 'Search Svgs')setPlaceholder('Search Svgs')
    }else if(pathname.indexOf(`/ComponentLibrary`) === 0){
        if(!visible)setVisible(true)
        if(placeholder !== 'Search Components')setPlaceholder('Search Components')
    }
    const setSearchBarInputValue = (search) => {
        useStore.setState(() => ({
            svgFilter : search
        }))
    }
    const setAddToggledTo = () => {
        if(pathname.indexOf(`/Notes`) === 0){
            useStore.setState((state) => ({
                addToggledTo: 'Notes',
                addNotesWindowToggle: !state.addNotesWindowToggle
            }))
        }else if(pathname.indexOf(`/SvgLibrary`) === 0){
            useStore.setState((state) => ({
                addToggledTo: 'svgLibrary'
            }))
        }else if(pathname.indexOf(`/ComponentLibrary`) === 0){
            useStore.setState((state) => ({
                addNotesWindowToggle: !state.addNotesWindowToggle
            }))
        }
    }
    const setAddNote = () => {
        useStore.setState(() => ({
            bluredBackgroundToggle: true,
            addNotesWindowToggle: false,
            addNoteToggle: true,
            addFolderToggle: false
        }))
    }
    const setAddComponent = () => {
        useStore.setState(() => ({
            bluredBackgroundToggle: true,
            addNotesWindowToggle: false,
            addComponentToggle: true,
            addComponentFolderToggle: false
        }))
    }
    const setAddFolder = () => {
        useStore.setState(() => ({
            bluredBackgroundToggle: true,
            addNotesWindowToggle: false,
        }))
        if(pathname.indexOf(`/Notes`) === 0){
            useStore.setState(() => ({
                addFolderToggle: true,
                addNoteToggle: false
            }))
        }else if(pathname.indexOf(`/ComponentLibrary`) === 0){
            useStore.setState(() => ({
                addComponentToggle: false,
                addComponentFolderToggle: true
            }))
        }
    }
    const search = async (searchValue) => {
        console.log(searchValue)
        setSearchBarInputValue(searchValue)
        if(pathname.indexOf(`/Notes`) === 0){
            if(searchValue !== ''){
                setSearchEmpty(false)
                const res = await fetch(`/api/Searchbar/${searchValue}`)
                console.log(res)
                const data = await res.json()
                setSearchItems(data)
            }else{
                setSearchEmpty(true)
                setSearchItems([])
            }
        }
    }
    const { addNotesWindowToggle } = useStore()
    return (
        <div className={` ${!visible && 'opacity-0 pointer-events-none'} absolute bg-white top-[100%] left-[-2rem] w-[30rem] h-[2rem] shadow-lg hover:opacity-100 duration-300 rounded-md flex items-center`}>
            <button onClick={() => setAddToggledTo()}><svg className='ml-10 mr-2 h-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z"/></svg></button>
            <input placeholder={placeholder} onChange={(e) => search(e.target.value)} className="flex-1 mr-2 my-1 border border-black"/>
            <div className={`${!addNotesWindowToggle && 'opacity-0 pointer-events-none'} absolute top-[100%] left-[2rem] py-2 gap-2 bg-white shadow flex flex-col`}>
                <button className={`${(pathname.indexOf(`/Notes`) !== 0) && 'hidden'} bg-gray-200 px-2 mx-2 rounded-md`} onClick={() => setAddNote()}>Add Note</button>
                <button className={`${(pathname.indexOf(`/ComponentLibrary`) !== 0) && 'hidden'} bg-gray-200 px-2 mx-2 rounded-md`} onClick={() => setAddComponent()}>Add Component</button>
                <button className='bg-gray-200 px-2 mx-2 rounded-md' onClick={() => setAddFolder()}>Add Folder</button>
            </div>
            <div className={`${searchEmpty && 'opacity-0 pointer-events-none'} absolute left-[4rem] bg-white rounded-md top-[calc(100%+.5rem)] w-[calc(100%-4rem)] flex flex-col p-4 gap-4`}>
                {searchItems.map((searchItem) => (
                    <Link key={searchItem.id} href={{pathname: `/Notes/${searchItem.title}`,query: {note: 'true'}}}>{searchItem.title}</Link>
                ))}
            </div>
        </div>
    )
}

export default SearchBar