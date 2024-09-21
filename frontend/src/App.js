import React from "react";
import "./App.css";
import Downloader from './Components/Downloader';
import InstaDownloader from './Components/InstaDownloader';
import FbDownloader from "./Components/FbDownloader";
import XDownloader from "./Components/XDownloader";
import WeatherDateToggle from "./Components/WeatherDateToggle";
import Navbar from "./Components/Navbar";
import Yt_download_guide from "./Components/Yt_download_guide";
import Footer from "./Components/Footer";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {

  return (
  <>
    <Router>
      <WeatherDateToggle />
      <Routes>
        <Route path="/" element={<Downloader />} />
        <Route path="/instadownloader" element={<InstaDownloader />} />
        <Route path="/fbDownloader" element = {<FbDownloader/>} />
        <Route path="/xDownloader" element = {<XDownloader/>} />
      </Routes>
      <Navbar />
      <Yt_download_guide/>
      <Footer/>
    </Router>
  </>
  );
}

export default App;
