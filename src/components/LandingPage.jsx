import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Chrome, Zap, Download, Bot, Menu, X } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="bg-gray-950 text-white min-h-screen px-4 sm:px-6 py-4 sm:py-6 font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center max-w-7xl mx-auto mb-8 sm:mb-10">
        <div className="flex items-center gap-2">
          <Chrome className="text-blue-500" size={24} />
          <span className="text-xl sm:text-2xl font-bold text-blue-500">Prompt2Plugin</span>
        </div>
        
        {/* Desktop Navigation */}
        <ul className="hidden lg:flex gap-6 text-sm font-medium items-center">
          <li className="hover:text-blue-400 cursor-pointer transition-colors">Home</li>
          <li className="hover:text-blue-400 cursor-pointer transition-colors">About</li>
          <li className="hover:text-blue-400 cursor-pointer transition-colors">Features</li>
          <li className="hover:text-blue-400 cursor-pointer transition-colors">Contact</li>
          {user ? (
            <li>
              <Link 
                to="/profile" 
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition-colors"
              >
                Profile
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className="hover:text-blue-400 cursor-pointer transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/signup" 
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition-colors"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 right-4 bg-gray-900 border border-gray-800 rounded-xl p-4 min-w-48 lg:hidden z-50">
            <ul className="space-y-3 text-sm font-medium">
              <li className="hover:text-blue-400 cursor-pointer transition-colors py-2">Home</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors py-2">About</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors py-2">Features</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors py-2">Contact</li>
              {user ? (
                <li>
                  <Link 
                    to="/profile" 
                    className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className="block hover:text-blue-400 cursor-pointer transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/signup" 
                      className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition-colors text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Header */}
      <header className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 px-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight">
          Generate a Chrome Extension with AI
        </h1>
        <p className="text-gray-400 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
          Describe the Chrome extension you want to create and let our AI do the magic.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="A tool that translates selected text on a web page"
            className="w-full sm:flex-1 max-w-lg px-4 py-3 sm:py-4 rounded-lg text-black border-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
          />
          <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base whitespace-nowrap">
            Generate Extension
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center mb-12 sm:mb-16">
        {[
          {
            icon: <Bot className="text-blue-500" size={28} />,
            title: "LLM-Powered Generator",
            desc: "Harness the power of AI to generate your Chrome extension.",
          },
          {
            icon: <Download className="text-green-500" size={28} />,
            title: "Download ZIP",
            desc: "Export your extension as a ready-to-use ZIP file.",
          },
          {
            icon: <Zap className="text-orange-500" size={28} />,
            title: "Quick Generation",
            desc: "Generate extensions in seconds with our AI technology.",
          },
          {
            icon: <Chrome className="text-purple-500" size={28} />,
            title: "Chrome Compatible",
            desc: "All extensions are fully compatible with Chrome browser.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 p-4 sm:p-6 rounded-xl hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="mb-3 sm:mb-4 flex justify-center">{feature.icon}</div>
            <h3 className="font-bold text-base sm:text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* How it Works */}
      <section className="text-center mb-12 sm:mb-16 max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">How It Works</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12">
          {[
            { icon: "✍️", title: "Describe", desc: "Explain what your extension should do" },
            { icon: "⚡", title: "Generate", desc: "Let the AI create your extension code" },
            { icon: "📦", title: "Install", desc: "Download and load your new extension" },
          ].map((step, i) => (
            <div key={i} className="text-center max-w-xs">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{step.icon}</div>
              <h4 className="text-lg sm:text-xl font-semibold mb-2">{step.title}</h4>
              <p className="text-gray-400 text-sm sm:text-base">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              name: "Jenny M.",
              text: "A game changer for developers. The AI understands my requirements instantly.",
              rating: "⭐⭐⭐⭐⭐"
            },
            {
              name: "Mark T.",
              text: "The extension generation process is flawless and the output is production-ready.",
              rating: "⭐⭐⭐⭐⭐"
            },
            {
              name: "Saran K.",
              text: "I built and installed my first Chrome extension in minutes. Incredible!",
              rating: "⭐⭐⭐⭐⭐"
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="bg-gray-900 p-4 sm:p-6 border border-gray-800 rounded-xl text-sm hover:border-gray-700 transition-colors"
            >
              <div className="mb-2 text-xs sm:text-sm">{testimonial.rating}</div>
              <p className="italic mb-3 sm:mb-4 text-gray-300 text-sm sm:text-base leading-relaxed">"{testimonial.text}"</p>
              <p className="text-right font-semibold text-blue-400 text-sm">– {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs sm:text-sm text-gray-500 border-t border-gray-800 pt-6 sm:pt-8">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4">
          <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
          <a href="#" className="hover:text-blue-400 transition-colors">API</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
        </div>
        <p>&copy; 2024 Prompt2Plugin. All rights reserved.</p>
      </footer>
    </div>
  );
}
