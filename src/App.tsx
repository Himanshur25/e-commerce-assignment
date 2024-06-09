import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import GlobalProvider from "./components/providers/GlobalProvider";

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />

          <Route
            path="*"
            element={<div>404...This Page Does not Exist..!!!</div>}
          />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
