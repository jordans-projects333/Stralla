import prisma from "@/prisma"
import { NextResponse } from "next/server"

export async function GET(req, {params}) {
    console.log(params.id)
    const res = await prisma.Note.findMany({ where: { title : { startsWith: params.id, mode: 'insensitive', }}})
    return NextResponse.json(res)
  }