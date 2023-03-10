import prisma from "@/prisma"

export async function POST(req) {
    const { title, parent } = await req.json()
    const newComponentFolder = await prisma.ComponentFolder.create({ data : {
        title: title,
    }})
    await prisma.ComponentFolder.update({
        where: {
            title : parent
        }, 
        data: {
            ComponentFolders:
            { connect: {
                id: newComponentFolder.id}}
        }})

    return new Response('Hello, Next.js!')
  }

  export async function PUT(req) {
    const { title, id } = await req.json()
    const newNote = await prisma.ComponentFolder.update({ 
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
            const deletedNotes = await prisma.Component.deleteMany({ 
                where : {
                    ComponentFolderid: id
                },
            })
            const deletedFolder = await prisma.ComponentFolder.delete({ 
                where : {
                    id: id
                },
                include : { 
                    ComponentFolders : true
                }
            })
            // delete all notes with folder id
            console.log(deletedNotes, 'deleted')
            if(deletedFolder.ComponentFolders.length !== 0){
                deletedFolder.ComponentFolders.map((item) => {
                    console.log(item.title, 'deleted')
                    relationsDeleting(item.id)
                })
            }
        }
        relationsDeleting(id)
        
        
        return new Response('Hello, Next.js!')
    }