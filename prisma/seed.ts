import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedData = [
  {
    id: '1',
    name: 'Modern Nomads',
    description: 'Монгол үндэстний зоогийн газар. Бид танд монгол ахуй, соёлыг мэдрүүлэх болно.',
    categories: JSON.stringify(['Ресторан', 'Монгол хоол']),
    addressCity: 'Улаанбаатар',
    addressDistrict: 'Сүхбаатар',
    addressKhoroo: '1-р хороо',
    addressFull: 'Сүхбаатар дүүрэг, 1-р хороо, Чингисийн өргөн чөлөө',
    locationLat: 47.918,
    locationLng: 106.917,
    contactPhone: JSON.stringify(['7011-0393', '9909-1100']),
    contactEmail: 'info@modernnomads.mn',
    contactWebsite: 'http://www.modernnomads.mn',
    hours: JSON.stringify({
      'Даваа-Баасан': '10:00 - 22:00',
      'Бямба-Ням': '11:00 - 23:00',
    }),
    rating: 4.5,
    reviewCount: 125,
    images: JSON.stringify([
      'https://picsum.photos/seed/restaurant-1/800/600',
      'https://picsum.photos/seed/restaurant-2/800/600'
    ]),
    logo: 'https://picsum.photos/seed/logo-1/200/200',
  },
  {
    id: '2',
    name: 'Ubean Coffee',
    description: 'Тансаг зэрэглэлийн кофе шоп. Амтат кофе, тав тухтай орчин таныг хүлээж байна.',
    categories: JSON.stringify(['Кофе шоп', 'Кафе']),
    addressCity: 'Улаанбаатар',
    addressDistrict: 'Баянзүрх',
    addressKhoroo: '26-р хороо',
    addressFull: 'Баянзүрх дүүрэг, 26-р хороо, Peace Mall-н 1-р давхарт',
    locationLat: 47.912,
    locationLng: 106.953,
    contactPhone: JSON.stringify(['7711-5555']),
    contactEmail: 'info@ubeancoffee.mn',
    contactWebsite: 'http://www.ubeancoffee.mn',
    hours: JSON.stringify({
      'Даваа-Ням': '07:00 - 21:00',
    }),
    rating: 4.7,
    reviewCount: 89,
    images: JSON.stringify([
      'https://picsum.photos/seed/coffee-1/800/600',
      'https://picsum.photos/seed/coffee-2/800/600'
    ]),
    logo: 'https://picsum.photos/seed/logo-2/200/200',
  },
  {
    id: '3',
    name: 'Мини маркет',
    description: 'Өдөр тутмын хэрэгцээт зүйлс. Дэлгүүр таны ойр орчимд.',
    categories: JSON.stringify(['Дэлгүүр', 'Хүнсний бүтээгдэхүүн']),
    addressCity: 'Улаанбаатар',
    addressDistrict: 'Чингэлтэй',
    addressKhoroo: '3-р хороо',
    addressFull: 'Чингэлтэй дүүрэг, 3-р хороо',
    locationLat: 47.923,
    locationLng: 106.905,
    contactPhone: JSON.stringify(['7012-3456']),
    contactEmail: 'info@minimarket.mn',
    contactWebsite: '',
    hours: JSON.stringify({
      'Даваа-Ням': '08:00 - 22:00',
    }),
    rating: 4.2,
    reviewCount: 67,
    images: JSON.stringify([
      'https://picsum.photos/seed/store-1/800/600'
    ]),
    logo: 'https://picsum.photos/seed/logo-3/200/200',
  },
  {
    id: '4',
    name: 'Хурдан сантехникч',
    description: 'Усны шугам, халаалтын системийн засварчин. 24/7 үйлчилгээ.',
    categories: JSON.stringify(['Үйлчилгээ', 'Засвар']),
    addressCity: 'Улаанбаатар',
    addressDistrict: 'Хан-Уул',
    addressKhoroo: '15-р хороо',
    addressFull: 'Хан-Уул дүүрэг, 15-р хороо, оффисгүй',
    locationLat: 47.892,
    locationLng: 106.898,
    contactPhone: JSON.stringify(['9911-9911']),
    contactEmail: 'hurd.santehnik@example.com',
    contactWebsite: '',
    hours: JSON.stringify({
      'Даваа-Ням': '24 цаг',
    }),
    rating: 5.0,
    reviewCount: 45,
    images: JSON.stringify([
      'https://picsum.photos/seed/plumber-1/800/600'
    ]),
    logo: 'https://picsum.photos/seed/logo-4/200/200',
  },
  {
    id: '5',
    name: 'Гоо сайхны салон',
    description: 'Эмэгтэйчүүдэд зориулсан гоо сайхны үйлчилгээ. Үс засалт, гоо сайхны арчилгаа.',
    categories: JSON.stringify(['Гоо сайхан', 'Үйлчилгээ']),
    addressCity: 'Улаанбаатар',
    addressDistrict: 'Сонгинохайрхан',
    addressKhoroo: '8-р хороо',
    addressFull: 'Сонгинохайрхан дүүрэг, 8-р хороо, БЗД-н 6-р хороо',
    locationLat: 47.909,
    locationLng: 106.876,
    contactPhone: JSON.stringify(['9988-7766']),
    contactEmail: 'info@beautysalon.mn',
    contactWebsite: 'http://www.beautysalon.mn',
    hours: JSON.stringify({
      'Даваа-Баасан': '09:00 - 20:00',
      'Бямба': '10:00 - 18:00',
      'Ням': 'Амрах өдөр',
    }),
    rating: 4.8,
    reviewCount: 156,
    images: JSON.stringify([
      'https://picsum.photos/seed/salon-1/800/600',
      'https://picsum.photos/seed/salon-2/800/600'
    ]),
    logo: 'https://picsum.photos/seed/logo-5/200/200',
  },
];

