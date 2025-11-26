import { useEffect, useState } from "react";
import "./App.css";
import IntroVideo from "./components/IntroVideo";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 11000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen">
      <div
        className={`transition-all duration-700 ${
          showIntro ? "opacity-30 blur-sm" : "opacity-100 blur-0"
        }`}
      >
        <AppRoutes />
      </div>
      {showIntro && <IntroVideo onFinish={() => setShowIntro(false)} />}
    </div>
  );
}

export default App;
