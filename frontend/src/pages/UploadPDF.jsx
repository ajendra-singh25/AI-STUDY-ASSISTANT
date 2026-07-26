import { useState } from "react";
import { useDropzone } from "react-dropzone";
import api from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import DocumentList from "../components/DocumentList";

import {
  FaFilePdf,
  FaCloudUploadAlt,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";

function UploadPDF() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [step, setStep] = useState("");

  const [success, setSuccess] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const selected = acceptedFiles[0];

    if (selected.size > 50 * 1024 * 1024) {
      setMessage("Maximum file size is 50 MB.");
      return;
    }

    setFile(selected);
    setMessage("");
    setSuccess(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!title || !file) {
      setMessage("Please enter a title and choose a PDF.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setSuccess(false);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("pdf", file);

    try {
      setStep("Uploading PDF...");

      const response = await api.post(
        "documents/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );

            setProgress(percent);
          },
        }
      );

      setStep("Creating AI Vector Database...");

      const pdfId = response.data.id;

      await api.get(`ai/extract/${pdfId}/`);

      setStep("Completed");

      setSuccess(true);

      setMessage("PDF uploaded successfully.");

      setTitle("");

      setFile(null);

      setProgress(100);
    } catch (error) {
      console.log(error);

      setMessage("Upload failed.");

      setProgress(0);
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold text-white">
        Upload PDF
      </h1>

      <p className="text-slate-400 mt-2">
        Upload your study material for AI-powered learning.
      </p>

      <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

        {/* Title */}

        <input
          type="text"
          placeholder="Enter PDF Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-8 px-5 py-4 rounded-xl bg-slate-900 border border-white/10 text-white outline-none"
        />

        {/* Dropzone */}

        <div
          {...getRootProps()}
          className={`rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer p-12 text-center ${
            isDragActive
              ? "border-cyan-400 bg-cyan-500/10 scale-[1.02]"
              : "border-slate-600 hover:border-cyan-500"
          }`}
        >
          <input {...getInputProps()} />

          <FaCloudUploadAlt
            className="mx-auto text-cyan-400"
            size={70}
          />

          <h2 className="text-white text-2xl font-bold mt-6">
            Drag & Drop PDF
          </h2>

          <p className="text-slate-400 mt-3">
            or click to browse
          </p>

          <p className="text-slate-500 text-sm mt-2">
            Maximum Size : 50 MB
          </p>
        </div>

        {/* File Preview */}

        {file && (
          <div className="mt-8 bg-slate-900 rounded-2xl p-5 flex justify-between items-center">

            <div className="flex items-center gap-4">

              <FaFilePdf
                className="text-red-500"
                size={40}
              />

              <div>

                <h2 className="text-white font-semibold">
                  {file.name}
                </h2>

                <p className="text-slate-400 text-sm">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>

              </div>

            </div>

            <button
              onClick={removeFile}
              className="text-red-400 hover:text-red-300"
            >
              <FaTrash size={20} />
            </button>

          </div>
        )}

        {/* Progress */}

        {loading && (
          <div className="mt-8">

            <div className="flex justify-between text-sm text-slate-300 mb-2">

              <span>{step}</span>

              <span>{progress}%</span>

            </div>

            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">

              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>
        )}

        {/* Upload Button */}

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-8 w-full py-4 rounded-xl font-bold text-lg transition ${
            loading
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-cyan-500 hover:bg-cyan-400 text-black"
          }`}
        >
          {loading ? step : "Upload PDF"}
        </button>

        {/* Success */}

        {success && (
          <div className="mt-8 bg-green-500/10 border border-green-500 rounded-2xl p-6 text-center">

            <FaCheckCircle
              className="mx-auto text-green-400"
              size={60}
            />

            <h2 className="text-2xl font-bold text-green-400 mt-4">
              Upload Successful
            </h2>

            <p className="text-slate-300 mt-2">
              Your PDF has been indexed and is ready for AI Chat.
            </p>

            <button
              onClick={() => {
                setSuccess(false);
                setProgress(0);
              }}
              className="mt-6 bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-3 rounded-xl font-bold"
            >
              Upload Another PDF
            </button>

          </div>
        )}

        {/* Error */}

        {message && !success && (
          <p className="mt-6 text-center text-red-400 font-semibold">
            {message}
          </p>
        )}

      </div>

      <DocumentList />

    </DashboardLayout>
  );
}

export default UploadPDF;