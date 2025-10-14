import { NextRequest } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const path = searchParams.get('path');
    const tag = searchParams.get('tag');
    
    // Check for secret to confirm this is a valid request
    if (secret !== process.env.REVALIDATION_SECRET) {
      return Response.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (path) {
      // Revalidate specific path
      revalidatePath(path);
      return Response.json({ 
        revalidated: true, 
        message: `Path "${path}" revalidated successfully`,
        now: Date.now() 
      });
    }

    if (tag) {
      // Revalidate by tag
      revalidateTag(tag);
      return Response.json({ 
        revalidated: true, 
        message: `Tag "${tag}" revalidated successfully`,
        now: Date.now() 
      });
    }

    return Response.json({ 
      message: 'Missing path or tag parameter' 
    }, { status: 400 });

  } catch (err) {
    return Response.json({ 
      message: 'Error revalidating',
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}