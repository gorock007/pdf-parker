import { db } from "@/db";
import { pinecone } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextRequest } from "next/server";

export const POST = async (req:NextRequest) =>{
    //ENDPOINT FOR ASKING A QUESTION TO A PDF FILE
    const body = await req.json()

    const {getUser} = getKindeServerSession()
    const user = getUser()
    const {id: userId} = user

    if(!userId) return new Response('Unauthorized', {status: 401})

    const {fileId, message} = SendMessageValidator.parse(body)

    const file = await db.file.findFirst({
        where:{
            id:fileId,
            userId,
        },
    })

    if(!file) return new Response('Not found', {status: 404})

    //if the file exist
    await db.message.create({
        data:{
            text: message,
            isUserMessage: true,
            userId,
            fileId,
        },
    })

    //1.vectorize message
    const embeddings = new OpenAIEmbeddings({
          openAIApiKey:process.env.OPENAI_API_KEY,
    })

    // const pinecone = await getPineconeClient()
    const pineconeIndex = pinecone.Index('pdfparker')

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings,{
        pineconeIndex,
        namespace:file.id
    })
}