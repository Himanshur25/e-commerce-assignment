import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="*"
          element={<div>404...This Page Does not Exist..!!!</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
