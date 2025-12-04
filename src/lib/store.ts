import { create } from 'zustand'

export interface CanvasState {
  // Text
  title: string
  subtitle: string
  titleFontSize: number
  subtitleFontSize: number
  titleColor: string
  subtitleColor: string
  titleFontWeight: string
  subtitleFontWeight: string
  textPosition: 'top' | 'center' | 'bottom'
  titlePosition: { x: number; y: number }
  subtitlePosition: { x: number; y: number }

  // Background
  backgroundType: 'solid' | 'gradient' | 'image'
  backgroundColor: string
  backgroundImage: string | null
  gradientStart: string
  gradientEnd: string
  gradientDirection: 'to bottom' | 'to right' | 'to bottom right' | 'to top'

  // Device
  deviceType: 'iphone-15-pro' | 'iphone-15-pro-max' | 'pixel-8' | 'none'
  showDevice: boolean

  // Image
  uploadedImage: string | null
  imageFit: 'cover' | 'contain'

  // Layout
  padding: number

  // Actions
  setTitle: (title: string) => void
  setSubtitle: (subtitle: string) => void
  setTitleFontSize: (size: number) => void
  setSubtitleFontSize: (size: number) => void
  setTitleColor: (color: string) => void
  setSubtitleColor: (color: string) => void
  setTitleFontWeight: (weight: string) => void
  setSubtitleFontWeight: (weight: string) => void
  setTextPosition: (position: 'top' | 'center' | 'bottom') => void
  setTitlePosition: (position: { x: number; y: number }) => void
  setSubtitlePosition: (position: { x: number; y: number }) => void
  setBackgroundType: (type: 'solid' | 'gradient' | 'image') => void
  setBackgroundColor: (color: string) => void
  setBackgroundImage: (image: string | null) => void
  setGradientStart: (color: string) => void
  setGradientEnd: (color: string) => void
  setGradientDirection: (direction: 'to bottom' | 'to right' | 'to bottom right' | 'to top') => void
  setDeviceType: (type: 'iphone-15-pro' | 'iphone-15-pro-max' | 'pixel-8' | 'none') => void
  setShowDevice: (show: boolean) => void
  setUploadedImage: (image: string | null) => void
  setImageFit: (fit: 'cover' | 'contain') => void
  setPadding: (padding: number) => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
  // Initial state
  title: 'Your App Name',
  subtitle: 'Beautiful app description goes here',
  titleFontSize: 48,
  subtitleFontSize: 24,
  titleColor: '#ffffff',
  subtitleColor: '#ffffff',
  titleFontWeight: 'bold',
  subtitleFontWeight: 'normal',
  textPosition: 'bottom',
  titlePosition: { x: 20, y: 100 },
  subtitlePosition: { x: 20, y: 160 },

  backgroundType: 'solid',
  backgroundColor: '#1a1a1a',
  backgroundImage: null,
  gradientStart: '#1a1a1a',
  gradientEnd: '#4a4a4a',
  gradientDirection: 'to bottom',

  deviceType: 'iphone-15-pro-max',
  showDevice: true,

  uploadedImage: null,
  imageFit: 'cover',

  padding: 40,

  // Actions
  setTitle: (title) => set({ title }),
  setSubtitle: (subtitle) => set({ subtitle }),
  setTitleFontSize: (titleFontSize) => set({ titleFontSize }),
  setSubtitleFontSize: (subtitleFontSize) => set({ subtitleFontSize }),
  setTitleColor: (titleColor) => set({ titleColor }),
  setSubtitleColor: (subtitleColor) => set({ subtitleColor }),
  setTitleFontWeight: (titleFontWeight) => set({ titleFontWeight }),
  setSubtitleFontWeight: (subtitleFontWeight) => set({ subtitleFontWeight }),
  setTextPosition: (textPosition) => set({ textPosition }),
  setTitlePosition: (titlePosition) => set({ titlePosition }),
  setSubtitlePosition: (subtitlePosition) => set({ subtitlePosition }),
  setBackgroundType: (backgroundType) => set({ backgroundType }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setBackgroundImage: (backgroundImage) => set({ backgroundImage }),
  setGradientStart: (gradientStart) => set({ gradientStart }),
  setGradientEnd: (gradientEnd: string) => set({ gradientEnd }),
  setGradientDirection: (gradientDirection: 'to bottom' | 'to right' | 'to bottom right' | 'to top') => set({ gradientDirection }),
  setDeviceType: (deviceType) => set({ deviceType }),
  setShowDevice: (showDevice) => set({ showDevice }),
  setUploadedImage: (uploadedImage) => set({ uploadedImage }),
  setImageFit: (imageFit) => set({ imageFit }),
  setPadding: (padding) => set({ padding }),
}))