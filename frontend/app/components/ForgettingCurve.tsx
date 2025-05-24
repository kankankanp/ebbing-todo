"use client";

import { useEffect, useRef, useState } from "react";

interface ForgettingCurveProps {
  studyCount: number;
  retention: number;
}

export default function ForgettingCurve({
  studyCount,
  retention,
}: ForgettingCurveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // デバイスピクセル比を取得
    const dpr = window.devicePixelRatio || 1;

    // キャンバスのサイズを設定（アスペクト比を16:9に近づける）
    const width = 800;
    const height = 450;

    // キャンバスの物理的なサイズを設定
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // キャンバスの表示サイズを設定
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // コンテキストのスケールを設定
    ctx.scale(dpr, dpr);

    // パディングを設定
    const padding = {
      top: 50,
      right: 40,
      bottom: 50,
      left: 60,
    };

    // 描画領域の計算
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    // 背景をクリア
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // グリッドを描画
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;

    // 横線
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (graphHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // 目盛りの値を描画
      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${100 - i * 25}%`, padding.left - 10, y + 4);
    }

    // 縦線
    for (let i = 0; i <= 4; i++) {
      const x = padding.left + (graphWidth / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();

      // 目盛りの値を描画
      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${i * 7}日`, x, height - padding.bottom + 20);
    }

    // 忘却曲線を描画
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const points = [];
    for (let i = 0; i <= 28; i++) {
      const x = padding.left + (graphWidth / 28) * i;
      const retention = Math.exp(-0.1 * i) * 100;
      const y = padding.top + graphHeight - (retention / 100) * graphHeight;
      points.push({ x, y });
    }

    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // 現在の学習状態を描画
    const currentX = padding.left + (graphWidth / 28) * studyCount;
    const currentRetention = Math.exp(-0.1 * studyCount) * 100;
    const currentY =
      padding.top + graphHeight - (currentRetention / 100) * graphHeight;

    // 点を描画
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
    ctx.fill();

    // 現在の値を表示
    ctx.fillStyle = "#1e40af";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.round(currentRetention)}%`, currentX, currentY - 20);

    // ホバー時の忘却率を表示
    if (isHovering) {
      const forgettingRate = 100 - Math.round(currentRetention);

      // ポップアップの背景
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1;

      const text = `忘却率: ${forgettingRate}%`;
      ctx.font = "bold 16px sans-serif";
      const textWidth = ctx.measureText(text).width;
      const padding = 10;

      // 背景の四角形を描画
      ctx.beginPath();
      ctx.roundRect(
        mousePosition.x - textWidth / 2 - padding,
        mousePosition.y - 40,
        textWidth + padding * 2,
        30,
        5
      );
      ctx.fill();
      ctx.stroke();

      // テキストを描画
      ctx.fillStyle = "#ef4444";
      ctx.textAlign = "center";
      ctx.fillText(text, mousePosition.x, mousePosition.y - 20);
    }
  }, [studyCount, retention, isHovering, mousePosition]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 点の位置を計算
    const padding = { left: 60, top: 50 };
    const graphWidth =
      canvas.width / (window.devicePixelRatio || 1) - padding.left - 40;
    const currentX = padding.left + (graphWidth / 28) * studyCount;
    const currentRetention = Math.exp(-0.1 * studyCount) * 100;
    const graphHeight =
      canvas.height / (window.devicePixelRatio || 1) - padding.top - 50;
    const currentY =
      padding.top + graphHeight - (currentRetention / 100) * graphHeight;

    // 点の周辺（半径20px以内）にマウスがあるかチェック
    const distance = Math.sqrt(
      Math.pow(x - currentX, 2) + Math.pow(y - currentY, 2)
    );
    setIsHovering(distance <= 20);
    setMousePosition({ x: currentX, y: currentY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}
