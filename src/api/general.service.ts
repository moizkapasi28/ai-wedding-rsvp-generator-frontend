import { apiService } from "./api.service";

export interface GenerateUploadUrlResponse {
  message?: string;
  data: {
    url: string;
    object_key: string;
  };
}

export interface GenerateViewUrlResponse {
  message?: string;
  data: {
    url: string;
  };
}

class GeneralService {
  private api: typeof apiService;
  controller: string = "general";

  constructor() {
    this.api = apiService;
  }

  async generateUploadUrl(
    objectKey: string,
    mimeType: string,
  ): Promise<GenerateUploadUrlResponse> {
    return this.api.post<GenerateUploadUrlResponse>(
      `${this.controller}/generate-upload-url`,
      { object_key: objectKey, mime_type: mimeType },
    );
  }

  async generateViewUrl(
    objectKey: string,
  ): Promise<GenerateViewUrlResponse> {
    return this.api.post<GenerateViewUrlResponse>(
      `${this.controller}/generate-view-url`,
      { object_key: objectKey },
    );
  }

  async uploadFileToS3(uploadUrl: string, file: Blob): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to upload file to S3");
    }
  }
}

export const generalService = new GeneralService();
