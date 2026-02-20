import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col">

      {/* ================= ANIMATED BACKGROUND ================= */}

      <div className="absolute w-[400px] h-[400px] bg-highlightcolor rounded-full blur-[120px] opacity-20 top-[-100px] left-[-100px] animate-float"></div>

      <div
        className="absolute w-[350px] h-[350px] bg-purple-500 rounded-full blur-[120px] opacity-20 bottom-[-120px] right-[-80px] animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div
        className="absolute w-[300px] h-[300px] bg-indigo-500 rounded-full blur-[120px] opacity-20 top-[40%] left-[60%] animate-float"
        style={{ animationDelay: "4s" }}
      ></div>


      {/* ================= NAVBAR ================= */}
      <nav className="relative z-10 w-full flex justify-center pt-6">
        <div className="w-[95%] max-w-7xl bg-[#252538]/70 backdrop-blur-md px-6 py-4 rounded-full flex items-center justify-between">

          {/* Logo */}
          <div className="text-2xl font-bold text-highlightcolor">
            SCOUT
          </div>

          {/* Center Links */}
          <div className="hidden md:flex gap-10 text-sm font-medium">
            <a href="#" className="hover:text-highlightcolor transition">
              How it Works
            </a>
            <a href="#" className="hover:text-highlightcolor transition">
              FAQ
            </a>
            <a href="#" className="hover:text-highlightcolor transition">
              Contact
            </a>
          </div>

          {/* Right */}
            <Link href="/auth">
            <button className="bg-highlightcolor text-black px-5 py-2 rounded-full font-semibold hover:opacity-80 transition">
              Sign In
            </button>
            </Link>

        </div>
      </nav>


      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 mt-24">

        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Build Your Dream Team with{" "}
          <span className="text-highlightcolor">SCOUT</span>
        </h1>

        <p className="mt-6 max-w-2xl text-gray-300 text-base md:text-lg">
          Create or join teams for hackathons, startups, and innovative
          projects using AI-powered smart matching.
          Find the perfect teammates and mentors instantly.
        </p>

        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <Link href="/auth">
          <button className="bg-highlightcolor text-black px-8 py-3 rounded-full font-semibold hover:opacity-80 transition">
            Get Started
          </button>
</Link>
        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section className="relative z-10 mt-32 px-6 max-w-7xl mx-auto">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Platform Highlights
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

          <Feature
            title="Team Formation"
            desc="Create or join teams for hackathons, projects, and startups with AI-powered matching."
          />

          <Feature
            title="Smart Search"
            desc="Find people by skills, location, experience, and availability with intelligent filters."
          />

          <Feature
            title="Real-time Chat"
            desc="Connect instantly with potential teammates and mentors through built-in messaging."
          />

          <Feature
            title="GitHub Integration"
            desc="Verify skills through real code contributions and showcase your best projects."
          />

          <Feature
            title="Location-based Matching"
            desc="Find teammates near you for in-person collaboration or globally for remote work."
          />

          <Feature
            title="Mentor Connect"
            desc="Get guidance from experienced mentors who can help you grow and succeed."
          />

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 mt-32 border-t border-gray-700 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} SCOUT. All rights reserved.
      </footer>

    </main>
  );
}


/* ================= FEATURE COMPONENT ================= */

function Feature({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-[#252538]/80 backdrop-blur-sm p-8 rounded-2xl hover:scale-105 transition duration-300 border border-white/5 hover:border-highlightcolor/40">
      <h3 className="text-xl font-semibold text-highlightcolor mb-4">
        {title}
      </h3>
      <p className="text-gray-300 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}