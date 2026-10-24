export async function convertImageToWebP(file, { aspectRatio, maxWidth = 2560, maxHeight = 2560 } = {}) {
  if (!file?.type.startsWith('image/')) {
    throw new Error('Pilih file gambar yang valid.');
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error('Ukuran gambar maksimal 12 MB.');
  }

  const bitmap = await createImageBitmap(file);
  try {
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = bitmap.width;
    let sourceHeight = bitmap.height;

    if (aspectRatio) {
      const sourceRatio = sourceWidth / sourceHeight;
      if (sourceRatio > aspectRatio) {
        sourceWidth = sourceHeight * aspectRatio;
        sourceX = (bitmap.width - sourceWidth) / 2;
      } else {
        sourceHeight = sourceWidth / aspectRatio;
        sourceY = (bitmap.height - sourceHeight) / 2;
      }
    }

    const scale = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight);
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Gambar tidak dapat diproses di browser ini.');
    context.drawImage(bitmap, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) resolve(result);
        else reject(new Error('Gambar gagal dikompres ke WebP.'));
      }, 'image/webp', 0.92);
    });
    if (blob.type !== 'image/webp') {
      throw new Error('Browser ini tidak mendukung kompresi WebP.');
    }

    const name = file.name.replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${name}.webp`, { type: 'image/webp', lastModified: Date.now() });
  } finally {
    bitmap.close();
  }
}
