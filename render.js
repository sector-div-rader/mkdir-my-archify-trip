const fs = require('fs');
const path = require('path');

// 讀取 trip.json 數據
const rawData = fs.readFileSync(path.join(__dirname, 'trip.json'), 'utf-8');
const tripData = JSON.parse(rawData);

// 建立真正的 Archify 高科技動態 HTML 頁面
const generateArchifyHTML = (data) => `
<!DOCTYPE html>
<html lang="zh-TW" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title} - Archify Live Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;600;700&display=swap');
    
    body {
      background-color: #070b12;
      color: #e2e8f0;
      font-family: 'Inter', sans-serif;
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(0, 243, 255, 0.08) 0%, transparent 60%),
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 100% 100%, 40px 40px, 40px 40px;
    }

    .archify-box {
      background: rgba(13, 19, 33, 0.85);
      border: 1px solid rgba(0, 243, 255, 0.25);
      box-shadow: 0 0 15px rgba(0, 243, 255, 0.05), inset 0 0 15px rgba(0, 243, 255, 0.03);
      backdrop-filter: blur(12px);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .archify-box:hover {
      border-color: rgba(0, 243, 255, 0.8);
      box-shadow: 0 0 25px rgba(0, 243, 255, 0.3), inset 0 0 20px rgba(0, 243, 255, 0.1);
      transform: translateY(-2px);
    }

    .archify-box.selected {
      border-color: #00f3ff;
      box-shadow: 0 0 30px rgba(0, 243, 255, 0.6);
    }

    /* Archify SVG 脈衝箭頭動畫 */
    .archify-flow-line {
      stroke: #00f3ff;
      stroke-width: 2;
      stroke-dasharray: 6 6;
      animation: archifyFlow 20s linear infinite;
    }

    @keyframes archifyFlow {
      from { stroke-dashoffset: 1000; }
      to { stroke-dashoffset: 0; }
    }
  </style>
</head>
<body class="p-4 md:p-8 min-h-screen relative overflow-x-hidden">

  <!-- Archify Dashboard Header -->
  <div class="max-w-6xl mx-auto mb-8 text-center border-b border-cyan-900/40 pb-6">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
      <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
      ARCHIFY ENGINE v2.4 (LIVE ARCHITECTURE)
    </div>
    <h1 class="text-3xl md:text-4xl font-bold text-white tracking-wide font-mono">${data.title}</h1>
  </div>

  <!-- Main Visual Canvas -->
  <div class="max-w-6xl mx-auto relative">
    
    <!-- Nodes Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      ${data.nodes.map(node => `
        <div id="node-${node.id}" onclick="selectNode('${node.id}')" class="archify-box p-5 rounded-xl cursor-pointer relative group">
          <div class="flex justify-between items-center mb-3">
            <span class="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              ${node.type || 'NODE'}
            </span>
            <span class="text-xs font-mono text-gray-500">#${node.id}</span>
          </div>
          <div class="text-lg font-bold text-gray-100 group-hover:text-cyan-300 transition-colors">
            ${node.label}
          </div>
          ${node.details ? `
            <div class="mt-4 pt-3 border-t border-gray-800/80 font-mono text-xs text-gray-400 space-y-1">
              ${Object.entries(node.details).map(([k, v]) => `
                <div class="flex justify-between"><span class="text-gray-500">${k}:</span><span class="text-cyan-300 font-semibold">${v}</span></div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>

    <!-- Edges Flow Section -->
    <div class="archify-box p-6 rounded-xl">
      <h3 class="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-4 border-l-2 border-cyan-400 pl-3">
        Runtime Execution Paths (動態航線與接送連線)
      </h3>
      <div class="space-y-3 font-mono">
        ${data.edges.map(edge => `
          <div id="edge-${edge.from}-${edge.to}" class="p-3.5 rounded-lg bg-gray-900/90 border border-gray-800 hover:border-cyan-500/50 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/80 text-xs">
                ${edge.from.toUpperCase()}
              </span>
              <svg class="w-6 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span class="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/80 text-xs">
                ${edge.to.toUpperCase()}
              </span>
            </div>
            <div class="text-xs text-cyan-200 bg-cyan-950/40 px-3 py-1.5 rounded border border-cyan-900/50">
              ${edge.label}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <script>
    function selectNode(id) {
      document.querySelectorAll('.archify-box').forEach(el => el.classList.remove('selected'));
      const el = document.getElementById('node-' + id);
      if (el) el.classList.add('selected');
    }
  </script>
</body>
</html>
`;

// 生成並寫入 index.html
fs.writeFileSync(path.join(__dirname, 'index.html'), generateArchifyHTML(tripData), 'utf-8');
console.log('✅ 真正的 Archify Live Engine index.html 已成功渲染！');
