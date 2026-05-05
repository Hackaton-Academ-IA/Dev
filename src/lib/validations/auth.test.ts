import { describe, it, expect } from 'vitest';
import { loginSchema, signupSchema } from '@/lib/validations/auth';

describe('Auth Validations', () => {
  describe('loginSchema', () => {
    it('should validate correct email and password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should fail on invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Veuillez entrer une adresse email valide.');
      }
    });

    it('should fail on empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('signupSchema', () => {
    it('should validate a strong password and correct data', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password1@',
      });
      expect(result.success).toBe(true);
    });

    it('should fail if password is too short', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Pass1@',
      });
      expect(result.success).toBe(false);
    });

    it('should fail if password lacks a special character', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password1',
      });
      expect(result.success).toBe(false);
    });

    it('should fail if name is too short', () => {
      const result = signupSchema.safeParse({
        name: 'J',
        email: 'john@example.com',
        password: 'Password1@',
      });
      expect(result.success).toBe(false);
    });
  });
});
