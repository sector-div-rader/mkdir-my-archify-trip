const fs = require('fs');
const path = require('path');
const archify = require('archify'); // 引用已安裝的 archify 套件

async function buildDashboard() {
  try {
    // 1. 讀取 trip.json 檔案
    const jsonPath = path.join(__dirname, 'trip.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const tripData = JSON.parse(rawData);

    console.log('正在讀取行程資料：', tripData.title);

    // 2. 呼叫 Archify 進行圖表渲染
    // （根據套件 API 生成 HTML 內容）
    const htmlContent = await archify.render(tripData, {
      theme: 'dark',
      interactive: true,
      direction: 'LR' // LR 表示由左至右 (Left to Right) 流程圖
    });

    // 3. 將編譯結果寫入 output.html
    const outputPath = path.join(__dirname, 'index.html');
    fs.writeFileSync(outputPath, htmlContent, 'utf-8');

    console.log('✅ Archify 行程圖表生成成功！已儲存至：index.html');
  } catch (error) {
    console.error('❌ 生成失敗：', error.message);
  }
}

// 執行函數
buildDashboard();
