// src/admin/compress.js
// Автоматическое сжатие медиа перед загрузкой в хранилище.
// Задача — не дать залить в прод 100-мегабайтный файл: сайт от таких
// ассетов грузится минутами.

// Картинки ужимаем до этой стороны (хватает и для ретины)
const IMAGE_MAX_SIDE = 1920;
const IMAGE_QUALITY = 0.82;
// Иконки наград/лого показываются мелко — им хватает меньшего размера
const ICON_MAX_SIDE = 512;

// Видео перекодируем, только если оно тяжелее этого порога
const VIDEO_SIZE_LIMIT = 12 * 1024 * 1024; // 12 МБ
const VIDEO_MAX_HEIGHT = 1080;
const VIDEO_BITRATE = 2_500_000; // ~2.5 Мбит/с

const isImage = (file) => file.type.startsWith('image/');
const isVideo = (file) => file.type.startsWith('video/');
// У SVG и GIF нет смысла пережимать через canvas: SVG векторный,
// а GIF потеряет анимацию
const isUncompressible = (file) => /svg|gif/i.test(file.type);

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image decode failed')); };
    img.src = url;
  });
}

// Прозрачность нужно сохранить (иконки наград) — тогда остаёмся в PNG
function hasAlpha(canvas) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  // Проверяем выборочно: полный проход по 1920×1080 слишком дорогой
  const step = Math.max(1, Math.floor((width * height) / 40000));
  const data = ctx.getImageData(0, 0, width, height).data;
  for (let i = 3; i < data.length; i += 4 * step) {
    if (data[i] < 250) return true;
  }
  return false;
}

async function compressImage(file, { maxSide = IMAGE_MAX_SIDE } = {}) {
  const img = await loadImage(file);
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);

  const keepAlpha = /png|webp/i.test(file.type) && hasAlpha(canvas);
  const mime = keepAlpha ? 'image/png' : 'image/jpeg';
  const ext = keepAlpha ? 'png' : 'jpg';

  const blob = await new Promise((res) => canvas.toBlob(res, mime, IMAGE_QUALITY));
  if (!blob || blob.size >= file.size) return file; // сжатие не помогло — берём оригинал

  const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext;
  return new File([blob], name, { type: mime });
}

// Перекодирование видео в браузере: играем ролик в canvas и пишем
// MediaRecorder-ом. Идёт в реальном времени, поэтому применяем только к
// тяжёлым файлам. Если что-то не поддерживается — возвращаем оригинал.
async function compressVideo(file, onProgress) {
  if (typeof MediaRecorder === 'undefined') return file;

  const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
    .find((t) => MediaRecorder.isTypeSupported(t));
  if (!mime) return file;

  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.src = url;
  video.muted = true;
  video.playsInline = true;

  try {
    await new Promise((res, rej) => {
      video.onloadedmetadata = res;
      video.onerror = () => rej(new Error('video decode failed'));
    });

    const scale = Math.min(1, VIDEO_MAX_HEIGHT / video.videoHeight);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * scale / 2) * 2;
    canvas.height = Math.round(video.videoHeight * scale / 2) * 2;
    const ctx = canvas.getContext('2d');

    const stream = canvas.captureStream(30);
    // Звук тянем из исходника, если он есть
    if (video.captureStream) {
      const src = video.captureStream();
      src.getAudioTracks().forEach((t) => stream.addTrack(t));
    }

    const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: VIDEO_BITRATE });
    const chunks = [];
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

    const done = new Promise((res) => { recorder.onstop = res; });
    recorder.start();
    video.muted = false;
    await video.play();

    let raf;
    const draw = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (onProgress && video.duration) onProgress(video.currentTime / video.duration);
      raf = requestAnimationFrame(draw);
    };
    draw();

    await new Promise((res) => { video.onended = res; });
    cancelAnimationFrame(raf);
    recorder.stop();
    await done;

    const blob = new Blob(chunks, { type: 'video/webm' });
    if (!blob.size || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, '') + '.webm';
    return new File([blob], name, { type: 'video/webm' });
  } catch (e) {
    console.error('video compress failed, uploading original', e);
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Единая точка входа: folder подсказывает, насколько мелко можно жать
export async function compressForUpload(file, folder, onProgress) {
  try {
    if (isUncompressible(file)) return file;
    if (isImage(file)) {
      const maxSide = folder === 'awards' || folder === 'platforms' ? ICON_MAX_SIDE : IMAGE_MAX_SIDE;
      return await compressImage(file, { maxSide });
    }
    if (isVideo(file) && file.size > VIDEO_SIZE_LIMIT) {
      return await compressVideo(file, onProgress);
    }
    return file;
  } catch (e) {
    console.error('compress failed, uploading original', e);
    return file;
  }
}

export const formatSize = (bytes) =>
  bytes > 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + ' МБ' : Math.round(bytes / 1024) + ' КБ';
