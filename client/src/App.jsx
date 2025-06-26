import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUploadPage from "./components/FileUploadPage/FileUploadPage";
import InputDataPage from "./components/InputDataPage/InputDataPage";
import HomePage from "../src/Pages/HomePage";
import DiskScheduling from "./components/Disk/DiskScheduling";
import DocsPage from "./Pages/DocsPage";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/file-upload" element={<FileUploadPage />} />
          <Route path="/cpu-scheduling" element={<InputDataPage />} />
          <Route path="/disk-scheduling" element={<DiskScheduling />} />
          <Route path="/docs" element={<DocsPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
