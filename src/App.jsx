import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Menu, 
  User, 
  MessageCircle, 
  Gamepad2, 
  Sun, 
  Moon,
  Home,
  Newspaper,
  Video,
  BarChart3,
  ShoppingBag,
  Trophy,
  Ticket,
  Users,
  Target
} from 'lucide-react'
import './App.css'

// Mock NHL data
const mockStandings = [
  { team: 'Boston Bruins', wins: 45, losses: 20, otl: 5, points: 95 },
  { team: 'Toronto Maple Leafs', wins: 42, losses: 22, otl: 6, points: 90 },
  { team: 'Tampa Bay Lightning', wins: 40, losses: 25, otl: 5, points: 85 },
  { team: 'Florida Panthers', wins: 38, losses: 27, otl: 7, points: 83 },
  { team: 'Buffalo Sabres', wins: 35, losses: 30, otl: 5, points: 75 },
]

const mockNews = [
  {
    id: 1,
    title: "McDavid Reaches 1000 Career Points",
    summary: "Connor McDavid becomes the youngest player to reach 1000 career points in NHL history.",
    date: "2025-08-31"
  },
  {
    id: 2,
    title: "Trade Deadline Approaching",
    summary: "Teams are making final moves as the NHL trade deadline approaches next week.",
    date: "2025-08-30"
  },
  {
    id: 3,
    title: "Playoff Race Heating Up",
    summary: "Several teams are battling for the final playoff spots in both conferences.",
    date: "2025-08-29"
  }
]

const mockVideos = [
  {
    id: 1,
    title: "Best Goals of the Week",
    duration: "3:45",
    thumbnail: "https://via.placeholder.com/300x200?text=Best+Goals"
  },
  {
    id: 2,
    title: "McDavid Highlight Reel",
    duration: "5:20",
    thumbnail: "https://via.placeholder.com/300x200?text=McDavid+Highlights"
  },
  {
    id: 3,
    title: "Playoff Preview",
    duration: "8:15",
    thumbnail: "https://via.placeholder.com/300x200?text=Playoff+Preview"
  }
]

// Circular Button Component
const CircularButton = ({ children, onClick, className = "", size = "w-12 h-12" }) => (
  <Button
    onClick={onClick}
    className={`${size} rounded-full p-0 flex items-center justify-center ${className}`}
    variant="outline"
  >
    {children}
  </Button>
)

