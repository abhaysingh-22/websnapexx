import { ReactNode } from "react";

interface ChatLayoutProps {
  children: ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ChatLayout;