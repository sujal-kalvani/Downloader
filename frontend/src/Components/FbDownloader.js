import React, { useState } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";


function FbDownloader() {
  const [videoURL, setVideoURL] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  const handleUrlChange = (e) => {
    setVideoURL(e.target.value);
  };

  // Function to fetch video details
  const fetchVideoInfo = async () => {
    if (!videoURL) {
      alert("Please enter a Facebook video URL");
      return;
    }

    setLoader(true);
    setVideoInfo(null);

    try {
      const response = await axios.post("http://localhost:5000/api/fb-video-info", {
        url: videoURL,
      });

      setVideoInfo(response.data);
    } catch (error) {
      console.error("Failed to fetch video info:", error);
      alert("Failed to fetch video info.");
    } finally {
      setLoader(false);
    }
  };

  // Function to download the video
  const handleDownload = async () => {
    
    setLoader(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/fb-download",
        { url: videoURL },
        { responseType: "blob" }
      );

      // Trigger the download of the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "video.mp4");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download video:", error);
      alert("Failed to download video.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="main">
      <div className="head">
        <p className="heading">Facebook Video Downloader</p>
        <p className="semi-heading">Download your favorite Reels instantly!</p>
      </div>

      <div className="container2">
        <form>
          <input
            type="text"
            className="form-control me-2 border-2 rounded-10 search"
            placeholder="Paste Instagram Reels link here"
            value={videoURL}
            onChange={handleUrlChange}
            onKeyUp={fetchVideoInfo}
          />
          <svg
              onClick={fetchVideoInfo}
              className="search2"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0,0,300,150"
            >
              <g
                fill="red"
                fillRule="nonzero"
                stroke="red"
                strokeWidth="2"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
                fontFamily="none"
                fontWeight="none"
                fontSize="none"
                textAnchor="none"
                style={{ mixBlendMode: "normal" }}
              >
                <g transform="scale(8.53333,8.53333)">
                  <path d="M13,3c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c2.39651,0 4.59738,-0.85101 6.32227,-2.26367l5.9707,5.9707c0.25082,0.26124 0.62327,0.36648 0.97371,0.27512c0.35044,-0.09136 0.62411,-0.36503 0.71547,-0.71547c0.09136,-0.35044 -0.01388,-0.72289 -0.27512,-0.97371l-5.9707,-5.9707c1.41266,-1.72488 2.26367,-3.92576 2.26367,-6.32227c0,-5.511 -4.489,-10 -10,-10zM13,5c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8z"></path>
                </g>
              </g>
            </svg>
        </form>
        <p className="privacy-Service">
          By using our service you accept our{" "}
          <a href="#" className="link">Terms of Service</a>{" "}and{" "}
          <a href="#" className="link">Privacy Policy</a>.
        </p>
      </div>

      {loader && (
        <div className="loader">
          <BounceLoader color="#FDD333" />
        </div>
      )}

      {error && (
        <div className="error-message" style={{ color: "red" }}>
          {error}
        </div>
      )}

      {videoInfo && (
        <div className="info-box-1">
          <img src={videoInfo.thumbnail} alt="" className="thumbnailReel" />
          <div className="flex w-[80%] h-[100%] info">
          <div className="flex gap-4 flex-col w-[100%] items-center">
            <p className="font-semibold">{videoInfo.title.slice(0, 55)}...</p>
            <p className="">Duration: {new Date(videoInfo.duration * 1000).toISOString().substr(11, 8)}</p>
            <button
              onClick={handleDownload}
              className="px-3 py-2 bg-green-500 download"
            >
              Download
            </button>
            </div>  
          </div>
        </div>
      )}
    </div>
  );
}

export default FbDownloader;



  


