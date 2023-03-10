import prisma from "@/prisma"

export async function POST(req) {
    const { title, parent } = await req.json()
    const newFolder = await prisma.NoteFolder.create({ data : {
        title: title,
    }})
    await prisma.NoteFolder.update({
        where: {
            title : parent
        }, 
        data: {
            folders:
            { connect: {
                id: newFolder.id}}
        }})

    return new Response('Hello, Next.js!')
  }

  export async function PUT(req) {
    const { title, id } = await req.json()
    const newNote = await prisma.NoteFolder.update({ 
        where : {
            id: id
        },
        data: {
            title: title
        }
    })
    return new Response('Hello, Next.js!')
    }
    
    export async function DELETE(req) {
        const { id } = await req.json()
        const relationsDeleting = async (id) => {
            const deletedNotes = await prisma.Note.deleteMany({ 
                where : {
                    noteFolderId: id
                },
            })
            const deletedFolder = await prisma.NoteFolder.delete({ 
                where : {
                    id: id
                },
                include : { 
                    folders : true
                }
            })
            // delete all notes with folder id
            console.log(deletedNotes, 'deleted')
            if(deletedFolder.folders.length !== 0){
                deletedFolder.folders.map((item) => {
                    console.log(item.title, 'deleted')
                    relationsDeleting(item.id)
                })
            }
        }
        relationsDeleting(id)
        
        
        return new Response('Hello, Next.js!')
    }