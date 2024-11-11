import React from "react";
import "./App.css";
import Downloader from './Components/Downloader';
import InstaDownloader from './Components/InstaDownloader';
import FbDownloader from "./Components/FbDownloader";
import XDownloader from "./Components/XDownloader";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import Guide_of_downloader from "./Components/Guide_of_downloader";
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
        <div className="flex w-[100%] fixed top-0 Top-bar">
          <Sidebar />
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<Downloader />} />
          <Route path="/instadownloader" element={<InstaDownloader />} />
          <Route path="/fbDownloader" element={<FbDownloader />} />
          <Route path="/xDownloader" element={<XDownloader />} />
        </Routes>
        <Guide_of_downloader/>
        <Footer />
      </Router>
    </>
  );
}
// + , - svgs
{/* <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 24 24" style={{display:plus_display}} onClick={toggle}>
<path fill-rule="evenodd" d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"></path></svg>

<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 24 24" style={{display:minu_display}} onClick={toggle}>
<path fill-rule="evenodd" d="M 2 11 L 22 11 L 22 13 L 2 13 Z"></path>
</svg> */}

export default App;
