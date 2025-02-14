// 定义全局变量 posts
let posts = [];

// 字符串转换为时间格式
function parseDate(str) {
  try {
    // 处理 "2024-02-13" 格式的日期
    if (str.includes("-")) {
      return new Date(str);
    }
    // 处理 "2024年02月13日" 格式的日期
    if (str.includes("年")) {
      const [year, month, day] = str
        .match(/(\d{4})年(\d{2})月(\d{2})日/)
        .slice(1);
      return new Date(year, month - 1, day);
    }
    // 如果都不匹配，尝试直接创建日期对象
    return new Date(str);
  } catch (error) {
    console.error("日期解析错误:", str, error);
    throw error;
  }
}

// 获取本周的星期天作为开始时间
function getThisSunday(date) {
  const cstDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Shanghai" })
  );
  const dayOfWeek = cstDate.getDay();
  const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const thisSunday = new Date(cstDate);
  thisSunday.setDate(cstDate.getDate() + daysToSunday);
  return thisSunday;
}

// 获取当前年份
const currentYear = new Date().getFullYear();

// 获取年份选择框
const yearSelect = document.getElementById("year-select");

// 获取任意年份的第一周的起始日期
function getFirstWeekStartDate(selectedYear) {
  const firstDayOfYear = new Date(selectedYear, 0, 1);
  const dayOfWeek = firstDayOfYear.getDay();
  const firstWeekStartDate = new Date(firstDayOfYear);
  firstWeekStartDate.setDate(
    firstDayOfYear.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
  );
  return firstWeekStartDate;
}

// 获取任意年份的最后一周的结束日期
function getLastWeekEndDate(selectedYear) {
  const lastDayOfYear = new Date(selectedYear, 11, 31);
  const dayOfWeek = lastDayOfYear.getDay();
  const lastWeekEndDate = new Date(lastDayOfYear);
  lastWeekEndDate.setDate(
    lastDayOfYear.getDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek + 1)
  );
  return lastWeekEndDate;
}

// 根据选择的年份计算周数和日期范围
function getStartDate(selectedYear) {
  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Shanghai" })
  );
  const startOfYear = new Date(
    new Date(selectedYear, 0, 1).toLocaleString("en-US", {
      timeZone: "Asia/Shanghai",
    })
  );

  const dayOfYear = Math.ceil((today - startOfYear) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor((dayOfYear - 1) / 7) + 1;

  let weeks;
  if (selectedYear === 2024) {
    weeks = weekNumber - 35 + 1;
  } else if (selectedYear === 2025) {
    const firstDayOf2025 = new Date(2025, 0, 1);
    const dayOfWeek = firstDayOf2025.getDay();
    const firstWeekStartDate = new Date(firstDayOf2025);
    firstWeekStartDate.setDate(
      firstDayOf2025.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
    );
    weeks = weekNumber;
    const days = weeks * 7 - 1;
    return firstWeekStartDate;
  } else {
    weeks = weekNumber;
  }
  const days = weeks * 7 - 1;

  const sunday = getThisSunday(today);
  const startDate = new Date(sunday);
  startDate.setDate(sunday.getDate() - days);

  return startDate;
}

