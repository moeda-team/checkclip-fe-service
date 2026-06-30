"use client";

// app/(app)/attendance/components/PhotoCaptureModal.tsx
// Camera modal for photo capture during check-in / check-out.
// Uses the browser MediaDevices API to stream the webcam.

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Camera, RotateCcw, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PhotoCaptureModalProps = {
  open: boolean;
  /** Called with a base64 JPEG data-URL when user accepts the photo */
  onConfirm: (photoDataUrl: string) => void;
  /** Called when the user dismisses the modal without confirming */
  onClose: () => void;
};

// ─── Corner frame overlay ─────────────────────────────────────────────────────

function FrameCorners() {
  const corner = "absolute w-8 h-8 border-teal-400";
  return (
    <>
      {/* top-left */}
      <span className={cn(corner, "top-6 left-6 border-t-2 border-l-2 rounded-tl-lg")} />
      {/* top-right */}
      <span className={cn(corner, "top-6 right-6 border-t-2 border-r-2 rounded-tr-lg")} />
      {/* bottom-left */}
      <span className={cn(corner, "bottom-6 left-6 border-b-2 border-l-2 rounded-bl-lg")} />
      {/* bottom-right */}
      <span className={cn(corner, "bottom-6 right-6 border-b-2 border-r-2 rounded-br-lg")} />
    </>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function PhotoCaptureModal({ open, onConfirm, onClose }: PhotoCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [camError, setCamError] = useState<string | null>(null);

  // ── Start camera ────────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCamError(null);
    setCapturedPhoto(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCamError("Unable to access camera. Please allow camera permission and try again.");
    }
  }, []);

  // ── Stop camera ─────────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  // ── Lifecycle ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
      setCapturedPhoto(null);
      setCamError(null);
    }
    return () => stopCamera();
  }, [open, startCamera, stopCamera]);

  // ── Capture photo ────────────────────────────────────────────────────────────
  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror horizontally to match the video preview
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedPhoto(dataUrl);
    stopCamera();
  };

  // ── Retake ───────────────────────────────────────────────────────────────────
  const retake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  // ── Confirm ──────────────────────────────────────────────────────────────────
  const confirm = () => {
    if (capturedPhoto) onConfirm(capturedPhoto);
  };

  if (!open) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-teal-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Photo Capture</h2>
              <p className="text-xs text-gray-400">Take a photo for your check-in</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Camera / Preview area ── */}
        <div className="relative mx-6 mb-4 rounded-xl overflow-hidden bg-gray-900 aspect-4/3">
          {/* Error state */}
          {camError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <Camera className="w-10 h-10 text-gray-400" />
              <p className="text-sm text-gray-300">{camError}</p>
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-1.5 rounded-lg bg-teal-500 text-white text-xs font-semibold hover:bg-teal-600 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Live video — mirrored so it feels natural */}
          {!capturedPhoto && !camError && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
          )}

          {/* Captured photo */}
          {capturedPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={capturedPhoto}
              alt="Captured photo"
              className="w-full h-full object-cover"
            />
          )}

          {/* Guide text */}
          {!capturedPhoto && !camError && (
            <p className="absolute top-3 left-0 right-0 text-center text-xs text-white/80 font-medium drop-shadow">
              Position your face in the frame
            </p>
          )}

          {/* Corner frame overlay */}
          {!capturedPhoto && !camError && <FrameCorners />}
        </div>

        {/* Hidden canvas for snapshot */}
        <canvas ref={canvasRef} className="hidden" />

        {/* ── Tips ── */}
        <div className="mx-6 mb-4 px-4 py-3 rounded-xl bg-teal-50 border border-teal-100">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 mb-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            Tips for best result:
          </p>
          <ul className="space-y-1 text-xs text-teal-700 list-disc list-inside">
            <li>Look at the camera</li>
            <li>Make sure your face is clearly visible</li>
            <li>Avoid wearing sunglasses or mask</li>
          </ul>
        </div>

        {/* ── Footer buttons ── */}
        <div className="flex gap-3 px-6 pb-5">
          {!capturedPhoto ? (
            // Take photo
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={capture}
                disabled={!!camError}
                className="flex-1 h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
            </>
          ) : (
            // Retake / Use photo
            <>
              <button
                type="button"
                onClick={retake}
                className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retake
              </button>
              <button
                type="button"
                onClick={confirm}
                className="flex-1 h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Use Photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
