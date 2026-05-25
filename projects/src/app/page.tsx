"use client";

// ============================================================
// AI 绘本生成器 - 前端页面
// ============================================================
//
// 这个文件是用户看到的"舞台"：
//   1. 一个输入框：让用户输入故事主题
//   2. 一个按钮：点击后开始生成
//   3. 一个绘本展示区：生成完后，翻页浏览绘本
//
// 前端和后端的分工：
//   前端 = 只负责"展示"和"收集用户输入"
//   后端 = 负责"调用大模型"和"处理数据"
//   前端不会直接调用大模型，而是通过 API 请求把活交给后端
//
// ============================================================

import { useState } from "react";

// --- 定义数据格式（和后端保持一致） ---

/** 一页绘本 */
interface StoryPage {
  text: string;
  imagePrompt: string;
  imageUrl: string;
}

/** 整本绘本 */
interface Storybook {
  title: string;
  pages: StoryPage[];
}

// ============================================================
// 主组件：StorybookGenerator
// ============================================================
// React 组件就像一个"模具"，数据填进去就变成页面
// "use client" 表示这个组件在浏览器端运行（因为有点击事件等交互）

export default function StorybookGenerator() {
  // ---- 状态管理 ----
  // useState 就像给组件装了几个"记忆槽"，数据变了页面自动更新

  const [theme, setTheme] = useState("");           // 用户输入的故事主题
  const [isLoading, setIsLoading] = useState(false); // 是否正在生成中
  const [storybook, setStorybook] = useState<Storybook | null>(null); // 生成好的绘本
  const [currentPage, setCurrentPage] = useState(0); // 当前翻到第几页
  const [error, setError] = useState("");            // 错误信息

  // ---- 核心：点击"生成绘本"按钮后发生了什么？ ----
  //
  // 这个函数是前端和后端的"桥梁"：
  //   1. 把用户输入的主题发给后端
  //   2. 后端调用 LLM + 图片生成，返回绘本数据
  //   3. 前端拿到数据，更新页面展示
  //
  const handleGenerate = async () => {
    // 防止空输入
    if (!theme.trim()) return;

    // 开始加载状态：显示"正在生成"，禁用按钮
    setIsLoading(true);
    setError("");
    setStorybook(null);
    setCurrentPage(0);

    try {
      // ========================================
      // 这行就是前端调后端的关键！
      //
      // fetch() 是浏览器自带的发请求工具
      // - 第一个参数：后端地址 /api/generate-storybook
      // - method: "POST" 表示我们要"提交数据"
      // - headers 告诉后端我们发的是 JSON 格式
      // - body 里是我们提交的数据：{ theme: "小兔子找妈妈" }
      //
      // 这就像你给餐厅递了一张点菜单！
      // ========================================
      const response = await fetch("/api/generate-storybook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: theme.trim() }),
      });

      // 解析后端返回的 JSON 数据
      const data = await response.json();

      // 检查后端是否返回了错误
      if (!response.ok) {
        throw new Error(data.error || "生成失败，请重试");
      }

      // 成功！把绘本数据存入状态，页面会自动更新显示
      setStorybook(data as Storybook);
    } catch (err) {
      // 如果出错（网络问题、后端报错等），显示错误信息
      const message = err instanceof Error ? err.message : "生成时发生未知错误";
      setError(message);
    } finally {
      // 无论成功还是失败，都关闭加载状态
      setIsLoading(false);
    }
  };

  // ---- 翻页逻辑 ----
  const goNext = () => {
    if (storybook && currentPage < storybook.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goPrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // ---- 渲染页面 ----
  // 下面是 JSX：一种在 JavaScript 里写 HTML 的语法
  // {} 里面可以写 JavaScript 表达式，比如变量、函数调用

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center px-4 py-8">
      {/* ===== 顶部标题区 ===== */}
      <header className="text-center mb-8">
        <h1
          className="text-4xl md:text-5xl text-pink-500 mb-3"
          style={{ fontFamily: "'Fredoka One', cursive, 'Comic Sans MS', sans-serif" }}
        >
          AI 绘本生成器
        </h1>
        <p className="text-[#8B7355] text-lg">
          输入一个故事主题，AI 帮你写故事、画插图，生成一本专属绘本
        </p>
      </header>

      {/* ===== 输入区域 ===== */}
      {/* 这就是用户输入主题的地方 */}
      <div className="w-full max-w-xl mb-10">
        <div className="flex gap-3">
          {/* 输入框 */}
          <input
            type="text"
            value={theme}                        // 输入框的内容 = theme 变量的值
            onChange={(e) => setTheme(e.target.value)}  // 用户打字时更新 theme
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}  // 按回车也能提交
            placeholder="输入故事主题，如：小兔子找妈妈"
            disabled={isLoading}                 // 生成中禁用输入
            className="flex-1 px-5 py-3 rounded-xl border-2 border-[#E8DDD0] bg-[#FFFDF7]
                       text-[#3D2B1F] text-lg placeholder-[#C4B5A4]
                       focus:outline-none focus:border-[#E8845C] focus:ring-2 focus:ring-[#E8845C]/20
                       transition-all disabled:opacity-50"
          />
          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}             // 点击时触发生成
            disabled={isLoading || !theme.trim()}  // 加载中或没输入时禁用
            className="px-7 py-3 rounded-xl bg-purple-300 text-purple-900 text-lg font-medium
                       hover:bg-purple-400 active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all cursor-pointer"
            style={{ fontFamily: "'Fredoka One', cursive, 'Comic Sans MS', sans-serif" }}
          >
            {isLoading ? "生成中..." : "生成绘本"}
          </button>
        </div>
      </div>

      {/* ===== 加载状态 ===== */}
      {/* 生成中显示的动画提示 */}
      {isLoading && (
        <div className="flex flex-col items-center gap-4 py-16">
          {/* 脉冲动画的小书本图标 */}
          <div className="text-6xl animate-bounce">📖</div>
          <p className="text-[#8B7355] text-lg">
            AI 正在为你创作绘本，请稍候...
          </p>
          <p className="text-[#C4B5A4] text-sm">
            编剧正在写故事，画师正在画插图，大约需要 20-30 秒
          </p>
        </div>
      )}

      {/* ===== 错误提示 ===== */}
      {error && (
        <div className="w-full max-w-xl p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* ===== 绘本展示区 ===== */}
      {/* 生成完成后，显示翻页式绘本 */}
      {storybook && storybook.pages.length > 0 && !isLoading && (
        <div className="w-full max-w-2xl">
          {/* 绘本标题 */}
          <h2
            className="text-3xl text-center text-[#3D2B1F] mb-6"
            style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}
          >
            《{storybook.title}》
          </h2>

          {/* 当前页内容 */}
          <div className="bg-[#FFFDF7] rounded-2xl shadow-lg border border-[#E8DDD0] overflow-hidden">
            {/* 插图区域 */}
            <div className="relative w-full aspect-[4/3] bg-[#F5EDE3]">
              {storybook.pages[currentPage].imageUrl ? (
                // 有图片：显示图片
                <img
                  src={storybook.pages[currentPage].imageUrl}
                  alt={`第${currentPage + 1}页插图`}
                  className="w-full h-full object-cover"
                />
              ) : (
                // 没有图片（生成失败）：显示占位
                <div className="w-full h-full flex items-center justify-center text-[#C4B5A4]">
                  <span className="text-6xl">🎨</span>
                </div>
              )}
            </div>

            {/* 故事文字区域 */}
            <div className="p-6 md:p-8">
              <p
                className="text-xl md:text-2xl leading-relaxed text-[#3D2B1F] text-center"
                style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
              >
                {storybook.pages[currentPage].text}
              </p>
            </div>
          </div>

          {/* 翻页控制 */}
          <div className="flex items-center justify-between mt-6">
            {/* 上一页按钮 */}
            <button
              onClick={goPrev}
              disabled={currentPage === 0}
              className="px-5 py-2.5 rounded-xl bg-[#FFFDF7] border border-[#E8DDD0]
                         text-[#3D2B1F] hover:bg-[#F5EDE3]
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all cursor-pointer"
            >
              ← 上一页
            </button>

            {/* 页码指示器 */}
            <div className="flex gap-2">
              {storybook.pages.map((_, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer
                    ${index === currentPage
                      ? "bg-[#E8845C] scale-125"
                      : "bg-[#E8DDD0] hover:bg-[#D4C4B0]"
                    }`}
                />
              ))}
            </div>

            {/* 下一页按钮 */}
            <button
              onClick={goNext}
              disabled={currentPage === storybook.pages.length - 1}
              className="px-5 py-2.5 rounded-xl bg-[#FFFDF7] border border-[#E8DDD0]
                         text-[#3D2B1F] hover:bg-[#F5EDE3]
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all cursor-pointer"
            >
              下一页 →
            </button>
          </div>

          {/* 页码文字 */}
          <p className="text-center text-[#C4B5A4] mt-3">
            第 {currentPage + 1} 页 / 共 {storybook.pages.length} 页
          </p>
        </div>
      )}
    </div>
  );
}
