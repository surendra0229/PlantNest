import React, { useState, useRef } from 'react';
import { plantService, getBackendUrl } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Upload, Camera, Trash2, RefreshCw, Loader2, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';

const ImageInputManager = ({ value, onChange, label = "Product Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [capturedPreviewUrl, setCapturedPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const { toast } = useToast();

  // Upload a File or Blob to Cloudinary via the service layer
  const uploadFileToCloudinary = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const res = await plantService.uploadImage(file);
      if (res && res.success && res.url) {
        onChange(res.url);
        toast.success('Image uploaded to Cloudinary successfully!');
      } else {
        toast.error((res && res.message) || 'Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle file selected via file input
  const handleFileInputChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a JPG, PNG, or WEBP image file.');
      e.target.value = '';
      return;
    }

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB.');
      e.target.value = '';
      return;
    }

    uploadFileToCloudinary(file);
    // Reset file input so same file can be re-selected if needed
    e.target.value = '';
  };

  // Trigger File Dialog
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError('');
    setCapturedBlob(null);
    if (capturedPreviewUrl) {
      URL.revokeObjectURL(capturedPreviewUrl);
      setCapturedPreviewUrl(null);
    }
    setCameraActive(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera capture is not supported on this browser or device.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera error:', err);
      let errorMsg = 'Could not access device camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission was denied. Please allow camera access in browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera device was found on this device.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setCameraError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Stop Camera Stream and clean up
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (capturedPreviewUrl) {
      URL.revokeObjectURL(capturedPreviewUrl);
    }
    setCameraActive(false);
    setCapturedBlob(null);
    setCapturedPreviewUrl(null);
    setCameraError('');
  };

  // Capture Frame from Video Feed → convert to Blob directly (no base64 string needed)
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to Blob (binary) — much more reliable than base64 strings
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error('Failed to capture image from camera. Please try again.');
          return;
        }
        // Create preview URL from Blob (local object URL, not uploaded yet)
        if (capturedPreviewUrl) URL.revokeObjectURL(capturedPreviewUrl);
        const previewUrl = URL.createObjectURL(blob);
        setCapturedBlob(blob);
        setCapturedPreviewUrl(previewUrl);
      },
      'image/jpeg',
      0.92
    );
  };

  // Upload captured Blob to Cloudinary and close camera
  const confirmCapturedPhoto = async () => {
    if (!capturedBlob) return;

    // Create a proper named File from the Blob
    const capturedFile = new File([capturedBlob], `captured_${Date.now()}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now()
    });

    setUploading(true);
    try {
      const res = await plantService.uploadImage(capturedFile);
      if (res && res.success && res.url) {
        onChange(res.url);
        toast.success('Photo captured and uploaded to Cloudinary successfully!');
        stopCamera();
      } else {
        toast.error((res && res.message) || 'Failed to save captured photo.');
      }
    } catch (err) {
      console.error('Camera upload error:', err);
      toast.error(err.message || 'Failed to upload captured photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Retake — clear current capture but keep camera open
  const retakePhoto = () => {
    if (capturedPreviewUrl) URL.revokeObjectURL(capturedPreviewUrl);
    setCapturedBlob(null);
    setCapturedPreviewUrl(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700 dark:text-emerald-300">
        {label} <span className="text-rose-500">*</span>
      </label>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/jpeg,image/png,image/jpg,image/webp"
        className="hidden"
      />

      {/* State 1: Image Present Preview */}
      {value ? (
        <div className="relative group p-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500/40 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4 shadow-md transition">
          <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0">
            <img
              src={value.startsWith('http') || value.startsWith('/') ? value : `${getBackendUrl()}${value}`}
              alt="Product Preview"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
              <Check className="w-4 h-4 text-emerald-500" />
              {value.includes('cloudinary.com') ? 'Cloudinary Image Active' : 'Image Active'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-xs">
              {value}
            </p>

            {/* Change & Remove Buttons */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={uploading}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-700 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-slate-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                Change Image
              </button>

              <button
                type="button"
                onClick={startCamera}
                disabled={uploading}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Retake Photo
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                disabled={uploading}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* State 2: No Image Selected - Show Upload Options */
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border-2 border-dashed border-emerald-300 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-4 shadow-sm hover:border-emerald-500 transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <ImageIcon className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              No Image Attached
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Upload a file or capture a photo — automatically saved to Cloudinary
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={uploading}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Image
                </>
              )}
            </button>

            <button
              type="button"
              onClick={startCamera}
              disabled={uploading}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </button>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            Supports JPG, JPEG, PNG, WEBP (Max 10MB)
          </p>
        </div>
      )}

      {/* Camera Modal */}
      {cameraActive && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-white">
              <h4 className="font-extrabold text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                Capture Product Photo
              </h4>
              <button
                type="button"
                onClick={stopCamera}
                disabled={uploading}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Camera Access Error</p>
                  <p className="text-[11px] text-rose-300/90 mt-1">{cameraError}</p>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-800 flex items-center justify-center">
                {/* Video Feed (shown before capture) */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${capturedPreviewUrl ? 'hidden' : 'block'}`}
                />
                {/* Captured Photo Preview */}
                {capturedPreviewUrl && (
                  <img
                    src={capturedPreviewUrl}
                    alt="Captured Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}

            {/* Camera Controls */}
            {!cameraError && (
              <div className="flex items-center justify-between gap-3 pt-2">
                {!capturedPreviewUrl ? (
                  <>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      Snap Photo
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={retakePhoto}
                      disabled={uploading}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                      Retake
                    </button>
                    <button
                      type="button"
                      onClick={confirmCapturedPhoto}
                      disabled={uploading}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading to Cloudinary...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Use Captured Photo
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageInputManager;
