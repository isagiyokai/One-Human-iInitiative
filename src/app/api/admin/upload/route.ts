import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { Readable } from 'stream';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, PDF' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // For images, we would strip EXIF here using sharp
    // For now, just upload as-is

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'bin';
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
    const path = `campaign-assets/${filename}`;

    // Upload to Supabase Storage
    const admin = getAdminClient();
    const { data, error } = await admin.storage
      .from('campaign-assets')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = admin.storage
      .from('campaign-assets')
      .getPublicUrl(data.path);

    // Log admin action
    await admin.from('admin_audit_logs').insert({
      action: 'asset.uploaded',
      resource: 'storage',
      resource_id: data.path,
      details: { filename: file.name, size: file.size, type: file.type },
    });

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}