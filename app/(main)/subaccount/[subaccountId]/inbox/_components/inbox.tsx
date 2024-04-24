import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import React from "react";

type Props = {};

const Inbox = (props: Props) => {
  return (
    <div className="w-[440px] border-r h-full">
      <Tabs defaultValue="all">
        <div className="flex items-center px-4 py-2">
          <h1 className="text-xl font-bold">Inbox</h1>
          <TabsList className="ml-auto">
            <TabsTrigger
              value="all"
              className="text-zinc-600 dark:text-zinc-200"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="text-zinc-600 dark:text-zinc-200"
            >
              Unread
            </TabsTrigger>
          </TabsList>
        </div>
        <Separator />
        <div className="p-4 ">
          <form>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8" />
            </div>
          </form>
        </div>
        <TabsContent value="all" className="m-0">
          Lista
        </TabsContent>
        <TabsContent value="unread" className="m-0">
          Lista 2
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inbox;
