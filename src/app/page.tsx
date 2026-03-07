"use client";

import { Vortex } from "@/components/ui/vortex";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section with Vortex */}
      <section className="h-screen w-full">
        <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={500}
          baseHue={220}
          className="flex items-center flex-col justify-center px-4 md:px-10 py-4 w-full h-full"
        >
          <h1 className="text-white text-4xl md:text-7xl font-bold text-center mb-6">
            Transform Your Business
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              With Artificial Intelligence
            </span>
          </h1>
          <p className="text-white/80 text-lg md:text-2xl max-w-2xl text-center mb-10">
            Expert guidance to identify, implement, and optimize AI solutions
            that solve real problems and drive measurable ROI.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <InteractiveHoverButton
              text="Get Started"
              className="w-48 h-12 text-lg bg-blue-600 hover:bg-blue-700 border-blue-500"
            />
            <InteractiveHoverButton
              text="Learn More"
              className="w-48 h-12 text-lg bg-transparent border-white/30"
            />
          </div>
        </Vortex>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 md:px-10 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
            Our Services
          </h2>
          <p className="text-white/60 text-center text-lg mb-16 max-w-2xl mx-auto">
            Comprehensive AI solutions tailored to your business needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <ServiceCard key={idx} {...service} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 px-4 md:px-10 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Our Approach
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {approaches.map((step, idx) => (
              <ApproachStep key={idx} {...step} number={idx + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-10 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-white/70 text-xl mb-10">
            Let's explore how AI can solve your toughest challenges and drive
            growth.
          </p>
          <InteractiveHoverButton
            text="Get Started"
            className="w-64 h-14 text-xl bg-blue-600 hover:bg-blue-700 border-blue-500"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12 px-4 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Angus AI</h3>
            <p className="text-white/60">
              Transforming businesses through intelligent AI implementation.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-white/60">
              <li>AI Assessment</li>
              <li>Implementation</li>
              <li>Optimization</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <ul className="space-y-2 text-white/60">
              <li>hello@angus-ai.com</li>
              <li>LinkedIn</li>
              <li>Twitter</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-white/40">
          <p>&copy; 2026 Angus AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

// Service Card Component
function ServiceCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: delay }}
      className="group relative bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-lg p-8 rounded-3xl border border-blue-500/20 hover:border-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-white/70 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Approach Step Component
function ApproachStep({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: (number - 1) * 0.15 }}
      className="relative bg-gradient-to-br from-blue-900/30 to-purple-900/20 backdrop-blur-lg p-8 rounded-3xl border border-blue-500/30 hover:border-blue-400 transition-all duration-300 hover:scale-105"
    >
      <div className="text-6xl font-bold text-blue-500/30 mb-4">
        {String(number).padStart(2, "0")}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-white/70 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Data
const services = [
  {
    icon: "🔍",
    title: "AI Assessment",
    description:
      "Evaluate your current operations to identify high-impact opportunities where AI can deliver measurable value.",
  },
  {
    icon: "🛠️",
    title: "Implementation Strategy",
    description:
      "Develop a roadmap for successful AI adoption, including tool selection, team training, and risk mitigation.",
  },
  {
    icon: "⚙️",
    title: "Technical Integration",
    description:
      "Seamless integration of AI solutions into your existing systems and workflows with minimal disruption.",
  },
  {
    icon: "📊",
    title: "Performance Optimization",
    description:
      "Continuously monitor and refine your AI implementations to maximize efficiency and ROI over time.",
  },
  {
    icon: "👥",
    title: "Team Training",
    description:
      "Empower your team with the knowledge and skills to work effectively with AI tools and systems.",
  },
  {
    icon: "🚀",
    title: "Innovation Consulting",
    description:
      "Explore emerging AI technologies and their applications to keep your business competitive and forward-thinking.",
  },
];

const approaches = [
  {
    title: "Discover",
    description:
      "Deep dive into your business operations, challenges, and goals to identify where AI creates real value.",
  },
  {
    title: "Design",
    description:
      "Craft a customized AI strategy aligned with your business objectives, resources, and timeline.",
  },
  {
    title: "Deploy",
    description:
      "Execute the implementation with precision, minimizing disruption and ensuring team readiness.",
  },
  {
    title: "Optimize",
    description:
      "Continuously refine and expand your AI systems based on real-world performance data and evolving needs.",
  },
];
