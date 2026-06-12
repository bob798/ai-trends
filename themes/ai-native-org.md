---
name: ai-native-org
description: AI 时代企业的核心资产不是代码，是组织记忆——围绕这一论点聚合的信号与开源景观
created: 2026-06-09
updated: 2026-06-09
signals:
  - 2025-04-koomen-horseless-carriages
  - 2026-05-27-yc-superintelligence-inside
  - 2026-06-03-yc-ai-native-services
related_themes: []
status: published
---

# 主题：AI-Native Org

## 主线论点

> **AI 时代企业的核心资产不再是"代码 + 系统"，而是"组织记忆 + Agent"。代码越来越容易生成，经验越来越难以复制。企业最大的损失往往不是员工离职，而是组织失忆。**

这个论断把 YC 的三条信号串成了一个完整叙事：
- **产品哲学层**：Pete Koomen 的 Horseless Carriages 论证了"产品要 AI-native"——让用户掌控 System Prompt
- **组织内部层**：YC's Superintelligence Inside 论证了"组织要 AI-native"——AI 是 OS 不是 feature
- **创业方向层**：YC's AI-Native Services 论证了"赛道要 AI-native"——从零重建服务公司，而不是给老公司装 AI

## 聚合的 3 条信号

| 视角 | 信号 | 核心一句 |
|------|------|---------|
| 产品哲学（思想根基） | [Horseless Carriages](../signals/2025-04-koomen-horseless-carriages.md) | "AI-native 产品 = 用户能编辑 System Prompt 的产品" |
| 组织内部改造 | [Superintelligence Inside Your Company](../signals/2026-05-27-yc-superintelligence-inside.md) | "AI 不是功能，是组织运转的 OS" |
| 创业方向选择 | [AI-Native Services Company](../signals/2026-06-03-yc-ai-native-services.md) | "下一个十年最大公司是从零用 AI 重建的服务公司" |

---

## 核心框架：四类组织记忆

YC 播客里反复出现"organizational memory"、"shared brain"、"recording everything"这类词。把这些零散提法整合后，可以分成**四类记忆**——每类回答一个不同的问题：

| 类型 | 回答的问题 | 例子 | 传统存储 | 标准化方法 |
|------|-----------|------|---------|-----------|
| **Fact Memory（事实）** | 发生了什么？ | 客户信息、项目状态、产品配置、上线时间 | MySQL / Postgres / CRM | 数据库 schema |
| **Process Memory（流程）** | 应该怎么做？ | 微信进件流程、审核 SOP | SOP 文档 | 状态机、Workflow |
| **Decision Memory（决策）** | 为什么这样做？ | "统一收款 vs 门店收款" 的取舍与原因 | 散落在 Slack/会议纪要 | **ADR** (Architecture Decision Record) |
| **Experience Memory（经验）** | 什么容易出问题？ | "微信实名认证失败因为法人手机号不一致" | 老员工脑中（最易丢失） | Case library |

**组织记忆的 4 条标准**：

✅ 可复用 — 不只是给一个人看的
✅ 可检索 — Agent 能查到
✅ 可解释 — 决策原因清楚，不只有结论
✅ 可执行 — Agent 能直接调用 / 执行

## 跨信号原则（6 条）

1. **重做 > 集成**：把 AI 当功能加进现有系统的尝试 99% 会失败；从零重做是更慢但更对的路径
2. **数据/工具集中，使用分散**：底层（DB + Tools Registry）必须统一；上层 agent 使用必须每个员工自己玩
3. **方差控制 > 模型能力**：决定 AI 服务公司生死的不是用什么模型，是单笔输出方差能压多低
4. **Skill 沉淀机制是新型组织资产**：取代了"流程文档"和"内部工具"两个旧资产类别
5. **高信任文化是隐藏门槛**：所有这套体系都默认了员工 + agent 互相信任的高自主组织
6. **抬地板而非抬天花板**：AI 在企业里的 ROI 来自让新人/中层立刻有 80 分能力

---

## 开源对标景观（2026-06-09 已验证）

YC 的内部 AI 栈是闭源的。下表是把 OSS 项目按**组织记忆类型**和**架构层**双维度对照——所有 star 数都是 `gh repo view` 当场查的真实数字，避开了 SEO 列表文章的吹嘘。

### 按组织记忆类型分类

