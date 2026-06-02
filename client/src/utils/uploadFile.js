export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100 MB
export const IMAGE_COMPRESS_THRESHOLD_BYTES = 1024 * 1024;

const RASTER_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

export function formatBytes(bytes = 0) {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${Number.isInteger(mb) ? mb : Number(mb.toFixed(1))} MB`;
  }

  const kb = bytes / 1024;
  return `${Number.isInteger(kb) ? kb : Number(kb.toFixed(1))} KB`;
}

function isRasterImage(file) {
  return RASTER_IMAGE_TYPES.has(String(file?.type || '').toLowerCase());
}

function buildSizeError(file, maxBytes) {
  return new Error(`File ${file?.name || 'selected file'} is ${formatBytes(file?.size || 0)}. Please use a file under ${formatBytes(maxBytes)}.`);
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read selected image.'));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }
      reject(new Error('Could not optimize selected image.'));
    }, type, quality);
  });
}

function getScaledSize(width, height, maxDimension) {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / Math.max(width, height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export async function compressImageFile(file, {
  maxDimension = 2200,
  quality = 0.82,
} = {}) {
  if (!isRasterImage(file)) {
    return file;
  }

  const image = await loadImage(file);
  const size = getScaledSize(image.naturalWidth || image.width, image.naturalHeight || image.height, maxDimension);
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, size.width, size.height);

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await canvasToBlob(canvas, outputType, outputType === 'image/png' ? undefined : quality);

  if (blob.size >= file.size) {
    return file;
  }

  const extension = outputType === 'image/png' ? 'png' : 'jpg';
  const basename = String(file.name || 'upload').replace(/\.[^.]+$/, '');
  return new File([blob], `${basename}.${extension}`, {
    type: outputType,
    lastModified: Date.now(),
  });
}

export async function prepareUploadFile(file, {
  maxBytes = MAX_UPLOAD_BYTES,
  compressThresholdBytes = IMAGE_COMPRESS_THRESHOLD_BYTES,
  compressImage = compressImageFile,
} = {}) {
  if (!file) {
    throw new Error('Please choose a file.');
  }

  let prepared = file;
  if (isRasterImage(file) && file.size > compressThresholdBytes) {
    prepared = await compressImage(file);
  }

  if (prepared.size > maxBytes) {
    throw buildSizeError(prepared, maxBytes);
  }

  return prepared;
}

export async function createUploadFormData(file, fields = {}) {
  const preparedFile = await prepareUploadFile(file);
  const formData = new FormData();
  formData.append('file', preparedFile);

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return { formData, file: preparedFile };
}

export function getUploadErrorMessage(err, fallback = 'Upload failed.') {
  if (err?.response?.status === 413) {
    return `File is too large for the production server. Please use an image under ${formatBytes(MAX_UPLOAD_BYTES)}.`;
  }

  return err?.response?.data?.message || err?.message || fallback;
}
