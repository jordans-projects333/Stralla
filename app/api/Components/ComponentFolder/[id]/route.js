import prisma from "@/prisma"
import { NextResponse } from "next/server"

export async function GET(req, {params}) {
    const res = await prisma.ComponentFolder.findUnique({ where: { title : params.id}, include : { Components : true, ComponentFolders : true }})
    return NextResponse.json(res)
  }