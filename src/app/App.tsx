import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { HomePage } from "../pages/HomePage";
import { WorksPage } from "../pages/WorksPage";
import { WorkDetailPage } from "../pages/WorkDetailPage";

export function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/works/:workId" element={<WorkDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
