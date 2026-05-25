import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

// 引入儿童友好字体
const fontLink = (
  <link
    href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap"
    rel="stylesheet"
  />
);

export const metadata: Metadata = {
  // ---- 网页标题 ----
  // default: 直接访问首页时显示的标题
  // template: 子页面用，%s 会被替换成子页面的标题
  title: {
    default: 'AI 绘本生成器 - 一键创作带插图的儿童绘本',
    template: '%s | AI 绘本生成器',
  },

  // ---- 网页描述 ----
  // Google 搜索结果里标题下面那行灰字，影响用户是否点击
  // 要包含核心关键词，控制在 120-160 个字符
  description:
    'AI 绘本生成器：输入一个故事主题，AI 自动创作儿童故事并生成水彩风格插图。适合 3-6 岁儿童，支持自定义主题，一键生成完整绘本。',

  // ---- 关键词 ----
  // 帮助搜索引擎理解页面主题
  keywords: [
    'AI 绘本',
    'AI 绘本生成器',
    '儿童绘本生成',
    'AI 故事生成',
    '儿童故事创作',
    '绘本制作',
    'AI 画插图',
    '儿童阅读',
    '亲子阅读',
    '睡前故事',
  ],

  // ---- 作者信息 ----
  authors: [{ name: 'AI 绘本生成器' }],

  // ---- 网站创建者 ----
  creator: 'AI 绘本生成器',

  // ---- 发布者 ----
  publisher: 'AI 绘本生成器',

  // ---- 机器人抓取规则 ----
  // index: 允许 Google 收录这个页面
  // follow: 允许 Google 跟踪页面上的链接
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ---- Open Graph：社交媒体分享卡片 ----
  // 当你把网址贴到微信、微博、Twitter 时显示的卡片
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    title: 'AI 绘本生成器 - 一键创作带插图的儿童绘本',
    description:
      '输入故事主题，AI 自动写故事、画水彩插图，生成专属儿童绘本。适合亲子阅读、睡前故事。',
    siteName: 'AI 绘本生成器',
  },

  // ---- Twitter 专用分享卡片 ----
  twitter: {
    card: 'summary_large_image',
    title: 'AI 绘本生成器 - 一键创作带插图的儿童绘本',
    description:
      '输入故事主题，AI 自动写故事、画水彩插图，生成专属儿童绘本。',
  },

  // ---- 分类 ----
  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN">
      <head>
        {fontLink}
      </head>
      <body className="antialiased bg-[#FFF8F0]">
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
