import Logo from "../../../assets/images/Logo.jpeg";
import LoginForm from "./components/LoginForm";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const item = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const keyframes = `
  @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
`;

const Auth = () => {
    return (
        <div className="w-full min-h-screen flex">
            <style>{keyframes}</style>

            {/* ═══════════════════════════════════════════════════════════════════
          LEFT PANEL — Welcome + Quote
         ═══════════════════════════════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 xl:p-16"
            >
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[1.5px] shadow-lg shadow-primary/20">
                        <div className="w-full h-full rounded-full bg-dark flex items-center justify-center overflow-hidden">
                            <img
                                src={Logo}
                                alt="PrimeSys"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">
                        PrimeSys
                    </span>
                </div>

                {/* Welcome content */}
                <div className="max-w-lg">
                    <motion.h1
                        variants={item}
                        initial="hidden"
                        animate="show"
                        className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-[-0.02em]"
                    >
                        Welcome back,
                        <br />
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Administrator
                        </span>
                    </motion.h1>

                    {/* ── Description ── */}
                    <motion.p
                        variants={item}
                        initial="hidden"
                        animate="show"
                        className="mt-4 text-base text-white/80 leading-relaxed max-w-md"
                    >
                        Stay in control of your entire tracking ecosystem. Monitor devices,
                        manage divisions, and access real-time insights &mdash; all from one
                        powerful dashboard.
                    </motion.p>

                    {/* ── Quote ── */}
                    <motion.div
                        variants={item}
                        initial="hidden"
                        animate="show"
                        className="mt-10 pl-5 border-l-[2px] border-primary/60"
                    >
                        <p className="text-sm text-white/60 italic leading-relaxed">
                            &ldquo;Every asset, every movement, every insight &mdash; precision
                            at every step of your operations.&rdquo;
                        </p>
                        <p className="mt-2 text-xs text-white/45 tracking-wide uppercase">
                            &mdash; mykiddytracker.com
                        </p>
                    </motion.div>

                    {/* ── Features grid ── */}
                    <motion.div
                        variants={item}
                        initial="hidden"
                        animate="show"
                        className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4"
                    >
                        {[
                            ["Device Tracking", "Real-time GPS monitoring"],
                            ["Division Mgmt", "Multi-level hierarchy controls"],
                            ["Report Engine", "Automated scheduled reports"],
                            ["Issue Workflow", "Ticket-based resolution system"],
                        ].map(([title, desc]) => (
                            <div key={title}>
                                <p className="text-sm font-medium text-white/85">{title}</p>
                                <p className="text-xs text-white/55 mt-0.5">{desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Footer */}
                <p className="text-xs text-white/40">
                    &copy; {new Date().getFullYear()} PrimeSys. All rights reserved.
                </p>
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════════════
          RIGHT PANEL — Login Form
         ═══════════════════════════════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-10"
            >
                <div className="w-full max-w-md">
                    {/* Mobile brand */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="flex flex-col items-center mb-8 lg:hidden"
                    >
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px] shadow-lg shadow-primary/20 mb-3">
                            <div className="w-full h-full rounded-full bg-dark flex items-center justify-center overflow-hidden">
                                <img
                                    src={Logo}
                                    alt="PrimeSys"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                        </div>
                        <h1 className="text-xl font-bold text-white">PrimeSys</h1>
                        <p className="text-[10px] text-white/55 mt-0.5 tracking-[0.2em] uppercase">
                            Admin Portal
                        </p>
                    </motion.div>

                    {/* ── Glass Card ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="relative rounded-2xl border border-white/[0.10] bg-white/[0.07] shadow-2xl overflow-hidden"
                        style={{
                            boxShadow:
                                "0 0 0 1px rgba(255,255,255,0.03) inset, 0 32px 64px -16px rgba(0,0,0,0.5)",
                        }}
                    >
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent overflow-hidden">
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                                style={{ animation: "shimmer 5s ease-in-out infinite" }}
                            />
                        </div>

                        <div className="relative px-8 py-10 sm:px-10">
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.4 }}
                                className="mb-7"
                            >
                                <h2 className="text-xl font-semibold text-white tracking-[-0.01em]">
                                    Sign In
                                </h2>
                                <p className="text-xs text-white/60 mt-1.5">
                                    Enter your credentials to access the admin panel
                                </p>
                            </motion.div>

                            {/* Form */}
                            <LoginForm />

                            {/* Footer */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.4 }}
                                className="mt-6 pt-5 border-t border-white/[0.05] text-center"
                            >
                                <p className="text-[11px] text-white/45 tracking-wide">
                                    By signing in, you agree to our{" "}
                                    <Link
                                        to="/privacy"
                                        className="text-primary/80 hover:text-primary transition-colors duration-200 font-medium underline underline-offset-[3px] decoration-white/20 hover:decoration-primary/50"
                                    >
                                        Privacy Policy
                                    </Link>
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
