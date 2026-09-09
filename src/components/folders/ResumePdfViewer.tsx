"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { cn } from "@/lib/cn";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const RESUME_PDF = "/resume.pdf";
const RESUME_DOWNLOAD_NAME = "Rahul-Panchal-Resume.pdf";

export function ResumePdfViewer({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(0);
  const [width, setWidth] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      const next = Math.floor(node.clientWidth);
      if (next > 0) setWidth(next);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col bg-[#1a1a1c]", className)}>
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/8 px-3 py-2">
        <p className="truncate text-[12px] text-white/50">
          {pageCount > 0 ? `${pageCount} page${pageCount === 1 ? "" : "s"}` : "Loading PDF…"}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href={RESUME_PDF}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/85 hover:bg-white/14"
          >
            Open
          </a>
          <a
            href={RESUME_PDF}
            download={RESUME_DOWNLOAD_NAME}
            className="rounded-md bg-[#0a84ff] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#0a84ff]/90"
          >
            Download
          </a>
        </div>
      </div>

      <div ref={containerRef} className="min-h-0 flex-1 overflow-auto px-3 py-3">
        {error ? (
          <div className="grid h-full place-items-center px-4 text-center">
            <div>
              <p className="text-[14px] text-white/80">{error}</p>
              <a
                href={RESUME_PDF}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex rounded-md bg-[#0a84ff] px-3 py-1.5 text-[12px] font-semibold text-white"
              >
                Open PDF
              </a>
            </div>
          </div>
        ) : (
          <Document
            file={RESUME_PDF}
            loading={<p className="py-10 text-center text-[13px] text-white/45">Rendering pages…</p>}
            onLoadSuccess={({ numPages }) => {
              setError(null);
              setPageCount(numPages);
            }}
            onLoadError={() => setError("Couldn’t render the resume PDF.")}
            className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3"
          >
            {width > 0
              ? Array.from({ length: pageCount }, (_, index) => (
                  <Page
                    key={`page-${index + 1}`}
                    pageNumber={index + 1}
                    width={Math.min(width - 8, 760)}
                    renderTextLayer
                    renderAnnotationLayer
                    className="overflow-hidden rounded-md shadow-[0_12px_40px_rgb(0_0_0_/_0.35)]"
                  />
                ))
              : null}
          </Document>
        )}
      </div>
    </div>
  );
}
