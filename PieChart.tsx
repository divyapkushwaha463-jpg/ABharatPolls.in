'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { PollOption } from '@/types';

Chart.register(...registerables);

interface PieChartProps {
  options: PollOption[];
  donut?: boolean;
}

const PARTY_COLORS: Record<string, string> = {
  'BJP': '#FF6B1A',
  'Congress': '#138808',
  'SP': '#E41E30',
  'AAP': '#1E40AF',
  'BSP': '#0047AB',
  'TMC': '#26A69A',
  'JDU': '#10B981',
  'NDA Alliance': '#FF6B1A',
  'INDIA Alliance': '#E41E30',
};

export default function PieChart({ options, donut = true }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !options.length) return;
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const colors = options.map(opt =>
      PARTY_COLORS[opt.party || ''] || opt.color || '#FF6B1A'
    );

    chartRef.current = new Chart(ctx, {
      type: donut ? 'doughnut' : 'pie',
      data: {
        labels: options.map(o => o.label),
        datasets: [{
          data: options.map(o => o.percentage || 0),
          backgroundColor: colors.map(c => c + 'CC'),
          borderColor: colors,
          borderWidth: 2,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: true,
          duration: 1000,
          easing: 'easeOutQuart',
        },
        cutout: donut ? '65%' : '0%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#D1D5DB',
              font: { family: 'Rajdhani, sans-serif', weight: 'bold', size: 12 },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 12,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(14, 21, 40, 0.95)',
            borderColor: 'rgba(255, 107, 26, 0.3)',
            borderWidth: 1,
            titleColor: '#FF8C42',
            bodyColor: '#E0E0E0',
            titleFont: { family: 'Rajdhani, sans-serif', weight: 'bold', size: 14 },
            bodyFont: { family: 'Hind, sans-serif', size: 13 },
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
            },
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [options, donut]);

  return (
    <div className="w-full" style={{ height: '260px' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
