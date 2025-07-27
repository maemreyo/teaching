'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Volume2, 
  RotateCcw, 
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react'
import { speechAPI, useSpeechRecognition, useSpeechSynthesis, usePronunciationAssessment } from '@/lib/speech-api'
import { useMediaRecorder } from '@/lib/media-recorder'

interface PronunciationPracticeProps {
  word: string
  phonetic?: string
  definition?: string
  audioUrl?: string
  language?: string
  onScoreUpdate?: (score: number) => void
}

export function PronunciationPractice({
  word,
  phonetic,
  definition,
  audioUrl,
  language = 'en-US',
  onScoreUpdate
}: PronunciationPracticeProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [assessment, setAssessment] = useState<any>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [hasAudioPermission, setHasAudioPermission] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const { startListening, stopListening, isSupported: speechSupported } = useSpeechRecognition()
  const { speak, isSupported: ttsSupported } = useSpeechSynthesis()
  const { assessPronunciation } = usePronunciationAssessment()
  const mediaRecorder = useMediaRecorder()

  useEffect(() => {
    checkAudioPermission()
    return () => {
      if (isListening) {
        stopListening()
      }
    }
  }, [])

  const checkAudioPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setHasAudioPermission(true)
    } catch (err) {
      setHasAudioPermission(false)
      setError('Microphone permission is required for pronunciation practice')
    }
  }

  const playAudioExample = async () => {
    if (audioUrl && audioRef.current) {
      setIsPlayingAudio(true)
      try {
        await audioRef.current.play()
      } catch (err) {
        console.error('Audio playback failed:', err)
        // Fallback to text-to-speech
        playTTSExample()
      }
    } else {
      playTTSExample()
    }
  }

  const playTTSExample = async () => {
    if (!ttsSupported) return
    
    setIsPlayingAudio(true)
    try {
      await speak({
        text: word,
        options: {
          lang: language,
          rate: 0.8,
          pitch: 1
        },
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false)
      })
    } catch (err) {
      setIsPlayingAudio(false)
      setError('Text-to-speech not available')
    }
  }

  const startPronunciationTest = async () => {
    if (!hasAudioPermission || !speechSupported) {
      setError('Speech recognition not available')
      return
    }

    setIsListening(true)
    setTranscript('')
    setError(null)

    try {
      await startListening(
        {
          language,
          continuous: false,
          interimResults: true,
          maxAlternatives: 3
        },
        (result) => {
          setTranscript(result.transcript)
          
          if (result.isFinal && result.transcript.trim()) {
            evaluatePronunciation(result.transcript)
          }
        },
        (error) => {
          setIsListening(false)
          setError(`Speech recognition error: ${error.error || 'Unknown error'}`)
        }
      )
    } catch (err) {
      setIsListening(false)
      setError('Failed to start speech recognition')
    }
  }

  const stopPronunciationTest = () => {
    if (isListening) {
      stopListening()
      setIsListening(false)
    }
  }

  const evaluatePronunciation = async (spokenText: string) => {
    setIsListening(false)
    setAttempts(prev => prev + 1)

    try {
      const result = await assessPronunciation(word, spokenText, language)
      setAssessment(result)

      if (result.accuracyScore > bestScore) {
        setBestScore(result.accuracyScore)
        onScoreUpdate?.(result.accuracyScore)
      }
    } catch (err) {
      setError('Failed to assess pronunciation')
    }
  }

  const resetPractice = () => {
    setTranscript('')
    setAssessment(null)
    setAttempts(0)
    setBestScore(0)
    setError(null)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 70) return 'Fair'
    return 'Needs Practice'
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Pronunciation Practice
        </CardTitle>
        <CardDescription>
          Practice pronouncing "{word}" and get instant feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Word Display */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">{word}</h2>
          {phonetic && (
            <p className="text-lg text-muted-foreground font-mono">/{phonetic}/</p>
          )}
          {definition && (
            <p className="text-sm text-muted-foreground italic">{definition}</p>
          )}
        </div>

        {/* Audio Example */}
        <div className="flex justify-center">
          <Button
            onClick={playAudioExample}
            disabled={isPlayingAudio}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            {isPlayingAudio ? (
              <>
                <Pause className="h-4 w-4" />
                Playing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Listen to Example
              </>
            )}
          </Button>
        </div>

        {/* Pronunciation Test */}
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            {!isListening ? (
              <Button
                onClick={startPronunciationTest}
                disabled={!hasAudioPermission || !speechSupported}
                size="lg"
                className="gap-2"
              >
                <Mic className="h-4 w-4" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={stopPronunciationTest}
                variant="destructive"
                size="lg"
                className="gap-2"
              >
                <MicOff className="h-4 w-4" />
                Stop Recording
              </Button>
            )}
            
            {attempts > 0 && (
              <Button
                onClick={resetPractice}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>

          {isListening && (
            <div className="text-center">
              <div className="animate-pulse">
                <Mic className="h-8 w-8 mx-auto text-red-500 mb-2" />
                <p className="text-sm text-muted-foreground">Listening... Say "{word}"</p>
              </div>
            </div>
          )}

          {transcript && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">You said:</p>
              <p className="text-lg font-medium">"{transcript}"</p>
            </div>
          )}
        </div>

        {/* Assessment Results */}
        {assessment && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Assessment Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(assessment.accuracyScore)}`}>
                    {assessment.accuracyScore}%
                  </div>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(assessment.fluencyScore)}`}>
                    {assessment.fluencyScore}%
                  </div>
                  <p className="text-xs text-muted-foreground">Fluency</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(assessment.completenessScore)}`}>
                    {assessment.completenessScore}%
                  </div>
                  <p className="text-xs text-muted-foreground">Completeness</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(assessment.prosodyScore)}`}>
                    {assessment.prosodyScore}%
                  </div>
                  <p className="text-xs text-muted-foreground">Prosody</p>
                </div>
              </div>

              <div className="text-center">
                <Badge 
                  variant={assessment.accuracyScore >= 80 ? "default" : "secondary"}
                  className="text-sm"
                >
                  {getScoreLabel(assessment.accuracyScore)}
                </Badge>
              </div>

              {assessment.feedback && assessment.feedback.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Feedback:</h4>
                  <ul className="text-sm space-y-1">
                    {assessment.feedback.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="h-3 w-3 mt-0.5 text-yellow-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Progress Summary */}
        {attempts > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Best Score</span>
              <span>{bestScore}%</span>
            </div>
            <Progress value={bestScore} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Attempts: {attempts} | Keep practicing to improve!
            </p>
          </div>
        )}

        {/* Hidden audio element for native audio playback */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlayingAudio(false)}
            onError={() => setIsPlayingAudio(false)}
            preload="metadata"
          />
        )}

        {/* Capability warnings */}
        {!hasAudioPermission && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please allow microphone access to use pronunciation practice.
            </AlertDescription>
          </Alert>
        )}

        {!speechSupported && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Speech recognition is not supported in your browser. Try using Chrome or Edge.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}