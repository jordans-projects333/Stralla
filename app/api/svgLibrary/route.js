import prisma from "@/prisma"
import { NextResponse } from "next/server"

export async function GET(req) {
    const data = await prisma.Svg.findMany()
    return NextResponse.json(data)
  }

export async function POST(req) {
    const { title, code } = await req.json()
    try {
        await prisma.Svg.create({ data: {
            title: title,
            code: code
        }})
        return new Response()
    } catch (error) {
        return NextResponse.json({data: error})
    }
}

export async function DELETE(req) {
    const id  = parseInt(await req.json())
    await prisma.Svg.delete({where: {id: id}})
    return new Response('hello')
}

export async function PUT(req) {
    const {id, title, code} = await req.json()
    await prisma.Svg.update({where: {id: id}, data: {title: title, code: code}})
    return new Response('hello')
}