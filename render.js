const fs = require('fs');
const path = require('path');

const rawData = fs.readFileSync(path.join(__dirname, 'trip.json'), 'utf-8');
const tripData = JSON.parse(rawData);

const archifyCanvasHTML = `
<!DOCTYPE html>
<html lang="zh-TW" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tripData.title} - Archify Live Canvas</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;600;700&display=swap');
    
    body {
      background-color: #030712;
      color: #94a3b8;
      font-family: 'Inter', sans-serif;
    }
    .font-mono { font-family: 'JetBrains Mono', monospace; }

    /* Archify Canvas Grid Background */
    .archify-bg {
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 24px 24px;
    }

    /* Node Style */
    .archify-node {
      background: rgba(11, 17, 32, 0.9);
      border: 1px solid rgba(0, 243, 255, 0.3);
      box-shadow: 0 0 12px rgba(0, 243, 255, 0.1);
      backdrop-filter: blur(8px);
      transition: all 0.2s ease;
    }
    .archify-node:hover, .archify-node.active {
      border-color: #00f3ff;
      box-shadow: 0 0 20px rgba(0, 243, 255, 0.4);
    }

    /* SVG Orthogonal Edge Flow Animation */
    .flow-line {
      stroke: #00f3ff;
      stroke-width: 2;
      stroke-dasharray: 6 6;
      animation: dashFlow 25s linear infinite;
    }
    @keyframes dashFlow {
      from { stroke-dashoffset: 1000; }
      to { stroke-dashoffset: 0; }
    }
  </style>
</head>
<body class="archify-bg min-h-screen flex flex-col p-4 md:p-6 select-none">

  <!-- Archify Top Navigation Bar -->
  <header class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
    <div class="flex items-center space-x-3">
      <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
      <h1 class="text-lg font-bold font-mono text-slate-100 tracking-tight">${tripData.title}</h1>
    </div>
    <div class="flex items-center space-x-2 font-mono text-xs">
      <span class="px-2.5 py-1 rounded border border-slate-700 bg-slate-900 text-slate-300">SIGNAL FLOW</span>
      <span class="px-2.5 py-1 rounded border border-cyan-800 bg-cyan-950/80 text-cyan-400">‹ Dark</span>
      <span class="px-2.5 py-1 rounded bg-cyan-500 text-black font-bold">● Live</span>
    </div>
  </header>

  <!-- Guided Stepper Banner -->
  <div class="bg-slate-900/60 border border-slate-800 rounded-lg p-3 mb-6 flex items-center justify-between font-mono text-xs">
    <div class="flex items-center space-x-3">
      <span class="text-cyan-400">GUIDED VIEWS 1 / 3 ➔</span>
      <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300">01 / 08</span>
      <span class="text-slate-200 font-bold">Trip Architecture Execution Route</span>
    </div>
    <div class="flex items-center space-x-3 text-slate-400">
      <span>NEXT: 02 - Route Router</span>
      <button class="hover:text-cyan-400">⏸ Pause</button>
    </div>
  </div>

  <!-- Canvas Stage (Lanes & Nodes) -->
  <main class="flex-1 relative border border-slate-800 rounded-xl bg-slate-950/80 p-6 overflow-hidden min-h-[600px]">
    
    <!-- Swimlanes Background Layer -->
    <div class="absolute inset-0 grid grid-cols-3 pointer-events-none divide-x divide-dashed divide-slate-800/60">
      <div class="p-3 text-[10px] font-mono text-slate-600 uppercase tracking-widest">Intake Surface</div>
      <div class="p-3 text-[10px] font-mono text-slate-600 uppercase tracking-widest">Plan + Processing</div>
      <div class="p-3 text-[10px] font-mono text-slate-600 uppercase tracking-widest font-bold text-cyan-950">Execute + Destination</div>
    </div>

    <!-- SVG Orthogonal Edges Canvas -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none z-10">
      <!-- Direct Flow Lines -->
      <path d="M 220 120 L 320 120 L 320 220 L 420 220" fill="none" class="flow-line" />
      <path d="M 580 220 L 680 220 L 680 340 L 780 340" fill="none" class="flow-line" />
    </svg>

    <!-- Interactive Nodes Layer -->
    <div class="relative z-20 space-y-8 max-w-5xl mx-auto">
      <div class="text-xs font-mono text-cyan-400 border-l-2 border-cyan-400 pl-2">NODES WORKFLOW</div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${tripData.nodes.map(node => `
          <div class="archify-node p-4 rounded-lg cursor-pointer">
            <div class="flex justify-between items-center mb-2">
              <span class="text-[9px] font-mono bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800 uppercase">${node.type}</span>
              <span class="text-[10px] font-mono text-slate-500">#${node.id}</span>
            </div>
            <div class="text-sm font-bold text-slate-100 font-mono">${node.label}</div>${node.details ? `
              <div class="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono space-y-1">
                ${Object.entries(node.details).map(([k, v]) => `
                  <div class="flex justify-between"><span class="text-slate-500">${k}:</span><span class="text-cyan-300">${v}</span></div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  </main>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), archifyCanvasHTML, 'utf-8');
console.log('✅ Archify 1:1 Canvas Workflow 儀表板生成完成！');
