import YAML from 'yaml';
import { z } from 'zod';
import rawConfig from './site.yaml?raw';

const socialLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const logoSchema = z.object({
  mark: z.string().min(1).optional(),
  favicon32: z.string().min(1).optional(),
  favicon64: z.string().min(1).optional(),
  appleTouchIcon: z.string().min(1).optional(),
}).strict();

const siteConfigSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  bio: z.array(z.string().min(1)).min(1),
  avatar: z.string().min(1).nullish().transform((value) => value ?? undefined),
  logo: logoSchema.optional(),
  email: z.email(),
  url: z.url(),
  socials: z.array(socialLinkSchema).min(1),
  walineServerURL: z.url().optional(),
}).strict();

export type SocialLink = z.infer<typeof socialLinkSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;

export const site: SiteConfig = siteConfigSchema.parse(YAML.parse(rawConfig));
