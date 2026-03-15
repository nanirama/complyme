import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; slug: string; imageName: string }> }
) {
  try {
    const { category, slug, imageName } = await params;
    
    // Sanitize inputs to prevent directory traversal
    const sanitizedCategory = category.replace(/[^a-zA-Z0-9-_]/g, '');
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '');
    const sanitizedImageName = imageName.replace(/[^a-zA-Z0-9-_.]/g, '');
    
    // Construct the path to the image in the content folder
    const imagePath = path.join(
      process.cwd(),
      'src',
      'content',
      'posts',
      sanitizedCategory,
      sanitizedSlug,
      sanitizedImageName
    );
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Determine content type based on file extension
    const ext = path.extname(sanitizedImageName).toLowerCase();
    const contentType = 
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
      ext === '.png' ? 'image/png' :
      ext === '.gif' ? 'image/gif' :
      ext === '.webp' ? 'image/webp' :
      ext === '.svg' ? 'image/svg+xml' :
      'application/octet-stream';
    
    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving post image:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
