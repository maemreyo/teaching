'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Slider } from '@/components/ui/slider'
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Trash2,
  Volume2,
  Clock,
  FileAudio,
  AlertCircle
} from 'lucide-react'
import { useMediaRecorder, RecordingData } from '@/lib/media-recorder'

interface AudioRecorderProps {
  onRecordingComplete?: (recording: RecordingData) => void
  onRecordingDelete?: () => void
  maxDuration?: number // in seconds
  showWaveform?: boolean
  allowDownload?: boolean
  title?: string
  description?: string
}

export function AudioRecorder({
  onRecordingComplete,
  onRecordingDelete,
  maxDuration = 300, // 5 minutes default
  showWaveform = true,
  allowDownload = true,
  title = "Audio Recorder",
  description = "Record your voice and play it back"
}: AudioRecorderProps) {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'paused' | 'completed'>('idle')
  const [recordingData, setRecordingData] = useState<RecordingData | null>(null)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [volume, setVolume] = useState([100])
  const [error, setError] = useState<string | null>(null)
  const [audioAnalysis, setAudioAnalysis] = useState<any>(null)
  const [hasPermission, setHasPermission] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()
  const analysisIntervalRef = useRef<NodeJS.Timeout>()
  
  const mediaRecorder = useMediaRecorder()

  useEffect(() => {
    checkPermissions()
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current)
      mediaRecorder.cleanup()
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100
    }
  }, [volume])

  const checkPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setHasPermission(true)
    } catch (err) {
      setHasPermission(false)
      setError('Microphone permission is required for recording')
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    if (!hasPermission || !mediaRecorder.isSupported) {
      setError('Recording not supported or permission denied')
      return
    }

    try {
      await mediaRecorder.initialize()
      await mediaRecorder.startRecording()
      
      setRecordingState('recording')
      setDuration(0)
      setError(null)

      // Start duration timer
      intervalRef.current = setInterval(() => {
        const state = mediaRecorder.getCurrentState()
        setDuration(state.duration)

        // Auto-stop at max duration
        if (state.duration >= maxDuration) {
          stopRecording()
        }
      }, 100)

      // Start audio analysis if enabled
      if (showWaveform) {
        analysisIntervalRef.current = setInterval(() => {
          const analysis = mediaRecorder.getAudioAnalysis()
          setAudioAnalysis(analysis)
        }, 50)
      }

    } catch (err) {
      setError(`Failed to start recording: ${err}`)
    }
  }

  const pauseRecording = () => {
    mediaRecorder.pauseRecording()
    setRecordingState('paused')
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current)
    }
  }

  const resumeRecording = () => {
    mediaRecorder.resumeRecording()
    setRecordingState('recording')

    // Restart timers
    intervalRef.current = setInterval(() => {
      const state = mediaRecorder.getCurrentState()
      setDuration(state.duration)

      if (state.duration >= maxDuration) {
        stopRecording()
      }
    }, 100)

    if (showWaveform) {
      analysisIntervalRef.current = setInterval(() => {
        const analysis = mediaRecorder.getAudioAnalysis()
        setAudioAnalysis(analysis)
      }, 50)
    }
  }

  const stopRecording = async () => {
    try {
      const recording = await mediaRecorder.stopRecording()
      
      setRecordingData(recording)
      setRecordingState('completed')
      setAudioAnalysis(null)

      // Clear intervals
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current)
      }

      onRecordingComplete?.(recording)

    } catch (err) {
      setError(`Failed to stop recording: ${err}`)
    }
  }

  const playRecording = () => {
    if (!audioRef.current || !recordingData) return

    audioRef.current.currentTime = playbackTime
    audioRef.current.play()
    setIsPlaying(true)
  }

  const pausePlayback = () => {
    if (!audioRef.current) return

    audioRef.current.pause()
    setIsPlaying(false)
  }

  const stopPlayback = () => {
    if (!audioRef.current) return

    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setPlaybackTime(0)
    setIsPlaying(false)
  }

  const downloadRecording = () => {
    if (!recordingData) return

    const link = document.createElement('a')
    link.href = recordingData.url
    link.download = `recording-${new Date().toISOString()}.webm`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const deleteRecording = () => {
    if (recordingData) {
      URL.revokeObjectURL(recordingData.url)
    }
    
    setRecordingData(null)
    setRecordingState('idle')
    setDuration(0)
    setPlaybackTime(0)
    setIsPlaying(false)
    
    onRecordingDelete?.()
  }

  const resetRecorder = () => {
    stopPlayback()
    deleteRecording()
    mediaRecorder.cleanup()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileAudio className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!hasPermission && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please allow microphone access to use the audio recorder.
            </AlertDescription>
          </Alert>
        )}

        {!mediaRecorder.isSupported && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Audio recording is not supported in your browser. Try using Chrome or Edge.
            </AlertDescription>
          </Alert>
        )}

        {/* Recording Controls */}
        <div className="flex justify-center gap-4">
          {recordingState === 'idle' && (
            <Button
              onClick={startRecording}
              disabled={!hasPermission || !mediaRecorder.isSupported}
              size="lg"
              className="gap-2"
            >
              <Mic className="h-4 w-4" />
              Start Recording
            </Button>
          )}

          {recordingState === 'recording' && (
            <>
              <Button
                onClick={pauseRecording}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
              <Button
                onClick={stopRecording}
                variant="destructive"
                size="lg"
                className="gap-2"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
            </>
          )}

          {recordingState === 'paused' && (
            <>
              <Button
                onClick={resumeRecording}
                size="lg"
                className="gap-2"
              >
                <Mic className="h-4 w-4" />
                Resume
              </Button>
              <Button
                onClick={stopRecording}
                variant="destructive"
                size="lg"
                className="gap-2"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Recording Status */}
        {recordingState !== 'idle' && recordingState !== 'completed' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {recordingState === 'recording' && (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
                <Badge variant={recordingState === 'recording' ? "destructive" : "secondary"}>
                  {recordingState === 'recording' ? 'Recording' : 'Paused'}
                </Badge>
              </div>
              <div className="text-2xl font-mono">
                {formatTime(duration)}
              </div>
              <Progress 
                value={(duration / maxDuration) * 100} 
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max: {formatTime(maxDuration)}
              </p>
            </div>

            {/* Audio Visualization */}
            {showWaveform && audioAnalysis && (
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Volume Level</div>
                  <Progress 
                    value={audioAnalysis.volume * 100} 
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Playback Controls */}
        {recordingState === 'completed' && recordingData && (
          <div className="space-y-4">
            <div className="text-center">
              <Badge variant="default" className="mb-2">Recording Complete</Badge>
              <div className="text-lg font-medium">
                Duration: {formatTime(recordingData.duration)}
              </div>
              <div className="text-sm text-muted-foreground">
                Size: {(recordingData.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>

            <div className="flex justify-center gap-2">
              {!isPlaying ? (
                <Button onClick={playRecording} size="lg" className="gap-2">
                  <Play className="h-4 w-4" />
                  Play
                </Button>
              ) : (
                <Button onClick={pausePlayback} size="lg" className="gap-2">
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
              )}
              
              <Button onClick={stopPlayback} variant="outline" size="lg" className="gap-2">
                <Square className="h-4 w-4" />
                Stop
              </Button>

              {allowDownload && (
                <Button onClick={downloadRecording} variant="outline" size="lg" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}

              <Button onClick={deleteRecording} variant="destructive" size="lg" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">Volume</span>
              </div>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              src={recordingData.url}
              onTimeUpdate={() => {
                if (audioRef.current) {
                  setPlaybackTime(audioRef.current.currentTime)
                }
              }}
              onEnded={() => {
                setIsPlaying(false)
                setPlaybackTime(0)
              }}
              preload="metadata"
            />
          </div>
        )}

        {/* Action Buttons */}
        {recordingState === 'completed' && (
          <div className="flex justify-center">
            <Button onClick={resetRecorder} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Record Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}