const reviewData = [
  {
    businessId: '1',
    author: 'Болд',
    avatar: 'https://picsum.photos/seed/avatar-1/100/100',
    rating: 5,
    comment: 'Хоол маш амттай, үйлчилгээ сайн. Орчин үеийн болон уламжлалт хэв маягийг хослуулсан сайхан газар.',
    date: '2024-05-10',
  },
  {
    businessId: '1',
    author: 'Сараа',
    avatar: 'https://picsum.photos/seed/avatar-2/100/100',
    rating: 4,
    comment: 'Найзуудтайгаа суухад тохиромжтой юм байна. Жоохон үнэтэй санагдсан.',
    date: '2024-05-08',
  },
  {
    businessId: '2',
    author: 'Тэмүүлэн',
    avatar: 'https://picsum.photos/seed/avatar-3/100/100',
    rating: 5,
    comment: 'Миний дуртай кофе шоп. Ялангуяа латте нь үнэхээр гоё.',
    date: '2024-05-12',
  },
];

const categories = [
  { name: 'Ресторан', icon: 'utensils' },
  { name: 'Кафе', icon: 'coffee' },
  { name: 'Дэлгүүр', icon: 'shopping-cart' },
  { name: 'Үйлчилгээ', icon: 'wrench' },
  { name: 'Авто засвар', icon: 'car' },
  { name: 'Эрүүл мэнд', icon: 'heart-pulse' },
  { name: 'Гоо сайхан', icon: 'palette' },
  { name: 'Бусад', icon: 'more-horizontal' },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.yellowBookEntry.deleteMany();
  await prisma.category.deleteMany();

  // Seed categories
  console.log('📂 Seeding categories...');
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  // Seed businesses
  console.log('🏢 Seeding businesses...');
  for (const business of seedData) {
    await prisma.yellowBookEntry.create({
      data: business,
    });
  }

  // Seed reviews
  console.log('💬 Seeding reviews...');
  for (const review of reviewData) {
    await prisma.review.create({
      data: review,
    });
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });