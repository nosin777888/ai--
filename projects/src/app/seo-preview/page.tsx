"use client";

import { useState } from "react";

// 旧数据（扣子编程默认）
const OLD = {
  title: "新应用 | 扣子编程",
  description:
    "扣子编程是一款一站式云端 Vibe Coding 开发平台。通过对话轻松构建智能体、工作流和网站，实现从创意到上线的无缝衔接。",
  url: "code.coze.cn",
  siteName: "扣子编程",
  ogTitle: "扣子编程 | 你的 AI 工程师已就位",
  ogDesc:
    "我正在使用扣子编程 Vibe Coding，让创意瞬间上线。告别拖拽，拥抱心流。",
  keywords: [
    "扣子编程",
    "Coze Code",
    "Vibe Coding",
    "AI 编程",
    "智能体搭建",
  ],
};

// 新数据（AI 绘本生成器）
const NEW = {
  title: "AI 绘本生成器 - 一键创作带插图的儿童绘本",
  description:
    "AI 绘本生成器：输入一个故事主题，AI 自动创作儿童故事并生成水彩风格插图。适合 3-6 岁儿童，支持自定义主题，一键生成完整绘本。",
  url: "你的域名",
  siteName: "AI 绘本生成器",
  ogTitle: "AI 绘本生成器 - 一键创作带插图的儿童绘本",
  ogDesc:
    "输入故事主题，AI 自动写故事、画水彩插图，生成专属儿童绘本。适合亲子阅读、睡前故事。",
  keywords: [
    "AI 绘本",
    "AI 绘本生成器",
    "儿童绘本生成",
    "睡前故事",
    "亲子阅读",
  ],
};

