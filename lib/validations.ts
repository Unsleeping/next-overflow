import * as z from "zod";

export const questionsSchema = z.z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(20),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const answerSchema = z.z.object({
  answer: z.string().min(20).max(100000),
});

export const profileSchema = z.z.object({
  name: z.string().min(5).max(50),
  username: z.string().min(5).max(50),
  bio: z.string().min(10).max(150),
  location: z.string().min(5).max(50),
  portfolioWebsite: z.string().url(),
});
