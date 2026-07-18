import { useRef, useState } from "react";
import { Upload, X, FileText, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onChange?: (files: File[]) => void;
  label?: string;
  currentFile?: File | null;
  onFileSelect?: (file: File) => void;
  onClear?: () => void;
  error?: string;
  className?: string;
}

export default function FileUpload({
  accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg",
  multiple = false,
  onChange,
  label,
  currentFile,
  onFileSelect,
  onClear,
  error,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles);
    if (onFileSelect && arr.length > 0) {
      onFileSelect(arr[0]);
    }
    if (onChange) {
      const updated = multiple ? [...files, ...arr] : arr;
      setFiles(updated);
      onChange(updated);
    }
  };

  const remove = (idx: number) => {
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    onChange?.(updated);
  };

  const displayFile = currentFile || (files.length > 0 ? files[0] : null);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all duration-200",
          error
            ? "border-danger-400 bg-danger-50/30 dark:bg-danger-900/10 dark:border-danger-500/60"
            : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-primary-300 hover:bg-primary-50/30 dark:hover:border-primary-600 dark:hover:bg-primary-900/10"
        )}
      >
        <Upload className="h-8 w-8 text-slate-400 dark:text-slate-500 mb-2" />
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <p className="mt-1.5 text-xs text-danger-500 dark:text-danger-400">{error}</p>
      )}

      {displayFile && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5">
            <div className="flex items-center gap-3 min-w-0">
              {displayFile.type.startsWith("image/") ? (
                <Image className="h-4 w-4 text-primary-500 flex-shrink-0" />
              ) : (
                <FileText className="h-4 w-4 text-primary-500 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                  {displayFile.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(displayFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onClear) {
                  onClear();
                } else {
                  remove(0);
                }
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
