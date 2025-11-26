import { useState } from "react";
export default function IntroVideo({ onFinish }: { onFinish: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const video = document.getElementById("introVideo") as HTMLVideoElement;
    if (video) {
      video.muted = false; // unmute
      video.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
        >
          ▶ Play with Sound
        </button>
      )}
      <video
        id="introVideo"
        src="/videos/intro.mp4"
        muted
        playsInline
        onEnded={onFinish}
        className="max-w-2xl w-full rounded-2xl shadow-2xl border border-gray-300"
      />
    </div>
  );
}
