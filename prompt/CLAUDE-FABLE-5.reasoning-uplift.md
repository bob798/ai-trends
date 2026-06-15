# 专题：如何把弱底座的推理能力拉近 Fable 5

> 配套：[移植指南](CLAUDE-FABLE-5.porting-guide.md) ｜ [价值拆解](CLAUDE-FABLE-5.analysis.md)
> 这是移植指南第 2 节"能力缺口靠工程补"中**最难的一块——推理**的展开。
> 联网核验日期：2026-06-15

## 0. 先把边界钉死

- **能做到**：在**窄任务类**（数学、代码、多步 QA 等"有唯一可验证答案"的题）上，把弱模型拉到接近、个别甚至反超大模型——研究已出现 1B 小模型在复杂数学上反超 405B 的案例。
- **做不到**：在**通用、全任务**上把弱底座对齐 Fable 5 的原生推理；开放域常识/世界模型是硬约束。
- **本质**：这一切是**用"推理时算力"换准确率**（test-time compute scaling）。没有免费午餐——你付出的是 token、延迟、成本。

一句话：**能缩小差距，不能抹平差距；且差距越窄，账单越贵。**

## 1. 路线一 — 推理时（不重训，门槛最低，先做这个）

只改提示词与外部编排，不碰权重。按 ROI 从高到低：

1. **显式 CoT + "想得深而非长"**
   系统提示强制"先在 `<thinking>` 内分步推理再给结论"。研究提示：有效的是**推理深度**（关键决策步），不是单纯把输出拉长。

2. **自洽采样（Self-Consistency）** —— 单招里最稳的
   对同一题采样多次（如 N=5），取**多数答案**。只对"有唯一可聚合答案"的任务有效。
   省钱版：**自适应自洽（ReASC 式）**——高置信度时早停、模糊时才加采样，相比朴素自洽可省 70–80% 成本。

3. **Best-of-N + 验证器**
   生成 N 个候选，用一个 **verifier / 过程奖励模型（PRM）** 或自我置信度打分选最优。比纯多数投票更强，但需要一个会"判分"的环节。

4. **任务分解（Decomposition）**
   plan-and-solve、least-to-most：先拆子问题再逐个解。把弱模型扛不住的长链拆成它扛得住的短链。

5. **工具增强推理（PAL / 代码外包）** —— 弱模型增益最大点之一
   算术、逻辑、数据题强制走代码执行（program-aided）。把"模型不擅长的精确计算"外包出去，再让它做"自我验证"（tool-integrated self-verification 对小模型尤其有效）。

6. **反思回路（Reflexion）——必须带外部信号**
   让模型看到执行结果/测试反馈再修订。⚠️ **没有外部验证信号的纯自我反思常常原地踏步甚至变差**。

7. **计算-最优分配**
   按题目难度自适应给采样预算（简单题少采、难题多采），相比一刀切可提效 2–4 倍。

### 路线一的三个坑

- **小模型"多智能体辩论"会群体思维放大错误**——SLM 上慎用 debate/discussion 类方法。
- **纯自我反思无外部信号≈无效**——一定要接测试/工具/验证器。
- **自洽只对可聚合答案有效**——开放式写作、设计题用不上。

## 2. 路线二 — 训练时（能微调才行，门槛高，天花板更高）

改权重，已超出"用提示词"范畴，但这才是真正抬高推理**上限**的路：

- **蒸馏长 CoT**：用 Fable 5 / 大推理模型生成大量长链推理轨迹，SFT 到小模型。最直接、已被反复验证（o1/R1 类蒸馏让小模型产出有竞争力的长推理）。
- **可验证奖励 RL（DeepSeek-R1 路线）**：在有自动判分的领域（数学、代码）做 RL，让模型自己学会"延长推理"。对小模型同样有效。
- **训练一个验证器（PRM）**：配合路线一的 Best-of-N，质量随验证器变强而上升。

## 3. 路线三 — 换底座 / 混合（最务实）

- **难度路由（cascade）**：简单题留弱模型，推理难题路由到 Fable 5 / Opus。成本与能力的折中，工程上最快见效。
- **草稿—验证分工**：弱模型出草稿，强模型做验证/修订（cascade / speculative）。
- **Mixture of Opinions**：把弱模型的意见作为上下文喂给强模型，也能增益强模型的数学推理。

## 4. 按"你能动什么"选路线

| 你能改的 | 推荐组合 |
|----------|----------|
| 只能改 prompt | CoT + 自洽采样 + 工具增强（代码外包） |
| 能加外部编排 | 上面 + Best-of-N+验证器 + 任务分解 + cascade 路由 |
| 能微调权重 | 上面 + 长 CoT 蒸馏 + 可验证奖励 RL + 训练 PRM |
| 能换底座 | 直接上 Fable 5 / 同级，提示词只做"行为塑形" |

## 5. 现实预期（先有数感再动手）

| 任务类型 | 缩差空间 | 代价 |
|----------|----------|------|
| 数学/代码（有自动验证） | **大**，可接近甚至反超 | 大量采样，成本/延迟显著上升 |
| 多步结构化 QA | 中 | 中等采样 + 检索 |
| 开放域推理/常识 | **有限**，底座知识是硬约束 | 收益递减 |

## 6. 最小落地清单（今天就能做）

1. 系统提示加：「先在 `<thinking>` 内分步推理，再给结论；不确定就说不确定」。
2. 关键问答跑 **N=5 自洽投票**，取多数；用自适应早停控成本。
3. 数学/逻辑/数据题**强制走代码工具**，再让模型核对工具输出。
4. 加一个**验证步骤**（同模型二次调用或独立 verifier 检查答案）。
5. **难题 cascade** 到强模型，简单题留弱模型。
6. 用**你的真实任务集做 A/B**，画出"准确率 vs 成本"曲线，再决定加到哪一档——不要凭感觉堆技术。

## 7. 边界提醒

- **这是缩小差距，不是抹平**——底座仍是上限。
- **token/延迟/成本是真实账单**，先用自适应分配（按难度给预算）控住。
- **别在小模型上硬上多智能体辩论**——群体思维会放大错误。
- 想要 Fable 5 的推理，**最确定的办法仍是用 Fable 5（或同级底座）**；以上是"底座受限时把推理榨到极限"的工程手段。

---

### 参考（联网核验，2026-06）

- [Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (arXiv:2408.03314)](https://arxiv.org/html/arXiv:2408.03314)
- [Reliability-Aware Adaptive Self-Consistency (ReASC) (arXiv:2601.02970)](https://arxiv.org/pdf/2601.02970)
- [T1: Tool-integrated Self-verification for Test-time Compute Scaling in Small Language Models (arXiv:2504.04718)](https://arxiv.org/pdf/2504.04718)
- [Think Deep, Not Just Long (arXiv:2602.13517)](https://arxiv.org/pdf/2602.13517)
- [Weaker LLMs' Opinions Also Matter: Mixture of Opinions (arXiv:2502.19622)](https://arxiv.org/html/2502.19622v2)
- [Self-Consistency Improves Chain of Thought Reasoning (Wang et al.)](https://www.semanticscholar.org/paper/Self-Consistency-Improves-Chain-of-Thought-in-Wang-Wei/5f19ae1135a9500940978104ec15a5b8751bc7d2)
- [How test-time scaling unlocks hidden reasoning in small models (VentureBeat)](https://venturebeat.com/ai/how-test-time-scaling-unlocks-hidden-reasoning-abilities-in-small-language-models-and-allows-them-to-outperform-llms)
