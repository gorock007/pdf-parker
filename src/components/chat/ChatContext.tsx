import { ReactNode, createContext, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";

type StreamResponse={
    addMessage:()=> void,
    message: string,
    handleInputChange:(event:React.ChangeEvent<HTMLTextAreaElement>) => void,
    isLoading:boolean,
}

export const ChatContext = createContext<StreamResponse>({
    //fallback values
    addMessage:()=>{},
    message:'',
    handleInputChange:()=>{},
    isLoading:false,
})

interface Props{
    fileId:string
    children:ReactNode
}

export const ChatContextProvider = ({fileId, children}: Props) =>{
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const {toast} = useToast()

    // stream back response from api to the client' (trpc only works for JSON)
    const {mutate: sendMessage} = useMutation({
        mutationFn: async ({message}: {message:string}) =>{
            const response = await fetch('/api/message', {
                method:'POST',
                body: JSON.stringify({
                    fileId,
                    message,
                }),
            })

            if(!response.ok){
                throw new Error("Failed to send message")
            }
            return response.body
        },
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>{
        setMessage(e.target.value)
    }

    const addMessage = () => sendMessage({message})

    return(
        <ChatContext.Provider value={{
            addMessage,
            message,
            handleInputChange,
            isLoading,
        }}>
            {children}
        </ChatContext.Provider>
    )

}