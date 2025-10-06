export type Business = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  address: {
    city: string;
    district: string;
    khoroo: string;
    full: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string[];
    email: string;
    website: string;
  };
  hours: {
    [day: string]: string;
  };
  rating: number;
  reviewCount: number;
  images: string[];
  logo: string;
};

export type Review = {
  id: string;
  businessId: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
};

export type Category = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
};