// Hockey Trivia Game Component
const TriviaGame = ({ isOpen, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const questions = [
    {
      question: "Which team has won the most Stanley Cup championships?",
      options: ["Montreal Canadiens", "Toronto Maple Leafs", "Boston Bruins", "Detroit Red Wings"],
      correct: 0
    },
    {
      question: "Who holds the record for most goals in a single NHL season?",
      options: ["Gordie Howe", "Wayne Gretzky", "Mario Lemieux", "Maurice Richard"],
      correct: 1
    },
    {
      question: "How many teams are currently in the NHL?",
      options: ["30", "31", "32", "33"],
      correct: 2
    },
    {
      question: "Which trophy is awarded to the NHL's most valuable player?",
      options: ["Hart Trophy", "Vezina Trophy", "Norris Trophy", "Calder Trophy"],
      correct: 0
    },
    {
      question: "What is the maximum number of players a team can have on the ice at one time?",
      options: ["5", "6", "7", "8"],
      correct: 1
    }
  ]

  const startGame = () => {
    setGameStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setGameEnded(false)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const selectAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setGameEnded(true)
      }
    }, 2000)
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameEnded(false)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 max-h-96 overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            🏒 Hockey Trivia Challenge
            <Button onClick={onClose} variant="outline" size="sm">×</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!gameStarted && !gameEnded && (
            <div className="text-center space-y-4">
              <p>Test your NHL knowledge with 5 challenging questions!</p>
              <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
                Start Game
              </Button>
            </div>
          )}

          {gameStarted && !gameEnded && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length} | Score: {score}
              </div>
              <h3 className="font-semibold">{questions[currentQuestion].question}</h3>
              <div className="space-y-2">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    disabled={selectedAnswer !== null}
                    variant={
                      showResult
                        ? index === questions[currentQuestion].correct
                          ? "default"
                          : index === selectedAnswer
                          ? "destructive"
                          : "outline"
                        : "outline"
                    }
                    className="w-full text-left justify-start"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {gameEnded && (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">Game Complete!</h3>
              <p className="text-lg">Your Score: {score} out of {questions.length}</p>
              <p className="text-muted-foreground">
                {score === questions.length ? "Perfect! You're a hockey expert!" :
                 score >= 3 ? "Great job! You know your hockey!" :
                 score >= 2 ? "Not bad! Keep learning!" :
                 "Keep studying those hockey facts!"}
              </p>
              <div className="flex space-x-2">
                <Button onClick={resetGame} variant="outline">Play Again</Button>
                <Button onClick={onClose}>Close</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
// Advanced Slots Game Component
const SlotsGame = ({ isOpen, onClose }) => {
  const [reels, setReels] = useState([['🏒', '🥅', '🏆'], ['🏒', '🥅', '🏆'], ['🏒', '🥅', '🏆']])
  const [numReels, setNumReels] = useState(3)
  const [betAmount, setBetAmount] = useState(10)
  const [isSpinning, setIsSpinning] = useState(false)
  const [credits, setCredits] = useState(1000)
  const [scrollPositions, setScrollPositions] = useState([0, 0, 0, 0, 0, 0])

  const symbols = ['🏒', '🥅', '🏆', '⭐', '🎯', '🔥', '🏅', '⚡', '💎', '🎰']
  const betOptions = [10, 50, 100, 1000]
  const reelOptions = [3, 4, 5, 6]

  const generateReelStrip = () => {
    const strip = []
    for (let i = 0; i < 20; i++) {
      strip.push(symbols[Math.floor(Math.random() * symbols.length)])
    }
    return strip
  }

  const spin = () => {
    if (credits < betAmount) {
      alert('Insufficient credits!')
      return
    }
    
    setIsSpinning(true)
    setCredits(prev => prev - betAmount)
    
    // Generate new reel strips for each reel
    const newReels = Array(numReels).fill(null).map(() => generateReelStrip())
    setReels(newReels)
    
    // Animate scrolling
    const newScrollPositions = Array(numReels).fill(null).map(() => 
      Math.floor(Math.random() * 15) + 5 // Random position between 5-20
    )
    setScrollPositions(newScrollPositions)
    
    setTimeout(() => {
      // Get final symbols
      const finalSymbols = newReels.map((reel, index) => 
        reel[newScrollPositions[index] % reel.length]
      )
      
      // Check for wins
      const uniqueSymbols = [...new Set(finalSymbols)]
      if (uniqueSymbols.length === 1) {
        // All symbols match
        const winAmount = betAmount * 10
        setCredits(prev => prev + winAmount)
        alert(`JACKPOT! You won ${winAmount} credits!`)
      } else if (uniqueSymbols.length === 2) {
        // Partial match
        const winAmount = betAmount * 2
        setCredits(prev => prev + winAmount)
        alert(`Nice! You won ${winAmount} credits!`)
      }
      
      setIsSpinning(false)
    }, 3000)
  }

  const changeNumReels = (newNum) => {
    setNumReels(newNum)
    const newReels = Array(newNum).fill(null).map(() => generateReelStrip())
    setReels(newReels)
    setScrollPositions(Array(newNum).fill(0))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[600px] bg-gradient-to-b from-purple-900 to-blue-900 text-white max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-center flex justify-between items-center">
            🎰 Advanced Hockey Slots
            <Button onClick={onClose} variant="outline" size="sm" className="text-white">×</Button>
          </CardTitle>
          <div className="text-center">Credits: {credits} | Bet: {betAmount}</div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Game Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Reels</label>
              <div className="flex space-x-2">
                {reelOptions.map((num) => (
                  <Button
                    key={num}
                    onClick={() => changeNumReels(num)}
                    variant={numReels === num ? "default" : "outline"}
                    size="sm"
                    disabled={isSpinning}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bet Amount</label>
              <div className="flex space-x-2">
                {betOptions.map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    variant={betAmount === amount ? "default" : "outline"}
                    size="sm"
                    disabled={isSpinning}
                  >
                    {amount}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Slot Machine */}
          <div className="bg-black rounded-lg p-4">
            <div className="flex justify-center space-x-2">
              {reels.slice(0, numReels).map((reel, reelIndex) => (
                <div
                  key={reelIndex}
                  className="w-16 h-48 bg-white rounded-lg overflow-hidden relative border-4 border-yellow-400"
                >
                  <div
                    className={`absolute transition-transform duration-3000 ${
                      isSpinning ? 'ease-out' : 'ease-in-out'
                    }`}
                    style={{
                      transform: `translateY(-${scrollPositions[reelIndex] * 48}px)`,
                    }}
                  >
                    {reel.map((symbol, symbolIndex) => (
                      <div
                        key={symbolIndex}
                        className="h-12 flex items-center justify-center text-2xl bg-white border-b border-gray-200"
                      >
                        {symbol}
                      </div>
                    ))}
                  </div>
                  {/* Winning line indicator */}
                  <div className="absolute top-1/2 left-0 right-0 h-12 border-t-2 border-b-2 border-red-500 pointer-events-none transform -translate-y-1/2"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={spin} 
              disabled={isSpinning || credits < betAmount}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              {isSpinning ? 'Spinning...' : `Spin (${betAmount} credits)`}
            </Button>
            <Button onClick={onClose} variant="outline" className="text-white">
              Close
            </Button>
          </div>

          {/* Paytable */}
          <div className="text-center text-sm">
            <h4 className="font-semibold mb-2">Paytable</h4>
            <div className="space-y-1">
              <div>All symbols match: {betAmount * 10}x bet</div>
              <div>Partial match: {betAmount * 2}x bet</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Enhanced Chatbot Component
const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your NHL assistant. How can I help you today?", sender: 'bot' }
  ])
  const [inputText, setInputText] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])

  const languages = [
    'English', 'Mandarin', 'Hindi', 'Spanish', 'French', 
    'Arabic', 'Bengali', 'Russian', 'Portuguese', 'Japanese'
  ]

  const sendMessage = () => {
    if (!inputText.trim()) return

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user'
    }

    setMessages(prev => [...prev, newMessage])
    setInputText('')

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputText, selectedLanguage),
        sender: 'bot'
      }
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  const getBotResponse = (userMessage, language) => {
    const responses = {
      'English': [
        "That's a great question about hockey!",
        "Let me help you with NHL information.",
        "I can assist you with stats, scores, and team info.",
        "Would you like to know more about your favorite team?"
      ],
      'Spanish': [
        "¡Esa es una gran pregunta sobre hockey!",
        "Déjame ayudarte con información de la NHL.",
        "Puedo ayudarte con estadísticas, puntuaciones e información del equipo.",
        "¿Te gustaría saber más sobre tu equipo favorito?"
      ],
      'French': [
        "C'est une excellente question sur le hockey!",
        "Laissez-moi vous aider avec les informations de la LNH.",
        "Je peux vous aider avec les statistiques, les scores et les informations d'équipe.",
        "Aimeriez-vous en savoir plus sur votre équipe préférée?"
      ],
      'Mandarin': [
        "这是一个关于曲棍球的好问题！",
        "让我帮您了解NHL信息。",
        "我可以帮您查看统计数据、比分和球队信息。",
        "您想了解更多关于您最喜欢的球队吗？"
      ]
    }

    const langResponses = responses[language] || responses['English']
    return langResponses[Math.floor(Math.random() * langResponses.length)]
  }

  const handleScreenshot = () => {
    // Simulate taking a screenshot of the current page
    const newFile = {
      id: Date.now(),
      type: 'screenshot',
      name: `screenshot-${Date.now()}.png`,
      data: 'simulated-screenshot-data'
    }
    setUploadedFiles(prev => [...prev, newFile])
    
    const message = {
      id: messages.length + 1,
      text: "📸 Screenshot captured and uploaded!",
      sender: 'user',
      attachment: newFile
    }
    setMessages(prev => [...prev, message])
  }

  const startRecording = () => {
    setIsRecording(true)
    // Simulate screen recording
    setTimeout(() => {
      setIsRecording(false)
      const newFile = {
        id: Date.now(),
        type: 'recording',
        name: `recording-${Date.now()}.webm`,
        data: 'simulated-recording-data'
      }
      setUploadedFiles(prev => [...prev, newFile])
      
      const message = {
        id: messages.length + 1,
        text: "🎥 Screen recording completed and uploaded!",
        sender: 'user',
        attachment: newFile
      }
      setMessages(prev => [...prev, message])
    }, 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <Card className="w-full max-w-md h-[600px] bg-gradient-to-t from-green-900 to-blue-900 text-white mb-4 mx-4 rounded-t-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-center flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <span>NHL Assistant</span>
            </div>
            <Button onClick={onClose} variant="outline" size="sm" className="text-white">×</Button>
          </CardTitle>
          
          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm">Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-gray-800 text-white px-2 py-1 rounded text-sm border border-gray-600"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col h-full pb-2">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-4 max-h-80">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-2 rounded-lg max-w-xs ${
                  message.sender === 'user'
                    ? 'bg-blue-600 ml-auto text-right'
                    : 'bg-gray-700 mr-auto'
                }`}
              >
                <div className="text-sm">{message.text}</div>
                {message.attachment && (
                  <div className="mt-1 text-xs opacity-75">
                    📎 {message.attachment.name}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Media Upload Section */}
          <div className="border-t border-gray-600 pt-2 mb-2">
            <div className="flex space-x-2 mb-2">
              <Button
                onClick={handleScreenshot}
                size="sm"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs"
              >
                📸 Screenshot
              </Button>
              <Button
                onClick={startRecording}
                disabled={isRecording}
                size="sm"
                className="flex-1 bg-red-600 hover:bg-red-700 text-xs"
              >
                {isRecording ? '🔴 Recording...' : '🎥 Record'}
              </Button>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="text-xs mb-2">
                <div className="font-semibold mb-1">Uploaded Files:</div>
                {uploadedFiles.slice(-3).map((file) => (
                  <div key={file.id} className="truncate opacity-75">
                    {file.type === 'screenshot' ? '📸' : '🎥'} {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Type your message in ${selectedLanguage}...`}
              className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600 text-sm"
            />
            <Button onClick={sendMessage} size="sm" className="bg-green-600 hover:bg-green-700">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Navigation Component
const Navigation = ({ darkMode, toggleDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [tokens, setTokens] = useState(1000)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/news', label: 'News', icon: Newspaper },
    { path: '/videos', label: 'Videos', icon: Video },
    { path: '/stats', label: 'Stats', icon: BarChart3 },
    { path: '/merch', label: 'Merch', icon: ShoppingBag },
    { path: '/fantasy', label: 'Fantasy', icon: Trophy },
    { path: '/tickets', label: 'Tickets', icon: Ticket },
    { path: '/teams', label: 'Teams', icon: Users },
  ]

  const purchaseTokens = (method, amount) => {
    setTokens(prev => prev + amount)
    alert(`Purchased ${amount} tokens via ${method}!`)
  }

  const watchVideoForTokens = () => {
    // Simulate watching a video
    setTimeout(() => {
      setTokens(prev => prev + 50)
      alert('You earned 50 tokens for watching a video!')
    }, 2000)
  }

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            NHL Sports Hub
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Token Display & Hamburger Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-primary">
              🪙 {tokens} tokens
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative"
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>

        {/* Enhanced Hamburger Menu */}
        {menuOpen && (
          <div className="absolute right-4 top-16 bg-background border border-border rounded-lg shadow-lg p-4 w-80 z-50">
            <div className="space-y-4">
              {/* Close Button */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Menu</h3>
                <Button
                  onClick={() => setMenuOpen(false)}
                  variant="outline"
                  size="sm"
                >
                  ×
                </Button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="md:hidden space-y-2">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === path
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>

              {/* Dark Mode Toggle */}
              <div className="border-t border-border pt-4">
                <Button
                  onClick={toggleDarkMode}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  <span className="ml-2">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </Button>
              </div>

              {/* Token Purchase Options */}
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-3">Purchase Tokens</h4>
                <div className="space-y-2">
                  <Button
                    onClick={() => purchaseTokens('Crypto', 500)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    💰 Buy with Crypto (500 tokens)
                  </Button>
                  <Button
                    onClick={() => purchaseTokens('Balls', 300)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    ⚽ Buy with Balls (300 tokens)
                  </Button>
                  <Button
                    onClick={() => purchaseTokens('Fiat', 200)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    💳 Buy with Fiat (200 tokens)
                  </Button>
                  <Button
                    onClick={watchVideoForTokens}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                  >
                    📺 Watch Video (Earn 50 tokens)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Home Page Component
const HomePage = ({ setTriviaOpen }) => (
  <div className="space-y-8">
    <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
      <h1 className="text-4xl font-bold mb-4">Welcome to NHL Sports Hub</h1>
      <p className="text-xl">Your ultimate destination for hockey news, stats, and entertainment</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Standings */}
      <Card>
        <CardHeader>
          <CardTitle>Current Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockStandings.map((team, index) => (
              <div key={team.team} className="flex justify-between items-center p-2 rounded-lg bg-accent/50">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span className="font-medium">{team.team}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {team.wins}-{team.losses}-{team.otl} ({team.points} pts)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Latest News */}
      <Card>
        <CardHeader>
          <CardTitle>Latest News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockNews.slice(0, 3).map((article) => (
              <div key={article.id} className="border-b border-border pb-4 last:border-b-0">
                <h3 className="font-semibold mb-1">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{article.summary}</p>
                <span className="text-xs text-muted-foreground">{article.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Mini Game Section */}
    <Card>
      <CardHeader>
        <CardTitle>Hockey Trivia Challenge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p>Test your NHL knowledge with our daily trivia challenge!</p>
          <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600" onClick={() => setTriviaOpen(true)}>
            <Gamepad2 className="mr-2" size={16} />
            Play Trivia
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
)

// News Page Component
const NewsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">NHL News</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockNews.map((article) => (
        <Card key={article.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{article.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{article.summary}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{article.date}</span>
              <Button variant="outline" size="sm">Read More</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

// Videos Page Component
const VideosPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">NHL Videos</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockVideos.map((video) => (
        <Card key={video.id} className="hover:shadow-lg transition-shadow">
          <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
            <Video size={48} className="text-gray-400" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg">{video.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{video.duration}</span>
              <Button variant="outline" size="sm">
                <Video className="mr-2" size={16} />
                Watch
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

// Placeholder Pages
const StatsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">NHL Stats</h1>
    <Card>
      <CardContent className="p-8 text-center">
        <BarChart3 size={64} className="mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">Player & Team Statistics</h2>
        <p className="text-muted-foreground">Comprehensive NHL statistics and analytics coming soon!</p>
      </CardContent>
    </Card>
  </div>
)

const MerchPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">NHL Merchandise</h1>
    <Card>
      <CardContent className="p-8 text-center">
        <ShoppingBag size={64} className="mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">Official NHL Gear</h2>
        <p className="text-muted-foreground">Shop jerseys, equipment, and fan gear from all 32 teams!</p>
      </CardContent>
    </Card>
  </div>
)

const FantasyPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Fantasy Hockey</h1>
    <Card>
      <CardContent className="p-8 text-center">
        <Trophy size={64} className="mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">Fantasy League Central</h2>
        <p className="text-muted-foreground">Manage your fantasy team and compete with friends!</p>
      </CardContent>
    </Card>
  </div>
)

const TicketsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">NHL Tickets</h1>
    <Card>
      <CardContent className="p-8 text-center">
        <Ticket size={64} className="mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">Game Tickets</h2>
        <p className="text-muted-foreground">Find and purchase tickets to NHL games near you!</p>
      </CardContent>
    </Card>
  </div>
)

const TeamsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">NHL Teams</h1>
    <Card>
      <CardContent className="p-8 text-center">
        <Users size={64} className="mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">All 32 NHL Teams</h2>
        <p className="text-muted-foreground">Explore team rosters, schedules, and statistics!</p>
      </CardContent>
    </Card>
  </div>
)

// Google Doodle-style Mini Game Component
const MiniGame = ({ isOpen, onClose }) => {
  const [selectedTeam, setSelectedTeam] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const [targets, setTargets] = useState([])
  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem('nhl-mini-game-leaderboard')
    return saved ? JSON.parse(saved) : {
      'Boston Bruins': 0,
      'Toronto Maple Leafs': 0,
      'Tampa Bay Lightning': 0,
      'Florida Panthers': 0,
      'Buffalo Sabres': 0,
      'Montreal Canadiens': 0,
      'Ottawa Senators': 0,
      'Detroit Red Wings': 0
    }
  })

  const teams = [
    'Boston Bruins', 'Toronto Maple Leafs', 'Tampa Bay Lightning', 'Florida Panthers',
    'Buffalo Sabres', 'Montreal Canadiens', 'Ottawa Senators', 'Detroit Red Wings'
  ]

  const startGame = () => {
    if (!selectedTeam) {
      alert('Please select a team first!')
      return
    }
    setGameStarted(true)
    setScore(0)
    setTimeLeft(30)
    setGameOver(false)
    generateTargets()
  }

  const generateTargets = () => {
    const newTargets = []
    for (let i = 0; i < 5; i++) {
      newTargets.push({
        id: i,
        x: Math.random() * 400,
        y: Math.random() * 300,
        hit: false
      })
    }
    setTargets(newTargets)
  }

  const hitTarget = (targetId) => {
    setTargets(prev => prev.map(target => 
      target.id === targetId ? { ...target, hit: true } : target
    ))
    setScore(prev => prev + 10)
    
    setTimeout(() => {
      setTargets(prev => prev.filter(target => target.id !== targetId))
      if (targets.filter(t => !t.hit).length <= 1) {
        generateTargets()
      }
    }, 200)
  }

  const endGame = () => {
    setGameOver(true)
    setGameStarted(false)
    
    // Update leaderboard
    const newLeaderboard = { ...leaderboard }
    newLeaderboard[selectedTeam] += score
    setLeaderboard(newLeaderboard)
    localStorage.setItem('nhl-mini-game-leaderboard', JSON.stringify(newLeaderboard))
  }

  useEffect(() => {
    let timer
    if (gameStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (timeLeft === 0 && gameStarted) {
      endGame()
    }
    return () => clearTimeout(timer)
  }, [gameStarted, timeLeft])

  if (!isOpen) return null

  const sortedLeaderboard = Object.entries(leaderboard)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[700px] bg-gradient-to-b from-blue-900 to-green-900 text-white max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-center flex justify-between items-center">
            🏒 Hockey Target Practice
            <Button onClick={onClose} variant="outline" size="sm" className="text-white">×</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!gameStarted && !gameOver && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Choose Your Team</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                >
                  <option value="">Select a team...</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
              <Button onClick={startGame} className="w-full bg-green-600 hover:bg-green-700">
                Start Game
              </Button>
            </div>
          )}

          {gameStarted && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>Team: {selectedTeam}</div>
                <div>Score: {score}</div>
                <div>Time: {timeLeft}s</div>
              </div>
              
              <div className="relative bg-green-800 rounded-lg h-80 overflow-hidden border-4 border-white">
                {/* Hockey rink background */}
                <div className="absolute inset-0 bg-gradient-to-b from-green-700 to-green-900"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Targets */}
                {targets.filter(target => !target.hit).map(target => (
                  <button
                    key={target.id}
                    onClick={() => hitTarget(target.id)}
                    className="absolute w-8 h-8 bg-red-500 rounded-full border-2 border-white hover:bg-red-600 transition-colors animate-pulse"
                    style={{
                      left: `${target.x}px`,
                      top: `${target.y}px`
                    }}
                  >
                    🎯
                  </button>
                ))}
              </div>
              
              <div className="text-center text-sm">
                Click the targets as fast as you can! Your score will be added to your team's total.
              </div>
            </div>
          )}

          {gameOver && (
            <div className="space-y-4 text-center">
              <h3 className="text-2xl font-bold">Game Over!</h3>
              <div className="text-lg">
                Final Score: {score} points for {selectedTeam}
              </div>
              <Button 
                onClick={() => {
                  setGameOver(false)
                  setSelectedTeam('')
                }} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Play Again
              </Button>
            </div>
          )}

          {/* Leaderboard */}
          <div className="border-t border-gray-600 pt-4">
            <h4 className="font-semibold mb-3 text-center">Team Leaderboard</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {sortedLeaderboard.map(([team, points], index) => (
                <div key={team} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                  <span className="flex items-center">
                    <span className="mr-2">{index + 1}.</span>
                    <span className={selectedTeam === team ? 'font-bold text-yellow-400' : ''}>
                      {team}
                    </span>
                  </span>
                  <span className="font-bold">{points}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Profile Component
const ProfilePage = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('nhl-user-profile')
    return saved ? JSON.parse(saved) : {
      username: 'HockeyFan2024',
      favoriteTeam: 'Boston Bruins',
      level: 12,
      experience: 26674969,
      maxExperience: 9000000,
      gamesPlayed: 126,
      wins: 89,
      totalPoints: 60174969,
      joinDate: '11/14/2018',
      avatar: '🏒'
    }
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(profile)

  const saveProfile = () => {
    setProfile(editForm)
    localStorage.setItem('nhl-user-profile', JSON.stringify(editForm))
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  if (!isOpen) return null

  const experiencePercentage = (profile.experience / profile.maxExperience) * 100

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[500px] bg-gradient-to-b from-pink-600 to-red-600 text-white max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-center flex justify-between items-center">
            <div className="flex space-x-4">
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant="outline" 
                size="sm" 
                className="text-white"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              <span>Profile</span>
            </div>
            <Button onClick={onClose} variant="outline" size="sm" className="text-white">×</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="text-center space-y-4">
            <div className="text-6xl">{profile.avatar}</div>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder="Username"
                />
                <select
                  value={editForm.favoriteTeam}
                  onChange={(e) => setEditForm({...editForm, favoriteTeam: e.target.value})}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                >
                  <option value="Boston Bruins">Boston Bruins</option>
                  <option value="Toronto Maple Leafs">Toronto Maple Leafs</option>
                  <option value="Tampa Bay Lightning">Tampa Bay Lightning</option>
                  <option value="Florida Panthers">Florida Panthers</option>
                  <option value="Buffalo Sabres">Buffalo Sabres</option>
                  <option value="Montreal Canadiens">Montreal Canadiens</option>
                  <option value="Ottawa Senators">Ottawa Senators</option>
                  <option value="Detroit Red Wings">Detroit Red Wings</option>
                </select>
                <input
                  type="text"
                  value={editForm.avatar}
                  onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder="Avatar (emoji)"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">{profile.username}</h2>
                <p className="text-lg opacity-90">& {profile.favoriteTeam}</p>
              </div>
            )}
          </div>

          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Level {profile.level}</span>
              <span className="text-sm">{profile.experience.toLocaleString()}/{profile.maxExperience.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(experiencePercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-black bg-opacity-30 rounded">
                <span className="flex items-center">
                  <span className="mr-2">🎮</span>
                  Games Played
                </span>
                <span className="font-bold">{profile.gamesPlayed}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-black bg-opacity-30 rounded">
                <span className="flex items-center">
                  <span className="mr-2">🏆</span>
                  Wins
                </span>
                <span className="font-bold">{profile.wins}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-black bg-opacity-30 rounded">
                <span className="flex items-center">
                  <span className="mr-2">⭐</span>
                  Total Points
                </span>
                <span className="font-bold">{profile.totalPoints.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-black bg-opacity-30 rounded">
                <span className="flex items-center">
                  <span className="mr-2">📅</span>
                  Member Since
                </span>
                <span className="font-bold">{profile.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button onClick={saveProfile} className="flex-1 bg-green-600 hover:bg-green-700">
                  Save Changes
                </Button>
                <Button onClick={cancelEdit} variant="outline" className="flex-1 text-white">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  🏒 Achievements
                </Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                  📊 Detailed Stats
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Custom Footer Component
const CustomFooter = () => {
  const [onlineNow] = useState([1, 2, 5, 4])
  const [allTimeVisitors] = useState([2, 4, 7, 8, 3, 9])
  const [selectedLanguage, setSelectedLanguage] = useState('English')

  const languages = [
    'English', 'Mandarin', 'Hindi', 'Spanish', 'French', 
    'Arabic', 'Bengali', 'Russian', 'Portuguese', 'Japanese'
  ]

  return (
    <footer className="bg-black text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Online Stats */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h3 className="text-yellow-400 font-bold text-lg mb-2">ONLINE NOW</h3>
            <div className="flex justify-center space-x-4">
              {onlineNow.map((num, index) => (
                <span key={index} className="text-yellow-400 text-2xl font-bold">
                  {num}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-2">ALL TIME VISITORS</h3>
            <div className="flex justify-center space-x-4">
              {allTimeVisitors.map((num, index) => (
                <span key={index} className="text-yellow-400 text-2xl font-bold">
                  {num}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Accessibility */}
          <div>
            <h4 className="text-cyan-400 font-bold text-lg mb-4">ACCESSIBILITY</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Accessibility Options</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Suggestions</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-purple-400 font-bold text-lg mb-4">COMPANY</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Responsible Gaming</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">AML Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Fair Play</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Credits</a></li>
            </ul>
          </div>

          {/* Competitions */}
          <div>
            <h4 className="text-yellow-400 font-bold text-lg mb-4">COMPETITIONS</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Tournaments</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Registration</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Prizes</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Player of the Month</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Wall of Fame</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Awards & Achievements</a></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <div className="mb-6">
              <h4 className="text-purple-400 font-bold text-lg mb-4">LEGAL</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Responsible Gaming</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">AML Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Fair Play</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-orange-400 font-bold text-lg mb-4">SUPPORT</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-pink-400 font-bold text-lg mb-4">SOCIAL MEDIA</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017 0z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="text-center">
          <select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>
    </footer>
  )
}

function App() {
  const [darkMode, setDarkMode] = useState(true) // Default to dark mode
  const [slotsOpen, setSlotsOpen] = useState(false)
  const [chatbotOpen, setChatbotOpen] = useState(false)
  const [triviaOpen, setTriviaOpen] = useState(false)
  const [miniGameOpen, setMiniGameOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  // Universal modal closing logic
  const handleModalBackdropClick = (e, closeFunction) => {
    if (e.target === e.currentTarget) {
      closeFunction()
    }
  }

  const handleDoubleClick = (e, closeFunction) => {
    if (e.target === e.currentTarget) {
      closeFunction()
    }
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Fixed Position Buttons */}
        {/* Profile Button - Top Left */}
        <div className="fixed top-20 left-4 z-30">
          <CircularButton 
            onClick={() => setProfileOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <User size={20} />
          </CircularButton>
        </div>

        {/* Dark Mode Toggle - Top Right (in hamburger menu on mobile, separate on desktop) */}
        <div className="hidden md:block fixed top-20 right-4 z-30">
          <CircularButton onClick={toggleDarkMode} className="bg-gray-600 hover:bg-gray-700 text-white">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </CircularButton>
        </div>

        {/* Chatbot Button - Bottom Left */}
        <div className="fixed bottom-4 left-4 z-30">
          <CircularButton 
            onClick={() => setChatbotOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle size={20} />
          </CircularButton>
        </div>

        {/* Mini Game Button - Bottom Right (above slots) */}
        <div className="fixed bottom-16 right-4 z-30">
          <CircularButton 
            onClick={() => setMiniGameOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Target size={20} />
          </CircularButton>
        </div>

        {/* Slots Game Button - Bottom Right */}
        <div className="fixed bottom-4 right-4 z-30">
          <CircularButton 
            onClick={() => setSlotsOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Gamepad2 size={20} />
          </CircularButton>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage setTriviaOpen={setTriviaOpen} />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/merch" element={<MerchPage />} />
            <Route path="/fantasy" element={<FantasyPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/teams" element={<TeamsPage />} />
          </Routes>
        </main>

        {/* Modals with Universal Closing Logic */}
        <div 
          className={slotsOpen ? "block" : "hidden"}
          onClick={(e) => handleModalBackdropClick(e, () => setSlotsOpen(false))}
          onDoubleClick={(e) => handleDoubleClick(e, () => setSlotsOpen(false))}
        >
          <SlotsGame isOpen={slotsOpen} onClose={() => setSlotsOpen(false)} />
        </div>
        
        <div 
          className={chatbotOpen ? "block" : "hidden"}
          onClick={(e) => handleModalBackdropClick(e, () => setChatbotOpen(false))}
          onDoubleClick={(e) => handleDoubleClick(e, () => setChatbotOpen(false))}
        >
          <Chatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
        </div>
        
        <div 
          className={triviaOpen ? "block" : "hidden"}
          onClick={(e) => handleModalBackdropClick(e, () => setTriviaOpen(false))}
          onDoubleClick={(e) => handleDoubleClick(e, () => setTriviaOpen(false))}
        >
          <TriviaGame isOpen={triviaOpen} onClose={() => setTriviaOpen(false)} />
        </div>
        
        <div 
          className={miniGameOpen ? "block" : "hidden"}
          onClick={(e) => handleModalBackdropClick(e, () => setMiniGameOpen(false))}
          onDoubleClick={(e) => handleDoubleClick(e, () => setMiniGameOpen(false))}
        >
          <MiniGame isOpen={miniGameOpen} onClose={() => setMiniGameOpen(false)} />
        </div>
        
        <div 
          className={profileOpen ? "block" : "hidden"}
          onClick={(e) => handleModalBackdropClick(e, () => setProfileOpen(false))}
          onDoubleClick={(e) => handleDoubleClick(e, () => setProfileOpen(false))}
        >
          <ProfilePage isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
        </div>

        {/* Custom Footer */}
        <CustomFooter />
      </div>
    </Router>
  )
}

export default App

