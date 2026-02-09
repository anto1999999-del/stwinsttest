import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  wpPostsApi,
  createProductPost,
  type QueryPostsParams,
  type CreatePostPayload,
  type UpdatePostPayload,
} from "../api/wp-posts";
import { toast } from "sonner";

// Query keys
const QUERY_KEYS = {
  posts: (params?: QueryPostsParams) => ["wp-posts", "list", params],
  post: (id: string) => ["wp-posts", "detail", id],
  postMeta: (postId: string) => ["wp-posts", "meta", postId],
};

// Hook for fetching posts
export const useWpPosts = (params?: QueryPostsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts(params),
    queryFn: () => wpPostsApi.getPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Enhanced hook for fetching posts with resolved images (for product posts)
export const useWpPostsWithImages = (params?: QueryPostsParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.posts(params), "with-images"],
    queryFn: async () => {
      const response = await wpPostsApi.getPosts(params);

      // Only resolve images for product posts that have thumbnail IDs
      const postsWithImages = await Promise.all(
        response.posts.map(async (post) => {
          if (post.post_type === "product") {
            let resolvedImageUrl = "";
            let resolvedGalleryUrls: string[] = [];

            // Resolve thumbnail image
            if (post.meta?._thumbnail_id) {
              // Check if _thumbnail_id is already a URL
              if (post.meta._thumbnail_id.startsWith("http")) {
                resolvedImageUrl = post.meta._thumbnail_id;
              } else {
                try {
                  const imageUrl = await wpPostsApi.getPost(
                    post.meta._thumbnail_id
                  );
                  resolvedImageUrl = imageUrl.guid || post.meta.image_url || "";
                } catch {
                  // Fallback to image_url if thumbnail resolution fails
                  resolvedImageUrl = post.meta.image_url || "";
                }
              }
            } else {
              resolvedImageUrl = post.meta?.image_url || "";
            }

            // Resolve gallery images
            const galleryMetaKey =
              post.meta?._gallery_ids || post.meta?._product_image_gallery;
            if (galleryMetaKey) {
              try {
                let galleryIds: string[] = [];
                // Try to parse as JSON first (for _gallery_ids format)
                try {
                  galleryIds = JSON.parse(galleryMetaKey);
                } catch {
                  // If JSON parsing fails, treat as comma-separated string (for _product_image_gallery format)
                  galleryIds = galleryMetaKey
                    .split(",")
                    .filter((id) => id.trim() !== "");
                }

                if (Array.isArray(galleryIds) && galleryIds.length > 0) {
                  // Resolve each gallery ID to URL
                  const galleryUrlPromises = galleryIds.map(async (id) => {
                    if (id.startsWith("http")) {
                      return id; // Already a URL
                    }
                    try {
                      const galleryPost = await wpPostsApi.getPost(id);
                      return galleryPost.guid || "";
                    } catch {
                      return ""; // Skip failed resolutions
                    }
                  });

                  const resolvedUrls = await Promise.all(galleryUrlPromises);
                  resolvedGalleryUrls = resolvedUrls.filter(
                    (url) => url !== ""
                  );
                }
              } catch (error) {
                console.warn("Failed to resolve gallery images:", error);
              }
            }

            return {
              ...post,
              resolvedImageUrl,
              resolvedGalleryUrls,
            };
          }
          return {
            ...post,
            resolvedImageUrl: post.meta?.image_url || "",
            resolvedGalleryUrls: [],
          };
        })
      );

      return {
        ...response,
        posts: postsWithImages,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching a single post
export const useWpPost = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.post(id),
    queryFn: () => wpPostsApi.getPost(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for creating posts
export const useCreateWpPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => wpPostsApi.createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wp-posts"] });
      toast.success("Post created successfully!");
    },
    onError: (error: unknown) => {
      let message = "Failed to create post";
      if (error && typeof error === "object" && "response" in error) {
        const response = error.response;
        if (response && typeof response === "object" && "data" in response) {
          const data = response.data;
          if (data && typeof data === "object" && "message" in data) {
            message = String(data.message);
          }
        }
      }
      toast.error(message);
    },
  });
};

// Hook for creating product posts (specialized for parts)
export const useCreateProductPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partData: Parameters<typeof createProductPost>[0]) =>
      createProductPost(partData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wp-posts"] });
      toast.success("Product created successfully!");
    },
    onError: (error: unknown) => {
      let message = "Failed to create product";
      if (error && typeof error === "object" && "response" in error) {
        const response = error.response;
        if (response && typeof response === "object" && "data" in response) {
          const data = response.data;
          if (data && typeof data === "object" && "message" in data) {
            message = String(data.message);
          }
        }
      }
      toast.error(message);
    },
  });
};

// Hook for updating posts
export const useUpdateWpPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePostPayload }) =>
      wpPostsApi.updatePost(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["wp-posts"] });
      queryClient.setQueryData(QUERY_KEYS.post(data.ID), data);
      toast.success("Post updated successfully!");
    },
    onError: (error: unknown) => {
      let message = "Failed to update post";
      if (error && typeof error === "object" && "response" in error) {
        const response = error.response;
        if (response && typeof response === "object" && "data" in response) {
          const data = response.data;
          if (data && typeof data === "object" && "message" in data) {
            message = String(data.message);
          }
        }
      }
      toast.error(message);
    },
  });
};

// Hook for deleting posts
export const useDeleteWpPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => wpPostsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wp-posts"] });
      toast.success("Post deleted successfully!");
    },
    onError: (error: unknown) => {
      let message = "Failed to delete post";
      if (error && typeof error === "object" && "response" in error) {
        const response = error.response;
        if (response && typeof response === "object" && "data" in response) {
          const data = response.data;
          if (data && typeof data === "object" && "message" in data) {
            message = String(data.message);
          }
        }
      }
      toast.error(message);
    },
  });
};

// Hook for fetching post meta
export const usePostMeta = (postId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.postMeta(postId),
    queryFn: () => wpPostsApi.getPostMeta(postId),
    enabled: !!postId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
