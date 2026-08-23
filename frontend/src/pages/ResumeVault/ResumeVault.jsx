import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { uploadResume } from "../../services/resumeService";

export default function ResumeVault() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // ======================================================
  // File Selection
  // ======================================================

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    setSuccessData(null);
    setErrorMessage("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);

      setErrorMessage(
        "Please select a PDF, DOC, or DOCX resume."
      );

      return;
    }

    setSelectedFile(file);
  };

  // ======================================================
  // Upload Resume
  // ======================================================

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a resume first.");
      return;
    }

    try {
      setUploading(true);
      setSuccessData(null);
      setErrorMessage("");

      const result = await uploadResume(selectedFile);

      console.log("Resume upload result:", result);

      // Store complete backend response
      setSuccessData({
        message:
          result?.message ||
          "Resume entry created successfully.",

        candidate: result?.candidate || null,

        resume: result?.resume || null,
      });

      // Clear selected file
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error("Resume upload error:", error);

      setErrorMessage(
        error?.message ||
        "Unable to upload resume."
      );

    } finally {
      setUploading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-[#fff7f7] px-6 py-8 md:px-10">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-800">
          Resume Vault
        </h1>

        <p className="mt-2 text-slate-500">
          Upload resumes and let TalentSphere
          automatically extract candidate intelligence.
        </p>

      </div>


      {/* Upload Card */}

      <div className="max-w-3xl rounded-2xl border border-red-100 bg-white p-8 shadow-sm">

        {/* Card Header */}

        <div className="mb-6 flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <FileText size={24} />
          </div>

          <div>

            <h2 className="text-xl font-semibold text-slate-800">
              Upload Resume
            </h2>

            <p className="text-sm text-slate-500">
              PDF, DOC or DOCX
            </p>

          </div>

        </div>


        {/* File Selector */}

        <div
          className="cursor-pointer rounded-2xl border-2 border-dashed border-red-200 bg-red-50/30 p-10 text-center transition hover:border-red-400 hover:bg-red-50"
          onClick={() => fileInputRef.current?.click()}
        >

          <Upload
            size={42}
            className="mx-auto mb-4 text-red-500"
          />

          <p className="font-medium text-slate-700">
            Click to select a resume
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Choose a PDF, DOC, or DOCX file
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileSelect}
          />

        </div>


        {/* Selected File */}

        {selectedFile && (

          <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 p-4">

            <div className="flex min-w-0 items-center gap-3">

              <FileText
                size={22}
                className="shrink-0 text-red-500"
              />

              <div className="min-w-0">

                <p className="truncate font-medium text-slate-700">
                  {selectedFile.name}
                </p>

                <p className="text-xs text-slate-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

            </div>

          </div>

        )}


        {/* ==================================================
            Resume Entry Confirmation
        ================================================== */}

        {successData && (

          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

            <div className="flex items-start gap-3">

              <CheckCircle
                size={22}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <div className="min-w-0">

                <h3 className="font-semibold text-green-800">
                  Resume Entry Confirmed
                </h3>

                <p className="mt-1 text-sm text-green-700">
                  {successData.message}
                </p>

              </div>

            </div>


            {/* Entry Details */}

            <div className="mt-4 rounded-xl border border-green-200 bg-white p-4">

              <div className="grid gap-3 text-sm">

                {/* Candidate */}

                {successData.candidate?.full_name && (

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Candidate
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                      {successData.candidate.full_name}
                    </p>

                  </div>

                )}


                {/* Email */}

                {successData.candidate?.email && (

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 text-slate-600">
                      {successData.candidate.email}
                    </p>

                  </div>

                )}


                {/* Resume */}

                {successData.resume?.file_name && (

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Resume
                    </p>

                    <p className="mt-1 truncate font-medium text-slate-700">
                      {successData.resume.file_name}
                    </p>

                  </div>

                )}


                {/* Processing Status */}

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <div className="mt-1 flex items-center gap-2">

                    <CheckCircle
                      size={16}
                      className="text-green-600"
                    />

                    <span className="font-medium text-green-700">
                      Uploaded and processed successfully
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}


        {/* ==================================================
            Error
        ================================================== */}

        {errorMessage && (

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm">
              {errorMessage}
            </p>

          </div>

        )}


        {/* Upload Button */}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <Upload size={20} />

          {uploading
            ? "Uploading & Processing..."
            : "Upload Resume"}

        </button>


        {/* Processing Message */}

        {uploading && (

          <p className="mt-3 text-center text-xs text-slate-500">
            TalentSphere is uploading, parsing and processing
            the resume. This may take a moment.
          </p>

        )}

      </div>

    </div>
  );
}