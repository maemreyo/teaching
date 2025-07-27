'use client'

export interface RecordingConfig {
  mimeType?: string
  audioBitsPerSecond?: number
  videoBitsPerSecond?: number
  bitsPerSecond?: number
  timeslice?: number
  constraints?: MediaStreamConstraints
}

export interface RecordingData {
  blob: Blob
  url: string
  duration: number
  size: number
  mimeType: string
}

export interface AudioAnalysis {
  volume: number
  frequency: number[]
  pitch: number
  clarity: number
}

class MediaRecorderAPI {
  private mediaRecorder: MediaRecorder | null = null
  private mediaStream: MediaStream | null = null
  private recordedChunks: Blob[] = []
  private isRecording = false
  private isPaused = false
  private startTime = 0
  private pausedTime = 0
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private dataArray: Uint8Array | null = null

  // Check browser support
  isSupported(): boolean {
    return typeof window !== 'undefined' && 
           'MediaRecorder' in window && 
           'getUserMedia' in navigator.mediaDevices
  }

  // Initialize recording with microphone access
  async initialize(config: RecordingConfig = {}): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('MediaRecorder not supported in this browser')
    }

    try {
      // Default constraints for audio recording
      const defaultConstraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        },
        video: false
      }

      const constraints = config.constraints || defaultConstraints
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

      // Set up audio analysis
      this.setupAudioAnalysis()

      // Configure MediaRecorder
      const options: MediaRecorderOptions = {}
      
      if (config.mimeType && MediaRecorder.isTypeSupported(config.mimeType)) {
        options.mimeType = config.mimeType
      } else {
        // Try common audio formats
        const supportedTypes = [
          'audio/webm',
          'audio/webm;codecs=opus',
          'audio/mp4',
          'audio/mp4;codecs=mp4a.40.2',
          'audio/mpeg',
          'audio/wav'
        ]
        
        for (const type of supportedTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            options.mimeType = type
            break
          }
        }
      }

      if (config.audioBitsPerSecond) options.audioBitsPerSecond = config.audioBitsPerSecond
      if (config.bitsPerSecond) options.bitsPerSecond = config.bitsPerSecond

      this.mediaRecorder = new MediaRecorder(this.mediaStream, options)
      this.setupRecorderEvents()

    } catch (error) {
      throw new Error(`Failed to initialize recording: ${error}`)
    }
  }

  private setupAudioAnalysis(): void {
    if (!this.mediaStream) return

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const source = this.audioContext.createMediaStreamSource(this.mediaStream)
      this.analyser = this.audioContext.createAnalyser()
      
      this.analyser.fftSize = 256
      this.analyser.smoothingTimeConstant = 0.8
      
      source.connect(this.analyser)
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    } catch (error) {
      console.warn('Audio analysis setup failed:', error)
    }
  }

  private setupRecorderEvents(): void {
    if (!this.mediaRecorder) return

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data)
      }
    }

    this.mediaRecorder.onstart = () => {
      this.isRecording = true
      this.startTime = Date.now()
      this.recordedChunks = []
    }

    this.mediaRecorder.onpause = () => {
      this.isPaused = true
      this.pausedTime += Date.now() - this.startTime
    }

    this.mediaRecorder.onresume = () => {
      this.isPaused = false
      this.startTime = Date.now()
    }

    this.mediaRecorder.onstop = () => {
      this.isRecording = false
      this.isPaused = false
    }

    this.mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event)
      this.isRecording = false
      this.isPaused = false
    }
  }

  // Recording control methods
  async startRecording(timeslice?: number): Promise<void> {
    if (!this.mediaRecorder) {
      throw new Error('MediaRecorder not initialized. Call initialize() first.')
    }

    if (this.isRecording) {
      throw new Error('Recording already in progress')
    }

    // Resume audio context if suspended (required by some browsers)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    this.recordedChunks = []
    this.pausedTime = 0
    
    if (timeslice) {
      this.mediaRecorder.start(timeslice)
    } else {
      this.mediaRecorder.start()
    }
  }

  pauseRecording(): void {
    if (!this.mediaRecorder || !this.isRecording || this.isPaused) {
      return
    }

    this.mediaRecorder.pause()
  }

  resumeRecording(): void {
    if (!this.mediaRecorder || !this.isRecording || !this.isPaused) {
      return
    }

    this.mediaRecorder.resume()
  }

  async stopRecording(): Promise<RecordingData> {
    if (!this.mediaRecorder || !this.isRecording) {
      throw new Error('No recording in progress')
    }

    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('MediaRecorder not available'))
        return
      }

      this.mediaRecorder.onstop = () => {
        try {
          const mimeType = this.mediaRecorder?.mimeType || 'audio/webm'
          const blob = new Blob(this.recordedChunks, { type: mimeType })
          const url = URL.createObjectURL(blob)
          const duration = this.getRecordingDuration()

          const recordingData: RecordingData = {
            blob,
            url,
            duration,
            size: blob.size,
            mimeType
          }

          resolve(recordingData)
        } catch (error) {
          reject(error)
        }
      }

      this.mediaRecorder.stop()
    })
  }

  // Audio analysis methods
  getAudioAnalysis(): AudioAnalysis | null {
    if (!this.analyser || !this.dataArray) {
      return null
    }

    this.analyser.getByteFrequencyData(this.dataArray)
    
    // Calculate volume (RMS)
    let sum = 0
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i] * this.dataArray[i]
    }
    const volume = Math.sqrt(sum / this.dataArray.length) / 255

    // Get frequency data
    const frequency = Array.from(this.dataArray)

    // Estimate pitch (find dominant frequency)
    let maxIndex = 0
    let maxValue = 0
    for (let i = 0; i < this.dataArray.length; i++) {
      if (this.dataArray[i] > maxValue) {
        maxValue = this.dataArray[i]
        maxIndex = i
      }
    }
    
    const nyquist = (this.audioContext?.sampleRate || 44100) / 2
    const pitch = (maxIndex / this.dataArray.length) * nyquist

    // Calculate clarity (spectral flatness)
    const geometricMean = this.calculateGeometricMean(this.dataArray)
    const arithmeticMean = this.dataArray.reduce((sum, val) => sum + val, 0) / this.dataArray.length
    const clarity = geometricMean / arithmeticMean

    return {
      volume,
      frequency,
      pitch,
      clarity
    }
  }

  private calculateGeometricMean(data: Uint8Array): number {
    let product = 1
    let count = 0
    
    for (let i = 0; i < data.length; i++) {
      if (data[i] > 0) {
        product *= data[i]
        count++
      }
    }
    
    return count > 0 ? Math.pow(product, 1 / count) : 0
  }

  // Utility methods
  getRecordingDuration(): number {
    if (!this.isRecording && !this.startTime) return 0
    
    const currentTime = this.isRecording ? Date.now() : this.startTime
    return (currentTime - this.startTime + this.pausedTime) / 1000
  }

  getCurrentState(): {
    isRecording: boolean
    isPaused: boolean
    duration: number
  } {
    return {
      isRecording: this.isRecording,
      isPaused: this.isPaused,
      duration: this.getRecordingDuration()
    }
  }

  // Cleanup methods
  cleanup(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop()
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
      this.mediaStream = null
    }

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    this.mediaRecorder = null
    this.analyser = null
    this.dataArray = null
    this.recordedChunks = []
    this.isRecording = false
    this.isPaused = false
    this.startTime = 0
    this.pausedTime = 0
  }

  // File conversion and export
  async convertToWav(blob: Blob): Promise<Blob> {
    // Basic WAV conversion (simplified)
    // In a real implementation, you might want to use a library like lamejs
    const arrayBuffer = await blob.arrayBuffer()
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    
    return this.audioBufferToWav(audioBuffer)
  }

  private audioBufferToWav(audioBuffer: AudioBuffer): Blob {
    const length = audioBuffer.length
    const sampleRate = audioBuffer.sampleRate
    const numberOfChannels = audioBuffer.numberOfChannels
    
    const buffer = new ArrayBuffer(44 + length * numberOfChannels * 2)
    const view = new DataView(buffer)
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }
    
    writeString(0, 'RIFF')
    view.setUint32(4, 36 + length * numberOfChannels * 2, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numberOfChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numberOfChannels * 2, true)
    view.setUint16(32, numberOfChannels * 2, true)
    view.setUint16(34, 16, true)
    writeString(36, 'data')
    view.setUint32(40, length * numberOfChannels * 2, true)
    
    // Convert audio data
    let offset = 44
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]))
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
        offset += 2
      }
    }
    
    return new Blob([buffer], { type: 'audio/wav' })
  }

  // Get supported MIME types
  getSupportedMimeTypes(): string[] {
    const types = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/webm;codecs=pcm',
      'audio/mp4',
      'audio/mp4;codecs=mp4a.40.2',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/ogg;codecs=opus'
    ]
    
    return types.filter(type => MediaRecorder.isTypeSupported(type))
  }
}

// Create singleton instance
export const mediaRecorderAPI = new MediaRecorderAPI()

// React hook for easier usage
export function useMediaRecorder() {
  return {
    initialize: mediaRecorderAPI.initialize.bind(mediaRecorderAPI),
    startRecording: mediaRecorderAPI.startRecording.bind(mediaRecorderAPI),
    pauseRecording: mediaRecorderAPI.pauseRecording.bind(mediaRecorderAPI),
    resumeRecording: mediaRecorderAPI.resumeRecording.bind(mediaRecorderAPI),
    stopRecording: mediaRecorderAPI.stopRecording.bind(mediaRecorderAPI),
    getAudioAnalysis: mediaRecorderAPI.getAudioAnalysis.bind(mediaRecorderAPI),
    getCurrentState: mediaRecorderAPI.getCurrentState.bind(mediaRecorderAPI),
    cleanup: mediaRecorderAPI.cleanup.bind(mediaRecorderAPI),
    convertToWav: mediaRecorderAPI.convertToWav.bind(mediaRecorderAPI),
    getSupportedMimeTypes: mediaRecorderAPI.getSupportedMimeTypes.bind(mediaRecorderAPI),
    isSupported: mediaRecorderAPI.isSupported()
  }
}