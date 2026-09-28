const fs = require('fs');
const path = require('path');

const rawData = fs.readFileSync(path.join(__dirname, 'trip.json'), 'utf-8');
const data = JSON.parse(rawData);

const htmlContent = `
<!DOCTYPE html>
<html lang="zh-TW" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #070b12; color: #e2e8f0; font-family: system-ui, -apple-system, sans-serif; }
    .archify-card {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(0, 243, 255, 0.2);
      backdrop-filter: blur(8px);
      transition: all 0.3s ease;
    }
    .archify-card:hover {
      border-color: rgba(0, 243, 255, 0.8);
      box-shadow: 0 0 15px rgba(0, 243, 255, 0.3);
      transform: translateY(-2px);
    }
    .archify-card.active {
      border-color: #00f3ff;
      box-shadow: 0 0 20px rgba(0, 243, 255, 0.5);
    }
    .pulse-line {
      stroke-dasharray: 8, 8;
      animation: dash 30s linear infinite;
    }
    @keyframes dash {
      to { stroke-dashoffset: -1000; }
    }
  </style>
</head>
<body class="p-6 md:p-10 min-h-screen relative overflow-x-hidden">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-10 border-b border-gray-800 pb-6">
      <span class="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/80 tracking-widest uppercase">
        Archify System Dashboard
      </span>
      <h1 class="text-3xl font-bold text-white mt-3 tracking-wide">${data.title}</h1>
      <p class="text-xs text-gray-500 mt-2 font-mono">點擊下方卡片可高亮對應航程路線</p>
    </div>

    <!-- Nodes Grid -->
    <div class="mb-12">
      <h2 class="text-sm font-mono text-cyan-400 border-l-2 border-cyan-400 pl-3 mb-6 uppercase tracking-wider">
        Trip Nodes (節點)
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        ${data.nodes.map(node => `
          <div id="node-${node.id}" onclick="highlightNode('${node.id}')" class="archify-card p-5 rounded-xl cursor-pointer relative group">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/50">${node.type}</span>
              <span class="text-xs font-mono text-gray-500">ID: ${node.id}</span>
            </div>
            <div class="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">${node.label}</div>
            <div class="mt-3 pt-3 border-t border-gray-800/80 text-xs text-gray-400 font-mono space-y-1">
              ${Object.entries(node.details || {}).map(([k, v]) => `
                <div class="flex justify-between"><span class="text-gray-500">${k}:</span> <span class="text-cyan-200">${v}</span></div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Edges Flow -->
    <div>
      <h2 class="text-sm font-mono text-cyan-400 border-l-2 border-cyan-400 pl-3 mb-6 uppercase tracking-wider">
        Route Connections (航班與連線)
      </h2>
      <div class="space-y-3">
        ${data.edges.map(edge => `
          <div id="edge-${edge.from}-${edge.to}" class="archify-card p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-2 border-l-4 border-l-cyan-500">
            <div class="flex items-center space-x-3 font-mono text-sm">
              <span class="px-2 py-1 bg-cyan-950 text-cyan-300 rounded border border-cyan-800/60 font-bold">${edge.from}</span>
              <span class="text-cyan-500 animate-pulse">➔</span>
              <span class="px-2 py-1 bg-cyan-950 text-cyan-300 rounded border border-cyan-800/60 font-bold">${edge.to}</span>
            </div>
            <div class="text-sm font-semibold text-gray-200 font-mono bg-gray-900/80 px-3 py-1 rounded border border-gray-800">
              ${edge.label}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <script>
    function highlightNode(nodeId) {
      document.querySelectorAll('.archify-card').forEach(el => el.classList.remove('active'));
      const card = document.getElementById('node-' + nodeId);
      if (card) card.classList.add('active');
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent, 'utf-8');
console.log('✅ 成功生成具備 Archify 互動視覺效果的 index.html！');
