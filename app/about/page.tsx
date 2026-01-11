'use client'

import React from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FadeIn } from '@/components/animations/FadeIn'
import { Code, Cpu, Shield, Zap } from 'lucide-react'

export default function AboutPage() {
  const techStack = [
    'Next.js 14',
    'React 18',
    'TypeScript',
    'Tailwind CSS',
    'Framer Motion',
    'Zustand',
    'Ollama',
  ]

  const features = [
    {
      icon: <Cpu size={24} />,
      title: 'Local AI Processing',
      description:
        'All AI interactions run locally using Ollama, ensuring fast responses without cloud dependencies.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Privacy First',
      description:
        'Your conversations stay on your device. No data is sent to external servers.',
    },
    {
      icon: <Zap size={24} />,
      title: 'Real-time Streaming',
      description:
        'Experience fluid conversations with streaming AI responses and live voice interaction.',
    },
    {
      icon: <Code size={24} />,
      title: 'Modern Tech Stack',
      description:
        'Built with cutting-edge web technologies for optimal performance and user experience.',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <FadeIn>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Cosmic Characters
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            An AI-driven web application showcasing interactive character conversations
            with real-time chat and voice capabilities.
          </p>
        </div>
      </FadeIn>

      {/* Project Description */}
      <FadeIn delay={0.1}>
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Project Overview
          </h2>
          <p className="text-gray-700 mb-4">
            Cosmic Characters is a production-ready frontend application that demonstrates
            the integration of AI services into interactive web experiences. Built with
            Next.js and TypeScript, it features scalable architecture, reusable components,
            and smooth user interactions.
          </p>
          <p className="text-gray-700">
            The app supports streaming AI responses through local Ollama integration,
            character-specific personalities with persistent conversation memory, and voice
            interaction using browser-native speech APIs.
          </p>
        </Card>
      </FadeIn>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => (
          <FadeIn key={index} delay={0.2 + index * 0.1}>
            <Card hover>
              <div className="text-cosmic-600 mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          </FadeIn>
        ))}
      </div>

      {/* Tech Stack */}
      <FadeIn delay={0.6}>
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Technology Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <Badge key={tech} variant="primary" size="lg">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>
      </FadeIn>

      {/* Developer Info */}
      <FadeIn delay={0.7}>
        <Card className="mt-8 bg-gradient-to-br from-cosmic-50 to-nebula-50 border-cosmic-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Built by Muhammad Midhat
            </h2>
            <p className="text-gray-700">
              This project demonstrates expertise in building production-ready frontend
              systems and integrating AI services into user-centric web applications.
            </p>
          </div>
        </Card>
      </FadeIn>
    </div>
  )
}