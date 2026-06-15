# prompt/

收录值得逐字研读的**原始系统提示词（system prompt）**及其中文翻译。

和 `signals/` 不同：signal 是对一份材料的结构化拆解，而这里保留的是**一手全文**——系统提示词本身就是研究对象，任何二手转述都会损失信息。翻译只为降低阅读门槛，不做删改、不做概括。

## 翻译原则

- **逐字、完整**：不省略、不概括、不增补。
- **保留结构**：标题层级、空行、代码块、JSON Schema 与原文一一对应。
- **不译技术标识**：URL、工具/函数名、模型字符串（如 `claude-fable-5`）、API 字段名、文件路径、JSON 的键与枚举值，以及代码块内部内容一律保持原样。
- **标题双语**：形如 `### product_information` 的下划线式标识符标题保留英文原名，并在括号内补中文释义，例如 `### product_information（产品信息）`。

## 条目

| 文件 | 说明 | 来源 |
|------|------|------|
| [CLAUDE-FABLE-5.zh.md](CLAUDE-FABLE-5.zh.md) | Claude Fable 5 系统提示词（中文翻译） | [CL4R1T4S](https://github.com/elder-plinius/CL4R1T4S/blob/main/ANTHROPIC/CLAUDE-FABLE-5.md) |
| [CLAUDE-FABLE-5.en.md](CLAUDE-FABLE-5.en.md) | 同上，英文原文存档 | 同上 |
