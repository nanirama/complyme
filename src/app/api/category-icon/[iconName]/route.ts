import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ iconName: string }> }
) {
  try {
    const { iconName } = await params;
    
    // Sanitize input to prevent directory traversal
    const sanitizedIconName = iconName.replace(/[^a-zA-Z0-9-_.]/g, '');
    
    // Construct the path to the icon in the content/categories folder
    const iconPath = path.join(
      process.cwd(),
      'src',
      'content',
      'categories',
      sanitizedIconName
    );
    
    // Check if file exists
    if (!fs.existsSync(iconPath)) {
      return new NextResponse('Icon not found', { status: 404 });
    }
    
    // Read the icon file
    const iconBuffer = fs.readFileSync(iconPath);
    
    // Determine content type based on file extension
    const ext = path.extname(sanitizedIconName).toLowerCase();
    const contentType = 
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
      ext === '.png' ? 'image/png' :
      ext === '.gif' ? 'image/gif' :
      ext === '.webp' ? 'image/webp' :
      ext === '.svg' ? 'image/svg+xml' :
      'application/octet-stream';
    
    // Return the icon with appropriate headers
    return new NextResponse(iconBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving category icon:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
