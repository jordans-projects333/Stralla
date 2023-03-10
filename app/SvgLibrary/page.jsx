import getQueryClient from "@/reactQuery/GetQueryClient"
import AddSvgs from "./components/AddSvgs"
import CopySvgButton from "./components/CopySvgButton"
import prisma from "@/prisma"
import { dehydrate } from "@tanstack/query-core"
import Hydrate from "@/reactQuery/Hydrate"
import DeleteSvgButton from "./components/DeleteSvgButton"
import EditSvgButton from "./components/EditSvgButton"

const getData = async () => {
    const data = await prisma.Svg.findMany()
    data.sort(function(a, b) {
        return (a.id - b.id);
      })
    return data
}
const SvgLibrary = async () => {
    const queryClient = getQueryClient()
    await queryClient.prefetchQuery(['Svgs'], getData)
    const dehydratedState = dehydrate(queryClient)
    return (
        <>
            <AddSvgs/>
            <div className="absolute bottom-4 left-4 p-4 gap-8 flex flex-col shadow bg-white z-20">
                <EditSvgButton/>
                <DeleteSvgButton/>
            </div>
            <div className="grid fadeIntro gridSvg overflow-y-auto w-full gap-4 p-4 pt-6 pb-[20vh]">
                <Hydrate state={dehydratedState}>
                    <CopySvgButton/>
                </Hydrate>
            </div>
            
        </>
    )
}
export default SvgLibrary