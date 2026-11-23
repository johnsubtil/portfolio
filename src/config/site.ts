export const site = {
  name: 'John Subtil',
  themeColor: '#000000',
  email: 'contact@johnsubtil.com',
  socials: [
    {
      platform: 'Instagram',
      icon: 'instagram',
      name: 'John Subtil',
      href: 'https://www.instagram.com/john.subtil/',
    },
    {
      platform: 'GitHub',
      icon: 'github',
      name: 'John Subtil',
      href: 'https://github.com/johnsubtil',
    },
    {
      platform: 'LinkedIn',
      icon: 'linkedin',
      name: 'John Subtil',
      href: 'https://www.linkedin.com/in/johnsubtil/',
    },
  ],
} as const;

// Path of the About page photo under public/, e.g. '/images/about/portrait.jpg' (4:5).
export const aboutPortrait: string | undefined = undefined;
