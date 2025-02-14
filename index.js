const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8100;

app.use(express.json());
app.use(express.static("public"));

// Serve the HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// 添加 data.json 路由
app.get("/data.json", (req, res) => {
  res.sendFile(path.join(__dirname, "data.json"));
});

// 添加 blog.html 路由
app.get("/blog.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "blog.html"));
});

// 添加 article.html 路由
app.get("/article.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "article.html"));
});

// 添加 index.html 路由 - 重定向到根路径
app.get("/index.html", (req, res) => {
  res.redirect("/");
});

// Load data from data.json
app.get("/data", (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, "data.json"), "utf8");
  res.json(JSON.parse(data));
});

// Save data to data.json
app.post("/data", (req, res) => {
  try {
    const { blocks: newBlocks } = req.body;

    // 处理日期，保持原有顺序
    const processedBlocks = newBlocks.map((block, index) => {
      const firstLine = block.content.split("\n")[0];
      const processedBlock = { ...block }; // 创建块的副本，避免直接修改原始数据

      // 如果是日历条目（以 # 📆 开头）
      if (firstLine.startsWith("# 📆")) {
        const dateMatch = firstLine.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
        if (dateMatch) {
          const [_, year, month, day] = dateMatch;
          processedBlock.date = `${year}-${month.padStart(
            2,
            "0"
          )}-${day.padStart(2, "0")}`;
        }
      }
      // 如果是文章条目（以 # 📘 开头）或其他情况
      else {
        const lastDate = findLastCalendarDate(newBlocks, index);
        if (lastDate) {
          processedBlock.date = lastDate;
        } else {
          const now = new Date();
          processedBlock.date = now.toISOString().split("T")[0];
        }
      }

      return processedBlock;
    });

    // 写入文件，保持原有顺序
    fs.writeFileSync(
      path.join(__dirname, "data.json"),
      JSON.stringify({ blocks: processedBlocks }, null, 2)
    );
    res.sendStatus(200);
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// 从下往上找日期的函数
function findLastCalendarDate(blocks, currentIndex) {
  for (let i = currentIndex; i >= 0; i--) {
    const block = blocks[i];
    const firstLine = block.content.split("\n")[0];
    if (firstLine.startsWith("# 📆")) {
      const dateMatch = firstLine.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (dateMatch) {
        const [_, year, month, day] = dateMatch;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
    }
  }
  return null;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
