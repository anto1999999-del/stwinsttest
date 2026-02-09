import { useMutation } from '@tanstack/react-query';
import { uploadsApi } from '../api/uploads';
import { toast } from 'sonner';

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadsApi.uploadImage(file),
    onSuccess: () => {
      toast.success('Image uploaded successfully!');
    },
    onError: (error: unknown) => {
      let message = 'Failed to upload image';
      if (error && typeof error === 'object' && 'response' in error) {
        const response = error.response;
        if (response && typeof response === 'object' && 'data' in response) {
          const data = response.data;
          if (data && typeof data === 'object' && 'message' in data) {
            message = String(data.message);
          }
        }
      }
      toast.error(message);
    },
  });
};