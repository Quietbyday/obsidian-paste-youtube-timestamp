const YOUTUBE_HOSTNAMES = new Set([
	'youtu.be',
	'youtube.com',
	'www.youtube.com',
	'm.youtube.com',
]);

/**
 * Returns true if the given text is a YouTube URL that includes a numeric
 * timestamp parameter (`t=<seconds>`).
 */
export function isYouTubeTimestampUrl(text: string): boolean {
	let url: URL;
	try {
		url = new URL(text.trim());
	} catch {
		return false;
	}

	if (!YOUTUBE_HOSTNAMES.has(url.hostname)) {
		return false;
	}

	const t = url.searchParams.get('t');
	if (!t) return false;

	return /^\d+$/.test(t);
}

/**
 * Given a YouTube URL containing a `t=<seconds>` parameter, returns a
 * Markdown link whose display text is the timestamp in human-readable form.
 *
 * Format:
 *   - Under 1 hour:  m:ss   (e.g. "1:55", "0:45")
 *   - 1 hour+:       h:mm:ss (e.g. "1:02:05")
 */
export function formatAsMarkdownLink(url: string): string {
	const parsed = new URL(url.trim());
	const seconds = parseInt(parsed.searchParams.get('t') ?? '0', 10);

	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;

	const ss = String(s).padStart(2, '0');

	let timestamp: string;
	if (h > 0) {
		const mm = String(m).padStart(2, '0');
		timestamp = `${h}:${mm}:${ss}`;
	} else {
		timestamp = `${m}:${ss}`;
	}

	return `[${timestamp}](${url.trim()})`;
}
