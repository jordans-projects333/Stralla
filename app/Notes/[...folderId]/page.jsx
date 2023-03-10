import Notes from "./components/Notes"
import Folders from "./components/Folders"
// import AddNotePage from "./AddNote"
import prisma from "@/prisma"
import { dehydrate } from "@tanstack/query-core"
import Hydrate from "@/reactQuery/Hydrate"
import getQueryClient from "@/reactQuery/GetQueryClient"
import AddNote from "./components/AddNote"
import AddFolder from "./components/AddFolder"
import EditButton from "./components/EditButton"
import DeleteButton from "./components/DeleteButton"

const getDataFolders = async (currentTitle) => {
  let editedCurrentTitle = currentTitle.replaceAll('%20', ' ')
  const data = await prisma.NoteFolder.findUnique({where: {title: editedCurrentTitle}, include: { folders: true }})
  data.folders.sort(function(a, b) {
      return (a.id - b.id);
    })
  return data.folders
}

const getDataNotes = async (currentTitle) => {
  let editedCurrentTitle = currentTitle.replaceAll('%20', ' ')
  const data = await prisma.NoteFolder.findUnique({where: {title: editedCurrentTitle}, include: { notes: true }})
  data.notes.sort(function(a, b) {
      return (a.id - b.id);
    })
  return data.notes
}

async function NotesPage({ params, searchParams }) {
    let prevParam = ''
    for(let i = 0; i < params.folderId.length; i++){
        prevParam = prevParam + params.folderId[i] + '/'
    }
    let currentTitle =  params.folderId[params.folderId.length - 1]
    const queryClient = getQueryClient()
    if(searchParams.note !== 'true'){
      await queryClient.prefetchQuery(['NotesPageFolders'], () => getDataFolders(currentTitle))
      await queryClient.prefetchQuery(['NotesPageNotes'], () => getDataNotes(currentTitle))
    }
    const dehydratedState = dehydrate(queryClient)
    if((searchParams.note !== 'true')){
      return (
        <>
          <div className="grid gridNotes overflow-y-auto w-full relative gap-4 p-4 pt-6 pb-[20vh]">
            <Hydrate state={dehydratedState}>
              <Folders prevParam={prevParam} currentTitle={currentTitle}/>
              <Notes prevParam={prevParam} currentTitle={currentTitle}/>
              <div className="absolute bottom-4 left-4 p-4 gap-8 flex flex-col shadow bg-white z-20">
                <EditButton/>
                <DeleteButton/>
              </div>
            </Hydrate>
          </div>
          <AddNote currentTitle={currentTitle}/>
          <AddFolder currentTitle={currentTitle}/>
        </>
      )
    }else{
      let editedCurrentTitle = currentTitle.replaceAll('%20', ' ')
      console.log(editedCurrentTitle)
      const data = await prisma.Note.findUnique({where: {title: editedCurrentTitle}})
      return(
        <div>
            <h3 className="mt-20">{data.title}</h3>
            <p>{data.content}</p>
        </div>
      )
    }
  }
  
  export default NotesPage