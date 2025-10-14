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
      'https://picsum.photos/seed/restaurant-2/800/600',
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
      'https://picsum.photos/seed/coffee-2/800/600',
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
    images: JSON.stringify(['https://picsum.photos/seed/store-1/800/600']),
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
    images: JSON.stringify(['https://picsum.photos/seed/plumber-1/800/600']),
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
      Бямба: '10:00 - 18:00',
      Ням: 'Амрах өдөр',
    }),
    rating: 4.8,
    reviewCount: 156,
    images: JSON.stringify([
      'https://picsum.photos/seed/salon-1/800/600',
      'https://picsum.photos/seed/salon-2/800/600',
    ]),
    logo: 'https://picsum.photos/seed/logo-5/200/200',
  },
  {
    id: '6',
    name: 'Хаан банк салбар',
    description: 'Санхүүгийн үйлчилгээ, зээл, хадгаламж, гүйлгээ. Найдвартай банкны үйлчилгээ.',
    categories: JSON.stringify(['Банк', 'Санхүү']),
    addressCity: 'Улаанбаатар',
    addressDistrict: 'Сүхбаатар',
    addressKhoroo: '1-р хороо',
    addressFull: 'Сүхбаатар дүүрэг, 1-р хороо, Сүхбаатарын талбай',
    locationLat: 47.9077,
    locationLng: 106.9062,
    contactPhone: JSON.stringify(['1900-1955', '7777-7777']),
    contactEmail: 'info@khanbank.com',
    contactWebsite: 'https://www.khanbank.com',
    hours: JSON.stringify({
      'Даваа-Баасан': '09:00 - 18:00',
      Бямба: '10:00 - 16:00',
      Ням: 'Амрах өдөр',
    }),
    rating: 4.3,
    reviewCount: 89,
    images: JSON.stringify(['https://picsum.photos/seed/bank-1/800/600']),
    logo: 'https://picsum.photos/seed/logo-6/200/200',
  },
  {
    id: '7',
    name: 'Фитнес клуб "Эрч хүч"',
    description: 'Орчин үеийн тоног төхөөрөмжтэй фитнес клуб. Бие бялдрын дасгал, хувийн дасгалжуулагч.',
    categories: JSON.stringify(['Спорт', 'Фитнес']),
    addressCity: 'Улаанбаатар',
    addressDistrict: 'Баянзүрх',
    addressKhoroo: '4-р хороо',
    addressFull: 'Баянзүрх дүүрэг, 4-р хороо, Sky mall-н 3-р давхар',
    locationLat: 47.9144,
    locationLng: 106.9496,
    contactPhone: JSON.stringify(['9999-8888']),
    contactEmail: 'info@erchuhuh.mn',
    contactWebsite: 'http://www.erchuhuh.mn',
    hours: JSON.stringify({
      'Даваа-Ням': '06:00 - 23:00',
    }),
    rating: 4.6,
    reviewCount: 134,
    images: JSON.stringify([
      'https://picsum.photos/seed/gym-1/800/600',
      'https://picsum.photos/seed/gym-2/800/600',
    ]),
    logo: 'https://picsum.photos/seed/logo-7/200/200',
  },
  {
    id: '8',
    name: 'Улаанбаатар хотел',
    description: '4 одтой зочид буудал. Олон улсын стандартын үйлчилгээ, ресторан, конференц танхим.',
    categories: JSON.stringify(['Зочид буудал', 'Аялал']),
    addressCity: 'Улаанбаатар',
    addressDistrict: 'Хан-Уул',
    addressKhoroo: '17-р хороо',
    addressFull: 'Хан-Уул дүүрэг, 17-р хороо, Токио гудамж',
    locationLat: 47.8864,
    locationLng: 106.9057,
    contactPhone: JSON.stringify(['1234-5678', '9876-5432']),
    contactEmail: 'reservation@ubhotel.mn',
    contactWebsite: 'https://www.ubhotel.mn',
    hours: JSON.stringify({
      'Даваа-Ням': '24 цаг',
    }),
    rating: 4.7,
    reviewCount: 267,
    images: JSON.stringify([
      'https://picsum.photos/seed/hotel-1/800/600',
      'https://picsum.photos/seed/hotel-2/800/600',
      'https://picsum.photos/seed/hotel-3/800/600',
    ]),
    logo: 'https://picsum.photos/seed/logo-8/200/200',
  },
  {
    id: '9',
    name: 'Шинэ мэргэжлийн сургууль',
    description: 'Техникийн болон мэргэжлийн боловсрол. Компьютерийн хичээл, англи хэл, нягтлан бодох.',
    categories: JSON.stringify(['Боловсрол', 'Сургалт']),
    addressCity: 'Улаанбаатар',
    addressDistrict: 'Чингэлтэй',
    addressKhoroo: '5-р хороо',
    addressFull: 'Чингэлтэй дүүрэг, 5-р хороо, Их сургууль 40',
    locationLat: 47.9267,
    locationLng: 106.9053,
    contactPhone: JSON.stringify(['1111-2222']),
    contactEmail: 'info@school.edu.mn',
    contactWebsite: 'http://www.school.edu.mn',
    hours: JSON.stringify({
      'Даваа-Баасан': '08:00 - 17:00',
      'Бямба-Ням': 'Амрах өдөр',
    }),
    rating: 4.4,
    reviewCount: 78,
    images: JSON.stringify(['https://picsum.photos/seed/school-1/800/600']),
    logo: 'https://picsum.photos/seed/logo-9/200/200',
  },
  {
    id: '10',
    name: 'Авто центр "Хурд"',
    description: 'Автомашины засвар үйлчилгээ, сэлбэг солих, диагностик шинжилгээ. Мэргэжлийн засварчин.',
    categories: JSON.stringify(['Авто засвар', 'Үйлчилгээ']),
    addressCity: 'Улаанбаатар',
    addressDistrict: 'Сонгинохайрхан',
    addressKhoroo: '12-р хороо',
    addressFull: 'Сонгинохайрхан дүүрэг, 12-р хороо, Автозам',
    locationLat: 47.9011,
    locationLng: 106.8453,
    contactPhone: JSON.stringify(['9909-0909']),
    contactEmail: 'service@autocentre.mn',
    contactWebsite: '',
    hours: JSON.stringify({
      'Даваа-Баасан': '09:00 - 19:00',
      Бямба: '10:00 - 16:00',
      Ням: 'Амрах өдөр',
    }),
    rating: 4.5,
    reviewCount: 112,
    images: JSON.stringify([
      'https://picsum.photos/seed/auto-1/800/600',
      'https://picsum.photos/seed/auto-2/800/600',
    ]),
    logo: 'https://picsum.photos/seed/logo-10/200/200',
  },
];

