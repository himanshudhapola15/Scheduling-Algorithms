import axios from "axios";
import { useEffect, useState } from "react";
import FileUploadForm from "./FileUploadForm";
import { BASE_URL } from "../../constant/api";
import toast from "react-hot-toast";

const FileUploadFormSection = ({ filesList, setResult }) => {
  const [files, setFiles] = useState([]);
  const [selectAlgo, setSelectAlgo] = useState("");
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (filesList.length !== files.length) {
      console.log("please upload all files");
      toast.error("Please upload all files before submitting.");
      return;
    }

    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("algo", selectAlgo);

    (async () => {
      const loadingId = toast.loading("Uploading files...");  
      try {
        const res = await axios.post(BASE_URL + "/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (!res.data.success) {
          throw new Error("Upload failed");
        }
        console.log("DATA",res.data.result)
        setResult(res.data.result);
        toast.success(res.data.message);
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Error uploading files.");
      } finally {
        toast.dismiss(loadingId);
      }
    })();
  };

  useEffect(() => {
    console.log(files);
  }, [files]);

  return (
    <form
      onSubmit={handleFormSubmit}
      className="w-full max-w-3xl bg-[#01090fcb] border border-sky-200 shadow-xl p-6 mt-4 rounded-2xl flex flex-col items-center gap-6"
    >
      {filesList?.length !== 0 && (
        <div className="w-full max-w-xs">
          <label className="block text-white text-center font-semibold text-2xl mb-5">
            Select Scheduling Algorithm
          </label>

          <select
            value={selectAlgo}
            onChange={(e) => setSelectAlgo(e.target.value)}
            className="block w-full bg-gray-700 cursor-pointer rounded-lg px-4 py-2 text-base text-white focus:outline-none"
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "32px 32px",
            }}
          >
            <option className="text-gray-400" value="">
              --Select--
            </option>
            <option value="fcfs">FCFS</option>
            <option value="ljfs">LJFS</option>
            <option value="sjfs">SJFS</option>
          </select>
        </div>
      )}

      <div className="w-full flex flex-wrap justify-center gap-4">
        {filesList.map((_, index) => (
          <FileUploadForm setFiles={setFiles} key={index} />
        ))}
      </div>

      {filesList?.length !== 0 && (
        <button
          type="submit"
          className="mt-4 px-6 py-2 cursor-pointer font-medium bg-teal-500 hover:bg-teal-800 text-white rounded-xl shadow-md transition-all duration-200"
        >
          Upload
        </button>
      )}
    </form>
  );
};

export default FileUploadFormSection;
