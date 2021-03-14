import { v2 as cloudinary } from 'cloudinary';
import env from './env';
import notifySlack from './slack';

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const upload = async (file) => {
  try {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      const image = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'BroadCaster',
        use_filename: true,
      }, (result) => result);
      return image;
    }
  } catch (e) {
    await notifySlack(`Cloudinary error: ${e.message}, ${e.stack}`);
    return null;
  }
};

export default upload;
