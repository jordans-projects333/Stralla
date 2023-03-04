import Notes from "./components/Notes"
import Folders from "./components/Folders"
// import AddNotePage from "./AddNote"
import prisma from "@/prisma"
import { dehydrate } from "@tanstack/query-core"
import Hydrate from "@/reactQuery/Hydrate"
import getQueryClient from "@/reactQuery/GetQueryClient"


const getDataFolders = async () => {
  const data = await prisma.NoteFolder.findUnique({where: {id: 1}, include: { folders: true }})
  data.folders.sort(function(a, b) {
      return (a.id - b.id);
    })
  return data
}

const getDataNotes = async () => {
  const data = await prisma.NoteFolder.findUnique({where: {id: 1}, include: { notes: true }})
  data.notes.sort(function(a, b) {
      return (a.id - b.id);
    })
  return data
}

async function NotesPage() {
    const queryClient = getQueryClient()
    await queryClient.prefetchQuery(['NotesPageFolders'], getDataFolders)
    await queryClient.prefetchQuery(['NotesPageNotes'], getDataNotes)
    const dehydratedState = dehydrate(queryClient)
    return (
      <>
        <div className="grid gridNotes overflow-y-auto w-full relative gap-4 p-4 pt-6 pb-[20vh]">
          <Hydrate state={dehydratedState}>
            <Folders currentId={1}/>
            <Notes currentId={1}/>
          </Hydrate>
        </div>
      </>
    )
  }
  
  export default NotesPage