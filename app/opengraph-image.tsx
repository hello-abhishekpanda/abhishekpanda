import { ImageResponse } from "next/og";

export const alt = "Abhishek Panda — Enterprise AI Solution Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      justifyContent: "center", padding: "78px 92px", color: "#24212a",
      background: "linear-gradient(135deg, #fff9fa 0%, #ffffff 58%, #f5edf0 100%)",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#b5123b", fontSize: 23, fontWeight: 700, letterSpacing: 4 }}>
        <div style={{ width: 15, height: 15, borderRadius: 20, background: "#b5123b" }} /> ENTERPRISE AI · MULTI-CLOUD
      </div>
      <div style={{ display: "flex", marginTop: 42, fontSize: 72, lineHeight: 1.05, fontWeight: 700, letterSpacing: -3 }}>Abhishek Panda</div>
      <div style={{ display: "flex", marginTop: 22, fontSize: 34, color: "#5d5962" }}>Enterprise AI Solution Architect</div>
      <div style={{ display: "flex", marginTop: 38, fontSize: 22, color: "#79737c" }}>Secure, scalable AI platforms for real-world enterprise systems</div>
      <div style={{ display: "flex", marginTop: 60, fontSize: 19, fontWeight: 600, color: "#b5123b" }}>abhishekpanda.com</div>
    </div>,
    size,
  );
}