// 构建基础数据
function dateBuild(data, startDate) {
  const dateCounts = {};
  // 标准化json中的时间格式
  data.forEach((item) => {
    if (!item.date) return; // 跳过没有日期的项
    try {
      const date = parseDate(item.date);
      const dateStr = date.toISOString().split("T")[0];
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    } catch (e) {
      console.warn("Invalid date:", item.date);
    }
  });

  const result = [];
  const sunday = getThisSunday(new Date());

  // 生成从 startDate 到 sunday 的数据数组
  for (
    let currentDate = new Date(
      sunday.toLocaleString("en-US", { timeZone: "Asia/Shanghai" })
    );
    currentDate >=
    new Date(startDate.toLocaleString("en-US", { timeZone: "Asia/Shanghai" }));
    currentDate.setDate(currentDate.getDate() - 1)
  ) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const count = dateCounts[dateStr] || 0;
    // 通过时间去json数据获取当天的文章
    const dataContent = data.filter(
      (item) => parseDate(item.date).toISOString().split("T")[0] === dateStr
    );

    // 统计文章字符总数
    let sumOfWordcounts = 0;
    dataContent.forEach((item) => {
      // 计算内容的实际字数（去掉第一行的标记）
      const contentLines = item.content.split("\n");
      const contentWithoutFirstLine = contentLines.slice(1).join("\n");
      sumOfWordcounts += contentWithoutFirstLine.length;
    });

    // 为每个内容项添加标题和处理后的字数
    const contentWithTitles = dataContent.map((item) => {
      const contentLines = item.content.split("\n");
      const firstLine = contentLines[0];
      const contentWithoutFirstLine = contentLines.slice(1).join("\n");
      let title = firstLine;
      if (firstLine.includes("# 📘")) {
        title = firstLine.replace(/^#\s*📘\s*/, "").trim();
      }
      return {
        ...item,
        title: title,
        href: `#${encodeURIComponent(title)}`,
        word_count: contentWithoutFirstLine.length,
      };
    });

    // 放进数组中
    result.push({
      date: dateStr,
      count: count,
      data: contentWithTitles,
      wordcount: sumOfWordcounts,
    });
  }

  return result;
}

// 动态生成星期标签
function generateWeekLabels() {
  const weekLabels = ["一", "三", "五", "日"];
  const weekLabelsContainer = document.querySelector(".week-labels");
  weekLabelsContainer.innerHTML = ""; // 清空现有内容

  // 生成新的星期标签
  weekLabels.forEach((labelText) => {
    const label = document.createElement("div");
    label.className = "week-label";
    label.innerText = labelText;
    weekLabelsContainer.appendChild(label);
  });
}

// 填充热力图
function fillHeatmap(data, startDate) {
  let articles = dateBuild(data, startDate);
  const gridContainer = document.getElementById("relitu-container");
  gridContainer.innerHTML = "";

  // 获取选择的年份
  const selectedYear = parseInt(yearSelect.value);

  // 动态计算第一周的起始日期和最后一周的结束日期
  const firstWeekStartDate = getFirstWeekStartDate(selectedYear);
  const lastWeekEndDate = getLastWeekEndDate(selectedYear);

  let lastMonth = null; // 用于跟踪上一个月份
  let currentColumn = null; // 当前列
  let currentColumnIndex = 0; // 当前列的索引
  let currentRowIndex = 0; // 当前列中的行索引（0-6）

  // 倒序遍历文章数据
  articles
    .slice()
    .reverse()
    .forEach((article) => {
      // 获取当前格子的日期
      const currentDate = new Date(article.date);
      const currentMonth = currentDate.getMonth(); // 获取当前月份

      // 过滤数据：只显示在动态计算的日期范围内的数据
      if (currentDate < firstWeekStartDate || currentDate > lastWeekEndDate) {
        return; // 跳过不在范围内的数据
      }

      // 检查是否是新的月份的开始
      if (lastMonth !== null && currentMonth !== lastMonth) {
        // 插入7个隐形格子
        for (let i = 0; i < 7; i++) {
          if (currentRowIndex >= 7) {
            currentColumn = document.createElement("div");
            currentColumn.className = "grid-column";
            gridContainer.appendChild(currentColumn);
            currentColumnIndex++;
            currentRowIndex = 0;
          }

          const gridItem = document.createElement("div");
          gridItem.className = "grid-item invisible";
          gridItem.innerHTML = `<div class="item-info"></div>`;
          currentColumn.appendChild(gridItem);
          currentRowIndex++;
        }
      }

      lastMonth = currentMonth;

      if (currentRowIndex >= 7) {
        currentColumn = document.createElement("div");
        currentColumn.className = "grid-column";
        gridContainer.appendChild(currentColumn);
        currentColumnIndex++;
        currentRowIndex = 0;
      }

      const gridItem = document.createElement("div");
      gridItem.className = "grid-item";

      // 构建提示字符串，使用双引号并正确转义HTML
      const tooltipStr = article.data
        .map((item) => {
          const content = item.content
            .split("\n")[0]
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
          return `- <a href=article.html?id=${item.id} style="color: inherit; text-decoration: none">${content}</a>`;
        })
        .join("<br>");

      // 构建格子内容
      const backgroundColor =
        article.wordcount != 0
          ? `rgba(30,129,248,${article.wordcount / 5000 + 0.2})`
          : "#E9ECEF";

      const tippyContent =
        `${article.date}，共 ${article.count} 篇，共 ${article.wordcount} 字<br />${tooltipStr}`
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");

      // 使用 createElement 和 setAttribute 来避免 HTML 转义问题
      const itemInfo = document.createElement("div");
      itemInfo.className = "item-info item-tippy";
      itemInfo.setAttribute("data-date", article.date);
      itemInfo.setAttribute("data-tippy-content", tippyContent);
      itemInfo.style.backgroundColor = backgroundColor;

      const link = document.createElement("a");
      link.href = article.data[0]
        ? `article.html?id=${article.data[0].id}`
        : "#";
      link.style.display = "block";
      link.style.width = "100%";
      link.style.height = "100%";

      itemInfo.appendChild(link);
      gridItem.appendChild(itemInfo);

      if (!currentColumn) {
        currentColumn = document.createElement("div");
        currentColumn.className = "grid-column";
        gridContainer.appendChild(currentColumn);
      }
      currentColumn.appendChild(gridItem);
      currentRowIndex++;
    });

  // 生成星期标签
  generateWeekLabels();

  // 初始化提示框
  tippy(".item-tippy", {
    allowHTML: true,
    interactive: true,
    maxWidth: "none",
    theme: "custom",
    appendTo: document.body,
    placement: "top",
    delay: [0, 0],
    duration: [0, 0],
  });
}

