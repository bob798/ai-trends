---
title: Claude Fable 5 and Mythos 5 — Two-SKU Release Pattern
date: 2026-06-09
captured: 2026-06-10
source: https://www.anthropic.com/news/claude-fable-5-mythos-5
source_type: blog
source_name: Anthropic News
speakers: [Anthropic]
tags: [two-sku-release, frontier-models, ai-safeguards]
signal_strength: strong
status: published
---

# 一句话核心

> **Anthropic 同时发布 Fable 5 与 Mythos 5——"同一底层模型，后者在部分领域解除护栏"——这是前沿实验室第一次把"安全护栏"从模型的内嵌属性外化为独立的产品 SKU 维度。"双 SKU 发布"正在成为新的发布范式。**

# 为什么这是个信号

过去十年里，"模型能力"和"安全护栏"始终被当作同一个模型的**两个内嵌属性**——OpenAI 和 Anthropic 都没把它们拆开过。Fable/Mythos 5 是第一次：同一份 weights，两个 SKU，护栏可配置。这意味着接下来 12 个月内，业内对"模型发布"的默认问题会从"它有多强 / 它有多安全"变成"我用哪个 SKU、合规上能不能用、出事谁担责"。**这不是一次产品发布，而是一次产品形态层的范式转移。**

附带信号：FrontierCode 图表显示 **Fable 5 随推理预算线性涨**（low → max：11% → 31%），而 GPT-5.5（~5% 平线）和 Claude Opus 4.8（max 处反降）已撞顶——**测试时算力可扩展性已成为新的代际分水岭**，这正是为什么"双 SKU"现在才有商业必要。

# 核心观点

| # | 观点 | 论据（原文/图表） | 适用判断 |
|---|------|-----------------|---------|
| 1 | **双 SKU = 新发布范式** | "Mythos 5...the same underlying model as Fable 5, but with the safeguards lifted in some areas" | 评估对前沿模型的依赖时，要假设双 SKU 是常态 |
| 2 | **厂商首次公开承认自家模型可被武器化** | "Mythos-class models excel at discovering and exploiting software vulnerabilities...make cyberattacks substantially easier and cheaper to commit" + "It has the strongest cybersecurity capabilities of any model in the world" | 任何 AI 基础设施的威胁建模都要把"对手用的是 Mythos 级模型"作为默认假设 |
| 3 | **护栏作为可配置层而非内嵌属性** | "safeguards that mean queries on some topics will instead receive a response from our next-most-capable model, Claude Opus 4.8" + "triggers, on average, in less than 5% of sessions" | 开源社区要么模仿（双 weights）要么拒绝（一份 weights），无法回避选择 |
| 4 | **测试时算力扩展性已分化** | FrontierCode（150 题硬子集 50）：Fable 5 max 31%，Opus 4.8 max ~11%（且 xhigh→max 反降），GPT-5.5 全程 ~5% | "通用模型 scaling 都会涨"的论断已被证伪；scaling 现在只对某些谱系有效 |
| 5 | **保守护栏 = 显式的误报税** | "we've tuned these safeguards conservatively—they'll sometimes catch harmless requests" | 企业部署时，5% 平均误报率的尾部分布可能很差，需要测自家场景 |
| 6 | **同名同价的"降级回退"** | 护栏触发时不报错而是用 Opus 4.8 回答——用户看不到 SKU 切换 | 影响 eval 与 SLA：你测的可能不是你买的那个模型 |

# 可复用框架

## 框架 A：双 SKU 发布的二维决策矩阵

发布一个前沿模型时，厂商现在要在两个轴上选位置：

```
                     护栏强度
                       │
            Fable 5    │    Opus 4.8
       (高能力+强护栏) │ (中能力+强护栏)
                       │
   ────────────────────┼──────────────────► 能力
                       │
            Mythos 5   │    [开源 Llama 等]
       (高能力+弱护栏) │ (中能力+无护栏)
                       │
```

- **左上 / 右上**：传统选择，单一 SKU
- **左下（Mythos）**：第一次出现在**闭源前沿厂商**的菜单上
- **左上 + 左下双发**：Anthropic 在选的位置——卖给两批人，对监管说"我们筛了"

这个矩阵能套到未来每一次前沿模型发布上。

## 框架 B：测试时算力可扩展性 = 新代际分水岭

FrontierCode 三类轨迹：

| 轨迹 | 成本-准确率曲线形状 | 代表 | 含义 |
|------|------------------|------|------|
| **单调上升** | low → max 几乎线性 | Fable 5 | 推理预算还有空间，未撞顶 |
| **早期撞顶** | 某档之后平台或微跌 | Opus 4.8 | scaling 收益递减，下一代要换路径 |
| **全程平线** | 任何预算下都不涨 | GPT-5.5 | 模型架构对这类任务无敏感度 |

