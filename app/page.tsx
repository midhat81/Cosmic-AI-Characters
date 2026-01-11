'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageSquare, Sparkles, Mic, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FadeIn } from '@/components/animations/FadeIn'

export default function HomePage() {
  const router = useRouter()

  const features = [
    {
      icon: <MessageSquare size={32} />,
      title: 'AI-Powered Conversations',
      description: 'Chat with unique cosmic characters powered by local AI models',
      color: 'text-cosmic-600',
      bg: 'bg-cosmic-50',
    },
    {
      icon: <Mic size={32} />,
      title: 'Voice Interaction',
      description: 'Speak naturally with text-to-speech and speech-to-text support',
      color: 'text-nebula-600',
      bg: 'bg-nebula-50',
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Unique Personalities',
      description: 'Each character has their own backstory, traits, and conversational style',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: <Zap size={32} />,
      title: 'Privacy First',
      description: 'All conversations run locally on your device with complete privacy',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <FadeIn>
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-block p-4 rounded-full bg-gradient-to-br from-cosmic-100 to-nebula-100 mb-4">
              <MessageSquare size={64} className="text-cosmic-600" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cosmic-600 via-nebula-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Cosmic Characters
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of AI conversations. Chat with unique cosmic personalities,
            each with their own story and style. All powered by local AI for complete privacy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/characters')}
              rightIcon={<ArrowRight size={20} />}
            >
              Explore Characters
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/about')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {features.map((feature, index) => (
          <FadeIn key={index} delay={index * 0.1}>
            <Card hover padding="lg">
              <div className={`inline-block p-3 rounded-xl ${feature.bg} mb-4`}>
                <div className={feature.color}>{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          </FadeIn>
        ))}
      </div>

      {/* CTA Section */}
      <FadeIn delay={0.4}>
        <Card
          variant="elevated"
          className="text-center bg-gradient-to-br from-cosmic-50 to-nebula-50 border-cosmic-200"
        >
          <div className="py-12 px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Cosmic Journey?
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Choose from our diverse cast of characters and begin meaningful conversations
              powered by cutting-edge AI technology.
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/characters')}
              rightIcon={<Sparkles size={20} />}
            >
              Get Started Now
            </Button>
          </div>
        </Card>
      </FadeIn>
    </div>
  )
}