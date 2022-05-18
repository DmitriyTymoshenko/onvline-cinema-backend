import { v2 } from 'cloudinary';
import { CLOUDINARY } from '../constants/constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'doyynldwy',
      api_key: '227286522685976',
      api_secret: 'AVg4pRVHWHQeEXV3aiU3Nqsi78k',
    });
  },
};
