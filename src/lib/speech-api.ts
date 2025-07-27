'use client'

// Speech Recognition Types
export interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
  alternatives?: Array<{
    transcript: string
    confidence: number
  }>
}

export interface SpeechRecognitionConfig {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  maxAlternatives?: number
  grammars?: string[]
}

export interface PronunciationAssessment {
  accuracyScore: number
  fluencyScore: number
  completenessScore: number
  prosodyScore: number
  feedback: string[]
  phonemeScores?: Array<{
    phoneme: string
    accuracyScore: number
  }>
}

// Speech Synthesis Types
export interface VoiceOptions {
  lang?: string
  voice?: SpeechSynthesisVoice
  rate?: number
  pitch?: number
  volume?: number
}

export interface TextToSpeechConfig {
  text: string
  options?: VoiceOptions
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: SpeechSynthesisErrorEvent) => void
}

class SpeechAPI {
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesis
  private isListening = false
  private currentUtterance: SpeechSynthesisUtterance | null = null

  constructor() {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
      }
      
      this.synthesis = window.speechSynthesis
    } else {
      this.synthesis = {} as SpeechSynthesis
    }
  }

  // Check browser support
  isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null
  }

  isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
  }

  // Speech Recognition Methods
  async startListening(
    config: SpeechRecognitionConfig = {},
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported')
    }

    if (this.isListening) {
      this.stopListening()
    }

    // Configure recognition
    this.recognition.lang = config.language || 'en-US'
    this.recognition.continuous = config.continuous || false
    this.recognition.interimResults = config.interimResults || true
    this.recognition.maxAlternatives = config.maxAlternatives || 1

    // Set up event handlers
    this.recognition.onstart = () => {
      this.isListening = true
    }

    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const alternatives = Array.from(result).map(alt => ({
          transcript: alt.transcript,
          confidence: alt.confidence
        }))

        onResult({
          transcript: result[0].transcript,
          confidence: result[0].confidence,
          isFinal: result.isFinal,
          alternatives: alternatives.slice(1) // Exclude the main result
        })
      }
    }

    this.recognition.onerror = (event) => {
      this.isListening = false
      onError?.(event)
    }

    this.recognition.onend = () => {
      this.isListening = false
    }

    // Start recognition
    this.recognition.start()
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  getIsListening(): boolean {
    return this.isListening
  }

  // Speech Synthesis Methods
  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    if (!this.isSpeechSynthesisSupported()) {
      return []
    }

    return new Promise((resolve) => {
      let voices = this.synthesis.getVoices()
      
      if (voices.length > 0) {
        resolve(voices)
      } else {
        // Wait for voices to load
        this.synthesis.onvoiceschanged = () => {
          voices = this.synthesis.getVoices()
          resolve(voices)
        }
      }
    })
  }

  async speak(config: TextToSpeechConfig): Promise<void> {
    if (!this.isSpeechSynthesisSupported()) {
      throw new Error('Speech synthesis not supported')
    }

    // Stop any current speech
    this.stopSpeaking()

    const utterance = new SpeechSynthesisUtterance(config.text)
    
    // Apply voice options
    if (config.options) {
      if (config.options.voice) utterance.voice = config.options.voice
      if (config.options.rate) utterance.rate = config.options.rate
      if (config.options.pitch) utterance.pitch = config.options.pitch
      if (config.options.volume) utterance.volume = config.options.volume
      if (config.options.lang) utterance.lang = config.options.lang
    }

    // Set up event handlers
    utterance.onstart = config.onStart || (() => {})
    utterance.onend = config.onEnd || (() => {})
    utterance.onerror = config.onError || (() => {})

    this.currentUtterance = utterance
    this.synthesis.speak(utterance)

    return new Promise((resolve, reject) => {
      utterance.onend = () => {
        this.currentUtterance = null
        config.onEnd?.()
        resolve()
      }
      
      utterance.onerror = (error) => {
        this.currentUtterance = null
        config.onError?.(error)
        reject(error)
      }
    })
  }

  stopSpeaking(): void {
    if (this.isSpeechSynthesisSupported() && this.synthesis.speaking) {
      this.synthesis.cancel()
      this.currentUtterance = null
    }
  }

  pauseSpeaking(): void {
    if (this.isSpeechSynthesisSupported() && this.synthesis.speaking) {
      this.synthesis.pause()
    }
  }

  resumeSpeaking(): void {
    if (this.isSpeechSynthesisSupported() && this.synthesis.paused) {
      this.synthesis.resume()
    }
  }

  isSpeaking(): boolean {
    return this.isSpeechSynthesisSupported() && this.synthesis.speaking
  }

  isPaused(): boolean {
    return this.isSpeechSynthesisSupported() && this.synthesis.paused
  }

  // Pronunciation Assessment (Basic implementation)
  async assessPronunciation(
    targetText: string,
    spokenText: string,
    language: string = 'en-US'
  ): Promise<PronunciationAssessment> {
    // Basic pronunciation assessment using text similarity
    // In a real implementation, you would use a more sophisticated algorithm
    // or integrate with services like Azure Speech or Google Speech-to-Text
    
    const normalizedTarget = targetText.toLowerCase().trim()
    const normalizedSpoken = spokenText.toLowerCase().trim()
    
    // Calculate basic similarity score
    const similarity = this.calculateTextSimilarity(normalizedTarget, normalizedSpoken)
    
    // Generate feedback based on differences
    const feedback: string[] = []
    
    if (similarity < 0.7) {
      feedback.push('Try to pronounce each word more clearly')
    }
    
    if (normalizedSpoken.length < normalizedTarget.length * 0.8) {
      feedback.push('Make sure to pronounce all parts of the words')
    }
    
    if (similarity > 0.9) {
      feedback.push('Excellent pronunciation!')
    } else if (similarity > 0.7) {
      feedback.push('Good pronunciation, keep practicing!')
    }

    return {
      accuracyScore: Math.round(similarity * 100),
      fluencyScore: Math.round(Math.min(similarity * 1.1, 1) * 100),
      completenessScore: Math.round(Math.min(normalizedSpoken.length / normalizedTarget.length, 1) * 100),
      prosodyScore: Math.round(similarity * 90), // Simplified prosody scoring
      feedback
    }
  }

  // Utility Methods
  private calculateTextSimilarity(text1: string, text2: string): number {
    // Simple Levenshtein distance-based similarity
    const distance = this.levenshteinDistance(text1, text2)
    const maxLength = Math.max(text1.length, text2.length)
    return maxLength === 0 ? 1 : 1 - distance / maxLength
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  // Language and Voice Helpers
  async getVoiceByLanguage(language: string): Promise<SpeechSynthesisVoice | null> {
    const voices = await this.getVoices()
    return voices.find(voice => voice.lang.startsWith(language)) || null
  }

  async getPreferredVoice(language: string, gender?: 'male' | 'female'): Promise<SpeechSynthesisVoice | null> {
    const voices = await this.getVoices()
    const languageVoices = voices.filter(voice => voice.lang.startsWith(language))
    
    if (gender) {
      // Basic gender detection based on voice name (not reliable)
      const genderVoices = languageVoices.filter(voice => {
        const name = voice.name.toLowerCase()
        if (gender === 'female') {
          return name.includes('female') || name.includes('woman') || 
                 name.includes('zira') || name.includes('helen') ||
                 name.includes('samantha')
        } else {
          return name.includes('male') || name.includes('man') ||
                 name.includes('david') || name.includes('mark') ||
                 name.includes('alex')
        }
      })
      
      if (genderVoices.length > 0) {
        return genderVoices[0]
      }
    }
    
    return languageVoices[0] || null
  }
}

