import React, { useContext, useEffect } from "react";
import { UploadFileHook } from "../hooks/UploadFileHook";
import { UserDetailContext } from "../../../../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";

interface ImageUploaderInterface {
  setFileUrl: (file: string) => void;
}

const ImageUploader: React.FC<ImageUploaderInterface> = ({ setFileUrl }) => {

  const {userDetail} = useContext(UserDetailContext);

  const {mutate,data,isSuccess} = UploadFileHook();

  useEffect(()=>{
    if(isSuccess && data){
      setFileUrl(data.data.data.result);
    }
  },[data,isSuccess]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      mutate({
        file:selectedFile,
        updatedBy: userDetail.data.result.divisionId
      });
    }
  };

  return (
    <div className="w-full p-4 mt-1">
       <h2 className="mb-4 text-sm font-medium">Upload Image</h2>
      <div className="flex items-center justify-between w-full gap-4">
        <input
          type="file"
          onChange={(e)=>handleFileChange(e)}
          className="block w-full px-2 py-2 text-sm text-gray-500 shadow file:mr-4 file:py-2 file:px-4 rounded-2xl hover:shadow-xl file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
    </div>
  );
};

export default ImageUploader;
