import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/quiz/generate/route';
import { NextResponse } from 'next/server';

// Mock GoogleGenerativeAI
vi.mock('@google/generative-ai', () => {
  const generateContent = vi.fn().mockResolvedValue({
    response: {
      text: () => JSON.stringify({
        question: "Quelle est la capitale de la France ?",
        options: ["Paris", "Londres", "Berlin", "Madrid"],
        correctAnswer: 0,
        explanation: "Paris est la capitale de la France."
      })
    }
  });

  const getGenerativeModel = vi.fn().mockReturnValue({
    generateContent
  });

  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(function() {
      return {
        getGenerativeModel
      };
    })
  };
});

describe('Quiz Generate API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a generated quiz question on success', async () => {
    const req = new Request('http://localhost:3000/api/quiz/generate', {
      method: 'POST',
      body: JSON.stringify({ theme: 'Géographie', difficulty: 5 }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.question).toBeDefined();
    expect(data.options).toHaveLength(4);
    expect(data.source).toBe('gemini');
  });

  it('should return a fallback question when Gemini fails with 429', async () => {
    // Force mock to throw 429
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const mockModel = new GoogleGenerativeAI('').getGenerativeModel({ model: '' });
    vi.mocked(mockModel.generateContent).mockRejectedValueOnce({ status: 429 });

    const req = new Request('http://localhost:3000/api/quiz/generate', {
      method: 'POST',
      body: JSON.stringify({ theme: 'Le Commencement', difficulty: 5 }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.source).toBe('fallback');
    expect(data.question).toBe("Quelle est la première étape typique d'une aventure épique ?");
  });

  it('should return 500 on unexpected errors', async () => {
    const req = new Request('http://localhost:3000/api/quiz/generate', {
      method: 'POST',
      body: JSON.stringify({ theme: 'Error', difficulty: 5 }),
    });

    // Mock generic error
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const mockModel = new GoogleGenerativeAI('').getGenerativeModel({ model: '' });
    vi.mocked(mockModel.generateContent).mockRejectedValueOnce(new Error('Unexpected error'));

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Erreur lors de la génération du quiz');
  });
});
