import { BRAND, MENU } from '@/lib/data';

/**
 * CafeOrCoffeeShop schema. This is what feeds the Google sidebar for a local
 * business — name, address, geo, the menu sections, and sameAs to Instagram.
 *
 * Deliberately absent: `priceRange` and `openingHoursSpecification`. Base has
 * published neither, and a wrong price or a wrong closing time on a result
 * card sends someone to a shut door. Omitted fields are ignored; invented ones
 * are worse than nothing. See issues #1 and #2.
 */
export default function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': 'https://basecoffee.in/#cafe',
    name: BRAND.name,
    description: BRAND.tagline,
    url: 'https://basecoffee.in',
    image: 'https://basecoffee.in/og.jpg',
    logo: 'https://basecoffee.in/icon.svg',
    foundingDate: '2025-05',
    servesCuisine: ['Coffee', 'Matcha', 'Breakfast'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: BRAND.street,
      addressLocality: BRAND.area,
      addressRegion: 'Telangana',
      addressCountry: 'IN',
    },
    areaServed: { '@type': 'City', name: BRAND.city },
    hasMap: BRAND.maps,
    sameAs: [BRAND.instagram],
    hasMenu: {
      '@type': 'Menu',
      name: 'Signatures',
      hasMenuSection: [
        {
          '@type': 'MenuSection',
          name: 'Signatures',
          hasMenuItem: MENU.map((m) => ({
            '@type': 'MenuItem',
            name: m.name,
            description: m.body,
          })),
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
