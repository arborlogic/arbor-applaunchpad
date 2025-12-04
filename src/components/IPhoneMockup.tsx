import React from 'react'

interface IPhoneMockupProps {
  screenshot?: string | null
  deviceType: 'iphone-15-pro' | 'iphone-15-pro-max' | 'pixel-8' | 'none'
  showDevice: boolean
}

export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({
  screenshot,
  deviceType,
  showDevice
}) => {
  if (!showDevice || deviceType === 'none') {
    return (
      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 rounded-2xl">
        {screenshot ? (
          <img
            src={screenshot}
            alt="App screenshot"
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          'Upload an image to get started'
        )}
      </div>
    )
  }

  const dimensions = {
    'iphone-15-pro': { width: 390, height: 844 },
    'iphone-15-pro-max': { width: 430, height: 932 },
    'pixel-8': { width: 412, height: 915 }
  }

  const { width, height } = dimensions[deviceType]

  return (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      {/* iPhone Frame */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 drop-shadow-2xl"
      >
        {/* Main body */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="40"
          ry="40"
          fill="#1a1a1a"
          stroke="#333"
          strokeWidth="1"
        />

        {/* Screen area (transparent cutout) */}
        <rect
          x="12"
          y="12"
          width={width - 24}
          height={height - 24}
          rx="28"
          ry="28"
          fill="#000"
          opacity="0.1"
        />

        {/* Top notch/speaker */}
        <rect
          x={width / 2 - 80}
          y="8"
          width="160"
          height="6"
          rx="3"
          fill="#333"
        />

        {/* Front camera */}
        <circle
          cx={width / 2}
          cy="16"
          r="8"
          fill="#333"
        />

        {/* Side button */}
        <rect
          x="-2"
          y={height / 2 - 30}
          width="6"
          height="60"
          rx="3"
          fill="#666"
        />

        {/* Volume buttons */}
        <rect
          x="-2"
          y={height / 2 - 90}
          width="6"
          height="30"
          rx="3"
          fill="#666"
        />
        <rect
          x="-2"
          y={height / 2 + 60}
          width="6"
          height="30"
          rx="3"
          fill="#666"
        />

        {/* Home indicator for iPhone */}
        {deviceType.includes('iphone') && (
          <rect
            x={width / 2 - 60}
            y={height - 16}
            width="120"
            height="4"
            rx="2"
            fill="#666"
          />
        )}

        {/* Pixel navigation bar */}
        {deviceType === 'pixel-8' && (
          <rect
            x="20"
            y={height - 20}
            width={width - 40}
            height="8"
            rx="4"
            fill="#333"
          />
        )}
      </svg>

      {/* Screenshot inside screen area */}
      {screenshot && (
        <div
          className="absolute"
          style={{
            top: '12px',
            left: '12px',
            width: `${width - 24}px`,
            height: `${height - 24}px`,
            borderRadius: '28px',
            overflow: 'hidden',
            background: 'black'
          }}
        >
          <img
            src={screenshot}
            alt="App screenshot"
            className="w-full h-full object-cover"
            style={{
              borderRadius: '28px'
            }}
          />
        </div>
      )}
    </div>
  )
}