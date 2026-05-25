import { NextRequest, NextResponse } from "next/server";
import { LLMClient, ImageGenerationClient, Config, HeaderUtils } from "coze-coding-dev-sdk";

// ============================================================
// AI 绘本生成器 - 后端 API
// ============================================================
//
// 这个文件是整个应用的"厨房"：
//   1. 接收前端发来的"点菜单"（故事主题）
//   2. 让 LLM（编剧）写故事
//   3. 让图片生成模型（画师）画插图
//   4. 把成品端给前端（返回结果）
//
// ============================================================

// --- 第①部分：定义数据格式 ---
// 就像餐厅的菜单模板，规定了每道菜该有什么内容

/** 一页绘本的内容 */
interface StoryPage {
  text: string;        // 故事文字，如"清晨的森林里，小兔子醒来了"
  imagePrompt: string; // 给画师的画面描述，如"水彩风格，清晨森林，小兔子"
  imageUrl: string;    // 画师画完后的图片地址（最开始是空的，画完才填上）
}

/** 整本绘本的内容 */
interface Storybook {
  title: string;      // 绘本标题
  pages: StoryPage[]; // 所有页面
}

// --- 第②部分：创建 AI 客户端 ---
// 就像招聘员工，我们需要一个编剧（LLM）和一个画师（ImageGeneration）

/**
 * 创建 LLM 客户端 —— 我们的"编剧"
 * 
 * LLMClient 是 SDK 提供的工具类，封装了调用大语言模型的所有细节。
 * 我们只需要 new 一个出来，就能让它帮我们写故事了。
 * 
 * Config() 会自动从环境变量中读取 API 密钥等配置，不需要我们手动填写。
 * customHeaders 是从浏览器的请求中提取的头部信息，SDK 需要它来做身份验证。
 */
function createLLMClient(requestHeaders: Headers) {
  const config = new Config();
  const customHeaders = HeaderUtils.extractForwardHeaders(requestHeaders);
  return new LLMClient(config, customHeaders);
}

/**
 * 创建图片生成客户端 —— 我们的"画师"
 * 
 * ImageGenerationClient 也是 SDK 提供的工具类，专门用来生成图片。
 * 用法和 LLMClient 类似：传 Config 和 customHeaders 就行。
 */
function createImageClient(requestHeaders: Headers) {
  const config = new Config();
  const customHeaders = HeaderUtils.extractForwardHeaders(requestHeaders);
  return new ImageGenerationClient(config, customHeaders);
}

// --- 第③部分：让编剧写故事 ---
// 这是整个流程的第一步：把主题告诉 LLM，让它输出结构化的故事

/**
 * 调用 LLM 生成故事
 * 
 * @param theme  用户输入的故事主题，如"小兔子找妈妈"
 * @param client LLM 客户端
 * @returns 故事页面数组（文字 + 画面描述，但还没有图片）
 * 
 * 工作原理：
 *   我们给 LLM 一段"系统提示词"（system prompt），告诉它：
 *   "你是一个儿童绘本作家，请按照指定格式输出故事。"
 *   然后把用户的主题作为"用户消息"发给它。
 *   LLM 会返回一段 JSON 格式的文字，我们把它解析成 StoryPage 数组。
 */
async function generateStory(theme: string, client: LLMClient): Promise<StoryPage[]> {
  // ---- 构造提示词 ----
  // system 消息：告诉 LLM 它的角色和输出格式
  // user 消息：用户的具体需求
  const messages = [
    {
      role: "system" as const,
      content: `你是一位专业的儿童绘本作家。请根据用户给的主题，创作一个5页的儿童绘本故事。

要求：
1. 每页故事文字2-3句话，语言简单温暖，适合3-6岁儿童
2. 每页配上一段"画面描述"，用于AI生成插图
3. 画面描述要用英文，包含风格词"watercolor illustration style for children's storybook"
4. 画面描述要具体，包含角色外观、动作、场景细节、光线氛围

请严格用以下JSON格式输出，不要输出任何其他内容：
[
  {
    "text": "故事文字...",
    "imagePrompt": "英文画面描述..."
  }
]`,
    },
    {
      role: "user" as const,
      content: `请以"${theme}"为主题，创作一个5页的儿童绘本故事。`,
    },
  ];

  // ---- 调用 LLM ----
  // invoke() 是"非流式"调用：一次性等 LLM 写完再返回
  // （如果用 stream() 就是流式，像打字机一样一个个字蹦出来）
  // temperature 设为 0.9，让故事更有创意（0=保守，2=天马行空）
  const response = await client.invoke(messages, {
    temperature: 0.9,
  });

  // ---- 解析 LLM 返回的 JSON ----
  // LLM 返回的是一段文字，里面包含 JSON 数组
  // 我们需要把 JSON 提取出来
  const content = response.content;
  
  // 用正则表达式提取 JSON 数组部分
  // 因为 LLM 可能在 JSON 前后加一些废话，我们只取 [...] 部分
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("LLM 返回的内容无法解析为 JSON，原始内容：" + content);
  }

  // 把 JSON 字符串转成 JavaScript 对象
  const pages: StoryPage[] = JSON.parse(jsonMatch[0]).map(
    (page: { text: string; imagePrompt: string }) => ({
      text: page.text,
      imagePrompt: page.imagePrompt,
      imageUrl: "", // 图片还没生成，先空着
    })
  );

  return pages;
}

