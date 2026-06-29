export interface CoworkMessageRailIndexItem {
  messageId: string;
  type: 'user' | 'assistant';
  sequence: number | null;
  messageOffset: number;
  timestamp: number;
  preview: string;
  contentLen: number;
}

export const COWORK_RAIL_PREVIEW_MAX_LENGTH = 50;

export const stripCoworkRailPreviewMarkdown = (value: string): string => value
  .replace(/^#+\s+/gm, '')
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/`[^`]*`/g, ' ')
  .replace(/[*_~>]/g, '')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/\s+/g, ' ')
  .trim();

export const getCoworkRailPreview = (
  content: string,
  fallback: string,
  maxLength = COWORK_RAIL_PREVIEW_MAX_LENGTH,
): string => {
  const stripped = stripCoworkRailPreviewMarkdown(content);
  return stripped.slice(0, maxLength) || fallback;
};