const reviewData = [
  // Modern Nomads reviews (businessId: '1')
  {
    businessId: '1',
    author: 'Болд',
    avatar: 'https://picsum.photos/seed/avatar-1/100/100',
    rating: 5,
    comment:
      'Хоол маш амттай, үйлчилгээ сайн. Орчин үеийн болон уламжлалт хэв маягийг хослуулсан сайхан газар.',
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
    businessId: '1',
    author: 'Өнөрбаяр',
    avatar: 'https://picsum.photos/seed/avatar-7/100/100',
    rating: 5,
    comment: 'Монгол дундаж хоолны амт дэх сайхан орчин. Найзуудтай очиж байна.',
    date: '2024-05-15',
  },

  // Ubean Coffee reviews (businessId: '2')
  {
    businessId: '2',
    author: 'Тэмүүлэн',
    avatar: 'https://picsum.photos/seed/avatar-3/100/100',
    rating: 5,
    comment: 'Миний дуртай кофе шоп. Ялангуяа латте нь үнэхээр гоё.',
    date: '2024-05-12',
  },

  // Мини маркет reviews (businessId: '3')
  {
    businessId: '3',
    author: 'Энхбаяр',
    avatar: 'https://picsum.photos/seed/avatar-4/100/100',
    rating: 4,
    comment: 'Хэрэгцээт зүйлс байдаг. Үнэ боломжийн.',
    date: '2024-05-11',
  },
  {
    businessId: '3',
    author: 'Нарангэрэл',
    avatar: 'https://picsum.photos/seed/avatar-5/100/100',
    rating: 4,
    comment: 'Орон нутгийн дэлгүүр шиг л байна. Сайн.',
    date: '2024-05-09',
  },

  // Хурдан сантехникч reviews (businessId: '4')
  {
    businessId: '4',
    author: 'Бат-Эрдэнэ',
    avatar: 'https://picsum.photos/seed/avatar-6/100/100',
    rating: 5,
    comment: 'Шөнө дунд дуудсан ч ирсэн. Мэргэжилтэй ажил хийсэн.',
    date: '2024-05-07',
  },

  // Гоо сайхны салон reviews (businessId: '5')
  {
    businessId: '5',
    author: 'Цэцэг',
    avatar: 'https://picsum.photos/seed/avatar-8/100/100',
    rating: 5,
    comment: 'Үс засалт маш сайн хийсэн. Баярлалаа!',
    date: '2024-05-14',
  },
  {
    businessId: '5',
    author: 'Пүрэв',
    avatar: 'https://picsum.photos/seed/avatar-9/100/100',
    rating: 4,
    comment: 'Үйлчилгээ сайн, үнэ боломжийн.',
    date: '2024-05-13',
  },

  // Хаан банк салбар reviews (businessId: '6')
  {
    businessId: '6',
    author: 'Дорж',
    avatar: 'https://picsum.photos/seed/avatar-10/100/100',
    rating: 4,
    comment: 'Хурдан үйлчилгээ, ажилтнууд эелдэг.',
    date: '2024-05-16',
  },
  {
    businessId: '6',
    author: 'Алтанцэцэг',
    avatar: 'https://picsum.photos/seed/avatar-11/100/100',
    rating: 5,
    comment: 'Зээлийн үйлчилгээ маш сайн. Хурдан шийдвэрлэж өгсөн.',
    date: '2024-05-18',
  },

  // Фитнес клуб reviews (businessId: '7')
  {
    businessId: '7',
    author: 'Батболд',
    avatar: 'https://picsum.photos/seed/avatar-12/100/100',
    rating: 5,
    comment: 'Тоног төхөөрөмж сайн, тренер нар мэргэжилтэй.',
    date: '2024-05-19',
  },
  {
    businessId: '7',
    author: 'Оюунаа',
    avatar: 'https://picsum.photos/seed/avatar-13/100/100',
    rating: 4,
    comment: 'Орчин сайн, харин жаахан үнэтэй.',
    date: '2024-05-20',
  },

  // Улаанбаатар хотел reviews (businessId: '8')
  {
    businessId: '8',
    author: 'Жавхлан',
    avatar: 'https://picsum.photos/seed/avatar-14/100/100',
    rating: 5,
    comment: 'Маш сайн хотел байлаа. Үйлчилгээ онцгой.',
    date: '2024-05-21',
  },
  {
    businessId: '8',
    author: 'Мөнхбат',
    avatar: 'https://picsum.photos/seed/avatar-15/100/100',
    rating: 4,
    comment: 'Өрөө тав тухтай, хоол амттай.',
    date: '2024-05-22',
  },

  // Шинэ мэргэжлийн сургууль reviews (businessId: '9')
  {
    businessId: '9',
    author: 'Гэрэлт',
    avatar: 'https://picsum.photos/seed/avatar-16/100/100',
    rating: 4,
    comment: 'Багш нар сайн заадаг, орчин шинэлэг.',
    date: '2024-05-23',
  },

  // Авто центр "Хурд" reviews (businessId: '10')
  {
    businessId: '10',
    author: 'Цэдэв',
    avatar: 'https://picsum.photos/seed/avatar-17/100/100',
    rating: 5,
    comment: 'Машины асуудлыг маш сайн засчихлаа. Үнэ боломжийн.',
    date: '2024-05-24',
  },
];

