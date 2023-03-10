import Components from "./components/Components"
import ComponentsFolders from "./components/ComponentFolders"
import prisma from "@/prisma"
import { dehydrate } from "@tanstack/query-core"
import Hydrate from "@/reactQuery/Hydrate"
import getQueryClient from "@/reactQuery/GetQueryClient"
import AddComponentFolder from "./components/addComponentFolders"
import AddComponents from "./components/addComponents"
import EditButton from "./components/EditButton"
import DeleteButton from "./components/DeleteButton"

const getDataComponentsFolders = async (currentTitle) => {
  let editedCurrentTitle = currentTitle.replaceAll('%20', ' ')
  const data = await prisma.ComponentFolder.findUnique({where: {title: editedCurrentTitle}, include: { ComponentFolders: true }})
  data.ComponentFolders.sort(function(a, b) {
      return (a.id - b.id);
    })
  return data.ComponentFolders
}

const getDataComponents = async (currentTitle) => {
  let editedCurrentTitle = currentTitle.replaceAll('%20', ' ')
  const data = await prisma.ComponentFolder.findUnique({where: {title: editedCurrentTitle}, include: { Components: true }})
  data.Components.sort(function(a, b) {
      return (a.id - b.id);
    })
  return data.Components
}

async function ComponentLibraryPage({ params, searchParams }) {
    let prevParam = ''
    for(let i = 0; i < params.folderId.length; i++){
        prevParam = prevParam + params.folderId[i] + '/'
    }
    let currentTitle =  params.folderId[params.folderId.length - 1]
    const queryClient = getQueryClient()
    if(searchParams.components !== 'true'){
      await queryClient.prefetchQuery(['ComponentsFolders'], () => getDataComponentsFolders(currentTitle))
      await queryClient.prefetchQuery(['Components'], () => getDataComponents(currentTitle))
    }
    const dehydratedState = dehydrate(queryClient)
    if((searchParams.components !== 'true')){
      return (
        <>
          <div className="grid gridNotes overflow-y-auto w-full relative gap-4 p-4 pt-6 pb-[20vh]">
            <Hydrate state={dehydratedState}>
              <ComponentsFolders prevParam={prevParam} currentTitle={currentTitle}/>
              <Components prevParam={prevParam} currentTitle={currentTitle}/>
              <div className="absolute bottom-4 left-4 p-4 gap-8 flex flex-col shadow bg-white z-20">
                <EditButton/>
                <DeleteButton/>
              </div>
            </Hydrate>
          </div>
          <AddComponents currentTitle={currentTitle}/>
          <AddComponentFolder currentTitle={currentTitle}/>
        </>
      )
    }else{
      let editedCurrentTitle = currentTitle.replaceAll('%20', ' ')
      const data = await prisma.Component.findUnique({where: {title: editedCurrentTitle}})
      return(
        <div>
            <h3 className="mt-20">{data.title}</h3>
            <p>{data.content}</p>
        </div>
      )
    }
  }
  
  export default ComponentLibraryPage