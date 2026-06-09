---
name: ai-native-org
description: AI 不是功能，是组织/产品的操作系统——围绕这一论点聚合的信号
created: 2026-06-09
updated: 2026-06-09
signals:
  - 2025-04-koomen-horseless-carriages
  - 2026-05-27-yc-superintelligence-inside
  - 2026-06-03-yc-ai-native-services
related_themes: []
status: draft
---

# 主题：AI-Native Org（"AI 原生组织/产品"）

## 主线论点

> **AI 的真正落地不是"加一个功能"，而是"重做一遍"。无论是新创业者的赛道选择（AI-native services）、已存在组织的内部改造（superintelligence inside）、还是产品形态本身（horseless carriages），核心都是同一句：以 AI 为前提重新设计，而不是把 AI 装进现有架构。**

## 聚合的 3 条信号

| 视角 | 信号 | 核心一句 |
|------|------|---------|
| 产品哲学（最上游） | [Horseless Carriages](../signals/2025-04-koomen-horseless-carriages.md) | "AI-native 产品 = 用户能编辑 System Prompt 的产品" |
| 组织内部改造 | [Superintelligence Inside Your Company](../signals/2026-05-27-yc-superintelligence-inside.md) | "AI 不是功能，是组织运转的 OS" |
| 创业方向选择 | [AI-Native Services Company](../signals/2026-06-03-yc-ai-native-services.md) | "下一个十年最大公司是从零用 AI 重建的服务公司" |

**三条信号形成 YC 的完整叙事**：
- 对内（Pete Koomen 路径）：把组织变成 AI 原生
- 对外（Charlie Warren 路径）：投资 AI 原生新创公司
- 思想基础（Pete 早年文章）：什么叫"原生"

## 提炼的 6 条跨信号原则

1. **重做 > 集成**：把 AI 当功能加进现有系统的尝试 99% 会失败；从零重做是更慢但更对的路径
2. **数据/工具集中，使用分散**：底层（DB + Tools Registry）必须统一；上层 agent 使用必须每个员工自己玩
3. **方差控制 > 模型能力**：决定 AI 服务公司生死的不是用什么模型，是单笔输出方差能压多低
4. **Skill 沉淀机制是新型组织资产**：取代了"流程文档"和"内部工具"这两个旧资产类别
5. **高信任文化是隐藏门槛**：所有这套体系都默认了员工 + agent 互相信任的高自主组织，低信任组织无法复制
6. **抬地板而非抬天花板**：AI 在企业里的 ROI 来自让新人/中层立刻有 80 分能力，不是让顶尖员工翻倍

## 开源对标景观（2026-06 verified）

YC 的内部 AI 栈是闭源的。OSS 生态有哪些可对标的层？我去 GitHub 搜了一圈，按 G-Brain 的 4 层架构对照：

| 层 | YC G-Brain | OSS 候选（已验证存在） | 成熟度 | 缺口 |
|----|-----------|--------------------|--------|------|
| **Layer 4: Chat 界面** | 内部 | 所有 agent 框架都自带 | 成熟 | / |
| **Layer 3: Skills Registry** | 350+ skills 共享 | [Claude Skills 生态](https://github.com/ComposioHQ/awesome-claude-skills)（337+ skills 列表）、skillhub、skillbase、skilluse、skills-mcp 多个 | 活跃但碎片化 | **无统一标准**，每个 registry 协议不同 |
| **Layer 2: Tools Registry** | 内部 | [agentregistry.ai](https://aregistry.ai/)、Microsoft Agent Governance Toolkit、kagent (MCP-based) | 早期 | MCP 协议正在形成事实标准 |
| **Layer 1: G-Brain (统一去范式化 DB)** | YC 私有 | **基本没有直接对标** | **空白** | 最大的 gap——OSS 都聚焦 vector DB，没人专门做"为 agent 优化的宽表 SQL" |
| **横向：Self-improving loop** | Dream Cycle | [Letta](https://github.com/letta-ai/letta) (23K stars)、metamorph、OpenClaw 系自我改进 skill 群 | 涌现中 | 没有"夜间复盘 + skill 自改写"完整端到端方案 |

### 关键发现

1. **Skill registry 层最热闹**：Anthropic 的 Claude Skills 协议 + Composio 等公司在拉标准，几十个开源 registry 项目，但**没有一个达到 YC 内部那种规模 + 沉淀质量**
2. **Tools 层正在 MCP 化**：Model Context Protocol 正在成为事实标准，agentregistry.ai 这类项目在试图做"agent 工具的 npm"
3. **Letta (= MemGPT 改名) 是最接近 G-Brain 的开源项目**：23K stars，主打 stateful agents + 长期记忆 + 自我改进，但**核心还是 vector store，不是去范式化 SQL**
4. **Layer 1（G-Brain 本体）是真正的空白**：YC 的"为 agent 重新建模数据库"思路在 OSS 还没有清晰的对标。这可能是个**开源机会**

### 关于一些可疑的信息

搜到的 listicle（"347K stars OpenClaw"、"32K stars Hermes Agent"等）**很多数字明显被夸大**——典型 SEO 农场风格。OpenClaw、Hermes Agent 作为项目本身是真实存在的，但具体 star 数和"市场地位"需要去原 repo 验证，不能信第三方文章。

## 开放问题（持续追踪）

1. **G-Brain 这一层会不会出开源标准？** 还是会被 Letta + MCP 这套组合取代？
2. **Dream Cycle 的可工程化程度**——多少 OSS 项目真的能做到"夜间自改进且不退化"？目前像是"有但都还很初期"
3. **System Prompt 编辑权下放到 C 端**：Notion AI / Cursor / Claude Projects 谁会先把它做成主流产品形态？
4. **YC W26/S26 batch 里 AI-native services 公司数量**——验证 [Charlie Warren 论点](../signals/2026-06-03-yc-ai-native-services.md)的预测
5. **方差控制的工程化方法**——YC 节目暗示但没展开，OSS 几乎没人在做（机会信号）

## 跟进动作

- 监控 Letta 是否引入 SQL/relational 后端（非 vector）
- 监控 MCP 协议是否被 Anthropic 之外的大厂广泛采纳
- 关注每个新出现的 "G-Brain-like" 开源项目，加到这张表里
- 6 个月后回看：上面的 6 条原则有哪几条被证伪/修正
