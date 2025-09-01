import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
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
} from 'lucide-react';
import './App.css';

// Mock NHL data
const mockStandings = [
  { team: 'Boston Bruins', wins: 45, losses: 20, otl: 5, points: 95 },
  { team: 'Toronto Maple Leafs', wins: 42, losses: 22, otl: 6, points: 90 },
  { team: 'Tampa Bay Lightning', wins: 40, losses: 25, otl: 5, points: 85 },
  { team: 'Florida Panthers', wins: 38, losses: 27, otl: 7, points: 83 },
  { team: 'Buffalo Sabres', wins: 35, losses: 30, otl: 5, points: 75 },
];

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
];

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
];

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [miniGameOpen, setMiniGameOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage setMiniGameOpen={setMiniGameOpen} t={(key) => key} />} />
          {/* Add other routes here */}
        </Routes>
      </main>
      <footer className="bg-background border-t border-border py-4 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 NHL Sports Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};

const Navigation = ({ darkMode, toggleDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/news', label: 'News', icon: Newspaper },
    { path: '/videos', label: 'Videos', icon: Video },
    { path: '/stats', label: 'Stats', icon: BarChart3 },
    { path: '/rosters', label: 'Rosters', icon: Users },
    { path: '/merch', label: 'Merch', icon: ShoppingBag },
    { path: '/fantasy', label: 'Fantasy', icon: Trophy },
    { path: '/tickets', label: 'Tickets', icon: Ticket },
    { path: '/teams', label: 'Teams', icon: Users },
  ];

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            NHL Sports Hub
          </Link>
          
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

          <div className="flex items-center space-x-4">
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

        {menuOpen && (
          <div className="absolute right-4 top-16 bg-background border border-border rounded-lg shadow-lg p-4 w-80 z-50">
            <div className="space-y-4">
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const HomePage = ({ setMiniGameOpen, t }) => (
  <div className="space-y-8">
    <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
      <h1 className="text-4xl font-bold mb-4">{t('welcome')}</h1>
      <p className="text-xl">{t('subtitle')}</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('currentStandings')}</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>{t('latestNews')}</CardTitle>
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
  </div>
);

export default App;


