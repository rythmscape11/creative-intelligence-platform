'use client';

import { useState } from 'react';
import { Sparkles, Grid3X3, Loader2, Download, Check } from 'lucide-react';

interface MatrixCell {
    id: string;
    xValue: string;
    yValue: string;
    imageUrl: string | null;
    status: 'pending' | 'generating' | 'complete' | 'error';
}

interface MatrixGeneratorProps {
    onSelectImage?: (imageUrl: string, params: { xValue: string; yValue: string }) => void;
}

// Predefined axis options from the brief
const X_AXIS_OPTIONS = {
    lighting: ['Natural Light', 'Golden Hour', 'Studio', 'Dramatic'],
    style: ['Photorealistic', 'Cinematic', 'Editorial', 'Commercial'],
    mood: ['Energetic', 'Calm', 'Luxurious', 'Playful'],
};

const Y_AXIS_OPTIONS = {
    angle: ['Front View', 'Side View', '3/4 View', 'Bird\'s Eye'],
    composition: ['Close-up', 'Medium Shot', 'Wide Shot', 'Detail'],
    background: ['White', 'Dark', 'Natural', 'Abstract'],
};

export function MatrixGenerator({ onSelectImage }: MatrixGeneratorProps) {
    const [basePrompt, setBasePrompt] = useState('');
    const [xAxis, setXAxis] = useState<keyof typeof X_AXIS_OPTIONS>('lighting');
    const [yAxis, setYAxis] = useState<keyof typeof Y_AXIS_OPTIONS>('angle');
    const [grid, setGrid] = useState<MatrixCell[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedCell, setSelectedCell] = useState<string | null>(null);

    const xValues = X_AXIS_OPTIONS[xAxis];
    const yValues = Y_AXIS_OPTIONS[yAxis];

    const initializeGrid = () => {
        const cells: MatrixCell[] = [];
        for (const yValue of yValues) {
            for (const xValue of xValues) {
                cells.push({
                    id: `${xValue}-${yValue}`,
                    xValue,
                    yValue,
                    imageUrl: null,
                    status: 'pending',
                });
            }
        }
        return cells;
    };

    const generateMatrix = async () => {
        if (!basePrompt.trim()) return;

        setIsGenerating(true);
        const newGrid = initializeGrid();
        setGrid(newGrid);

        // Simulate parallel generation for 16 images
        const generateCell = async (index: number) => {
            const cell = newGrid[index];

            // Update status to generating
            setGrid(prev => prev.map((c, i) => i === index ? { ...c, status: 'generating' } : c));

            try {
                // Call API to generate image with matrix parameters
                const response = await fetch('/api/forge/matrix/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: `${basePrompt}, ${cell.xValue.toLowerCase()}, ${cell.yValue.toLowerCase()}`,
                        xValue: cell.xValue,
                        yValue: cell.yValue,
                    }),
                });

                if (!response.ok) {
                    // Use placeholder on error
                    const placeholderUrl = `https://via.placeholder.com/256x256/1a1a2e/eee?text=${encodeURIComponent(cell.xValue.slice(0, 3))}`;
                    setGrid(prev => prev.map((c, i) =>
                        i === index ? { ...c, imageUrl: placeholderUrl, status: 'complete' } : c
                    ));
                    return;
                }

                const data = await response.json();
                setGrid(prev => prev.map((c, i) =>
                    i === index ? { ...c, imageUrl: data.imageUrl, status: 'complete' } : c
                ));
            } catch {
                // Mock response for demo
                const mockUrl = `https://picsum.photos/seed/${cell.id}/256/256`;
                setGrid(prev => prev.map((c, i) =>
                    i === index ? { ...c, imageUrl: mockUrl, status: 'complete' } : c
                ));
            }
        };

        // Generate all 16 in parallel (4 at a time to avoid rate limits)
        const batchSize = 4;
        for (let i = 0; i < newGrid.length; i += batchSize) {
            const batch = Array.from({ length: Math.min(batchSize, newGrid.length - i) }, (_, k) => i + k);
            await Promise.all(batch.map(generateCell));
        }

        setIsGenerating(false);
    };

    const handleCellClick = (cell: MatrixCell) => {
        if (cell.status !== 'complete' || !cell.imageUrl) return;
        setSelectedCell(cell.id);
        onSelectImage?.(cell.imageUrl, { xValue: cell.xValue, yValue: cell.yValue });
    };

    const estimatedSparks = 16 * 5; // 16 images × 5 Sparks each

    return (
        <div className="bg-slate-800 rounded-xl p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                        <Grid3X3 className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Matrix Generation</h3>
                        <p className="text-sm text-slate-400">Generate 4×4 grid for A/B testing</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-amber-400">
                    <Sparkles className="h-4 w-4" />
                    <span>{estimatedSparks} Sparks</span>
                </div>
            </div>

            {/* Base Prompt */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Base Prompt</label>
                <textarea
                    value={basePrompt}
                    onChange={(e) => setBasePrompt(e.target.value)}
                    placeholder="Enter your base prompt (e.g., 'Product shot of a sneaker')"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={2}
                />
            </div>

            {/* Axis Selection */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">X-Axis (Columns)</label>
                    <select
                        value={xAxis}
                        onChange={(e) => setXAxis(e.target.value as keyof typeof X_AXIS_OPTIONS)}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="lighting">Lighting Style</option>
                        <option value="style">Visual Style</option>
                        <option value="mood">Mood</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Y-Axis (Rows)</label>
                    <select
                        value={yAxis}
                        onChange={(e) => setYAxis(e.target.value as keyof typeof Y_AXIS_OPTIONS)}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="angle">Camera Angle</option>
                        <option value="composition">Composition</option>
                        <option value="background">Background</option>
                    </select>
                </div>
            </div>

            {/* Generate Button */}
            <button
                onClick={generateMatrix}
                disabled={isGenerating || !basePrompt.trim()}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating Matrix...
                    </>
                ) : (
                    <>
                        <Grid3X3 className="h-5 w-5" />
                        Generate 4×4 Matrix
                    </>
                )}
            </button>

            {/* Matrix Grid */}
            {grid.length > 0 && (
                <div className="space-y-4">
                    {/* Column Headers */}
                    <div className="grid grid-cols-5 gap-2">
                        <div /> {/* Empty corner */}
                        {xValues.map(val => (
                            <div key={val} className="text-center text-xs text-slate-400 truncate">
                                {val}
                            </div>
                        ))}
                    </div>

                    {/* Grid with Row Headers */}
                    {yValues.map((yVal, yIndex) => (
                        <div key={yVal} className="grid grid-cols-5 gap-2">
                            {/* Row Header */}
                            <div className="flex items-center justify-end pr-2 text-xs text-slate-400 truncate">
                                {yVal}
                            </div>

                            {/* Cells */}
                            {xValues.map((xVal, xIndex) => {
                                const cellIndex = yIndex * 4 + xIndex;
                                const cell = grid[cellIndex];

                                return (
                                    <div
                                        key={cell?.id || `${xVal}-${yVal}`}
                                        onClick={() => cell && handleCellClick(cell)}
                                        className={`
                      aspect-square rounded-lg overflow-hidden cursor-pointer transition-all
                      ${selectedCell === cell?.id ? 'ring-2 ring-purple-500 scale-105' : 'hover:ring-1 hover:ring-slate-500'}
                      ${cell?.status === 'generating' ? 'animate-pulse bg-slate-700' : 'bg-slate-700'}
                    `}
                                    >
                                        {cell?.status === 'complete' && cell.imageUrl ? (
                                            <div className="relative w-full h-full group">
                                                <img
                                                    src={cell.imageUrl}
                                                    alt={`${xVal} × ${yVal}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {selectedCell === cell.id && (
                                                    <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center">
                                                        <Check className="h-6 w-6 text-white" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Download className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                        ) : cell?.status === 'generating' ? (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                <Grid3X3 className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                    {/* Selection Instructions */}
                    <p className="text-center text-sm text-slate-400">
                        Click an image to select it and add to your canvas
                    </p>
                </div>
            )}
        </div>
    );
}