const categories = [
  // Primary categories - бодит businesses-ийн categories-аас авсан
  { name: 'Ресторан', icon: 'utensils', isPrimary: true, order: 1 },
  { name: 'Кафе', icon: 'coffee', isPrimary: true, order: 2 },
  { name: 'Дэлгүүр', icon: 'shopping-cart', isPrimary: true, order: 3 },
  { name: 'Үйлчилгээ', icon: 'wrench', isPrimary: true, order: 4 },
  { name: 'Авто засвар', icon: 'car', isPrimary: true, order: 5 },
  { name: 'Гоо сайхан', icon: 'palette', isPrimary: true, order: 6 },
  { name: 'Банк', icon: 'building-2', isPrimary: true, order: 7 },
  
  // Secondary categories (not primary) 
  { name: 'Боловсрол', icon: 'graduation-cap', isPrimary: false, order: null },
  { name: 'Зочид буудал', icon: 'hotel', isPrimary: false, order: null },
  { name: 'Спорт', icon: 'dumbbell', isPrimary: false, order: null },
  { name: 'Монгол хоол', icon: 'utensils', isPrimary: false, order: null },
  { name: 'Кофе шоп', icon: 'coffee', isPrimary: false, order: null },
  { name: 'Хүнсний бүтээгдэхүүн', icon: 'shopping-bag', isPrimary: false, order: null },
  { name: 'Засвар', icon: 'wrench', isPrimary: false, order: null },
  { name: 'Санхүү', icon: 'dollar-sign', isPrimary: false, order: null },
  { name: 'Фитнес', icon: 'dumbbell', isPrimary: false, order: null },
  { name: 'Аялал', icon: 'map', isPrimary: false, order: null },
  { name: 'Сургалт', icon: 'book', isPrimary: false, order: null },
  { name: 'Бусад', icon: 'more-horizontal', isPrimary: false, order: null },
];

async function main() {
  console.warn('🌱 Starting seed...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.yellowBookEntry.deleteMany();
  await prisma.category.deleteMany();

  // Seed categories
  console.warn('📂 Seeding categories...');
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  // Seed businesses
  console.warn('🏢 Seeding businesses...');
  for (const business of seedData) {
    await prisma.yellowBookEntry.create({
      data: business,
    });
  }

  // Seed reviews
  console.warn('💬 Seeding reviews...');
  for (const review of reviewData) {
    await prisma.review.create({
      data: review,
    });
  }

  // Update review counts based on actual reviews
  console.warn('🔄 Updating review counts...');
  const businesses = await prisma.yellowBookEntry.findMany();
  for (const business of businesses) {
    const reviews = await prisma.review.findMany({
      where: { businessId: business.id },
    });

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;
      await prisma.yellowBookEntry.update({
        where: { id: business.id },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
        },
      });
    } else {
      // Set to 0 if no reviews
      await prisma.yellowBookEntry.update({
        where: { id: business.id },
        data: {
          reviewCount: 0,
        },
      });
    }
  }

  console.warn('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
