import prisma from "@/prisma"

export async function POST(req) {
    const { title, description, content, parent } = await req.json()
    const currentfolder = await prisma.NoteFolder.findUnique({where : { title: parent }})
    const newNote = await prisma.Note.create({ data : {
        title: title,
        description: description,
        content: content,
        noteFolder: { connect: { id : currentfolder.id }}
    }})
    return new Response('Hello, Next.js!')
  }

export async function PUT(req) {
const { title, description, id } = await req.json()
const newNote = await prisma.Note.update({ 
    where : {
        id: id
    },
    data: {
        title: title,
        description: description
    }
})
return new Response('Hello, Next.js!')
}

export async function DELETE(req) {
    const { id } = await req.json()
    await prisma.Note.delete({ 
        where : {
            id: id
        }
    })

    return new Response('Hello, Next.js!')
}