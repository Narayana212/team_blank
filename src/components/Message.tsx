import { cn } from "@/lib/utils";
import { Messages } from "@prisma/client";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";
import { PersonStandingIcon } from "lucide-react";
import { Icons } from "./icon";

interface MessageProps {
  message: Messages;
  isNextMessageSamePerson: boolean;
}

const Message: React.FC<MessageProps> = ({
  message,
  isNextMessageSamePerson,
}) => {
  
  const {user}=useUser()
  if(!user ){
    return null
  }
  const userId=user.id

  return (
    <div
      className={cn("flex items-end", {
        "justify-end": message.senderId === userId,
      })}
    >
      <div
        className={cn(
          "relative flex h-6 w-6 aspect-square items-center justify-center",
          {
            "order-2 bg-violet-500 rounded-sm": message.senderId === userId,
            "order-1 bg-zinc-800 rounded-sm": !(message.senderId === userId),
            invisible: isNextMessageSamePerson,
          }
        )}
      >
        {message.senderId === userId ? (
          <Avatar>
            <AvatarImage src={user.imageUrl} alt={user?.firstName||"J"} />
            <AvatarFallback>{user?.firstName?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        ) : (
          <Icons.user className='fill-zinc-300 h-3/4 w-3/4' />
        )}
      </div>

      <div
        className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
          "order-1 items-end": message.senderId === userId,
          "order-2 items-start": !(message.senderId === userId),
        })}
      >
        <div
          className={cn("px-4 py-2 rounded-lg inline-block", {
            "bg-violet-500 text-white": message.senderId === userId,
            "bg-gray-200 text-gray-900": !(message.senderId === userId),
            "rounded-br-none":
              !isNextMessageSamePerson && message.senderId === userId,
            "rounded-bl-none":
              !isNextMessageSamePerson && !(message.senderId === userId),
          })}
        >
          { message.content?.startsWith("http") ? (
         <audio className="bg-transparent" src={message.content} controls>

         </audio>
            
          ) : (
            message.content
          )}
          {message.id !== "loading-message" ? (
            <div
              className={cn("text-xs select-none mt-2 w-full text-right", {
                "text-zinc-500": !(message.senderId === userId),
                "text-violet-300": message.senderId === userId,
              })}
            >
              
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

Message.displayName = "Message";

export default Message;
