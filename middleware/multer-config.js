import multer, { diskStorage } from 'multer';
import { join } from 'path';

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = diskStorage({
  destination: (req, file, callback) => {
    const destinationPath = join(__dirname, '../images');
    callback(null, destinationPath);
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

export default multer({ storage: storage }).single('image');