// Create singleton instance
export const speechAPI = new SpeechAPI()

// React hooks for easier usage
export function useSpeechRecognition() {
  return {
    startListening: speechAPI.startListening.bind(speechAPI),
    stopListening: speechAPI.stopListening.bind(speechAPI),
    isListening: speechAPI.getIsListening.bind(speechAPI),
    isSupported: speechAPI.isSpeechRecognitionSupported()
  }
}

export function useSpeechSynthesis() {
  return {
    speak: speechAPI.speak.bind(speechAPI),
    stopSpeaking: speechAPI.stopSpeaking.bind(speechAPI),
    pauseSpeaking: speechAPI.pauseSpeaking.bind(speechAPI),
    resumeSpeaking: speechAPI.resumeSpeaking.bind(speechAPI),
    isSpeaking: speechAPI.isSpeaking.bind(speechAPI),
    isPaused: speechAPI.isPaused.bind(speechAPI),
    getVoices: speechAPI.getVoices.bind(speechAPI),
    getVoiceByLanguage: speechAPI.getVoiceByLanguage.bind(speechAPI),
    getPreferredVoice: speechAPI.getPreferredVoice.bind(speechAPI),
    isSupported: speechAPI.isSpeechSynthesisSupported()
  }
}

export function usePronunciationAssessment() {
  return {
    assessPronunciation: speechAPI.assessPronunciation.bind(speechAPI)
  }
}