// 生成笔记列表
function generateNoteList(data) {
  const noteListContainer = document.getElementById("note-list");
  if (!noteListContainer) return;
  noteListContainer.innerHTML = "";

  const noteListTemplate = document.createElement("div");
  noteListTemplate.className = "note-item";

  const groupedNotes = {};
  data.forEach((note) => {
    if (!note || !note.date || !note.title) return;

    try {
      const date = parseDate(note.date);
      if (!date || isNaN(date.getTime())) return;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (!groupedNotes[year]) groupedNotes[year] = {};
      if (!groupedNotes[year][month]) groupedNotes[year][month] = [];

      groupedNotes[year][month].push(note);
    } catch (e) {}
  });

  // 按年和月排序并生成笔记列表
  Object.keys(groupedNotes)
    .sort((a, b) => b - a) // 按年降序
    .forEach((year) => {
      const yearDiv = document.createElement("div");
      yearDiv.className = "note-year";
      yearDiv.innerText = year;
      noteListContainer.appendChild(yearDiv);

      Object.keys(groupedNotes[year])
        .sort((a, b) => b - a) // 按月降序
        .forEach((month) => {
          const monthDiv = document.createElement("div");
          monthDiv.className = "note-month";
          monthDiv.innerText = `${month}月`;
          noteListContainer.appendChild(monthDiv);

          groupedNotes[year][month].forEach((note) => {
            try {
              const noteItem = noteListTemplate.cloneNode(false);
              const date = parseDate(note.date);
              const formattedDate = `${String(date.getMonth() + 1).padStart(
                2,
                "0"
              )}-${String(date.getDate()).padStart(2, "0")}`;
              noteItem.innerHTML = `<a href="article.html?id=${note.id}" target="_blank">
                      ${formattedDate} &nbsp;&nbsp;&nbsp; ${note.title}
                    </a>`;
              noteListContainer.appendChild(noteItem);
            } catch (e) {
              console.warn("渲染笔记项时出错：", e);
            }
          });
        });
    });
}

// 填充所有数据
function fillGrid(data, startDate) {
  // 填充热力图 - 使用原始的完整数据
  fillHeatmap(data.blocks, startDate);

  // 生成笔记列表 - 只使用笔记数据
  generateNoteList(data);

  // 计算日记和笔记数量及总字数
  let noteCount = 0;
  let diaryCount = 0;
  let totalWordCount = 0;

  data.forEach((item) => {
    if (!item.content) return;

    const firstLine = item.content.split("\n")[0];
    const contentWithoutFirstLine = item.content
      .split("\n")
      .slice(1)
      .join("\n");
    const wordCount = contentWithoutFirstLine.length;

    if (firstLine && firstLine.includes("# 📘")) {
      noteCount++;
      totalWordCount += wordCount;
    } else {
      diaryCount++;
      totalWordCount += wordCount;
    }
  });

  // 更新显示统计信息的元素
  const noteCountElement = document.getElementById("note-count");
  if (noteCountElement) {
    noteCountElement.innerHTML = `<span class="stat-number">${diaryCount}</span> 篇日记 <span class="stat-number">${noteCount}</span> 篇笔记 <span class="stat-number">${totalWordCount}</span> 字`;
  }
}

