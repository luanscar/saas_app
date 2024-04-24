import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { Cross1Icon, FileIcon } from "@radix-ui/react-icons";
import { error } from "console";
import { X } from "lucide-react";

type Props = {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo";
  onChange: (url?: string) => void;
  value?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-row justify-center items-center gap-4">
        {type !== "pdf" ? (
          <div className="relative  h-20 w-20">
            <Image fill src={value} alt="Upload" className="rounded-full" />
            <button
              onClick={() => onChange("")}
              className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View PDF
            </a>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="w-full bg-muted/30">
      {/* <UploadButton
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      /> */}
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      />
    </div>
  );
};

export default FileUpload;
