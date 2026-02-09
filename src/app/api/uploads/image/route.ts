import { NextRequest, NextResponse } from 'next/server';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { randomUUID } from 'crypto';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

export type UploadResponse = {
  success: boolean;
  data: {
    url: string;
    filename: string;
  };
  message: string;
};

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await access(dirPath);
  } catch {
    // Directory doesn't exist, create it
    await mkdir(dirPath, { recursive: true });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          data: { url: '', filename: '' },
          message: 'No file uploaded',
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        {
          success: false,
          data: { url: '', filename: '' },
          message: 'Only image files are allowed',
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          data: { url: '', filename: '' },
          message: 'File size too large. Maximum size is 10MB',
        },
        { status: 400 }
      );
    }

    // Create year/month directory structure like WordPress
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const baseUploadPath = path.join(process.cwd(), 'public', 'wp-content', 'uploads');
    const monthDir = path.join(baseUploadPath, year.toString(), month);

    // Ensure directory exists
    await ensureDirectoryExists(monthDir);

    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${randomUUID()}${fileExtension}`;
    const filePath = path.join(monthDir, uniqueFilename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate absolute URL for storage in database
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const url = `${baseUrl}/wp-content/uploads/${year}/${month}/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      data: {
        url,
        filename: uniqueFilename,
      },
      message: 'Image uploaded successfully',
    });

  } catch (error: unknown) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        data: { url: '', filename: '' },
        message: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}