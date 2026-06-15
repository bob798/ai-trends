# prompt/

收录值得逐字研读的**原始系统提示词（system prompt）**及其中文翻译。

和 `signals/` 不同：signal 是对一份材料的结构化拆解，而这里保留的是**一手全文**——系统提示词本身就是研究对象，任何二手转述都会损失信息。翻译只为降低阅读门槛，不做删改、不做概括。

## 翻译原则

- **逐字、完整**：不省略、不概括、不增补。
- **保留结构**：标题层级、空行、代码块、JSON Schema 与原文一一对应。
- **不译技术标识**：URL、工具/函数名、模型字符串（如 `claude-fable-5`）、API 字段名、文件路径、JSON 的键与枚举值，以及代码块内部内容一律保持原样。
- **标题双语**：形如 `### product_information` 的下划线式标识符标题保留英文原名，并在括号内补中文释义，例如 `### product_information（产品信息）`。

## 真实性须知

这里的"原始材料"多为**社区从模型诱导提取**的系统提示词，不是官方权威发布。收录时遵循：

1. **产品层面尽量交叉核验**（官方博客/文档/API docs），并在文件顶部注明核验结论。
2. **文本本身视为"高可信但未经官方确认的近似样本"**——结论可参考，逐字不可作为事实引用。
3. **区分系统提示词与模型本身**：前者只是最表层、可调的"方向盘"，不等于模型的真实能力与训练。

## 条目

| 文件 | 说明 | 来源 |
|------|------|------|
| [CLAUDE-FABLE-5.zh.md](CLAUDE-FABLE-5.zh.md) | Claude Fable 5 系统提示词（中文翻译，含真实性说明） | [CL4R1T4S](https://github.com/elder-plinius/CL4R1T4S/blob/main/ANTHROPIC/CLAUDE-FABLE-5.md) |
| [CLAUDE-FABLE-5.en.md](CLAUDE-FABLE-5.en.md) | 同上，英文原文存档 | 同上 |
| [CLAUDE-FABLE-5.analysis.md](CLAUDE-FABLE-5.analysis.md) | 拆解：这份提示词有什么价值（含联网核验） | 本仓库 |
| [CLAUDE-FABLE-5.porting-guide.md](CLAUDE-FABLE-5.porting-guide.md) | 移植指南：用此提示词让"非 Fable 5 模型"逼近其表现（行为可搬、能力不可搬） | 本仓库 |
| [CLAUDE-FABLE-5.reasoning-uplift.md](CLAUDE-FABLE-5.reasoning-uplift.md) | 专题：如何把弱底座的推理能力拉近 Fable 5（test-time compute / 蒸馏 / 路由，含联网核验） | 本仓库 |
