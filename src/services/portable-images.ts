const MIME_TYPE_BY_EXTENSION: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
};

export const isDataUrl = (value: string | undefined): value is string => {
  return typeof value === 'string' && value.startsWith('data:');
};

export const isManagedImagePath = (value: string | undefined): value is string => {
  return typeof value === 'string' && value.startsWith('images/');
};

export const getMimeTypeFromPath = (path: string): string => {
  const extension = path.split('.').pop()?.toLowerCase() ?? '';
  return MIME_TYPE_BY_EXTENSION[extension] ?? 'application/octet-stream';
};

export const bytesToDataUrl = (bytes: Uint8Array, mimeType: string): string => {
  let binary = '';

  for (let index = 0; index < bytes.length; index += 0x8000) {
    const chunk = bytes.subarray(index, index + 0x8000);
    binary += String.fromCharCode(...chunk);
  }

  return `data:${mimeType};base64,${btoa(binary)}`;
};

export const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const response = await fetch(dataUrl);
  return response.blob();
};
