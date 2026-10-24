import {projects as allProjects} from '../app/data';

// Static portfolio content: no CMS, credentials, or network requests required.
export async function getContent() {
  const projects = allProjects.slice(0, 4).map((project, index) => ({...project, order: index + 1}));
  const profile = {
    name: 'Андрей Альшевский',
    headline: 'Привет, я — Андрей Альшевский, продуктовый дизайнер.',
    bio: 'Почти 3 года занимаюсь дизайном интерфейсов для приложений и веба, работал над B2B-продуктами в Ozon и в стартапах в сфере финтеха.',
    avatar: '/projects/Facetune_21-09-2026-18-41-59.JPG',
    telegram: 'https://t.me/andreyalshevskiy',
    email: 'alshevskias@gmail.com',
    resumeUrl: '/resume.pdf',
  };
  return {projects, profile};
}
