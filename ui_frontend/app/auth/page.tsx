import Link from "next/link";

export default function AuthPage() {
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center px-6">

      {/* ===== Background Glow ===== */}
      <div className="absolute w-[500px] h-[500px] bg-highlightcolor rounded-full blur-[140px] opacity-20 top-[20%] left-[10%]"></div>

      {/* ===== Main Container ===== */}
      <div className="relative z-10 w-full max-w-7xl grid md:grid-cols-2 gap-16 items-center">

        {/* ================= LEFT SIDE ================= */}
        <div>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-highlightcolor rounded-xl flex items-center justify-center text-black font-bold">
              S
            </div>
            <span className="text-2xl font-semibold">Scout</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Build Your <span className="text-highlightcolor">Dream</span><br />
            Team Today
          </h1>

          {/* Description */}
          <p className="mt-6 text-gray-400 max-w-md">
            Join the community of developers, designers, and creators who
            are building the future together. Find teammates, mentors, and
            opportunities that match your skills.
          </p>

          {/* Bullet Points */}
          <div className="mt-10 space-y-6">

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#2a2a40] flex items-center justify-center">
                👥
              </div>
              <span className="text-gray-300">
                Connect with 10,000+ developers
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#2a2a40] flex items-center justify-center">
                ⚡
              </div>
              <span className="text-gray-300">
                AI-powered team matching
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#2a2a40] flex items-center justify-center">
                🎯
              </div>
              <span className="text-gray-300">
                Find your perfect project fit
              </span>
            </div>

          </div>
        </div>


        {/* ================= RIGHT SIDE (AUTH CARD) ================= */}
        <div className="bg-[#252538]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-10 max-w-md w-full mx-auto">

          <h2 className="text-2xl font-semibold text-center mb-2">
            Join Scout
          </h2>

          <p className="text-center text-gray-400 mb-8">
            Sign up to start building your team
          </p>

          {/* GitHub Button */}
          <button className="w-full bg-[#2f2f48] hover:bg-[#3a3a5f] transition py-3 rounded-xl mb-4">
            Continue with GitHub
          </button>

          {/* Google Button */}
          <button className="w-full bg-[#2f2f48] hover:bg-[#3a3a5f] transition py-3 rounded-xl">
            Continue with Google
          </button>

          <p className="text-xs text-gray-500 text-center mt-6">
            By continuing, you agree to Scout's{" "}
            <Link href="#" className="text-highlightcolor hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-highlightcolor hover:underline">
              Privacy Policy
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}