**评估一个新模型的真正问题不再是"max 档多少分"，而是"曲线长什么形状"**——这是过去 benchmark 表格遗漏的维度。

## 框架 C：双 SKU 时代的合规问题清单

部署前沿模型时新增的尽调项：

1. 我用的是哪个 SKU？（合同/API 里写明）
2. 触发护栏时会回退到哪个模型？（影响 eval 可信度）
3. 解除护栏的版本有没有审核门？（API key、企业资质、用例审查）
4. 我所在司法管辖区允许我使用解除护栏版吗？（出口管制、AI Act）
5. 如果我同时申请了两个 SKU，事故归责怎么走？

# 金句

> "It has the strongest cybersecurity capabilities of any model in the world."

> "Mythos 5...the same underlying model as Fable 5, but with the safeguards lifted in some areas."

> "Mythos-class models excel at discovering and exploiting software vulnerabilities...make cyberattacks substantially easier and cheaper to commit."

> "safeguards that mean queries on some topics will instead receive a response from our next-most-capable model, Claude Opus 4.8."

> "we've tuned these safeguards conservatively—they'll sometimes catch harmless requests."

# 我的延展

- **对从业者的启示**：如果你的产品在 API 层接前沿模型，**eval 套件需要新增"护栏触发率"指标**——你的输出质量不只取决于模型，还取决于触发了几次降级到 Opus 4.8。
- **对安全 / 合规的启示**：威胁建模的"对手能力上限"假设要立刻上修。Mythos 5 的访问门槛即便严格，**6 个月内一定会有等效能力的开源模型出现**（Llama 谱系、DeepSeek、Qwen 都在追）。
- **对开源社区的启示**：Anthropic 用"双 SKU"做了一次定义性动作——这意味着"开源 = 默认 Mythos 形态"被隐式承认。开源社区可以选择"我们才是真正的 Mythos 替代品"作为定位。
- **对投资 / 战略的启示**："护栏作为产品维度"催生新基础设施：第三方护栏服务、模型路由层（在 Fable/Mythos 之间动态切换）、合规审计 SaaS。
- **反对意见 / 盲点**：
  - 所有 benchmark 胜利（FrontierCode、FrontierBench、Hebbia、ViBench、CursorBench）都来自 **Anthropic 第一方口径**，部分 benchmark 是自家的——需等独立评测（如 LMSYS Arena、Aider、SWE-bench Verified 第三方榜）
  - **"draws down usage 2× faster than Opus"** 这条流传引述**在主 blog 中并不出现**，可能来自营销材料或 X 帖，未独立验证前不要采信
  - "5% session 触发护栏"是平均值，**企业 enterprise 场景（如内部红队、安全研究）的尾部触发率可能高得多**，5% 不代表你能用
  - Mythos 5 的实际 access gate 未公开——如果只是"填表"，"双 SKU"的安全意义就被夸大了；如果是 case-by-case 审批，则更像传统出口管制
  - 把"双 SKU"称为"新范式"有过度概括风险：可能只有 Anthropic 这一家敢这么做（OpenAI、Google 受监管压力更大），如果 6 个月内没有第二家跟进，本信号需要降权

# 关联信号

<!-- 未来同主题信号在这里互链 -->
- *待建立链接：当出现第二家厂商跟进双 SKU 发布、或独立评测验证/证伪 FrontierCode 结论时，回填这里。*
- 拆解方法论沉淀在主题：[../themes/model-capability-breakdown.md](../themes/model-capability-breakdown.md)

# 元信息

- 投入时间：~60 分钟（读原文 + 拆图 + 写框架）
- 是否值得二次阅读：是。需要在三个时间点回看：
  - **+30 天**：等 LMSYS / SWE-bench Verified / Aider 等第三方榜更新，验证 FrontierCode 结论是否成立
  - **+90 天**：观察是否有第二家闭源前沿厂商（OpenAI / Google / xAI）跟进"双 SKU"发布
  - **+180 天**：Mythos 5 的实际访问门槛是否被披露；是否出现"等效解除护栏"的开源模型
- 跟进动作：
  1. 把"双 SKU 矩阵"加进 [`themes/model-capability-breakdown.md`](../themes/model-capability-breakdown.md) 作为长期观察轴
  2. 留意 Anthropic 后续是否补充 Mythos 5 的访问条款细节
  3. 在 [`_thinking/2026-06-10-model-capability-breakdown-direction.md`](../_thinking/2026-06-10-model-capability-breakdown-direction.md) 记录这次方向选择的问题链
