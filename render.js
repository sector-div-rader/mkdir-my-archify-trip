const fs = require('fs');
const path = require('path');

// 讀取 trip.json
const rawData = fs.readFileSync(path.join(__dirname, 'trip.json'), 'utf-8');
const data = JSON.parse(rawData);

// 生成 HTML 網頁內容
const htmlContent = `
<!DOCTYPE html>
<html lang="zh-TW" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #070b12; color: #e2e8f0; font-family: system-ui, sans-serif; }
    .neon-card { border: 1px solid rgba(0, 243, 255, 0.3); box-shadow: 0 0 10px rgba(0, 243, 255, 0.15); }
  </style>
</head>
<body class="p-6 md:p-10">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-8 border-b border-gray-800 pb-4">
      <span class="text-xs font-mono text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">ARCHIFY WORKFLOW DASHBOARD</span>
      <h1 class="text-3xl font-bold text-white mt-3">${data.title}</h1>
    </div>

    <div class="space-y-6">
      <h2 class="text-xl font-bold text-cyan-400 border-l-4 border-cyan-400 pl-3">行程節點 (Nodes)</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${data.nodes.map(node => `
          <div class="p-4 bg-gray-900 rounded-lg neon-card">
            <div class="text-xs text-cyan-400 font-mono uppercase">${node.type}</div>
            <div class="text-lg font-bold text-white mt-1">${node.label}</div>
            <div class="text-xs text-gray-400 mt-2">${JSON.stringify(node.details || {})}</div>
          </div>
        `).join('')}
      </div>

      <h2 class="text-xl font-bold text-cyan-400 border-l-4 border-cyan-400 pl-3 mt-8">航程與接送連線 (Edges)</h2>
      <div class="space-y-3">
        ${data.edges.map(edge => `
          <div class="p-3 bg-gray-900/60 rounded border border-gray-800 flex items-center justify-between text-sm">
            <span class="font-mono text-cyan-300">${edge.from} ➔${edge.to}</span>
            <span class="text-gray-300 font-bold">${edge.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</body>
</html>
`;

// 寫入根目錄 index.html
fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent, 'utf-8');
console.log('✅ 成功生成 index.html！');
