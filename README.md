# Real-Time Notepad 项目

![Project Screenshot](./public/screenshot.png) <!-- 如果有截图可以放在这里 -->

**Real-Time Notepad** 是一个基于 Web 的实时记事本应用，支持动态添加、编辑和删除文本块，并可以实时保存数据。用户可以通过简单的按钮操作插入时间、日期，并在文本块之间灵活插入新内容。

---

## 功能特性

- **实时编辑**：每个文本块都可以实时编辑，内容自动保存。
- **动态插入**：
  - 在当前块前或后插入新文本块（`Before` 和 `After` 按钮）。
  - 在光标位置插入时间（`Time` 按钮）。
  - 在光标位置插入日期（`Date` 按钮）。
- **自动保存**：所有更改会自动保存到 `data.json` 文件中。
- **响应式设计**：适配不同屏幕尺寸，提供良好的用户体验。
- **颜色交替**：文本块背景颜色交替显示，提升可读性。

---

## 技术栈

- **前端**：
  - HTML5、CSS3、JavaScript
  - [Tailwind CSS](https://tailwindcss.com/)：用于快速构建响应式 UI。
- **后端**：
  - [Express.js](https://expressjs.com/)：用于创建简单的 REST API。
  - Node.js：服务器运行时环境。
- **数据存储**：
  - `data.json`：用于存储记事本内容。

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/real-time-notepad.git
cd real-time-notepad
```

### 2. 安装依赖

确保已安装 [Node.js](https://nodejs.org/)，然后运行以下命令安装依赖：

```bash
npm install
```

### 3. 启动服务器

运行以下命令启动服务器：

```bash
node index.js
```

服务器将运行在 `http://localhost:3000`。

### 4. 访问应用

打开浏览器，访问 `http://localhost:3000`，即可开始使用 Real-Time Notepad。

---

## 项目结构

```
real-time-notepad/
├── public/               # 静态资源文件
├── views/                # HTML 文件
│   └── index.html        # 主页面
├── data.json             # 数据存储文件
├── index.js              # 服务器主文件
├── README.md             # 项目说明文件
└── package.json          # 项目依赖配置文件
```

---

## 使用方法

1. **编辑文本块**：

   - 点击任意文本块即可开始编辑。
   - 如果文本块为空，删除内容后会自动移除该块。

2. **插入时间**：

   - 点击 `Time` 按钮，在光标位置插入当前时间。

3. **插入日期**：

   - 点击 `Date` 按钮，在光标位置插入当前日期（包含年份、月份、日期、星期和周数）。

4. **插入新块**：

   - 点击 `Before` 按钮，在当前块前插入一个新块。
   - 点击 `After` 按钮，在当前块后插入一个新块。

5. **自动保存**：
   - 所有更改会自动保存到 `data.json` 文件中，刷新页面后内容不会丢失。

---

## 示例

### 插入时间

点击 `Time` 按钮后，插入的时间格式为：`10:15:30 AM`。

### 插入日期

点击 `Date` 按钮后，插入的日期格式为：`📆 2023年10月05日 周四 40周`。

### 插入新块

- 点击 `Before` 按钮，在当前块前插入一个空白块。
- 点击 `After` 按钮，在当前块后插入一个空白块。

---

## 未来计划

- **用户身份验证**：支持多用户登录，每个用户有自己的记事本。
- **云端存储**：将数据存储到云端（如 Firebase 或 MongoDB）。
- **Markdown 支持**：支持 Markdown 语法渲染。
- **导出功能**：支持将内容导出为 `.txt` 或 `.md` 文件。

---

## 贡献

欢迎贡献代码！如果你有任何建议或发现问题，请提交 Issue 或 Pull Request。

1. Fork 项目。
2. 创建新分支：`git checkout -b feature/your-feature`。
3. 提交更改：`git commit -m 'Add some feature'`。
4. 推送到分支：`git push origin feature/your-feature`。
5. 提交 Pull Request。

---

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

---

## 联系方式

如有问题或建议，请联系：  
📧 Email: your-email@example.com  
🌐 GitHub: [your-username](https://github.com/your-username)

---

希望这个 `README.md` 能帮助你更好地展示项目！如果有其他需求，可以随时告诉我！ 😊
