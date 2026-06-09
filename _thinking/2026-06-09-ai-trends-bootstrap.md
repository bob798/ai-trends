---
date: 2026-06-09
type: process-log
status: preserved
description: ai-trends 仓库从 0 到 3 个 signals + 1 个 theme 的完整问题驱动过程
---

# ai-trends 仓库启动过程的"思考考古"

> **为什么保留这份文件**：决定的合理性不是看结论漂不漂亮，而是看推到结论的问题链是否清晰。这份记录是为了让我（或别人）半年后回来时，不只看到 signals 和 themes，还能看到**当时是从什么问题出发、走了哪几步、为什么是这几步**。本仓库的所有重大节点都该有这样一份"考古笔记"。

---

## 原始问题清单（一字不改，按时间顺序）

| # | 时间 | 我的原话 |
|---|------|---------|
| Q1 | 2026-06-09 | "拆解下这期博客" + Y Combinator Startup Podcast 链接 |
| Q2 | 2026-06-09 | "我要沉淀一个ai 趋势分析的知识库，你有什么建议，是新的仓库 还是老的仓库" |
| Q3 | 2026-06-09 | "ai-trends" （仓库命名选择） |
| Q4 | 2026-06-09 | "你直接创建 github repo；我怎么用ob 管理这些github repo" |
| Q5 | 2026-06-09 | "下载你推荐的ob插件" |
| Q6 | 2026-06-09 | "上篇拆解疑问：P&L是什么，方差控制是什么意思；ob下载的插件 其他valut 能用么" |
| Q7 | 2026-06-09 | "拆解：How To Build Superintelligence Inside Your Company" |
| Q8 | 2026-06-09 | "do all; 找下是否有类似的开源项目了" |
| Q9 | 2026-06-09 | "提交到仓库，保留原始的问题清单，作为思考；这是和 gpt的对话..." |

## 问题链的形状

```
Q1 拆解一期播客
   │
   ▼ 拆解完发现这种短篇高频内容没有合适的家
Q2 建知识库？放老仓库还是新仓库？
   │
   ▼ "公开资产 + 还没成型习惯" 两个约束 → 强烈推荐新仓库
Q3 选仓库名（ai-trends vs ai-signals vs notes）
   │
   ▼ 选了 ai-trends
Q4 落地：建 GitHub repo + 工具问题（怎么用 Obsidian 管多仓库）
   │
   ▼ 设计：vault 在 my-assistant/ 层级，跨多 repo，配置在 repo 之外
Q5 工具补全：下载推荐的插件
   │
   ▼ 4 个插件直接 curl 到 .obsidian/plugins/
Q6 概念回填（P&L、方差控制） + 插件跨 vault 复用
   │
   ▼ 巩固上一条 signal 的理解
Q7 第二期拆解
   │
   ▼ 内容比第一期厚 4 倍，引出更多衍生话题
Q8 do all（保存 signal #2 + 建 theme + 拆解 Horseless Carriages 原文 + 找 OSS 对标）
   │
   ▼ 一次产出 4 件事；OSS 对标揭示了 Layer 1 是开源空白
Q9 → 这份文件本身
```

**这条链最有意思的拐点**是 Q2——从"拆解一期播客"自然演化到"我需要一个知识库"。这暗示了一个判断：**单条优质内容如果没有归宿，它的价值会衰减得很快**。仓库的存在意义是让一次性的拆解变成可累积资产。

---

## 关键决策与未选的路

| 决策点 | 选了什么 | 没选什么 | 为什么 |
|--------|---------|---------|--------|
| 仓库位置 | 新独立 repo | 加到 `analyses/` 子目录 | 工作流差异大；公开资产需要独立 URL |
| 仓库可见性 | 公开 | 私有 | 用户明确"从一开始就是公开资产"；公开 = 习惯锚点 |
| Obsidian vault 层级 | `my-assistant/` 层级 | 每个 repo 一个 vault | 跨 repo 全局搜索 + graph view 才有真正价值 |
| Wikilinks vs 标准 MD 链接 | 标准 MD（关闭 wikilinks） | Wikilinks | 公开仓库读者在 GitHub 看到 `[[...]]` 会是乱码 |
| Obsidian Git 插件 | 不装 | 装 | 多 repo 场景支持差，且自动 push 草稿对公开仓库危险 |
| 插件安装方式 | 手动 curl 到 `.obsidian/plugins/` | UI 安装 | 用户问"下载"——直接下，省 UI 操作；后续更新仍走 Obsidian 自带渠道 |
| Signal #2 拆解粒度 | 章节级表格 + 4 个框架 + 反方观点 | 时间轴流水账 | 用户偏好结构化笔记，已存 memory |
| 同时拆 Horseless Carriages | 拆了 | 不拆 | 上下游思想链断了，theme 不完整；机会窗口在场就拆 |
| OSS 对标深度 | 按 4 层架构对照真实 GitHub 项目 | 信 SEO listicle 的数字 | 多个 listicle 给的 star 数（如 347K）明显是 AI 内容农场吹的，不能采信 |
| 数据来源验证 | gh CLI 直接查 + 标注"已验证"/"待验证" | 不验证 | 用户偏好诚实标注信息边界，已存 memory |

---

## 未解决但被记录的问题（值得 follow-up）

1. **G-Brain Layer 1 是否会出开源标准？** 见 [themes/ai-native-org.md](../themes/ai-native-org.md)
2. **Dream Cycle 的工程化可靠性**——目前 OSS 都是"声称做了"，没有公开 evals
3. **YC W26/S26 batch 里 AI-native services 公司数量**——预测验证窗口
4. **System Prompt 编辑权下放到 C 端**会不会成主流——监控 Notion AI / Cursor / Claude Projects
5. **方差控制的工程化方法**——节目暗示但没展开，OSS 几乎空白（可能是机会信号）

---

## 交叉引用：和 ChatGPT 的并行研究

**问题**：列出你查到的相似的 GitHub 仓库

**ChatGPT 对话链接**：https://chatgpt.com/?prompt=列出你查到的相似的github仓库&share_source=prompt_link_button&share_id=0b3e50b5-7b4b-451b-97de-8508f5087f08

**说明**：
- 该链接通过 WebFetch 抓取返回 403（ChatGPT 的 share 页面对未登录请求关闭）
- 因此**这边的 OSS landscape 是 Claude 独立完成的**，没有用 GPT 的结果做交叉验证
- 未来如果用户能从 ChatGPT 复制内容粘进来，可以放进本文件做对比，看两个模型的研究方向有无系统性差异

**为什么记录这个**：
- 跨模型对照是研究质量的一种验证方式（看是否得到相似结论）
- 即使这次没拿到 GPT 那边的回答，**记下"曾经做过这次对照尝试"** 也有价值——未来同主题再研究时知道该补什么

---

## 这份文件的元规则（约束未来同类记录）

如果以后要写第二份 `_thinking/` 文件，沿用这个结构：

1. **原始问题清单**：用户的原话，按时间顺序，不修饰
2. **问题链的形状**：用 ASCII 流程图画出"问题 A 怎么自然引出问题 B"
3. **关键决策与未选的路**：每个决策点都列出"选了 X，没选 Y，为什么"
4. **未解决的开放问题**：明确记录 follow-up 列表
5. **交叉引用**：如果有平行研究（GPT、Gemini、其他人），记下链接和差异

**不要写**：进度日志（"今天做了 X"）、感想（"觉得很有意思"）、未来计划（那是 README/themes 的事）。`_thinking/` 是用来记**问题驱动的考古**，不是记日记。
