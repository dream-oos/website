export interface Skill {
  name: string;
  level: number;
  category: string;
}

export const skills: Skill[] = [
  { name: 'TypeScript', level: 90, category: '编程语言' },
  { name: 'React', level: 88, category: '前端框架' },
  { name: 'Vue', level: 82, category: '前端框架' },
  { name: 'Astro', level: 85, category: '前端框架' },
  { name: 'Node.js', level: 80, category: '后端' },
  { name: 'Tailwind CSS', level: 92, category: '样式' },
  { name: 'Docker', level: 70, category: 'DevOps' },
  { name: 'PostgreSQL', level: 75, category: '数据库' },
];
