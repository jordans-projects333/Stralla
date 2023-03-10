'use client'
import { useStore } from "@/Zustand/store"

const BlurBackground = () => {
    const { bluredBackgroundToggle } = useStore()
    const closeWindows = () => {
        useStore.setState(() => ({
            bluredBackgroundToggle: false,
            addNoteToggle: false,
            addFolderToggle: false,
            addComponentToggle: false,
            addComponentFolderToggle: false
        }))
    }
    return (
        <div onClick={() => closeWindows()} className={`fixed w-full h-full backdrop-blur-sm duration-150 ${!bluredBackgroundToggle && 'opacity-0 pointer-events-none' }`}></div>
    )
}

export default BlurBackground