---
title: YC Requests for Startups — Summer 2026（15 个方向）
date: 2026-04            # RFS 发布于 2026-04 下旬（第三方报道集中在 04-28 前后，YC 官网原文日期未能直接验证）
captured: 2026-06-12
source: https://www.ycombinator.com/rfs
source_type: blog
source_name: Y Combinator RFS
speakers: [YC Partners, Diana Hu]
tags: [yc-rfs, agent-infrastructure, hard-tech]
signal_strength: strong
status: published
---

# 一句话核心

> **YC 用 15 个方向宣告："做一个 AI 工具"的窗口关闭了——下一波在 agent 基础设施（软件、接口、芯片、公司大脑）和 AI 进入物理世界（半导体供应链、农业、国防、太空）。**

# 为什么这是个信号

RFS 是 YC 唯一的"主动出题"机制：它不是观察趋势，是**用 $500K 支票制造趋势**。Summer 2026 这期有两个史无前例的特征：(1) 没有一条是"AI 应用/copilot"——agent 基础设施和硬科技占满全部 15 席；(2) YC 在多个条目里明确给出论断式判断（"SaaS 的护城河没了"、"下一个万亿用户是 agent 不是人"）。这是 YC 第一次把"软件本身贬值"写进官方文件。

# 核心观点

15 个方向按内在逻辑聚成 4 簇：

## 簇 1：Agent 基础设施（5/15，最重的注）

| 方向 | 核心论断 |
|------|---------|
| **Software for Agents** | 下一个万亿用户是 AI agent。现在的 agent 在笨拙地模拟人类点按钮——需要为机器重建 API、文档、CLI、身份、权限、支付的全套协议 |
| **Dynamic Software Interfaces** | 用户会用 coding agent 把软件改造成自己的形状：同一个邮件客户端，有人改成任务列表，有人改成日历。底层原语共享，最终界面由用户自己的 agent 塑形 |
| **Company Brain** | 把散落在老员工脑中、Slack 历史、工单里的公司知识抽取、结构化、保持更新，变成 **AI 可执行的 skills file**——一张"公司如何运转"的活地图 |
| **The AI Operating System for Companies** | 企业自动化的瓶颈不是模型能力，是**领域知识的极度碎片化**。Diana Hu 署名（她在本期挂名 3 条，是押注最重的合伙人） |
| **Inference Chips for Agent Workflows** | Agent 不是 prompt-in/response-out，是循环：调工具、分支、回溯、跨几十步持上下文。现有 GPU 在这种 bursty 负载下只有 30–40% 利用率。需要为 agent loop 设计的芯片：快速模型切换、原生投机解码、跨执行图持久化的 KV cache |

## 簇 2：重做软件与服务（3/15）

| 方向 | 核心论断 |
|------|---------|
| **SaaS Challengers** | 点名靶子：ERP、芯片设计软件（EDA）、工业控制、供应链管理——收费最贵、创新最少的品类。论据：AI 把软件生产成本压低 10–100 倍，"几十年积累的百万行代码"这条护城河没了，5 人团队能在特定工作流上反超巨头 |
| **AI-Native Service Companies** | 不卖软件、直接交付服务（保险经纪、会计税务审计、合规、医疗行政）——连续第 4 期 RFS 出现，是最稳的共识 |
| **Startups That Want to Sell to Huge Companies** | 配套方向：AI-native 新公司要能切进大企业采购 |

## 簇 3：AI 进入物理世界（5/15）

| 方向 | 核心论断 |
|------|---------|
| **Supply Chain 2.0 for Semiconductors** | 一颗先进 AI 芯片要经过约 1,400 道工序、跨十几个国家、耗时 5 个月——这条供应链现在靠 Excel、SAP 和电话管理 |
| **Hardware Supply Chain** | 同上逻辑泛化到整个硬件业 |
| **AI for Low-Pesticide Agriculture** | 现代农业跑在化学品上；农药残留无处不在，AI+机器人精准除草/施药是替代路径 |
| **Counter-Swarm Defense** | 反无人机蜂群防御 |
| **AI Personalized Medicine** | 个性化医疗 |

