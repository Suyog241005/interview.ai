import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), "./public"));
  },
  filename: (_req, file, cb) => {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
});

const audioStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), "./public"));
  },
  filename: (_req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (!ext) {
      if (file.mimetype === "audio/webm") ext = ".webm";
      else if (file.mimetype === "audio/ogg") ext = ".ogg";
      else if (file.mimetype === "audio/mpeg") ext = ".mp3";
      else ext = ".webm"; // Default standard for modern browser MediaRecorders
    }

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `answer-${uniqueSuffix}${ext}`);
  },
});

export const uploadAudio = multer({
  storage: audioStorage,
  limits: {
    fileSize: 15 * 1024 * 1024, // Increased to 15MB to support longer spoken answers smoothly
  },
});
