import React from "react";
import { useNavigate, Link } from "react-router-dom";

// Inline brand mark: classic black 'TA' typography
const BrandMark = ({ className = "text-sm" }) => (
  <span className={`${className} font-extrabold tracking-tight`}>TA</span>
);

const IconTrainer = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-10 w-10 text-indigo-600"
    fill="none"
    aria-hidden
  >
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M4 20c0-4 4-6 8-6s8 2 8 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconCalendar = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-10 w-10 text-indigo-600"
    fill="none"
    aria-hidden
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 3v4M8 3v4M3 11h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconClock = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-10 w-10 text-indigo-600"
    fill="none"
    aria-hidden
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 7v5l3 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconChart = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-10 w-10 text-indigo-600"
    fill="none"
    aria-hidden
  >
    <path
      d="M4 18h16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect x="6" y="10" width="3" height="8" fill="currentColor" />
    <rect x="11" y="7" width="3" height="11" fill="currentColor" />
    <rect x="16" y="12" width="3" height="6" fill="currentColor" />
  </svg>
);

// Tech logos for Built With
const TechReact = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-12 w-12 text-cyan-500"
    fill="none"
    aria-hidden
  >
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    <ellipse
      cx="12"
      cy="12"
      rx="9"
      ry="3.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="9"
      ry="3.5"
      transform="rotate(60 12 12)"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="9"
      ry="3.5"
      transform="rotate(120 12 12)"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const TechTailwind = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-12 w-12 text-sky-500"
    fill="none"
    aria-hidden
  >
    <path
      d="M4 10c2-4 6-4 8-2 2 2 4 2 8 0-2 4-6 4-8 2-2-2-4-2-8 0z"
      fill="currentColor"
    />
    <path
      d="M4 16c2-4 6-4 8-2 2 2 4 2 8 0-2 4-6 4-8 2-2-2-4-2-8 0z"
      fill="currentColor"
    />
  </svg>
);

const TechRouter = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-12 w-12 text-rose-500"
    fill="none"
    aria-hidden
  >
    <circle cx="6" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="6" r="2" fill="currentColor" />
    <circle cx="18" cy="12" r="2" fill="currentColor" />
    <path
      d="M7.5 11l3-3M13.5 7l3 3M8 13h8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Implementation topic icons
const IconState = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-8 w-8 text-indigo-600"
    fill="none"
    aria-hidden
  >
    <rect x="5" y="6" width="14" height="4" rx="1" fill="currentColor" />
    <rect x="5" y="12" width="10" height="4" rx="1" fill="currentColor" />
  </svg>
);
const IconForm = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-8 w-8 text-indigo-600"
    fill="none"
    aria-hidden
  >
    <rect
      x="5"
      y="4"
      width="14"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M8 8h8M8 12h6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const IconLayout = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-8 w-8 text-indigo-600"
    fill="none"
    aria-hidden
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect x="6" y="6" width="7" height="7" rx="1" fill="currentColor" />
    <rect x="14" y="6" width="4" height="12" rx="1" fill="currentColor" />
  </svg>
);
const IconLock = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-8 w-8 text-indigo-600"
    fill="none"
    aria-hidden
  >
    <rect
      x="5"
      y="10"
      width="14"
      height="9"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M8 10V8a4 4 0 118 0v2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const features = [
    {
      title: "Trainer Management",
      description:
        "Create and maintain trainer profiles with skills and contact details",
      Icon: IconTrainer,
      path: "/trainers",
    },
    {
      title: "Session Scheduling",
      description:
        "Plan sessions with conflict detection and clear timing details",
      Icon: IconCalendar,
      path: "/sessions",
    },
    {
      title: "Attendance Tracking",
      description:
        "Check-in/out with automatic working hours and status badges",
      Icon: IconClock,
      path: "/attendance",
    },
    {
      title: "Reports & Analytics",
      description:
        "Export CSV and view summarized insights by trainer and date",
      Icon: IconChart,
      path: "/reports",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-md bg-slate-900 text-white flex items-center justify-center">
              <BrandMark className="text-base" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm text-slate-500">Trainer Attendance</p>
              <p className="text-base font-semibold text-slate-900">
                Control Center
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary px-6 py-3 text-base font-semibold"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero (centered) */}
      <section className="container mx-auto px-4 py-14 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <BrandMark className="text-2xl" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
          Trainer Attendance Portal
        </h1>
        <p className="text-lg text-slate-600 mt-3 max-w-2xl mx-auto">
          Manage trainers, sessions, attendance, and reporting in one cohesive,
          modern interface.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary btn-lg"
          >
            Get Started
          </button>
          <button
            className="btn btn-outline btn-lg"
            onClick={() => scrollToId("about")}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ title, description, Icon, path }, i) => (
            <Link
              key={i}
              to={path}
              aria-label={title}
              className="card p-5 text-center hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <div className="flex justify-center mb-2">
                <Icon />
              </div>
              <h3 className="text-lg font-bold mb-1 text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section id="built-with" className="container mx-auto px-4 pb-12">
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">Built with</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <TechReact />
              </div>
              <p className="text-sm font-semibold">React 18</p>
              <p className="text-xs text-slate-600">
                Component-based architecture with hooks
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <TechTailwind />
              </div>
              <p className="text-sm font-semibold">Tailwind CSS</p>
              <p className="text-xs text-slate-600">Utility-first design</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <TechRouter />
              </div>
              <p className="text-sm font-semibold">React Router</p>
              <p className="text-xs text-slate-600">Client-side routing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="implementation" className="container mx-auto px-4 pb-16">
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center text-center gap-2 p-3 border rounded-lg">
              <span className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-700 inline-flex items-center justify-center">
                <IconState />
              </span>
              <div>
                <p className="font-semibold">State Management</p>
                <p className="text-sm text-slate-600">
                  Context API with reducers
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-3 border rounded-lg">
              <span className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-700 inline-flex items-center justify-center">
                <IconForm />
              </span>
              <div>
                <p className="font-semibold">Form Validation</p>
                <p className="text-sm text-slate-600">Controlled inputs</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-3 border rounded-lg">
              <span className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-700 inline-flex items-center justify-center">
                <IconLayout />
              </span>
              <div>
                <p className="font-semibold">Dynamic Rendering</p>
                <p className="text-sm text-slate-600">Conditional UI</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-3 border rounded-lg">
              <span className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-700 inline-flex items-center justify-center">
                <IconLock />
              </span>
              <div>
                <p className="font-semibold">Protected Routes</p>
                <p className="text-sm text-slate-600">Auth-based access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About (target for Learn More) */}
      <section id="about" className="container mx-auto px-4 pb-16">
        <div className="card p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">About Trainer Attendance</h2>
          <p className="text-base font-semibold text-slate-700 text-center">
            Trainer Attendance is a modern portal for end-to-end training ops:
            admins create sessions, assign trainers, and avoid conflicts
            automatically; simple check-in/out captures accurate working hours;
            clear status badges surface issues fast; reports summarize hours,
            attendance rates, and activity; the UI stays responsive and
            accessible for daily workflows; dashboards keep leaders informed;
            CSV exports make sharing easy; built with React, Tailwind, and React
            Router; data flow uses Context plus reducers for predictable,
            extensible state; the goal is to keep scheduling, attendance, and
            insight-gathering neat, reliable, and fast for every user.
          </p>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-4 text-center text-slate-500 text-sm">
          © 2025 Trainer Attendance Portal. Modern Frontend Framework Project.
        </div>
      </footer>
    </div>
  );
};

export default Home;
