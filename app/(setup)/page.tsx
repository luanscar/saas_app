import CustomModal from "@/components/global/custom-modal";
import React from "react";

export default function SetupPage() {
  return (
    <>
      <CustomModal defaultOpen title="Register your company" subheading="">
        <div>
          Give your server a personality with a name and an image. You can
          always change it latter.
        </div>
      </CustomModal>
    </>
  );
}