export default function SEOPreview() {
  const [showNew, setShowNew] = useState(true);
  const data = showNew ? NEW : OLD;

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* 标题区 */}
        <h1
          className="text-3xl md:text-4xl text-center mb-2"
          style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}
        >
          SEO 元数据对比预览
        </h1>
        <p className="text-center text-gray-500 mb-8">
          切换查看"旧版"和"新版"在 Google 搜索、社交媒体分享中的真实显示效果
        </p>

        {/* 切换按钮 */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setShowNew(false)}
            className={`px-6 py-3 rounded-xl text-lg font-medium transition-all cursor-pointer border-2 ${
              !showNew
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            旧版（扣子编程默认）
          </button>
          <button
            onClick={() => setShowNew(true)}
            className={`px-6 py-3 rounded-xl text-lg font-medium transition-all cursor-pointer border-2 ${
              showNew
                ? "bg-[#E8845C] text-white border-[#E8845C]"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            新版（AI 绘本生成器）
          </button>
        </div>

        {/* ============================================ */}
        {/* 模拟 Google 搜索结果 */}
        {/* ============================================ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔍</span> Google 搜索结果预览
          </h2>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
            {/* URL 行 */}
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  showNew ? "bg-[#E8845C]" : "bg-gray-600"
                }`}
              >
                {showNew ? "绘" : "扣"}
              </div>
              <span className="text-sm text-gray-500">{data.url}</span>
            </div>
            {/* 标题（蓝色链接） */}
            <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer mb-1 leading-snug">
              {data.title}
            </h3>
            {/* 描述 */}
            <p className="text-sm text-[#4d5156] leading-relaxed">
              {data.description}
            </p>
          </div>
        </section>

        {/* ============================================ */}
        {/* 模拟社交媒体分享卡片 */}
        {/* ============================================ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">💬</span> 社交媒体分享卡片预览
            <span className="text-sm text-gray-400 font-normal">
              （微信 / 微博 / Twitter）
            </span>
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 max-w-md">
            {/* 封面图占位 */}
            <div
              className={`w-full aspect-[1.91/1] flex items-center justify-center ${
                showNew
                  ? "bg-gradient-to-br from-[#FFF8F0] to-[#FDEBD0]"
                  : "bg-gradient-to-br from-gray-100 to-gray-200"
              }`}
            >
              <div className="text-center">
                <span className="text-5xl block mb-2">
                  {showNew ? "📖" : "💻"}
                </span>
                <span
                  className={`text-sm ${
                    showNew ? "text-[#E8845C]" : "text-gray-400"
                  }`}
                >
                  {showNew ? "水彩风格绘本插图" : "Vibe Coding 开发平台"}
                </span>
              </div>
            </div>
            {/* 卡片文字 */}
            <div className="p-4 bg-[#f0f0f0]">
              <p className="text-sm text-gray-500 mb-1">{data.url}</p>
              <h4 className="text-[#1d1d1f] font-semibold leading-snug mb-1">
                {data.ogTitle}
              </h4>
              <p className="text-sm text-[#86868b] leading-relaxed">
                {data.ogDesc}
              </p>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* 模拟 Twitter 分享卡片 */}
        {/* ============================================ */}
        {showNew && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-2xl">🐦</span> Twitter 分享卡片预览
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-normal">
                新增
              </span>
            </h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 max-w-md">
              {/* 封面图占位 */}
              <div className="w-full aspect-[2/1] flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] to-[#FDEBD0]">
                <div className="text-center">
                  <span className="text-5xl block mb-2">📖</span>
                  <span className="text-sm text-[#E8845C]">
                    summary_large_image 大图模式
                  </span>
                </div>
              </div>
              {/* 卡片文字 */}
              <div className="p-3 border-t border-gray-200">
                <p className="text-[#536471] text-sm mb-0.5">
                  {NEW.url}
                </p>
                <h4 className="text-[#0f1419] font-bold leading-snug">
                  {NEW.ogTitle}
                </h4>
                <p className="text-[#536471] text-sm leading-relaxed mt-0.5">
                  {NEW.ogDesc}
                </p>
              </div>
            </div>
          </section>
        )}

        {!showNew && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-2xl">🐦</span> Twitter 分享卡片
            </h2>
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-300 text-center max-w-md">
              <span className="text-4xl block mb-3">🚫</span>
              <p className="text-gray-500 text-lg">旧版没有配置 Twitter 卡片</p>
              <p className="text-gray-400 text-sm mt-1">
                分享到 Twitter 只会显示一个干巴巴的链接
              </p>
            </div>
          </section>
        )}

        {/* ============================================ */}
        {/* 关键词对比 */}
        {/* ============================================ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">🏷️</span> 关键词对比
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* 旧版关键词 */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">
                旧版关键词
              </h3>
              <div className="flex flex-wrap gap-2">
                {OLD.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-sm"
                  >
                    {kw}
                  </span>
                ))}
                <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-400 text-sm">
                  +5 个...
                </span>
              </div>
              <p className="text-xs text-red-400 mt-3">
                ❌ 搜"绘本""睡前故事"的用户找不到你
              </p>
            </div>
            {/* 新版关键词 */}
            <div
              className={`rounded-2xl p-5 border-2 ${
                showNew
                  ? "bg-[#FFF8F0] border-[#E8845C]/30"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-sm font-semibold mb-3 ${
                  showNew ? "text-[#E8845C]" : "text-gray-400"
                }`}
              >
                新版关键词
              </h3>
              <div className="flex flex-wrap gap-2">
                {NEW.keywords.map((kw) => (
                  <span
                    key={kw}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      showNew
                        ? "bg-[#E8845C]/10 text-[#E8845C]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {kw}
                  </span>
                ))}
                <span className="px-3 py-1.5 rounded-full bg-[#E8845C]/10 text-[#E8845C] text-sm">
                  +5 个...
                </span>
              </div>
              <p className="text-xs text-green-600 mt-3">
                ✅ 覆盖"绘本""睡前故事""亲子阅读"等搜索词
              </p>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* 完整对比表 */}
        {/* ============================================ */}
        <section>
          <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span> 完整改动清单
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 text-gray-500 font-medium w-28">
                    字段
                  </th>
                  <th className="text-left p-4 text-gray-500 font-medium">
                    旧版
                  </th>
                  <th className="text-left p-4 text-gray-500 font-medium">
                    新版
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <Row
                  label="title"
                  old={OLD.title}
                  newVal={NEW.title}
                />
                <Row
                  label="description"
                  old={OLD.description}
                  newVal={NEW.description}
                />
                <Row
                  label="keywords"
                  old={OLD.keywords.join("、")}
                  newVal={NEW.keywords.join("、") + "..."}
                />
                <Row
                  label="robots"
                  old="index + follow（最基础）"
                  newVal="index + follow + Google 大图预览 + 不限描述长度"
                  isNew
                />
                <Row
                  label="openGraph"
                  old={OLD.ogTitle}
                  newVal={NEW.ogTitle}
                />
                <Row
                  label="twitter"
                  old="未配置（注释掉了）"
                  newVal="summary_large_image + 标题 + 描述"
                  isNew
                />
                <Row
                  label="category"
                  old="无"
                  newVal="education"
                  isNew
                />
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

/** 表格行组件 */
function Row({
  label,
  old,
  newVal,
  isNew = false,
}: {
  label: string;
  old: string;
  newVal: string;
  isNew?: boolean;
}) {
  return (
    <tr>
      <td className="p-4 text-gray-500 font-mono text-xs align-top">
        {label}
        {isNew && (
          <span className="ml-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
            新增
          </span>
        )}
      </td>
      <td className="p-4 text-gray-400 align-top line-through decoration-gray-300">
        {old}
      </td>
      <td className="p-4 text-[#3D2B1F] align-top font-medium">{newVal}</td>
    </tr>
  );
}
