import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.abhishekpanda.com"),
  title: {
    default: "Abhishek Panda | Enterprise AI Solution Architect",
    template: "%s | Abhishek Panda",
  },
  description: "Abhishek Panda is an Enterprise AI Solution Architect building secure, scalable AI platforms across Azure, AWS, and Google Cloud. Explore his experience, projects, architecture, and engineering writing.",
  applicationName: "Abhishek Panda — Portfolio",
  authors: [{ name: "Abhishek Panda", url: "https://www.abhishekpanda.com" }],
  creator: "Abhishek Panda",
  publisher: "Abhishek Panda",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "https://www.abhishekpanda.com/",
    siteName: "Abhishek Panda",
    title: "Abhishek Panda | Enterprise AI Solution Architect",
    description: "Enterprise AI architecture and secure, scalable multi-cloud platforms across Azure, AWS, and Google Cloud.",
    firstName: "Abhishek",
    lastName: "Panda",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Abhishek Panda — Enterprise AI Solution Architect" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhishek Panda | Enterprise AI Solution Architect",
    description: "Enterprise AI architecture and secure, scalable multi-cloud platforms.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: {
    icon: [
      { url: "/abhishek-panda-icon.png", type: "image/png", sizes: "any" },
    ],
    shortcut: "/abhishek-panda-icon.png",
    apple: [{ url: "/abhishek-panda-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ProfilePage",
              "@id": "https://www.abhishekpanda.com/#profile",
              "url": "https://www.abhishekpanda.com/",
              "name": "Abhishek Panda | Enterprise AI Solution Architect",
              "mainEntity": { "@id": "https://www.abhishekpanda.com/#person" },
            },
            {
              "@type": "Person",
              "@id": "https://www.abhishekpanda.com/#person",
              "name": "Abhishek Panda",
              "alternateName": ["Abhishek", "Abhishek Panda"],
              "url": "https://www.abhishekpanda.com/",
              "image": "https://www.abhishekpanda.com/profile.png",
              "jobTitle": "Architect / Enterprise AI Solution Architect",
              "worksFor": { "@type": "Organization", "name": "Quality-AI" },
              "description": "Enterprise AI Solution Architect designing secure, scalable, multi-cloud AI platforms and intelligent enterprise solutions.",
              "knowsAbout": ["Enterprise AI architecture", "Generative AI", "Agentic AI", "Retrieval-augmented generation", "Azure AI", "AWS", "Google Cloud", "Cloud architecture", "Kubernetes", ".NET", "Python", "MLOps"],
              "sameAs": ["https://www.linkedin.com/in/iamabhishekpanda/", "https://github.com/abhishekpandaOfficial", "https://substack.com/@stackedin/posts"],
            },
            {
              "@type": "WebSite",
              "@id": "https://www.abhishekpanda.com/#website",
              "url": "https://www.abhishekpanda.com/",
              "name": "Abhishek Panda",
              "publisher": { "@id": "https://www.abhishekpanda.com/#person" },
              "inLanguage": "en",
            },
          ],
        }).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
