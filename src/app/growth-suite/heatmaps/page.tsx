'use client';

import { useState, useEffect, useRef } from 'react';
import { Eye, MousePointer, ArrowDown, Play, Download, Code } from 'lucide-react';
import {
  type PageHeatmap,
  generatePageHeatmap,
  generateTrackingScript,
  exportHeatmapCSV,
  getHeatmapIntensity
} from '@/lib/growth-suite/heatmaps';

const samplePages = [
  '/pricing',
  '/features',
  '/about',
  '/contact',
  '/blog',
  '/dashboard'
];

type HeatmapType = 'click' | 'scroll' | 'move';

export default function HeatmapsPage() {
  const [selectedPage, setSelectedPage] = useState('/pricing');
  const [selectedType, setSelectedType] = useState<HeatmapType>('click');
  const [heatmapData, setHeatmapData] = useState<PageHeatmap | null>(null);
  const [showTrackingCode, setShowTrackingCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate heatmap data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = generatePageHeatmap(selectedPage, 150);
      setHeatmapData(data);
      setIsLoading(false);
    }, 500);
  }, [selectedPage]);

  // Draw heatmap on canvas
  useEffect(() => {
    if (!heatmapData || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (selectedType === 'click') {
      // Draw click heatmap
      const gridSize = 5;
      
      for (let x = 0; x < 100; x += gridSize) {
        for (let y = 0; y < 100; y += gridSize) {
          const intensity = getHeatmapIntensity(x, y, heatmapData.clickHeatmap, 10);
          
          if (intensity > 0) {
            const alpha = intensity;
            const hue = 60 - (intensity * 60); // Yellow to red
            ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha * 0.6})`;
            ctx.fillRect(
              (x / 100) * canvas.width,
              (y / 100) * canvas.height,
              (gridSize / 100) * canvas.width,
              (gridSize / 100) * canvas.height
            );
          }
        }
      }
      
      // Draw click points
      heatmapData.clickHeatmap.forEach(click => {
        const x = (click.x / 100) * canvas.width;
        const y = (click.y / 100) * canvas.height;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.fill();
      });
    } else if (selectedType === 'scroll') {
      // Draw scroll depth visualization
      const depths = [0, 25, 50, 75, 100];
      const distribution = heatmapData.scrollDepthDistribution;
      
      depths.forEach((depth) => {
        const y = (depth / 100) * canvas.height;
        const count = distribution.find(d => d.depth === depth)?.count || 0;
        const maxCount = Math.max(...distribution.map(d => d.count));
        const intensity = count / maxCount;
        
        // Draw horizontal bar
        ctx.fillStyle = `rgba(245, 158, 11, ${intensity * 0.5})`;
        ctx.fillRect(0, y - 2, canvas.width, 4);
        
        // Draw label
        ctx.fillStyle = '#F59E0B';
        ctx.font = '12px sans-serif';
        ctx.fillText(`${depth}% - ${count} users`, 10, y - 10);
      });
      
      // Draw average scroll line
      const avgY = (heatmapData.avgScrollDepth / 100) * canvas.height;
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, avgY);
      ctx.lineTo(canvas.width, avgY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`Avg: ${heatmapData.avgScrollDepth}%`, canvas.width - 100, avgY - 10);
    }
  }, [heatmapData, selectedType]);

  const handleExportCSV = () => {
    if (!heatmapData) return;
    
    const csv = exportHeatmapCSV(heatmapData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heatmap-${selectedPage.replace(/\//g, '-')}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyTrackingCode = () => {
    const code = generateTrackingScript('demo-site-id');
    navigator.clipboard.writeText(code);
  };

  const totalSessions = heatmapData?.totalSessions || 0;
  const totalClicks = heatmapData?.totalClicks || 0;
  const avgScrollDepth = heatmapData?.avgScrollDepth || 0;

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-bg-secondary border border-border-primary rounded-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-[#F59E0B]">
                  <Eye className="h-6 w-6 text-black" />
                </div>
                <h1 className="text-4xl font-bold text-text-primary">Heatmaps & Session Recordings</h1>
              </div>
              <p className="text-lg text-text-secondary">
                Visualize user behavior and watch session replays
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTrackingCode(!showTrackingCode)}
                className="px-4 py-2 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary hover:bg-bg-hover transition-colors flex items-center"
              >
                <Code className="h-5 w-5 mr-2" />
                Tracking Code
              </button>
              <button
                onClick={handleExportCSV}
                disabled={!heatmapData}
                className="px-4 py-2 rounded-lg bg-[#F59E0B] text-black hover:bg-[#D97706] transition-colors flex items-center font-semibold disabled:opacity-50"
              >
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Total Sessions</span>
              <Play className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <div className="text-3xl font-bold text-text-primary">{totalSessions.toLocaleString()}</div>
          </div>

          <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Total Clicks</span>
              <MousePointer className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <div className="text-3xl font-bold text-text-primary">{totalClicks.toLocaleString()}</div>
          </div>

          <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Avg Scroll Depth</span>
              <ArrowDown className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <div className="text-3xl font-bold text-text-primary">{avgScrollDepth}%</div>
          </div>
        </div>

        {/* Tracking Code Modal */}
        {showTrackingCode && (
          <div className="mb-8 bg-bg-secondary border border-border-primary rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Tracking Script</h2>
              <button
                onClick={handleCopyTrackingCode}
                className="px-3 py-2 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary hover:bg-bg-hover transition-all text-sm"
              >
                Copy Code
              </button>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-text-secondary font-mono">
                {generateTrackingScript('demo-site-id')}
              </pre>
            </div>
            <p className="text-sm text-text-tertiary mt-4">
              Add this script before the closing &lt;/body&gt; tag on your website to start tracking user behavior.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Page Selection */}
          <div className="space-y-6">
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-text-primary">Select Page</h2>
              <div className="space-y-2">
                {samplePages.map((page) => (
                  <button
                    key={page}
                    onClick={() => setSelectedPage(page)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedPage === page
                        ? 'bg-[#F59E0B]/10 border border-[#F59E0B] text-text-primary'
                        : 'bg-bg-tertiary border border-border-primary text-text-secondary hover:border-border-hover'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-text-primary">Heatmap Type</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedType('click')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                    selectedType === 'click'
                      ? 'bg-[#F59E0B]/10 border border-[#F59E0B] text-text-primary'
                      : 'bg-bg-tertiary border border-border-primary text-text-secondary hover:border-border-hover'
                  }`}
                >
                  <MousePointer className="h-5 w-5 mr-3" />
                  Click Heatmap
                </button>
                <button
                  onClick={() => setSelectedType('scroll')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                    selectedType === 'scroll'
                      ? 'bg-[#F59E0B]/10 border border-[#F59E0B] text-text-primary'
                      : 'bg-bg-tertiary border border-border-primary text-text-secondary hover:border-border-hover'
                  }`}
                >
                  <ArrowDown className="h-5 w-5 mr-3" />
                  Scroll Depth
                </button>
              </div>
            </div>

            {/* Top Clicked Elements */}
            {heatmapData && selectedType === 'click' && (
              <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-text-primary">Top Clicked Elements</h2>
                <div className="space-y-3">
                  {heatmapData.topClickedElements.slice(0, 5).map((item, index) => (
                    <div key={item.element} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center text-xs font-bold mr-3">
                          {index + 1}
                        </span>
                        <span className="text-text-primary text-sm">{item.element}</span>
                      </div>
                      <span className="text-text-secondary text-sm font-semibold">{item.clicks}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Heatmap Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-primary">
                  {selectedType === 'click' ? 'Click Heatmap' : 'Scroll Depth Analysis'}
                </h2>
                <span className="text-sm text-text-tertiary">
                  {heatmapData?.totalSessions} sessions
                </span>
              </div>

              {isLoading ? (
                <div className="bg-bg-tertiary rounded-lg p-12 text-center">
                  <div className="animate-spin h-12 w-12 border-4 border-[#F59E0B] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-text-secondary">Generating heatmap...</p>
                </div>
              ) : (
                <div className="bg-bg-elevated rounded-lg p-4 relative">
                  {/* Simulated page preview */}
                  <div className="relative bg-white rounded-lg overflow-hidden" style={{ height: '600px' }}>
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={600}
                      className="absolute inset-0 w-full h-full"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                    
                    {/* Page mockup overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="h-20 bg-gray-100 border-b border-gray-200 flex items-center px-6">
                        <div className="w-32 h-8 bg-gray-300 rounded"></div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="h-48 bg-gray-200 rounded-lg"></div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-32 bg-gray-200 rounded-lg"></div>
                          <div className="h-32 bg-gray-200 rounded-lg"></div>
                          <div className="h-32 bg-gray-200 rounded-lg"></div>
                        </div>
                        <div className="h-24 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm text-text-tertiary">
                    <span>Simulated page: {selectedPage}</span>
                    <span>
                      {selectedType === 'click' ? `${totalClicks} clicks tracked` : `Avg depth: ${avgScrollDepth}%`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
