import React from 'react';
import "@google/model-viewer/lib/model-viewer"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerJSX & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

interface ModelViewerJSX {
  src: string
  poster?: string
  iosSrc?: string
  seamlessPoster?: boolean
  autoplay?: boolean
  environmentImage?: string
  exposure?: string
  interactionPromptThreshold?: string
  shadowIntensity?: string
  ar?: boolean
  arModes?: string
  autoRotate?: boolean
  cameraControls?: boolean
  cameraOrbit?: string
  alt?: string
  sx?: any
}

// TODO: handle ios model(*.usdz)
export const ModelViewer = (props: {src: string; cover: string}) => {
  const {src, cover} = props

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <model-viewer
        style={{width: "100%", height: "100%"}}
        id="first"
        src={src}
        // ios-src={iosSrc}
        seamless-poster
        environment-image="neutral"
        exposure="1.0"
        interaction-prompt-threshold="0"
        shadow-intensity="1"
        ar
        autoplay
        ar-modes="webxr scene-viewer quick-look"
        auto-rotate
        camera-controls
        camera-orbit="0deg 90deg 0deg 8.37364m"
        alt="3D fish model"
      >
        <div className="w-full h-full flex flex-col items-center justify-center" slot="poster">
          <img src={cover} />
        </div>
      </model-viewer>
    </div>
  )
}

export default ModelViewer
