import React, { useRef, useCallback, useState } from 'react';
import { toPng } from 'html-to-image';
import { useDropzone } from 'react-dropzone';
import download from 'downloadjs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ImageMergerProps {
  mockupSrc?: string;
  screenshotSrc?: string;
}

const DEFAULT_MOCKUP = "";

const ImageMerger: React.FC<ImageMergerProps> = ({
  mockupSrc: initialMockupSrc = DEFAULT_MOCKUP,
  screenshotSrc: initialScreenshotSrc = "https://picsum.photos/1170/2532"
}) => {
  const mergeContainerRef = useRef<HTMLDivElement>(null);
  const [mockupSrc, setMockupSrc] = useState(initialMockupSrc);
  const [screenshotSrc, setScreenshotSrc] = useState(initialScreenshotSrc);
  
  // Vibe Check Controls
  const [padding, setPadding] = useState(8);
  const [borderRadius, setBorderRadius] = useState(32);
  const [containerWidth, setContainerWidth] = useState(308);
  
  // Mockup Controls
  const [mockupScale, setMockupScale] = useState(1.0);
  const [mockupOffsetX, setMockupOffsetX] = useState(0);
  const [mockupOffsetY, setMockupOffsetY] = useState(0);
  const [mockupWidthScale, setMockupWidthScale] = useState(1.0);
  const [mockupHeightScale, setMockupHeightScale] = useState(1.0);

  const [containerKey, setContainerKey] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string>('');

  const handleDownload = useCallback(async () => {
    if (mergeContainerRef.current === null) {
      setDownloadStatus('錯誤：無法找到預覽區域');
      return;
    }

    if (!screenshotSrc) {
      setDownloadStatus('請先上傳應用截圖');
      return;
    }

    setIsDownloading(true);
    setDownloadStatus('正在生成圖片...');

    try {
      await new Promise((resolve, reject) => {
        const img = new Image();
        if (!screenshotSrc.startsWith('data:')) {
          img.crossOrigin = 'anonymous';
        }
        img.onload = resolve;
        img.onerror = () => reject(new Error(`無法載入截圖: ${screenshotSrc}`));
        img.src = screenshotSrc;
      });

      if (mockupSrc) {
        await new Promise((resolve, reject) => {
          const img = new Image();
          if (!mockupSrc.startsWith('data:')) {
            img.crossOrigin = 'anonymous';
          }
          img.onload = resolve;
          img.onerror = () => reject(new Error(`無法載入手機外框: ${mockupSrc}`));
          img.src = mockupSrc;
        });
      }

      await new Promise(resolve => setTimeout(resolve, 50));

      const dataUrl = await toPng(mergeContainerRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        width: containerWidth,
        height: containerWidth * (19.5 / 9),
        style: {
          margin: '0',
          padding: '0'
        }
      });

      if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
        throw new Error('生成的圖片無效');
      }

      download(dataUrl, `mockup-${Date.now()}.png`);
      setDownloadStatus('圖片下載成功！');
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('無法創建 canvas 上下文');
        }

        const scale = 2;
        canvas.width = containerWidth * scale;
        canvas.height = (containerWidth * (19.5 / 9)) * scale;

        // 清除畫布（透明背景）
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 繪製白色圓角矩形作為手機本體
        ctx.save();
        ctx.beginPath();
        const outerRadius = 40 * scale;
        ctx.roundRect(0, 0, canvas.width, canvas.height, outerRadius);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();

        // 載入並繪製截圖
        const screenshotImg = new Image();
        if (!screenshotSrc.startsWith('data:')) {
          screenshotImg.crossOrigin = 'anonymous';
        }
        await new Promise((resolve, reject) => {
          screenshotImg.onload = resolve;
          screenshotImg.onerror = reject;
          screenshotImg.src = screenshotSrc;
        });

        // 繪製截圖（在內側區域，帶圓角）- 實現 object-fit: cover 效果
        const minPadding = 8 * scale;
        const p = Math.max(padding * scale, minPadding);
        const targetX = p;
        const targetY = p;
        const targetWidth = canvas.width - (p * 2);
        const targetHeight = canvas.height - (p * 2);

        // 計算縮放比例，實現 cover 效果
        const imgAspect = screenshotImg.width / screenshotImg.height;
        const targetAspect = targetWidth / targetHeight;

        let sourceX, sourceY, sourceWidth, sourceHeight;

        if (imgAspect > targetAspect) {
          // 圖片比較寬，裁剪左右
          sourceHeight = screenshotImg.height;
          sourceWidth = sourceHeight * targetAspect;
          sourceX = (screenshotImg.width - sourceWidth) / 2;
          sourceY = 0;
        } else {
          // 圖片比較高，裁剪上下
          sourceWidth = screenshotImg.width;
          sourceHeight = sourceWidth / targetAspect;
          sourceX = 0;
          sourceY = (screenshotImg.height - sourceHeight) / 2;
        }

        // 創建圓角矩形路徑
        ctx.save();
        ctx.beginPath();
        const radius = borderRadius * scale;
        ctx.roundRect(targetX, targetY, targetWidth, targetHeight, radius);
        ctx.clip();
        ctx.drawImage(
          screenshotImg,
          sourceX, sourceY, sourceWidth, sourceHeight,
          targetX, targetY, targetWidth, targetHeight
        );
        ctx.restore();

        // 載入並繪製手機框
        if (mockupSrc) {
          const mockupImg = new Image();
          mockupImg.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            mockupImg.onload = resolve;
            mockupImg.onerror = reject;
            mockupImg.src = mockupSrc;
          });

          // 繪製手機框（應用縮放和偏移）
          const mockupCenterX = canvas.width / 2;
          const mockupCenterY = canvas.height / 2;
          const mockupWidth = canvas.width * mockupWidthScale;
          const mockupHeight = canvas.height * mockupHeightScale;
          const mockupX = mockupCenterX - mockupWidth / 2 + mockupOffsetX * scale;
          const mockupY = mockupCenterY - mockupHeight / 2 + mockupOffsetY * scale;
          
          ctx.drawImage(mockupImg, mockupX, mockupY, mockupWidth, mockupHeight);
        }

        // 轉換為 data URL
        const dataUrl = canvas.toDataURL('image/png');

        if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
          throw new Error('生成的圖片無效');
        }

        download(dataUrl, `mockup-${Date.now()}.png`);
        setDownloadStatus('圖片下載成功！');
      } catch (backupErr) {
        console.error('備用方法也失敗:', backupErr);
        const errorMessage = backupErr instanceof Error ? backupErr.message : '未知錯誤';
        setDownloadStatus(`下載失敗: ${errorMessage}`);
      }
    } finally {
      setIsDownloading(false);
      setTimeout(() => setDownloadStatus(''), 5000);
    }
  }, [mockupSrc, screenshotSrc, containerWidth, padding, borderRadius, mockupWidthScale, mockupHeightScale, mockupOffsetX, mockupOffsetY]);

  const onScreenshotDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotSrc(e.target?.result as string);
        setContainerKey(prev => prev + 1);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const onMockupDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMockupSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const mockupDropzone = useDropzone({
    onDrop: onMockupDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false
  });

  const screenshotDropzone = useDropzone({
    onDrop: onScreenshotDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false
  });

  return (
    <div className="text-gray-900 p-8 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-6">Mockup 合併預覽</h2>

      {/* 主佈局：左右分欄 */}
      <div className="flex gap-8">
        {/* 左側：設定面板 */}
        <div className="w-96 space-y-6">
          {/* 上傳區域 */}
          <div className="flex flex-col gap-4">
            {/* 手機外框上傳 */}
            <div>
              <h3 className="text-lg font-semibold mb-2">手機外框</h3>
              <div
                {...mockupDropzone.getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  mockupDropzone.isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...mockupDropzone.getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    📱
                  </div>
                  <p className="text-sm text-gray-600">
                    {mockupSrc ? '點擊更換手機外框' : '拖拽或點擊上傳手機外框'}
                  </p>
                  <p className="text-xs text-gray-400">支援 PNG, JPG, GIF, WebP</p>
                </div>
              </div>
            </div>

            {/* 應用截圖上傳 */}
            <div>
              <h3 className="text-lg font-semibold mb-2">應用截圖</h3>
              <div
                {...screenshotDropzone.getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  screenshotDropzone.isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...screenshotDropzone.getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    📸
                  </div>
                  <p className="text-sm text-gray-600">
                    {screenshotSrc ? '點擊更換應用截圖' : '拖拽或點擊上傳應用截圖'}
                  </p>
                  <p className="text-xs text-gray-400">支援 PNG, JPG, GIF, WebP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vibe Check Controls */}
          <div className="space-y-4 p-6 text-gray-900 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-4">Vibe Check (微調設定)</h3>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>預覽大小 (Width)</Label>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{containerWidth}px</span>
                </div>
                <Slider
                  value={[containerWidth]}
                  onValueChange={(val) => setContainerWidth(val[0])}
                  min={200}
                  max={500}
                  step={10}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>內邊距 (Padding)</Label>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{padding}px</span>
                </div>
                <Slider
                  value={[padding]}
                  onValueChange={(val) => setPadding(val[0])}
                  min={0}
                  max={50}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>螢幕圓角 (Radius)</Label>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{borderRadius}px</span>
                </div>
                <Slider
                  value={[borderRadius]}
                  onValueChange={(val) => setBorderRadius(val[0])}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>

          {/* Mockup Controls - 手機外框調整 */}
          {mockupSrc && (
            <div className="space-y-4 p-6 text-gray-900 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-4">手機外框調整</h3>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>縮放 (Scale)</Label>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{mockupScale.toFixed(2)}x</span>
                  </div>
                  <Slider
                    value={[mockupScale]}
                    onValueChange={(val) => setMockupScale(val[0])}
                    min={0.5}
                    max={2.0}
                    step={0.05}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>寬度 (Width)</Label>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{mockupWidthScale.toFixed(2)}x</span>
                  </div>
                  <Slider
                    value={[mockupWidthScale]}
                    onValueChange={(val) => setMockupWidthScale(val[0])}
                    min={0.5}
                    max={2.0}
                    step={0.05}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>高度 (Height)</Label>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{mockupHeightScale.toFixed(2)}x</span>
                  </div>
                  <Slider
                    value={[mockupHeightScale]}
                    onValueChange={(val) => setMockupHeightScale(val[0])}
                    min={0.5}
                    max={2.0}
                    step={0.05}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>X 偏移</Label>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{mockupOffsetX}px</span>
                  </div>
                  <Slider
                    value={[mockupOffsetX]}
                    onValueChange={(val) => setMockupOffsetX(val[0])}
                    min={-50}
                    max={50}
                    step={1}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Y 偏移</Label>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{mockupOffsetY}px</span>
                  </div>
                  <Slider
                    value={[mockupOffsetY]}
                    onValueChange={(val) => setMockupOffsetY(val[0])}
                    min={-50}
                    max={50}
                    step={1}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 右側：預覽區域 */}
        <div className="flex flex-col items-center space-y-6">
          {/* 核心預覽容器 */}
          <div
            ref={mergeContainerRef}
            key={containerKey}
            className="relative bg-white rounded-[40px] shadow-lg"
            style={{ 
              width: `${containerWidth}px`,
              overflow: 'hidden',
              aspectRatio: '9/19.5'
            }}
          >
            {/* 底層：應用截圖 */}
            {screenshotSrc && (
              <img
                src={screenshotSrc}
                alt="App Screenshot"
                crossOrigin={screenshotSrc.startsWith('data:') ? undefined : "anonymous"}
                className="absolute object-cover z-0"
                style={{
                  top: `${padding}px`,
                  left: `${padding}px`,
                  width: `calc(100% - ${padding * 2}px)`,
                  height: `calc(100% - ${padding * 2}px)`,
                  borderRadius: `${borderRadius}px`,
                  backgroundColor: '#000000'
                }}
              />
            )}

            {/* 上層：手機外框 */}
            {mockupSrc && (
              <img
                src={mockupSrc}
                alt="Phone Mockup Frame"
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                style={{
                  transform: `scaleX(${mockupWidthScale}) scaleY(${mockupHeightScale}) translate(${mockupOffsetX}px, ${mockupOffsetY}px)`,
                  transformOrigin: 'center center'
                }}
              />
            )}
          </div>

          {/* 下載按鈕 */}
          <button
            onClick={handleDownload}
            disabled={isDownloading || !screenshotSrc}
            className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {isDownloading ? '生成中...' : '下載合併圖片'}
          </button>

          {downloadStatus && (
            <p className={`text-sm ${downloadStatus.includes('成功') ? 'text-green-600' : downloadStatus.includes('錯誤') || downloadStatus.includes('失敗') ? 'text-red-600' : 'text-blue-600'}`}>
              {downloadStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageMerger;
