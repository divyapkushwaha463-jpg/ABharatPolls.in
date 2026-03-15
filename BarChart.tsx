'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { PollOption } from '@/types';

Chart.register(...registerables);

interface BarChartProps {
  options: PollOption[];
  title?: string;
}

const PARTY_COLORS: Record<string, string> = {
  'BJP': '#FF6B1A',
  'Congress': '#138808',
  'SP': '#E41E30',
  'AAP': '#1E40AF',
  'BSP': '#0047AB',
  'TMC': '#26A69A',
  'JDU': '#10B981',
};

export default function BarChart({ options, title }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !options.length) return;

    // Destroy existing
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const colors = options.map(opt =>
      PARTY_COLORS[opt.party || ''] || opt.color || '#FF6B1A'
    );

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: options.map(o => o.label),
        datasets: [{
          label: 'Votes %',
          data: options.map(o => o.percentage || 0),
          backgroundColor: colors.map(c => c + 'CC'),
          borderColor: colors,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: { display: false },
          title: title ? {
            display: true,
            text: title,
            color: '#F0F0F0',
            font: { size: 14, family: 'Rajdhani, sans-serif', weight: 'bold' },
            padding: { bottom: 16 },
          } : { display: false },
          tooltip: {
            backgroundColor: 'rgba(14, 21, 40, 0.95)',
            borderColor: 'rgba(255, 107, 26, 0.3)',
            borderWidth: 1,
            titleColor: '#FF8C42',
            bodyColor: '#E0E0E0',
            titleFont: { family: 'Rajdhani, sans-serif', weight: 'bold', size: 14 },
            bodyFont: { family: 'Hind, sans-serif', size: 13 },
            padding: 12,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y}% of votes`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#9CA3AF',
              font: { family: 'Rajdhani, sans-serif', weight: 'bold', size: 13 },
            },
            border: { color: 'rgba(255,255,255,0.05)' },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: '#6B7280',
              font: { family: 'Hind, sans-serif', size: 11 },
              callback: (val) => `${val}%`,
            },
            border: { color: 'rgba(255,255,255,0.05)' },
            max: 100,
            min: 0,
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [options, title]);

  return (
    <div className="w-full" style={{ height: '280px' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