| 记忆类型 | 最匹配的 OSS 项目 | Stars | 备注 |
|---------|------------------|-------|------|
| **Fact Memory** | [getzep/graphiti](https://github.com/getzep/graphiti) | 27,192 | Temporal Knowledge Graph，记录"实体-关系-时间"三元组 |
| **Process Memory** | [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) | 34,216 | 状态机、长期运行 Agent、Checkpoint——最接近"流程记忆 Agent 化" |
| **Process Memory（执行）** | [All-Hands-AI/OpenHands](https://github.com/All-Hands-AI/OpenHands) | 76,272 | Agent runtime，能跑 SOP 化的工作流 |
| **Decision Memory** | **缺口** | — | ADR 是文档格式，没有专门的"决策检索 + 推理"开源系统 |
| **Experience Memory** | [mem0ai/mem0](https://github.com/mem0ai/mem0) | 58,086 | Universal memory layer，自动总结 + 长期记忆 + Memory Graph |
| **Experience Memory（自改进）** | [letta-ai/letta](https://github.com/letta-ai/letta) | 23,218 | Stateful agents，"learn and self-improve over time" |

### 按 G-Brain 架构层分类

| 层 | YC G-Brain | OSS 候选 | 成熟度 |
|----|-----------|---------|-------|
| **Layer 4: Chat Interface** | YC 内部 | [open-webui/open-webui](https://github.com/open-webui/open-webui) (140,708 stars) | 成熟 |
| **Layer 3: Skills Registry** | 350+ skills | Claude Skills 生态、skillhub、skillbase 等十几个 | 活跃但碎片化，无统一标准 |
| **Layer 2: Tools Registry** | YC 内部 | agentregistry.ai、kagent（MCP-based） | 早期，正在 MCP 化 |
| **Layer 1: G-Brain 本体** | YC 私有 | **基本空白**——Mem0 / Graphiti 是最接近的代理 | **OSS 真正的机会缺口** |
| **完整 "Company OS"** | YC G-Brain | [kortix-ai/suna](https://github.com/kortix-ai/suna) (19,820) — 官方口号就是 "Autonomous Company OS" | 最接近 YC 整体定位 |
| **Self-improving 横切** | Dream Cycle | Letta、Mem0（自动总结）、metamorph | 涌现中 |

### 整合架构建议

**如果只看一个组合接近 YC Agent OS：Suna + Mem0 + Graphiti**

```
                    Suna
                  (Company OS)
                      │
        ┌─────────────┼─────────────┐
        │             │             │
      Mem0        Graphiti       LangGraph
   (经验记忆)    (事实/关系)    (流程编排)
        │             │             │
        └─────────────┼─────────────┘
                      │
                  PostgreSQL
                      │
                Agent Runtime
                  (OpenHands)
                      │
                Chat Interface
                  (Open WebUI)
```

这个组合**覆盖了 4 类组织记忆里的 3 类**（Fact / Process / Experience），**Decision Memory 仍然是开源空白**。

---

## 关键发现

1. **Layer 1 + Decision Memory 是真正的开源缺口**
   - Layer 1（为 agent 优化的去范式化 SQL DB）：没人专门做
   - Decision Memory（ADR 的结构化存储 + Agent 检索 + 推理）：完全空白
   - 这两层是潜在的开源/创业机会信号

2. **MCP 协议正在成为事实标准**
   - Tools Registry 层正在被 Model Context Protocol 统一
   - skills-mcp 这类项目把 skill 注册表也搬到 MCP 上
   - 监控 MCP 是否被 Anthropic 之外的大厂广泛采纳

3. **Letta = MemGPT 改名**
   - 23K stars，主打 stateful agents + 长期记忆
   - 核心还是 vector store，不是去范式化 SQL——所以**最接近 G-Brain 但仍不是 G-Brain**

4. **"组织失忆"是个被低估的问题**
   - 员工离职 = 公司丢一份隐性知识
   - 传统 KMS / Wiki 没解决：写下来的人没动力、查的人查不到
   - Agent + 4 类记忆系统是新解法，但**目前没有开源端到端方案**

5. **关于二手来源的可疑数字**
   - "OpenClaw 347K stars"、"Hermes 32K stars"这类来自 SEO listicle 的数字，**实际仓库未必存在或没那么大**
   - 见 [`_thinking/2026-06-09-cross-llm-oss-comparison.md`](../_thinking/2026-06-09-cross-llm-oss-comparison.md)，ChatGPT 也犯了 9 选 2 假 repo 的错

---

## 2026-06-12 更新：置信度上调

YC Summer 2026 RFS（2026-04）把 **Company Brain** 和 **The AI Operating System for Companies** 列为官方征集方向，措辞与本主题"组织记忆 → 可执行资产"的推断几乎逐字吻合（"把碎片化知识变成 AI 可执行的 skills file"）。本主题的主线论点从"基于 3 条播客信号的推断"升级为"被 YC 官方 RFS 确认的命题"。Decision Memory / Layer 1 的开源空白**仍未被填上**——空白被官方点名但无人交付，机会信号增强。详见 [yc-compass-2025-2026](yc-compass-2025-2026.md) 判断③ 和 [RFS 信号](../signals/2026-04-yc-rfs-summer-2026.md)。

## 开放问题（持续追踪）

1. **Layer 1 这层会不会出开源标准？** 还是会被 Mem0 + Graphiti + MCP 这套组合替代？
2. **Decision Memory 谁会先做？** 这是最大的空白，可能值得自己写一个原型
3. **Dream Cycle 工程化可靠性**：多少 OSS 项目真的能做到"夜间自改进且不退化"？Letta / Mem0 都在试，但没公开 evals
4. **System Prompt 编辑权下放到 C 端**：Notion AI / Cursor / Claude Projects 谁会先把它做成主流产品形态？
5. **YC W26/S26 batch 里 AI-native services 公司数量**——验证 [Charlie Warren 的预测](../signals/2026-06-03-yc-ai-native-services.md)
6. **方差控制的工程化方法**——YC 节目暗示但没展开，OSS 几乎没人在做（机会信号）

## 跟进动作

- 监控 Mem0 / Letta 是否引入 SQL / relational 后端（非 vector）
- 监控 MCP 是否被广泛采纳（Anthropic 之外）
- 关注每个新出现的 "Decision Memory" 或 "ADR-as-system" 开源项目，加进 OSS 表
- 关注 Suna 的演进——它目前最接近"端到端 Company OS"，半年后回看是否真的达成
- 6 个月后回看：上面 6 条原则有哪几条被证伪/修正

---

*OSS 景观的数据交叉验证过程见 [`../_thinking/2026-06-09-cross-llm-oss-comparison.md`](../_thinking/2026-06-09-cross-llm-oss-comparison.md)。*
