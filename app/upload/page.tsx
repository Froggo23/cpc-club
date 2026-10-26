import type { Metadata } from "next";
import HalftoneText from "@/components/HalftoneText";
import Scene from "@/components/Scene";
import UploadForm from "@/components/UploadForm";

export const metadata: Metadata = { title: "Upload · Competitive Programming Club" };

export default function Upload() {
  return (
    <main className="page page-upload">
      <Scene tone="blue" />

      <HalftoneText
        as="h1"
        label="Upload your work"
        lines={["UPLOAD", "your work"]}
        cell={6}
        blur={0.06}
        smear={0.02}
        className="upload-title"
      />

      <div className="crt">
        <div className="crt-bezel">
          <span className="sticky" aria-hidden>
            push your
            <br />
            repo!
          </span>
          <div className="crt-screen">
            <UploadForm />
          </div>
        </div>
        <div className="crt-chin">
          <span className="crt-led" />
          <span className="crt-brand pixel">CPC-2000</span>
        </div>
        <div className="crt-base" />
      </div>

      <p className="upload-note">
        Paste a link to a <strong>public</strong> GitHub repo. The name, description and language are pulled from GitHub
        automatically.
      </p>
    </main>
  );
}
