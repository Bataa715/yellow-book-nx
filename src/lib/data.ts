import type { Business, Review, Category } from '@/types';
import { Utensils, Coffee, ShoppingCart, Wrench, Car, Building, HeartPulse, Palette } from 'lucide-react';

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Modern Nomads',
    description: 'Монгол үндэстний зоогийн газар. Бид танд монгол ахуй, соёлыг мэдрүүлэх болно.',
    categories: ['Ресторан', 'Монгол хоол'],
    address: {
      city: 'Улаанбаатар',
      district: 'Сүхбаатар',
      khoroo: '1-р хороо',
      full: 'Сүхбаатар дүүрэг, 1-р хороо, Чингисийн өргөн чөлөө',
    },
    location: { lat: 47.918, lng: 106.917 },
    contact: {
      phone: ['7011-0393', '9909-1100'],
      email: 'info@modernnomads.mn',
      website: 'http://www.modernnomads.mn',
    },
    hours: {
      'Даваа-Баасан': '10:00 - 22:00',
      'Бямба-Ням': '11:00 - 23:00',
    },
    rating: 4.5,
    reviewCount: 125,
    images: [
      'https://picsum.photos/seed/restaurant1/800/600',
      'https://picsum.photos/seed/food1/800/600'
    ],
    logo: 'https://picsum.photos/seed/logo1/200/200',
  },
  {
    id: '2',
    name: 'Ubean Coffee',
    description: 'Тансаг зэрэглэлийн кофе шоп. Амтат кофе, тав тухтай орчин таныг хүлээж байна.',
    categories: ['Кофе шоп', 'Кафе'],
    address: {
      city: 'Улаанбаатар',
      district: 'Баянзүрх',
      khoroo: '26-р хороо',
      full: 'Баянзүрх дүүрэг, 26-р хороо, Peace Mall-н 1-р давхарт',
    },
    location: { lat: 47.912, lng: 106.953 },
    contact: {
      phone: ['7711-5555'],
      email: 'contact@ubean.mn',
      website: 'https://ubean.mn',
    },
    hours: {
      'Даваа-Ням': '08:00 - 21:00',
    },
    rating: 4.8,
    reviewCount: 88,
    images: [
      'https://picsum.photos/seed/cafe1/800/600',
      'https://picsum.photos/seed/coffee1/800/600'
    ],
    logo: 'https://picsum.photos/seed/logo2/200/200',
  },
  {
    id: '3',
    name: 'Номин Их Дэлгүүр',
    description: 'Өргөн хэрэглээний барааны их дэлгүүр. Хүнс, хувцас, гэр ахуйн бараа.',
    categories: ['Дэлгүүр', 'Супермаркет'],
    address: {
      city: 'Улаанбаатар',
      district: 'Чингэлтэй',
      khoroo: '4-р хороо',
      full: 'Чингэлтэй дүүрэг, 4-р хороо, Их тойруу-89',
    },
    location: { lat: 47.925, lng: 106.918 },
    contact: {
      phone: ['1800-2888'],
      email: 'info@nomin.net',
      website: 'https://nomin.mn',
    },
    hours: {
      'Даваа-Ням': '09:00 - 22:00',
    },
    rating: 4.2,
    reviewCount: 210,
    images: [
      'https://picsum.photos/seed/shop1/800/600',
    ],
    logo: 'https://picsum.photos/seed/logo3/200/200',
  },
    {
    id: '4',
    name: 'Хурд Сантехник',
    description: 'Сантехникийн бүх төрлийн засвар үйлчилгээг 24 цагаар дуудлагаар хийнэ.',
    categories: ['Үйлчилгээ', 'Сантехник'],
    address: {
      city: 'Улаанбаатар',
      district: 'Хан-Уул',
      khoroo: '15-р хороо',
      full: 'Хан-Уул дүүрэг, 15-р хороо, оффисгүй',
    },
    location: { lat: 47.892, lng: 106.898 },
    contact: {
      phone: ['9911-9911'],
      email: 'hurd.santehnik@example.com',
      website: '',
    },
    hours: {
      'Даваа-Ням': '24 цаг',
    },
    rating: 5.0,
    reviewCount: 45,
    images: [
      'https://picsum.photos/seed/plumber1/800/600',
    ],
    logo: 'https://picsum.photos/seed/logo4/200/200',
  },
];

export const mockReviews: Review[] = [
  {
    id: '1',
    businessId: '1',
    author: 'Болд',
    avatar: 'https://picsum.photos/seed/avatar1/100/100',
    rating: 5,
    comment: 'Хоол маш амттай, үйлчилгээ сайн. Орчин үеийн болон уламжлалт хэв маягийг хослуулсан сайхан газар.',
    date: '2024-05-10',
  },
  {
    id: '2',
    businessId: '1',
    author: 'Сараа',
    avatar: 'https://picsum.photos/seed/avatar2/100/100',
    rating: 4,
    comment: 'Найзуудтайгаа суухад тохиромжтой юм байна. Жоохон үнэтэй санагдсан.',
    date: '2024-05-08',
  },
    {
    id: '3',
    businessId: '2',
    author: 'Тэмүүлэн',
    avatar: 'https://picsum.photos/seed/avatar3/100/100',
    rating: 5,
    comment: 'Миний дуртай кофе шоп. Ялангуяа латте нь үнэхээр гоё.',
    date: '2024-05-12',
  },
];

export const mockCategories: Category[] = [
    { id: '1', name: 'Ресторан', icon: Utensils },
    { id: '2', name: 'Кафе', icon: Coffee },
    { id: '3', name: 'Дэлгүүр', icon: ShoppingCart },
    { id: '4', name: 'Үйлчилгээ', icon: Wrench },
    { id: '5', name: 'Авто засвар', icon: Car },
    { id: '6', name: 'Барилга', icon: Building },
    { id: '7', name: 'Эрүүл мэнд', icon: HeartPulse },
    { id: '8', name: 'Гоо сайхан', icon: Palette },
]