## 簇 4：太空（2/15）

| 方向 | 核心论断 |
|------|---------|
| **Electronics in Space** | 太空中的推理芯片/电子设备市场会"绝对巨大" |
| **Industrial Capabilities in Space** | 月球原位资源利用：电解提取硅/铝/铁/钛，熔融月壤 3D 打印 |

# 可复用框架

## "AI 离开聊天框"的四步迁移（贯穿全期 RFS 的隐含框架）

```
copilot → agent          （从辅助人到替代人）
software → service       （从卖工具到交付结果）
chat 界面 → company OS   （从单点对话到组织级运转）
digital → physical       （从比特到原子：芯片/农业/国防/太空）
```

任何一个 AI 产品/职业定位，都可以用"我在这四步迁移的哪一级"来自检。

# 金句

> "The next trillion users are not people but AI agents."

> （SaaS Challengers）"The moat that protected legacy SaaS — millions of lines of code built over decades — is gone."

> （AI OS）"企业自动化的主要障碍不是模型能力，而是领域知识的极度碎片化。"

# 我的延展

- **对本仓库最大的回响**：**Company Brain + AI OS for Companies 把 [ai-native-org](../themes/ai-native-org.md) 主题里推断出的"组织记忆是新资产"从推断变成了 YC 官方 RFS**。我们 6 月 9 日标记的 "Decision Memory / Layer 1 是开源空白"——YC 现在用 $500K/家在公开征人填这个空白。这条主题的置信度大幅上调。
- **Dynamic Software Interfaces ≈ Horseless Carriages 的官方化**：Pete Koomen（YC 合伙人）2025-04 的个人论点（"用户应能编辑 System Prompt"）一年后变成了 RFS 条目（"用户用自己的 agent 塑形软件界面"）。个人博客 → 官方 RFS 的传导路径值得记住：**YC 合伙人的个人发文是 RFS 的 6–12 个月先行指标**。
- **对纯软件从业者的不舒服结论**：15 席里软件应用为零。如果你的技能栈 100% 在"写 Web 应用"，YC 认为你的产出物正在通缩。两条出路：往下走（agent 协议层、芯片）或往外走（与物理世界交界的软件：供应链、制造、国防）。
- **反对意见 / 盲点**：
  - RFS 有营销成分：YC 需要差异化故事吸引申请者，"硬科技转向"可能夸大了它实际的投资分布（W26 batch 实际仍以 B2B 软件为主，见 [W26 demo day 信号](2026-03-26-yc-w26-demo-day.md)）。**说的方向和投的方向有时差，甚至有缺口。**
  - "GPU 在 agent 负载下 30–40% 利用率"这个数字出自 Diana Hu 的条目描述，没有公开 benchmark 支撑，引用需谨慎。
  - 太空/国防两簇对绝大多数 AI 从业者不可执行（资本密度、许可证、周期），列入是为了完整性，不代表机会均等。

# 关联信号

- [[2026-03-26-yc-w26-demo-day]]（同期批次数据：RFS 说的 vs batch 投的）
- [[2026-06-03-yc-ai-native-services]]（AI-native services 的播客版完整论证）
- [[2026-05-27-yc-superintelligence-inside]]（Company Brain 的 YC 内部实践版：G-Brain）
- [[2025-04-koomen-horseless-carriages]]（Dynamic Software Interfaces 的思想源头）

# 元信息

- 投入时间：~50 分钟（多源交叉检索 + 拆解；YC 官网反爬，原文未能直接获取，内容由 6+ 个第三方来源交叉还原——TheNextWeb、Superframeworks、Epsilla、VC Corner、openfor.co、urbangeekz）
- 是否值得二次阅读：是。S26 batch（2026 年 9 月 demo day）公布时回看：15 个方向里有几个真的出现在 batch 里
