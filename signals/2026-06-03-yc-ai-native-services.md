---
title: How to Build an AI-Native Services Company
date: 2026-06-03
captured: 2026-06-09
source: https://podcasters.spotify.com/pod/show/ycombinator/episodes/How-to-Build-an-AI-Native-Services-Company-e3k8dj5
source_type: podcast
source_name: Y Combinator Startup Podcast
speakers: [Charlie Warren]
duration: "11:21"
tags: [ai-native-services, market-selection, business-model]
signal_strength: strong
status: published
---

# 一句话核心

> **下一个十年最大的公司未必是软件公司，而是"用 AI 从零重建的服务业公司"——保险、律所、税务、记账——它们不卖 AI 给服务业，它们自己就是那门服务生意。**

# 为什么这是个信号

YC 一个对 AI 创业方向最有发言权的机构，**第一次明确地把方向从 "AI tools" 推向 "AI-native services"**。这是从"卖锹给淘金者"转向"自己下场淘金"的范式信号——意味着接下来 12–18 个月的 YC batch 里，会出现一批"直接是律所/直接是保险公司"的新创业者，他们的天敌是传统服务业玩家而非 SaaS 同行。

# 核心观点

| # | 观点 | 论据 / 暗示 | 适用判断 |
|---|------|------------|---------|
| 1 | 别做"卖 AI 给服务业"，**直接做那门服务生意** | 节目章节 "AI Operating Leverage"：AI 是杠杆而不是产品 | 传统服务业人力工资占成本 50%+ 时 |
| 2 | **市场选错比执行错更致命** | 11 分钟节目里超 1/3 篇幅讲选市场（章节 01:01–03:43） | 创业初期，团队尚未锁定方向 |
| 3 | **方差（Variance）是头号杀手** | 章节明确点名 "Variance Is the Existential Problem" | 你提供的服务每次结果差异大（咨询、医疗、定制法务） |
| 4 | **早期高需求是陷阱** | 章节 "The Early Demand Trap" | 头几个客户求着你做时——这正是危险信号 |
| 5 | **定价不能照搬 SaaS** | 章节 "How to Price AI Services" + P&L Walkthrough | 你在纠结订阅 vs 按次 vs 按结果 |
| 6 | **不要靠收购买入市场** | 章节 "Don't Buy Your Way In" | 当你想"先收购一家律所再加 AI"时 |

# 可复用框架

## 框架 A：选市场的 4 个 traits

| 维度 | 好市场 | 反模式 |
|------|--------|--------|
| **劳动密度** | 营收 ≥50% 是人力工资 | 已经被软件吃完，毛利已高 |
| **任务可结构化** | 工作流可拆成模板化步骤 | 高度依赖人际信任 / 现场判断 |
| **客户接受新供应商** | 中小客户、痛点明确、采购周期短 | 长期供应商关系 / 监管沉重 |
| **方差可控** | 输出有客观对错（税表、保单、合同） | 输出主观（创意、咨询） |

## 框架 B：AI Services 的 P&L 重构

```
传统服务业 P&L:                AI-Native 服务公司 P&L:
营收            100             营收           100
- 人力成本      -55     ──→    - AI/算力成本   -8
- 房租/运营     -15             - 少量人力     -15
- 销售          -10             - 销售/获客    -12
- 其他          -10             - 其他         -5
─────────────────              ─────────────────
净利润           10              净利润         60
```

杠杆点不是"提效 10%"，而是把人力线整条砍掉 70%+，毛利从个位数翻到 50%+。

## 框架 C：方差控制 = 这类公司的生死线

卖 SaaS 时 bug 是麻烦；卖服务时**单笔糟糕交付就是退款 + 差评 + 监管投诉**。应对路径：

1. **窄切入口**：只接最标准化子类目（律所只做 NDA 审查，不做诉讼）
2. **人在回路**：高方差任务 human-in-the-loop，AI 跑底稿，人审签字
3. **Pre-mortem 而非 Post-mortem**：上线前模拟 100 个边缘案例

# 金句

> "These won't be software businesses. They'll be services companies rebuilt from scratch with AI doing most of the work."

> "Variance kills these businesses faster than anything else."

> "Don't buy your way in." —— 别想着"先收购一家事务所"，那是把传统成本结构整个搬回家。

# 我的延展

- **对从业者的启示**：如果你在做 AI Agent 工具，你的最大客户群——也是最大竞争对手——是**自建 Agent 的 AI-native 新公司**。他们不会买你的 SaaS，他们会自己写。
- **对 AI 售前/方案的启示**：别再给传统律所提"AI 转型方案"，ROI 太薄；真正的标的是**没有路径依赖的 AI-native 新进入者**。
- **方差是隐藏的赛道过滤器**：很多人在想"AI 能做什么"，但应该先问"**哪种服务的输出有客观对错**"——这就是为什么税务 / 保单核保 / NDA 审查比咨询 / 医疗诊断更早能跑通。
- **反对意见 / 盲点**：
  - YC 视角天然偏向"从零构建"，会低估**监管壁垒**——美国某些州的律所必须由持牌律师持股，AI-native 律所如何处理这层制度约束节目没回答。
  - "Don't buy your way in" 在某些极重许可证的市场（保险牌照、银行牌照）反而可能是必经之路，节目把它绝对化了。
  - P&L 模型省略了**客户获取成本（CAC）**：服务业销售周期长，AI-native 公司的 CAC 是否真比 SaaS 低，缺乏数据支撑。

# 关联信号

<!-- 未来同主题信号在这里互链 -->
- *待建立链接：当出现其他 AI-native services 案例（具体公司、融资、退出）时，回填到这里。*

# 元信息

- 投入时间：~40 分钟（找节目 + 拆解 + 写延展）
- 是否值得二次阅读：是。3 个月后再回看，验证 YC 的预测是否落地（看 W26/S26 batch 里有几家 AI-native services 公司）
- 跟进动作：关注 YC W26 batch 公布时的公司列表，做对照
