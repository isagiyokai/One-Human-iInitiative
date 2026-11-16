'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Update {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  imageUrl?: string;
  author: string;
}

// Empty state - data will be fetched from API
const emptyUpdates: Update[] = [];

export function UpdatesContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <header className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-charcoal-900">
          Updates
        </h1>
        <p className="mt-4 text-lg text-stone-600 leading-relaxed">
          Latest announcements, expense reports, and campaign news.
          All updates are published by the campaign admin.
        </p>
      </header>

      {/* Updates List */}
      <div className="max-w-3xl mx-auto space-y-6">
        {emptyUpdates.map((update) => (
          <article key={update.id} className="group">
            <Card variant="default" padding="lg" className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <Badge variant="info" size="sm">
                    Update
                  </Badge>
                  <time className="text-sm text-stone-500 font-mono" dateTime={update.publishedAt}>
                    {new Date(update.publishedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <CardTitle className="text-2xl group-hover:text-earth-600 transition-colors">
                  {update.title}
                </CardTitle>
                <CardDescription className="text-stone-500">
                  By {update.author}
                </CardDescription>
              </CardHeader>

              {update.imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden relative h-48">
                  <Image
                    src={update.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                  />
                </div>
              )}

              <CardContent>
                <div className="prose prose-sm max-w-none text-stone-700 leading-relaxed">
                  {update.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </article>
        ))}

        {/* Empty State */}
        {emptyUpdates.length === 0 && (
          <Card variant="outlined" padding="lg" className="text-center">
            <CardContent>
              <svg className="mx-auto w-16 h-16 text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-2">No Updates Yet</h3>
              <p className="text-stone-600">Campaign updates will appear here once published.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* RSS/Subscribe Note */}
      <div className="mt-12 lg:mt-16 max-w-3xl mx-auto">
        <Card variant="outlined" padding="lg" className="text-center">
          <CardContent>
            <svg className="mx-auto w-10 h-10 text-stone-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16l6-4 6 4V4H4z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
            </svg>
            <h3 className="font-semibold text-charcoal-900 mb-2">Stay Updated</h3>
            <p className="text-stone-600 mb-4">
              No email list. No tracking. No notifications.
              Bookmark this page or check back for new updates.
            </p>
            <p className="text-xs text-stone-500">
              For real-time contribution tracking, visit the <a href="/transparency" className="text-earth-600 hover:underline">Transparency</a> page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}