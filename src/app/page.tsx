import GameCanvas from '@/components/GameCanvas';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-blue-600">🎮</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EduGameHub</h1>
                <p className="text-sm text-gray-600">English Learning Games for Grade 6</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Global Success Curriculum
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to EduGameHub!</h2>
              <p className="text-gray-600">
                Learn English through interactive games designed for Global Success Grade 6 curriculum. 
                Play vocabulary games, practice grammar, and improve your pronunciation skills.
              </p>
            </div>

            {/* Game Canvas */}
            <div className="flex justify-center">
              <GameCanvas 
                width={1024} 
                height={768} 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Game Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Vocabulary Games</h3>
            <p className="text-gray-600 text-sm">Learn new words through interactive matching and quiz games</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Grammar Practice</h3>
            <p className="text-gray-600 text-sm">Master English grammar rules with fun exercises</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-3">🎤</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pronunciation</h3>
            <p className="text-gray-600 text-sm">Improve your speaking skills with audio-based games</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiplayer</h3>
            <p className="text-gray-600 text-sm">Challenge your classmates in real-time learning games</p>
          </div>
        </div>

        {/* Units Overview */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Grade 6 Units</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              { title: 'My new school', available: false },
              { title: 'My home', available: true },
              { title: 'My Friends', available: false },
              { title: 'My neighbourhood', available: false },
              { title: 'Natural wonders of the world', available: false },
              { title: 'Our Tet Holiday', available: false },
              { title: 'Television', available: false },
              { title: 'Sports and Games', available: false },
              { title: 'Cities of the world', available: false },
              { title: 'Our houses in the future', available: false },
              { title: 'Our Greener World', available: false },
              { title: 'Robots', available: false }
            ].map((unit, index) => {
              const unitNumber = index + 1;
              const isUnit2 = unitNumber === 2;
              
              if (isUnit2) {
                return (
                  <Link key={index} href="/unit2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold text-sm group-hover:bg-green-500 group-hover:text-white transition-colors">
                          {unitNumber}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">{unit.title}</span>
                          <div className="flex items-center mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Available
                            </span>
                            <span className="ml-2 text-xs text-gray-500">📚 Vocabulary • 🎮 Games</span>
                          </div>
                        </div>
                        <div className="text-green-500 group-hover:text-green-600 transition-colors">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              } else {
                return (
                  <div key={index} className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 opacity-60">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center font-semibold text-sm">
                        {unitNumber}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-500">{unit.title}</span>
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-300">
                        🔒
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              EduGameHub - Making English learning fun and interactive for Grade 6 students
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Built with Next.js, Phaser.js, and Supabase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
