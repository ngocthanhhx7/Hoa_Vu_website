const crypto = require('crypto');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const config = require('../config/config');

const uploadRoot = path.join(__dirname, '..', config.uploadDir);

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const s3Client = config.aws.isConfigured ? new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
  ...(config.aws.endpoint ? { endpoint: config.aws.endpoint } : {}),
}) : null;

function sanitizeFolder(folder = 'general') {
  const normalized = String(folder || 'general')
    .replace(/\\/g, '/')
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .filter((segment) => segment !== '.' && segment !== '..')
    .map((segment) => segment.replace(/[^a-zA-Z0-9_-]/g, '-'))
    .filter(Boolean)
    .join('/');

  return normalized || 'general';
}

function createFilename(originalName = 'file') {
  const ext = path.extname(originalName || '').toLowerCase();
  return `${Date.now()}-${crypto.randomInt(100000000, 999999999)}${ext}`;
}

function buildLocalUrl(folder, filename) {
  return `/uploads/${folder}/${filename}`.replace(/\/+/g, '/');
}

function buildPublicS3Url(key) {
  const normalizedKey = String(key || '').replace(/^\/+/, '');
  if (config.aws.publicBaseUrl) {
    return `${config.aws.publicBaseUrl.replace(/\/+$/, '')}/${normalizedKey}`;
  }

  if (config.aws.endpoint) {
    return `${config.aws.endpoint.replace(/\/+$/, '')}/${config.aws.bucket}/${normalizedKey}`;
  }

  return `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${normalizedKey}`;
}

function ensureS3Ready() {
  if (!config.aws.isConfigured || !s3Client) {
    const err = new Error('Cấu hình Amazon S3 chưa đầy đủ. Vui lòng kiểm tra AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION và AWS_S3_BUCKET.');
    err.statusCode = 500;
    throw err;
  }
}

async function uploadToLocal(file, folder) {
  const filename = createFilename(file.originalname);
  const normalizedFolder = sanitizeFolder(folder);
  const localFolder = path.join(uploadRoot, normalizedFolder);
  await fsPromises.mkdir(localFolder, { recursive: true });

  const absolutePath = path.join(localFolder, filename);
  await fsPromises.writeFile(absolutePath, file.buffer);

  return {
    provider: 'local',
    filename,
    key: `${normalizedFolder}/${filename}`.replace(/\\/g, '/'),
    url: buildLocalUrl(normalizedFolder, filename),
  };
}

async function uploadToS3(file, folder) {
  ensureS3Ready();

  const filename = createFilename(file.originalname);
  const normalizedFolder = sanitizeFolder(folder);
  const key = `${normalizedFolder}/${filename}`.replace(/\\/g, '/');

  await s3Client.send(new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));

  return {
    provider: 's3',
    filename,
    key,
    url: buildPublicS3Url(key),
    bucket: config.aws.bucket,
  };
}

async function uploadFile(file, folder = 'general') {
  if (!file || !file.buffer) {
    const err = new Error('Không có dữ liệu file để upload');
    err.statusCode = 400;
    throw err;
  }

  if (config.uploadProvider === 's3') {
    return uploadToS3(file, folder);
  }

  return uploadToLocal(file, folder);
}

async function deleteFromLocal(storageKey = '', mediaUrl = '') {
  const candidateKey = String(storageKey || mediaUrl || '')
    .replace(/^\/?uploads\/?/, '')
    .replace(/^\/+/, '');

  if (!candidateKey) {
    return false;
  }

  const absolutePath = path.resolve(uploadRoot, candidateKey);
  const normalizedRoot = path.resolve(uploadRoot);

  if (!absolutePath.startsWith(normalizedRoot)) {
    return false;
  }

  try {
    await fsPromises.unlink(absolutePath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}

async function deleteFromS3(storageKey = '', bucket = config.aws.bucket) {
  if (!storageKey) {
    return false;
  }

  ensureS3Ready();

  await s3Client.send(new DeleteObjectCommand({
    Bucket: bucket || config.aws.bucket,
    Key: storageKey,
  }));

  return true;
}

async function deleteFile(media = {}) {
  if (!media) {
    return false;
  }

  if (media.storageProvider === 's3' || (!media.storageProvider && media.bucket && media.storageKey)) {
    return deleteFromS3(media.storageKey, media.bucket);
  }

  return deleteFromLocal(media.storageKey, media.url);
}

module.exports = {
  deleteFile,
  sanitizeFolder,
  uploadFile,
};
