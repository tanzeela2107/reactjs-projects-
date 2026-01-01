import { useState } from "react";
import CurrencyConverter from "../components/CurrencyConverter";

function Home() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`app-wrapper ${darkMode ? "dark-bg" : ""}`}>
      <CurrencyConverter darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

export default Home;
