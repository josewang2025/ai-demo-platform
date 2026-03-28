import { useRef, useCallback } from "react";

type UseFileUploadOptions<T> = {
  parse: (csvText: string) => T[];
  onData: (rows: T[], fileName: string) => void;
  onError: (message: string) => void;
};

export function useFileUpload<T>({ parse, onData, onError }: UseFileUploadOptions<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const readFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const rows = parse(String(reader.result));
          onData(rows, file.name);
        } catch (err) {
          onError(err instanceof Error ? err.message : "Failed to parse CSV");
        }
      };
      reader.readAsText(file, "UTF-8");
    },
    [parse, onData, onError]
  );

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) readFile(file);
      e.target.value = "";
    },
    [readFile]
  );

  const handleDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) readFile(file);
    },
    [readFile]
  );

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = useCallback(
    (e) => e.preventDefault(),
    []
  );

  const triggerUpload = useCallback(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => fileInputRef.current?.click(), 400);
  }, []);

  return {
    fileInputRef,
    sectionRef,
    handleFileChange,
    handleDrop,
    handleDragOver,
    triggerUpload,
  };
}
