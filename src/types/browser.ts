export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  icon?: string;
  favicon?: string;
  history: string[];
  historyIndex: number;
  isLoading?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
}

export type TabItem = BrowserTab;

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  folder?: string;
  dateAdded: string;
}

export interface HistoryEntry {
  id: string;
  url: string;
  title: string;
  timestamp: string; // ISO string
  visitCount: number;
}

export interface DownloadItem {
  id: string;
  filename: string;
  url: string;
  sizeBytes: number;
  downloadedBytes: number;
  status: 'downloading' | 'completed' | 'cancelled' | 'error';
  mimeType: string;
  localVFSPath: string;
  dateAdded: string;
  content: string; // file content written to VFS
}

export interface AdItem {
  id: string;
  sponsor: string;
  title: string;
  description: string;
  url: string;
  keywords: string[];
  badgeColor?: string;
  callToAction: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  headline: string;
  subtitle: string;
  author: string;
  authorRole: string;
  date: string;
  category: 'Local' | 'National' | 'Tech' | 'Business' | 'Sports' | 'Opinion' | 'Culture' | 'Archive';
  readTime: string;
  leadParagraph: string;
  bodyParagraphs: string[];
  tags: string[];
  commentsCount: number;
  comments?: Array<{
    id: string;
    author: string;
    date: string;
    text: string;
    upvotes: number;
  }>;
}

export interface ForumPost {
  id: string;
  author: string;
  avatarText: string;
  role: string;
  postDate: string;
  content: string;
  likes: number;
  signature?: string;
  editedAt?: string;
}

export interface ForumThread {
  id: string;
  subforumId: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  isLocked?: boolean;
  isPinned?: boolean;
  tags: string[];
  posts: ForumPost[];
}

export interface SocialPost {
  id: string;
  author: string;
  handle: string;
  avatarColor: string;
  timeAgo: string;
  content: string;
  likes: number;
  reposts: number;
  commentsCount: number;
  tags?: string[];
  isLiked?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  duration: string;
  category: 'Tech' | 'Gaming' | 'Documentary' | 'Music' | 'News' | 'City';
  description: string;
  color: string;
  commentsCount: number;
  upvotes: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'Laptops' | 'Audio' | 'Keyboards' | 'Cameras' | 'Accessories';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  specs: Record<string, string>;
  description: string;
  badge?: string;
  color: string;
}

export interface MapLocation {
  id: string;
  name: string;
  category: 'Government' | 'Emergency' | 'Commercial' | 'Transit' | 'Food' | 'Park';
  address: string;
  district: string;
  x: number; // 0 - 100 percentage coordinates
  y: number; // 0 - 100 percentage coordinates
  description: string;
  icon: string;
  phone?: string;
}

export interface EmailAttachment {
  name: string;
  size: string;
  mimeType: string;
  downloadPath?: string;
  fileContent?: string;
}

export interface EmailMessage {
  id: string;
  fromName: string;
  fromEmail: string;
  toEmail: string;
  subject: string;
  date: string;
  body: string;
  folder: 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash';
  isRead: boolean;
  isStarred: boolean;
  attachments?: EmailAttachment[];
}

export interface WebsiteData {
  domain: string;
  name: string;
  category: string;
  icon: string;
  isHttps: boolean;
  themeColor?: string;
  pages: Record<string, {
    url: string;
    title: string;
    category?: string;
    content?: string;
    isCustomRenderer?: boolean;
    renderCustom?: () => any;
  }>;
}
