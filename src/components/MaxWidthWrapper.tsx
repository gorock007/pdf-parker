import { cn } from "@/lib/utils"
import { ReactNode } from "react"

const MaxWidthWrapper = ({
    className,
    children,
}: {
    className?:string
    children: ReactNode
}) => {
  return(
    //first argument applies always with the incoming argument.
    <div className={cn('mx-auto w-full max-w-screen-xl px-2.5 md:px-20', className)}>
        {children}
    </div>
  )
}

export default MaxWidthWrapper