'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useStore } from "@/Zustand/store"
import { useEffect, useState } from "react"

const CopySvgButton = () => { 
  const { deleteSvgToggle, editSvgToggle, editClicked, svgFilter } = useStore()
  let {data, isLoading, isError, error} = useQuery({
    queryKey: ['Svgs'],
    queryFn: async () => {
      const res = await fetch('api/svgLibrary')
      console.log(res, '5')
      let data = await res.json()
      console.log(data, '7')
      data.sort(function(a, b) {
        return (a.id - b.id);
      })
      // if(svgFilter !== '')data = data.filter((item) => {return item.title.toLowerCase().includes(svgFilter.toLowerCase())})
      return data

    }
  }) 
  const queryClient = useQueryClient()
  const svgButtonClicked = (svgCode, svgId, svgTitle) => {
    if(!deleteSvgToggle && !editSvgToggle){
      navigator.clipboard.writeText(svgCode)
    }else if(deleteSvgToggle){
      mutation.mutate(svgId)
    }else if(editSvgToggle){
      useStore.setState((state) => ({
        editClicked : true,
        editableSvgTitle: svgTitle,
        editableSvgCode: svgCode,
        editableSvgId: svgId
      }))
    }
  }
  const mutation = useMutation({
    mutationFn: async (deleteId) => await fetch('/api/svgLibrary', {method: 'DELETE', body: JSON.stringify(deleteId)}).then((response) => console.log(response)),
    onMutate: async (deleted) => {
      // cancel outgoing fetches
      await queryClient.cancelQueries({ queryKey: ['Svgs']})
      // get snapshot
      const previousState = queryClient.getQueryData({queryKey: ['Svgs']})
      await queryClient.setQueryData(
        ['Svgs'], 
        previousState.filter((svg) => svg.id !== deleted)
      )
      return { previousState }
    },
    onError: (err, post, context) => {
      queryClient.setQueryData(['Svgs'], context.previousState)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['Svgs'])
    }
  })
  if(isLoading)return <h4>Loading...</h4>
  if(isError)return <h4>{error.message}</h4>
  return (
    <>
    {}
      {(data.filter((item) => {return item.title.toLowerCase().includes(svgFilter.toLowerCase())})).map((svg) => (
        <button key={svg.id} onClick={() => svgButtonClicked(svg.code, svg.id, svg.title)} className={`duration-150 ${deleteSvgToggle && 'filterRed'} ${editSvgToggle && 'hover:border hover:border-blue-500'} aspect-square shadow flex items-center justify-center cursor-pointer`}>
          <img className={`h-6 w-6`} alt={svg.title} src={`data:image/svg+xml,${svg.code}`}/>
        </button>
      ))}
    </>
  )
}

export default CopySvgButton

