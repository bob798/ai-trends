---
title: "AI Horseless Carriages (Pete Koomen)"
date: 2025-04-01  # 估算，原文未给精确日期
captured: 2026-06-09
source: https://koomen.dev/essays/horseless-carriages/
source_type: blog
source_name: koomen.dev
speakers: [Pete Koomen]
tags: [ai-product-design, ai-native, system-prompt]
signal_strength: strong
status: published
notes: 原文日期为估算（基于上下游引用 + Gmail AI 助手 2024-2025 事件）
---

# 一句话核心

> **大多数 AI 应用是"无马马车"——把 AI 硬塞进按"人去做枯燥工作"设计的旧界面里。真正的 AI 原生软件应该让用户编辑 System Prompt，让大多数 AI 应用变成"智能体构建器"而非"预制智能体"。**

# 为什么这是个信号

这是 YC Pete Koomen 在 2026-05-27 那期 Lightcone 反复引用的核心论文，**理解它是看懂 YC 内部 AI 基础设施战略的前提**。它把"AI-native 产品"从一个营销词升级成有明确技术含义的设计哲学：**谁编辑 System Prompt，谁就是产品的真正主人**。

# 核心论点

## 论证链条

```
1. Gmail 加 Gemini 的方式很别扭：
   用户的 prompt 写得比生成出来的邮件还长 → 没省时间反倒费时
       ↓
2. 根因不是模型不行，是产品形态错了：
   Gmail 团队把 AI 当一个按钮加到原有界面上 → 模型被旧界面"困住"
       ↓
3. 旧界面的核心假设：
   开发者写代码、用户提供输入 → 单向关系
       ↓
4. AI 时代的正确假设：
   开发者提供 System Prompt 的编辑能力 + 工具层 + 安全边界
   用户编辑 System Prompt → 教会模型怎么代表自己工作
       ↓
5. 类比汽车早期：
   1803 年的蒸汽车还用木座椅、没悬挂——新动力源被困在旧形制里
   今天的 AI 应用 = 当年的"无马马车"
       ↓
6. 重新分配权力：
   "Render unto the user what is the user's, and unto the developer what is the developer's"
   开发者负责工具、UI、安全；用户负责行为指令（System Prompt）
       ↓
7. 终极愿景：
   大多数 AI 应用应是"智能体构建器"而非智能体本身
   AI-native software = 教电脑做我们不喜欢的事，让我们专注喜欢的工作
```

# 核心比喻：Horseless Carriages（无马马车）

| 维度 | 1803 年蒸汽车 | 今天的 AI 应用 |
|------|--------------|---------------|
| **新动力源** | 蒸汽机 | LLM |
| **旧形制残留** | 木座椅、无悬挂、马车造型 | 按"人做枯燥事"设计的 UI、单一固定 prompt |
| **设计错误** | 把蒸汽机塞进马车，没重新想象车 | 把 LLM 塞进 Gmail，没重新想象邮件 |
| **正确路径** | 重新发明汽车（流线型、悬挂、内燃机） | 重新发明软件（用户控 prompt、Just-in-Time Software） |

# 关键概念

- **System Prompt**：定义行为的通用指令（"你是一个写邮件助手，规则如下..."）。开发视角等价于"函数定义"。
- **User Prompt**：具体任务描述（"帮我回复张三说我明天不去"）。开发视角等价于"函数输入"。
- **AI Slop**：LLM 生成的冗长、形式化、非个性化文本——**根因不是模型差，是 System Prompt 没被用户控制**。
- **Agent Builder**：让用户编辑 System Prompt 的应用，比"预制好的 agent"价值高得多。

# 金句

> "Gemini 是一个极其强大的模型，完全有能力写好邮件。遗憾的是，Gmail 团队设计的应用阻止了它做到这一点。"

> "大多数 AI 应用应该是智能体构建器，而不是智能体本身。"

> "当 LLM 代表我行动时，我应被允许通过编辑 System Prompt 来教导它。"

> "Render unto the user what is the user's, and unto the developer what is the developer's." —— 借用《圣经》表达权力重分配

# 我的延展

## 对产品/设计的启示

1. **"AI-native 产品" = 用户可以编辑 System Prompt 的产品**——这是 Pete 给的最尖锐定义。**用这个标准看你公司的 AI 功能：用户能不能改 System Prompt？如果不能，就是无马马车。**
2. **大多数 ChatGPT-style "AI app" 都活在马车阶段**——它们提供预制 agent（"邮件助手 GPT"、"营销文案 GPT"），但不让用户改 System Prompt。Pete 的论点是：**这种形态会被淘汰**。
3. **"Agent Builder" 是更大的市场**：让用户配置/构建自己的 agent，比卖给他们一个预制 agent，市场规模大一个数量级。

## 对 AI 工程师的启示

1. **重新审视你的 prompt 边界**——你产品里哪些 prompt 是"业务硬编码的"，哪些是"用户可编辑的"？Pete 主张后者应该最大化。
2. **System Prompt 即产品**：未来 AI 产品的"功能"不在代码里，而在 System Prompt 模板 + 用户编辑能力。这意味着**版本控制和测试体系要重写**。
3. **工具层 + 安全层是开发者的护城河**：用户编 System Prompt，但调用什么外部 API、有什么访问权限、安全约束在哪里——这些仍是开发者的领域。"用户编 prompt + 开发者控工具"是新的分工。

## 反方观点 / 盲点

1. **"让用户写 System Prompt" 在 C 端基本不可能**：普通用户连密码都不愿设置，让他们写"你是一个 X，规则是 Y..."的 prompt？Pete 默认了用户是 power user。
2. **预制 agent 也有市场**——很多用户要的就是"开箱即用"，不是"自己配"。Pete 的论点对的是 power user 市场，不是 mass market。
3. **System Prompt 的可控性是双刃剑**——用户能改，意味着 jailbreak / prompt injection 风险也下移。Pete 没充分讨论这个新型攻击面。
4. **"AI-native" 这个词正在被滥用**——Pete 给的定义很硬，但 marketing 团队会稀释它。3 年后大概所有 AI 公司都会自称 "AI-native"，但只有少数符合 Pete 的定义。

# 关联信号

- 下游应用：[2026-05-27-yc-superintelligence-inside.md](2026-05-27-yc-superintelligence-inside.md) - YC 内部架构是这套哲学的落地
- 姐妹概念：Just-in-Time Software（在上一条信号里展开）
- 主题：[../themes/ai-native-org.md](../themes/ai-native-org.md)

# 元信息

- 投入时间：~30 分钟
- 是否值得二次阅读：是。每隔半年回看一次，对照"我的产品有没有变成无马马车"
- 跟进动作：监控哪些主流产品开始让用户编辑 System Prompt（Notion AI? Cursor? Claude Projects？）
