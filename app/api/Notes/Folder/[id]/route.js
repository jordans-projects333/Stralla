import prisma from "@/prisma"
import { NextResponse } from "next/server"

export async function GET(req, {params}) {
    const res = await prisma.NoteFolder.findUnique({ where: { title : params.id}, include : { notes : true, folders : true }})
    return NextResponse.json(res)
  }