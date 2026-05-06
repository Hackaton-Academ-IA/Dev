import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/quiz/generate/route';

// Mock Next.js headers() and auth so the route works outside a request scope
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { id: 'test-user' } }),
    },
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockReturnValue({ allowed: true, remaining: 9, resetAt: 0 }),
  getClientKey: vi.fn().mockReturnValue('ip:127.0.0.1'),
}));

// Mock Prisma so the route can be imported without a real DATABASE_URL
vi.mock('@/lib/prisma', () => ({
  prisma: {
    question: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

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
    process.env.GEMINI_API_KEY = 'test-key';
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

  it('should return a fallback question on unexpected Gemini error', async () => {
    const req = new Request('http://localhost:3000/api/quiz/generate', {
      method: 'POST',
      body: JSON.stringify({ theme: 'Error', difficulty: 5 }),
    });

    // Mock generic error — route always falls back to static pool, never throws
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const mockModel = new GoogleGenerativeAI('').getGenerativeModel({ model: '' });
    vi.mocked(mockModel.generateContent).mockRejectedValueOnce(new Error('Unexpected error'));

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.source).toBe('fallback');
  });
});
