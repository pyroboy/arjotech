import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface Segment {
  start: number;
  duration: number;
  text: string;
}

function extractVideoId(url: string): string | null {
  // Handle youtube.com/watch?v=...
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // Handle youtu.be/...
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Handle youtube.com/embed/...
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // Handle just a video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();

  return null;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\n/g, ' ')
    .trim();
}

export const GET: RequestHandler = async ({ url }) => {
  try {
    const youtubeUrl = url.searchParams.get('url');

    if (!youtubeUrl) {
      return json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return json({ error: 'Invalid YouTube URL. Paste a full YouTube link or video ID.' }, { status: 400 });
    }

    // Step 1: Fetch the YouTube page to get video info and caption tracks
    const pageUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const pageRes = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    if (!pageRes.ok) {
      return json({ error: 'Could not reach YouTube. Try again.' }, { status: 502 });
    }

    const html = await pageRes.text();

    // Extract title
    const titleMatch = html.match(/<title>(.*?)(?:\s*-\s*YouTube)?<\/title>/);
    const title = titleMatch ? decodeHtmlEntities(titleMatch[1]) : 'Untitled Video';

    // Try to find captionTracks in the page data
    // YouTube embeds this in ytInitialPlayerResponse or inside a script tag
    let captionUrl: string | null = null;

    // Method 1: Look for captionTracks in ytInitialPlayerResponse
    const playerMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/s);
    if (playerMatch) {
      try {
        const playerData = JSON.parse(playerMatch[1]);
        const tracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        if (tracks && tracks.length > 0) {
          // Prefer English, fall back to first track
          const englishTrack = tracks.find((t: any) =>
            t.languageCode === 'en' || t.languageCode?.startsWith('en')
          );
          captionUrl = (englishTrack || tracks[0]).baseUrl;
        }
      } catch {
        // JSON parse failed, try method 2
      }
    }

    // Method 2: Search for timedtext URL directly in the page source
    if (!captionUrl) {
      const timedtextMatch = html.match(/"(https:\/\/www\.youtube\.com\/api\/timedtext[^"]+)"/);
      if (timedtextMatch) {
        captionUrl = timedtextMatch[1].replace(/\\u0026/g, '&');
      }
    }

    // Method 3: Try the innertube API endpoint directly
    if (!captionUrl) {
      try {
        const innertubeRes = await fetch('https://www.youtube.com/youtubei/v1/player', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          body: JSON.stringify({
            videoId,
            context: {
              client: {
                clientName: 'WEB',
                clientVersion: '2.20240101.00.00',
                hl: 'en',
              },
            },
          }),
        });

        if (innertubeRes.ok) {
          const innertubeData = await innertubeRes.json();
          const tracks = innertubeData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
          if (tracks && tracks.length > 0) {
            const englishTrack = tracks.find((t: any) =>
              t.languageCode === 'en' || t.languageCode?.startsWith('en')
            );
            captionUrl = (englishTrack || tracks[0]).baseUrl;
          }
        }
      } catch {
        // innertube failed, continue
      }
    }

    if (!captionUrl) {
      return json(
        { error: 'No captions found for this video. The video may not have subtitles enabled.' },
        { status: 404 }
      );
    }

    // Ensure we request XML format (not JSON3)
    const captionFetchUrl = captionUrl.includes('fmt=')
      ? captionUrl
      : captionUrl + '&fmt=srv3';

    // Step 2: Fetch the captions
    const captionRes = await fetch(captionFetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!captionRes.ok) {
      return json({ error: 'Failed to fetch captions data.' }, { status: 502 });
    }

    const captionXml = await captionRes.text();

    // Step 3: Parse XML segments
    const segments: Segment[] = [];
    const textRegex = /<text start="([\d.]+)" dur="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g;

    let match;
    while ((match = textRegex.exec(captionXml)) !== null) {
      const start = parseFloat(match[1]);
      const duration = parseFloat(match[2]);
      const text = decodeHtmlEntities(match[3]);

      if (text.length > 0) {
        segments.push({ start, duration, text });
      }
    }

    if (segments.length === 0) {
      // Maybe it's JSON3 format instead
      try {
        const jsonData = JSON.parse(captionXml);
        if (jsonData.events) {
          for (const event of jsonData.events) {
            if (event.segs) {
              const text = event.segs.map((s: any) => s.utf8 || '').join('').trim();
              if (text && text !== '\n') {
                segments.push({
                  start: (event.tStartMs || 0) / 1000,
                  duration: (event.dDurationMs || 0) / 1000,
                  text,
                });
              }
            }
          }
        }
      } catch {
        return json({ error: 'Could not parse captions format.' }, { status: 500 });
      }
    }

    if (segments.length === 0) {
      return json({ error: 'Captions were found but could not be parsed.' }, { status: 500 });
    }

    return json({ title, segments, videoId });
  } catch (err) {
    console.error('Transcript extraction error:', err);
    return json(
      { error: 'Something went wrong. Please check the URL and try again.' },
      { status: 500 }
    );
  }
};
