import VideoSubtitle from "@/components/VideoSubtitle";
import VideoUpload from "@/components/VideoUpload";

export default function Home() {
  return (
    <div className="Application-Parent">
      <VideoUpload />
      <VideoSubtitle />
    </div>
  );
}