// --- 第④部分：让画师画插图 ---
// 故事文字有了，现在给每段画面描述生成一张插图

/**
 * 批量生成插图
 * 
 * @param pages  故事页面（已包含画面描述，但还没有图片）
 * @param client 图片生成客户端
 * @returns 填充了 imageUrl 的故事页面
 * 
 * 工作原理：
 *   我们把5段画面描述同时发给图片生成模型（并行处理），
 *   不用一张一张排队等，5张同时画，快很多！
 *   SDK 提供了 batchGenerate() 方法，就是专门干这个的。
 */
async function generateImages(
  pages: StoryPage[],
  client: ImageGenerationClient
): Promise<StoryPage[]> {
  // ---- 构造5个图片生成请求 ----
  // 每个请求包含：prompt（画面描述）+ size（图片大小）
  const requests = pages.map((page) => ({
    prompt: page.imagePrompt,
    size: "2K" as const, // 2K 分辨率，清晰够用
  }));

  // ---- 批量生成（5张并行） ----
  // batchGenerate() 会同时发出所有请求，谁先画完谁先返回
  const responses = await client.batchGenerate(requests);

  // ---- 把图片 URL 填回故事页面 ----
  const updatedPages = pages.map((page, index) => {
    const helper = client.getResponseHelper(responses[index]);
    // helper.success 表示这张图画成功了
    // helper.imageUrls[0] 就是第一张图的 URL
    if (helper.success && helper.imageUrls.length > 0) {
      return { ...page, imageUrl: helper.imageUrls[0] };
    }
    // 如果画失败了，imageUrl 保持为空字符串
    console.error(`第${index + 1}页插图生成失败:`, helper.errorMessages);
    return page;
  });

  return updatedPages;
}

// --- 第⑤部分：组装完整的 API 处理函数 ---
// 这是后端的"主菜"，把前面的步骤串起来

/**
 * POST /api/generate-storybook
 * 
 * 完整流程：
 *   前端发来 { theme: "小兔子找妈妈" }
 *   → 后端调用 LLM 写故事
 *   → 后端调用图片生成画插图
 *   → 后端返回 { title, pages: [{ text, imageUrl }] }
 */
export async function POST(request: NextRequest) {
  try {
    // ---- 1. 从请求中读取主题 ----
    const body = await request.json();
    const theme = body.theme as string;

    // 检查主题是否为空
    if (!theme || theme.trim() === "") {
      return NextResponse.json(
        { error: "请输入故事主题" },
        { status: 400 }
      );
    }

    console.log(`[绘本生成器] 收到请求，主题：${theme}`);

    // ---- 2. 创建 AI 客户端 ----
    const llmClient = createLLMClient(request.headers);
    const imageClient = createImageClient(request.headers);

    // ---- 3. 第一步：让 LLM 写故事 ----
    console.log("[绘本生成器] 正在让 LLM 写故事...");
    const pages = await generateStory(theme, llmClient);
    console.log(`[绘本生成器] 故事写好了，共 ${pages.length} 页`);

    // ---- 4. 第二步：让图片模型画插图 ----
    console.log("[绘本生成器] 正在生成插图...");
    const pagesWithImages = await generateImages(pages, imageClient);
    console.log("[绘本生成器] 插图全部生成完毕");

    // ---- 5. 返回结果给前端 ----
    const storybook: Storybook = {
      title: theme,
      pages: pagesWithImages,
    };

    return NextResponse.json(storybook);
  } catch (error) {
    // 如果任何一步出错，返回错误信息
    console.error("[绘本生成器] 生成失败:", error);
    const message = error instanceof Error ? error.message : "生成绘本时发生未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
