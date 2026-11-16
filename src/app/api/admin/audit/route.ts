import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = getAdminClient();
    const { searchParams } = new URL(request.url);

    const action = searchParams.get('action');
    const resource = searchParams.get('resource');
    const adminId = searchParams.get('adminId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = admin
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (action) {
      query = query.eq('action', action);
    }
    if (resource) {
      query = query.eq('resource', resource);
    }
    if (adminId) {
      query = query.eq('admin_id', adminId);
    }

    const { data: logs, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = admin
      .from('admin_audit_logs')
      .select('*', { count: 'exact', head: true });

    if (action) countQuery = countQuery.eq('action', action);
    if (resource) countQuery = countQuery.eq('resource', resource);
    if (adminId) countQuery = countQuery.eq('admin_id', adminId);

    const { count } = await countQuery;

    return NextResponse.json({
      logs: logs || [],
      pagination: {
        limit,
        offset,
        total: count || 0,
      }
    });
  } catch (error) {
    console.error('Admin audit GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}