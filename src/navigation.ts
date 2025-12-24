import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'عن العيادة',
      href: '/#hero-section',
      links: [
        {
          text: 'من نحن',
          href: '/#hero-section',
        },
        {
          text: 'ماذا نعالج',
          href: '/#features',
        },
        {
          text: 'أسئلة شائعة',
          href: '/#faq',
        },
        {
          text: 'قالوا عنا',
          href: '/#testimonials',
        },
      ],
    },
    {
      text: 'المنشورات',
      href: getBlogPermalink(),
    },
    {
      text: 'حجوزاتي',
      href: getPermalink('/bookings'),
      links: [
        {
          hidden: true,
          text: 'استشارة عن بعد',
          href: getPermalink('/video'),
        },
      ],
    },
    {
      text: 'أين تجدنا',
      href: '/#location',
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Product',
      links: [
        { text: 'Features', href: '#' },
        { text: 'Security', href: '#' },
        { text: 'Team', href: '#' },
        { text: 'Enterprise', href: '#' },
        { text: 'Customer stories', href: '#' },
        { text: 'Pricing', href: '#' },
        { text: 'Resources', href: '#' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { text: 'Developer API', href: '#' },
        { text: 'Partners', href: '#' },
        { text: 'Atom', href: '#' },
        { text: 'Electron', href: '#' },
        { text: 'AstroWind Desktop', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Docs', href: '#' },
        { text: 'Community Forum', href: '#' },
        { text: 'Professional Services', href: '#' },
        { text: 'Skills', href: '#' },
        { text: 'Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '#' },
        { text: 'Blog', href: '#' },
        { text: 'Careers', href: '#' },
        { text: 'Press', href: '#' },
        { text: 'Inclusion', href: '#' },
        { text: 'Social Impact', href: '#' },
        { text: 'Shop', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'سياسة الخصوصية', href: getPermalink('/privacy') },
    { text: 'الشروط', href: getPermalink('/terms') },
  ],
  socialLinks: [
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/Abuobaydatajjarrah/' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/dr.mumen.diraneyya/' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: 'https://www.youtube.com/channel/UCe9xMNuVzNgEWvoui3nolRw' },
    { ariaLabel: 'Google Business', icon: 'tabler:brand-google', href: 'https://maps.app.goo.gl/RE3yv34U16Ssdezj7' },
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/DrMumenDiraneya' },
    { ariaLabel: 'Tebcan', icon: 'brand-tebcan-alt', href: 'https://tebcan.com/ar/Jordan/dr/%D8%AF%D9%83%D8%AA%D9%88%D8%B1-%D9%85%D8%A4%D9%85%D9%86-%D9%85%D8%A3%D9%85%D9%88%D9%86-%D8%AF%D9%8A%D8%B1%D8%A7%D9%86%D9%8A%D8%A9-%D8%AC%D8%B1%D8%A7%D8%AD%D8%A9-%D8%B9%D8%A7%D9%85%D8%A9_2822' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    قالب رياح أسترو والذي بني عليه هذا الموقع هو من صنع <a class="text-tertiary underline dark:text-muted" href="https://github.com/arthelokyo"> Arthelokyo</a>. أما الجهة المصممة لهذا الموقع فهي <a class="text-tertiary underline dark:text-muted" href='https://orwa.tech'>وكالة عروة التقنية</a>.`,
};
