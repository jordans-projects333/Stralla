'use client'

import { Hydrate as RQHydrate } from "@tanstack/react-query"

import React from 'react'

const Hydrate = (props) => {
  return (
    <RQHydrate {...props}/>
  )
}

export default Hydrate