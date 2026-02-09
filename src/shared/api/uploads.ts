//  /root/s-twins/s-twins-web/src/shared/api/uploads.ts

export type UploadResponse = {
  success: boolean;
  data: {
    url: string;
    filename: string;
    id: string;
  };
  message: string;
};

// No authorization required for uploads

export const uploadsApi = {
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("image", file);

    // Use local Next.js API route instead of backend
    const response = await fetch(`/api/uploads/image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  },
};
