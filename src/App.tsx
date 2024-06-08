import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import ProductListPage from "./pages/Product";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product" element={<ProductListPage />} />

        <Route
          path="*"
          element={<div>404...This Page Does not Exist..!!!</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