// 修改初始加载时的代码
document.addEventListener("DOMContentLoaded", function () {
  const loadingSpinner = document.getElementById("loading-spinner");
  loadingSpinner.style.display = "flex";

  // 设置默认年份为当前年份
  yearSelect.value = currentYear;

  fetch("/data")
    .then((response) => response.json())
    .then((data) => {
      console.log("获取到原始数据：", data);

      // 分别处理笔记和所有内容
      const allBlocks = data.blocks;

      // 过滤出笔记内容
      const noteBlocks = allBlocks.filter((block) => {
        // 确保 block 和 block.content 存在
        if (!block || !block.content) {
          console.log("跳过无效块：", block);
          return false;
        }

        // 获取第一行
        const firstLine = block.content.split("\n")[0];
        // 只保留第一行包含 # 📘 的笔记
        const isNote = firstLine && firstLine.includes("# 📘");
        console.log("检查是否为笔记：", firstLine, isNote);
        return isNote;
      });

      console.log("过滤后的笔记块：", noteBlocks);

      // 处理笔记数据
      posts = noteBlocks.map((block) => {
        const firstLine = block.content.split("\n")[0];
        const title =
          firstLine.replace(/^#\s*📘\s*/, "").trim() || "无标题笔记";
        return {
          ...block,
          title: title,
          href: `#${encodeURIComponent(title)}`,
          word_count: block.content.length,
        };
      });

      console.log("处理后的posts数组：", posts);

      const selectedYear = parseInt(yearSelect.value);
      const startDate = getStartDate(selectedYear);

      // 填充热力图 - 使用所有内容
      fillHeatmap(allBlocks, startDate);

      // 生成笔记列表 - 只使用笔记内容
      generateNoteList(posts);

      // 计算日记和笔记数量及总字数
      let noteCount = 0;
      let diaryCount = 0;
      let totalWordCount = 0;

      allBlocks.forEach((item) => {
        if (!item.content) return;

        const firstLine = item.content.split("\n")[0];
        const contentWithoutFirstLine = item.content
          .split("\n")
          .slice(1)
          .join("\n");
        const wordCount = contentWithoutFirstLine.length;

        if (firstLine && firstLine.includes("# 📘")) {
          noteCount++;
          totalWordCount += wordCount;
        } else {
          diaryCount++;
          totalWordCount += wordCount;
        }
      });

      // 更新显示统计信息的元素
      const noteCountElement = document.getElementById("note-count");
      if (noteCountElement) {
        noteCountElement.innerHTML = `<span class="stat-number">${diaryCount}</span> 篇日记 <span class="stat-number">${noteCount}</span> 篇笔记 <span class="stat-number">${totalWordCount}</span> 字`;
      }

      // 添加随机笔记跳转功能
      const randomNoteButton = document.getElementById("random-note");
      randomNoteButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (posts.length > 0) {
          const randomIndex = Math.floor(Math.random() * posts.length);
          const randomNote = posts[randomIndex];
          window.open(randomNote.href, "_blank");
        }
      });
    })
    .catch((error) => {
      console.error("Error loading data:", error);
      loadingSpinner.style.display = "none";
    })
    .finally(() => {
      loadingSpinner.style.display = "none";
    });
});

// 修改年份选择框的监听器
yearSelect.addEventListener("change", function () {
  const selectedYear = parseInt(this.value);
  if (posts.length > 0) {
    const startDate = getStartDate(selectedYear);
    fillGrid(posts, startDate);
  }
});

// 修改随机日记按钮的功能
const randomDiaryButton = document.getElementById("random-diary");
randomDiaryButton.addEventListener("click", function (event) {
  event.preventDefault();
  // 这里我们不需要实际跳转，因为这个按钮只是标题
});
