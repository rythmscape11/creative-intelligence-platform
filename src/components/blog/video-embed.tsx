import React from 'react';

function getEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      // Extract video id
      let id = '';
      if (u.hostname.includes('youtu.be')) {
        id = u.pathname.slice(1);
      } else {
        id = u.searchParams.get('v') || '';
      }
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export interface VideoEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, title = 'Embedded video', className }) => {
  const embed = getEmbedUrl(url);
  if (!embed) return null;
  return (
    <div className={`relative w-full aspect-video overflow-hidden rounded-lg bg-black ${className || ''}`}>
      <iframe
        src={embed}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
};

