import type { Character } from '@/types/character'
import type { Message } from '@/types/chat'
import type { MemoryContext } from '@/types/memory'

export function buildSystemPrompt(character: Character): string {
  return `You are ${character.name}, ${character.title}.

Personality: ${character.personality}
Current Mood: ${character.mood}

Background:
${character.backstory || character.description}

Key Traits:
${character.traits.map((trait) => `- ${trait}`).join('\n')}

Instructions:
- Stay in character at all times
- Respond naturally and conversationally
- Show your personality through your responses
- Keep responses concise but engaging (2-4 sentences typically)
- Use appropriate emotions based on your mood
- Remember context from the conversation

${character.systemPrompt}`
}

export function buildContextualPrompt(
  character: Character,
  messages: Message[],
  memoryContext?: MemoryContext
): string {
  let prompt = buildSystemPrompt(character)

  if (memoryContext) {
    prompt += '\n\nRelevant Context from Previous Conversations:'
    
    if (memoryContext.conversationSummary) {
      prompt += `\nSummary: ${memoryContext.conversationSummary}`
    }

    if (memoryContext.userPreferences && Object.keys(memoryContext.userPreferences).length > 0) {
      prompt += '\n\nUser Preferences:'
      Object.entries(memoryContext.userPreferences).forEach(([key, value]) => {
        prompt += `\n- ${key}: ${value}`
      })
    }

    if (memoryContext.relevantMemories.length > 0) {
      prompt += '\n\nRelevant Memories:'
      memoryContext.relevantMemories.forEach((memory) => {
        prompt += `\n- ${memory.content}`
      })
    }
  }

  return prompt
}

export function formatMessagesForAPI(messages: Message[]): Array<{
  role: string
  content: string
}> {
  return messages
    .filter((msg) => msg.role !== 'system')
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }))
}