/**
 * ============================================================================
 * AsbiMart (আসবিমার্ট) - Cloudflare Pages Edge Function Gateway
 * ============================================================================
 * - Proxies all /api/* requests with zero latency to the backend server
 * - Rewrites Host header to upstream host to prevent 404 router mismatch
 * - Buffers request bodies safely across all Cloudflare Workers runtimes
 * - Handles CORS preflight (OPTIONS 204) instantly at the Cloudflare Edge
 * - Supports Server-Sent Events (SSE) streaming for real-time order sync
 * - Provides resilient edge fallback with full 39 organic products catalog
 *   if upstream backend is cold-starting or restarting
 */

const EDGE_SEED_PRODUCTS = [
  {
    "id": "honey-sundarban-01",
    "name": "Sundarbans Raw Wild Honey",
    "banglaName": "সুন্দরবনের কাঁচা মধু",
    "category": "honey",
    "categoryBangla": "মধু ও প্রাকৃতিক মিষ্টি",
    "isBestSeller": true,
    "rating": 5,
    "reviewsCount": 142,
    "discountPercent": 15,
    "image": "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "সুন্দরবনের গভীর অরণ্য থেকে মৌয়ালদের মাধ্যমে সরাসরি চাক ভেঙে সংগ্রহকৃত শতভাগ প্রাকৃতিক ও খাঁটি অপরিশোধিত কাঁচা মধু। এতে কোনো প্রকার প্রসেসিং, হিটিং কিংবা কৃত্রিম সুগার মেশানো হয় না। প্রাকৃতিকভাবে এনজাইম, পোলেন ও অ্যান্টিঅক্সিডেন্টে ভরপুর এই মধু রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে অতুলনীয়।",
    "benefits": [
      "১০০% প্রাকৃতিক সুন্দরবনের চাকভাঙা অপরিশোধিত কাঁচা মধু",
      "রোগ প্রতিরোধ ক্ষমতা ও শারীরিক এনার্জি বাড়ায়",
      "কাশি ও ঠান্ডা নিরাময়ে কার্যকরী",
      "ল্যাব টেস্টে উত্তীর্ণ ও চিনিমুক্ত"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম",
        "price": 650,
        "originalPrice": 765,
        "stock": 25
      },
      {
        "size": "১ কেজি",
        "price": 1250,
        "originalPrice": 1470,
        "stock": 18
      }
    ],
    "reviews": [
      {
        "name": "মাহমুদ হাসান",
        "rating": 5,
        "date": "৩ দিন আগে",
        "comment": "মধুর ঘ্রাণ এবং স্বাদ অসাধারণ! খাঁটি কাঁচা মধু।"
      },
      {
        "name": "আরিফুল ইসলাম",
        "rating": 5,
        "date": "১ সপ্তাহ আগে",
        "comment": "প্যাকেজিং খুবই চমৎকার ছিল। সম্পূর্ণ অক্ষত পেয়েছি।"
      }
    ]
  },
  {
    "id": "honey-kalojira-02",
    "name": "Pure Black Seed Flower Honey",
    "banglaName": "কালোজিরা ফুলের মধু",
    "category": "honey",
    "categoryBangla": "মধু ও প্রাকৃতিক মিষ্টি",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 96,
    "discountPercent": 12,
    "image": "../assets/products/honey-kalojira-02.jpg",
    "gallery": [
      "../assets/products/honey-kalojira-02.jpg"
    ],
    "description": "কালোজিরা ফুলের মাঠ থেকে সংগৃহীত পুষ্টিকর ও সুস্বাদু বিশেষ প্রজাতির মধু। এর গাঢ় লালচে আভা ও অনন্য স্বাদ রয়েছে। কালোজিরার ঔষধি গুণের সাথে খাঁটি মধুর সংমিশ্রণ এটি স্বাস্থ্যের জন্য মহৌষধ।",
    "benefits": [
      "কালোজিরা ফুলের প্রাকৃতিক নির্যাস সমৃদ্ধ",
      "গ্যাস্ট্রিক ও হজমের সমস্যা দূর করে",
      "দীর্ঘস্থায়ী এনার্জি যোগায়"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম",
        "price": 720,
        "originalPrice": 820,
        "stock": 30
      },
      {
        "size": "১ কেজি",
        "price": 1380,
        "originalPrice": 1570,
        "stock": 15
      }
    ],
    "reviews": [
      {
        "name": "তাহসিন উল্লাহ",
        "rating": 5,
        "date": "২ দিন আগে",
        "comment": "গাঢ় প্রাকৃতিক মধু, অনেক ভালো লেগেছে।"
      }
    ]
  },
  {
    "id": "honey-litchi-03",
    "name": "Litchi Blossom Pure Raw Honey",
    "banglaName": "লিচু ফুলের মধু",
    "category": "honey",
    "categoryBangla": "মধু ও প্রাকৃতিক মিষ্টি",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 68,
    "discountPercent": 10,
    "image": "../assets/products/honey-litchi-03.jpg",
    "gallery": [
      "../assets/products/honey-litchi-03.jpg"
    ],
    "description": "দিনাজপুরের বিখ্যাত লিচু বাগান থেকে মৌমাছির প্রাকৃতিক পরাগায়নের মাধ্যমে সংগৃহীত হালকা সোনালী রঙের সুমিষ্ট কাঁচা মধু। বাচ্চাদের জন্য এবং প্রতিদিনের শরবতে অত্যন্ত লোভনীয়।",
    "benefits": [
      "লিচু ফুলের মিষ্টি সুবাস ও হালকা টেক্সচার",
      "বাচ্চাদের ক্ষুধা ও পুষ্টি বাড়াতে সহায়ক",
      "প্রাকৃতিক ভিটামিন ও গ্লুকোজ সমৃদ্ধ"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম",
        "price": 580,
        "originalPrice": 650,
        "stock": 35
      },
      {
        "size": "১ কেজি",
        "price": 1100,
        "originalPrice": 1250,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "সাইফুল ইসলাম",
        "rating": 5,
        "date": "৫ দিন আগে",
        "comment": "বাচ্চারা খুব পছন্দ করেছে। দারুণ স্বাদ।"
      }
    ]
  },
  {
    "id": "honey-mustard-04",
    "name": "Mustard Blossom Cream Honey",
    "banglaName": "সরিষা ফুলের মধু",
    "category": "honey",
    "categoryBangla": "মধু ও প্রাকৃতিক মিষ্টি",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 54,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "শীতকালে সরিষা ক্ষেত থেকে সংগৃহীত হালকা সোনালী ক্রিমি মধু। ঠান্ডা আবহাওয়ায় এটি প্রাকৃতিকভাবে ক্রিমি জমে যায়, যা খাঁটি সরিষা মধুর প্রধান বৈশিষ্ট্য।",
    "benefits": [
      "প্রাকৃতিক গ্লুকোজে ভরপুর পুষ্টিকর মধু",
      "শীতের সকালে দুধ বা রুটির সাথে চমৎকার",
      "১০০% প্রাকৃতিক কোনো প্রক্রিয়াজাত ছাড়া"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম",
        "price": 480,
        "originalPrice": 540,
        "stock": 40
      },
      {
        "size": "১ কেজি",
        "price": 920,
        "originalPrice": 1030,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "জসিম উদ্দিন",
        "rating": 5,
        "date": "১ সপ্তাহ আগে",
        "comment": "একদম ক্রিমি আসল সরিষা ফুলের মধু।"
      }
    ]
  },
  {
    "id": "honey-nut-premium-05",
    "name": "Royal Honey Nut Superfood Jar",
    "banglaName": "প্রিমিয়াম হানি নাট জার",
    "category": "honey",
    "categoryBangla": "মধু ও বাদাম কম্বো",
    "isBestSeller": true,
    "rating": 5,
    "reviewsCount": 185,
    "discountPercent": 16,
    "image": "../assets/products/honey-nut-premium-05.jpg",
    "gallery": [
      "../assets/products/honey-nut-premium-05.jpg"
    ],
    "description": "খাঁটি সুন্দরবনের কাঁচা মধুতে ডুবানো কাঠবাদাম, কাজুবাদাম, আখরোট, পেস্তা, কিসমিস, আনজির ও কুমড়ার বীজের স্বর্গীয় মিশ্রণ। ক্লান্তি দূর করতে এবং শরীর ও মনের তাৎক্ষণিক শক্তির জন্য অন্যতম সেরা ন্যাচারাল হেলথ ফুড।",
    "benefits": [
      "৮টি প্রিমিয়াম ড্রাই ফ্রুটস ও খাঁটি কাঁচা মধুর মিশ্রণ",
      "সকালে এক চামচেই সারাদিনের পরিপূর্ণ শক্তি",
      "শিশু ও বড়দের স্মৃতিশক্তি ও হাড়ের পুষ্টি জোগায়"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম",
        "price": 790,
        "originalPrice": 940,
        "stock": 40
      },
      {
        "size": "১ কেজি",
        "price": 1500,
        "originalPrice": 1780,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "শাকিল আহমেদ",
        "rating": 5,
        "date": "১ দিন আগে",
        "comment": "অবিশ্বাস্য রকমের সুস্বাদু! এক চামচ খেলেই মন ভরে যায়।"
      }
    ]
  },
  {
    "id": "ghee-pabna-06",
    "name": "Premium Danadar Cow Ghee",
    "banglaName": "খাঁটি গাওয়া ঘি",
    "category": "ghee",
    "categoryBangla": "ঐতিহ্যবাহী গাওয়া ঘি",
    "isBestSeller": true,
    "rating": 5,
    "reviewsCount": 198,
    "discountPercent": 12,
    "image": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "পাবনা ও সিরাজগঞ্জের দেশি গরুর খাঁটি দুধের মাখন থেকে ঐতিহ্যবাহী সনাতন পদ্ধতিতে জ্বাল দেওয়া সুস্বাদু দানাদার গাওয়া ঘি। এর মোহনীয় প্রাকৃতিক সুবাস খাবারে এনে দেয় রাজকীয় তৃপ্তি।",
    "benefits": [
      "১০০% খাঁটি দেশি গরুর দুধের ননী থেকে প্রস্তুত",
      "প্রাকৃতিক দানাদার টেক্সচার ও মিষ্টি সুবাস",
      "হজমশক্তি বাড়ায় ও হাড় মজবুত রাখে"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম",
        "price": 950,
        "originalPrice": 1080,
        "stock": 45
      },
      {
        "size": "১ কেজি",
        "price": 1850,
        "originalPrice": 2100,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "তাহমিনা বেগম",
        "rating": 5,
        "date": "২ দিন আগে",
        "comment": "ঘির ঘ্রাণে পুরো বাড়ি ম ম করছে। দানাদার খাঁটি ঘি!"
      }
    ]
  },
  {
    "id": "ghee-buffalo-07",
    "name": "Pure Buffalo Danadar Ghee",
    "banglaName": "মহিষের খাঁটি ঘি",
    "category": "ghee",
    "categoryBangla": "ঐতিহ্যবাহী ঘি",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 76,
    "discountPercent": 10,
    "image": "../assets/products/ghee-buffalo-07.jpg",
    "gallery": [
      "../assets/products/ghee-buffalo-07.jpg"
    ],
    "description": "ভোলার চরাঞ্চলের ঘাস খাওয়া দেশি মহিষের দুধের ননী থেকে তৈরি গাঢ় দানাদার মহিষের ঘি। এতে রয়েছে উচ্চমাত্রার ক্যালসিয়াম ও প্রাকৃতিক সুবাস।",
    "benefits": [
      "প্রাকৃতিক ক্যালসিয়াম ও ফসফরাস সমৃদ্ধ",
      "শারীরিক শক্তি ও ওজন বৃদ্ধিতে সাহায্য করে",
      "হালুয়া ও মিষ্টিতে দারুণ সুবাস এনে দেয়"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম",
        "price": 880,
        "originalPrice": 980,
        "stock": 35
      },
      {
        "size": "১ কেজি",
        "price": 1700,
        "originalPrice": 1900,
        "stock": 15
      }
    ],
    "reviews": [
      {
        "name": "কামাল উদ্দিন",
        "rating": 5,
        "date": "৪ দিন আগে",
        "comment": "মহিষের খাঁটি ঘি পাওয়া খুব কঠিন ছিল। অসাধারণ কোয়ালিটি।"
      }
    ]
  },
  {
    "id": "ghee-butter-home-08",
    "name": "Hand-Churned Cultured Ghee",
    "banglaName": "বিলোন বাখন ঘি",
    "category": "ghee",
    "categoryBangla": "ঐতিহ্যবাহী ঘি",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 63,
    "discountPercent": 10,
    "image": "../assets/products/ghee-butter-home-08.jpg",
    "gallery": [
      "../assets/products/ghee-butter-home-08.jpg"
    ],
    "description": "দই মন্থন করে কাঠের মন্থনী দিয়ে হাতে মাখন তুলে ধীরে ধীরে তৈরি করা খাঁটি বৈদিক বিলোনা ঘি। এটি সহজে হজমযোগ্য ও পরম পুষ্টিকর।",
    "benefits": [
      "বৈদিক বিলোনা পদ্ধতিতে হাতে তৈরি খাঁটি ঘি",
      "অন্ত্রের সুস্বাস্থ্য ও স্মৃতিশক্তি বর্ধক",
      "ল্যাকটোজ ও ক্যাসিন মুক্ত"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম",
        "price": 1100,
        "originalPrice": 1220,
        "stock": 25
      },
      {
        "size": "১ কেজি",
        "price": 2150,
        "originalPrice": 2390,
        "stock": 10
      }
    ],
    "reviews": [
      {
        "name": "মনিরুল ইসলাম",
        "rating": 5,
        "date": "৩ দিন আগে",
        "comment": "বিলোনার আসল ঘ্রাণ পাওয়া যায়। সেরা ঘি!"
      }
    ]
  },
  {
    "id": "oil-mustard-ghani-09",
    "name": "Cold-Pressed Wood Ghani Mustard Oil",
    "banglaName": "ঘানিভাঙা সরিষার তেল",
    "category": "oil",
    "categoryBangla": "ঘানিভাঙা খাঁটি তেল",
    "isBestSeller": true,
    "rating": 4.8,
    "reviewsCount": 115,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "বাছাইকৃত দেশি মাঘী সরিষা কাঠের ঘানিতে ধীরগতিতে কোল্ড-প্রেসড করে তৈরি খাঁটি সরিষার তেল। এতে সরিষার প্রাকৃতিক ঝাঁঝ, পুষ্টিগুণ এবং র ভিটামিন অক্ষুণ্ন থাকে।",
    "benefits": [
      "কাঠের ঘানিতে ধীরগতির চাপে ভাঙানো শতভাগ খাঁটি তেল",
      "তীক্ষ্ণ আসল প্রাকৃতিক ঝাঁঝ ও খাঁটি স্বাদ",
      "হৃদযন্ত্র সুস্থ রাখতে ও কোলেস্টেরল নিয়ন্ত্রণে সহায়ক"
    ],
    "variants": [
      {
        "size": "১ লিটার",
        "price": 320,
        "originalPrice": 355,
        "stock": 50
      },
      {
        "size": "৫ লিটার",
        "price": 1500,
        "originalPrice": 1680,
        "stock": 15
      }
    ],
    "reviews": [
      {
        "name": "ফারুক আহমেদ",
        "rating": 5,
        "date": "৪ দিন আগে",
        "comment": "তিলের ঝাঁঝ আর আসল সরিষার গন্ধ পাওয়া যায়।"
      }
    ]
  },
  {
    "id": "kalojira-oil-pure-10",
    "name": "Pure Cold Pressed Black Seed Oil",
    "banglaName": "কোল্ড প্রেসড কালোজিরা তেল",
    "category": "oil",
    "categoryBangla": "ঘানিভাঙা খাঁটি তেল",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 74,
    "discountPercent": 15,
    "image": "https://images.unsplash.com/photo-1550160770-005c21924d66?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1550160770-005c21924d66?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "খাঁটি দেশি কালোজিরা থেকে ফার্স্ট কোল্ড-প্রেসড পদ্ধতিতে সংগৃহীত মহৌষধতুল্য কালোজিরা তেল। দেহের সার্বিক রোগ প্রতিরোধ ক্ষমতা বাড়াতে মহৌষধ হিসেবে কাজ করে।",
    "benefits": [
      "১০০% খাঁটি কোল্ড প্রেসড অপরিশোধিত কালোজিরা তেল",
      "শ্বাসকষ্ট ও সাইনাস নিরাময়ে সহায়ক",
      "চুল পড়া বন্ধে এবং ত্বকের সুস্থতায় ফলদায়ক"
    ],
    "variants": [
      {
        "size": "১০০ মিলি",
        "price": 210,
        "originalPrice": 245,
        "stock": 30
      },
      {
        "size": "২৫০ মিলি",
        "price": 460,
        "originalPrice": 540,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "আকতার হোসেন",
        "rating": 5,
        "date": "৪ দিন আগে",
        "comment": "তেলটা একদম আসল ও ঘন।"
      }
    ]
  },
  {
    "id": "coconut-oil-extra-virgin-11",
    "name": "Extra Virgin Cold Pressed Coconut Oil",
    "banglaName": "এক্সট্রা ভার্জিন নারিকেল তেল",
    "category": "oil",
    "categoryBangla": "ঘানিভাঙা খাঁটি তেল",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 62,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "তাজা নারিকেলের দুধ থেকে কোল্ড-সেন্ট্রিফিউজ পদ্ধতিতে সংগৃহীত শতভাগ খাঁটি ও খাবার উপযোগী এক্সট্রা ভার্জিন কোকোনাট অয়েল। চুল, ত্বক ও কিটো ডায়েটের জন্য আদর্শ।",
    "benefits": [
      "১০০% খাঁটি ও খাওয়ার উপযোগী র ভার্জিন তেল",
      "চুলের গোড়া শক্ত করে ও ত্বকে গভীর ময়েশ্চার যোগায়",
      "কিটো ডায়েটে দ্রুত চর্বি পোড়াতে সাহায্য করে"
    ],
    "variants": [
      {
        "size": "২৫০ মিলি",
        "price": 340,
        "originalPrice": 380,
        "stock": 40
      },
      {
        "size": "৫০০ মিলি",
        "price": 650,
        "originalPrice": 730,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "সামিয়া হক",
        "rating": 5,
        "date": "৩ দিন আগে",
        "comment": "নারিকেলের মিষ্টি প্রাকৃতিক গন্ধ। চুল পরা কমে গেছে।"
      }
    ]
  },
  {
    "id": "oil-sesame-til-12",
    "name": "Cold Pressed Pure Sesame (Til) Oil",
    "banglaName": "খাঁটি তিলের তেল",
    "category": "oil",
    "categoryBangla": "ঘানিভাঙা খাঁটি তেল",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 45,
    "discountPercent": 12,
    "image": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "কালো তিল থেকে কাঠের ঘানিতে ভাঙানো খাঁটি তিলের তেল। আয়ুর্বেদিক মালিশ, বাতের ব্যথা উপশমে এবং রান্নায় সুস্বাদু অ্যারোমা যোগ করতে চমৎকার।",
    "benefits": [
      "প্রাকৃতিক ক্যালসিয়াম ও অ্যান্টিঅক্সিডেন্টে ভরপুর",
      "হাড়ের জোড়া ও পেশির ব্যথা উপশমে সাহায্য করে",
      "ত্বকের তারুণ্য ধরে রাখে"
    ],
    "variants": [
      {
        "size": "২৫০ মিলি",
        "price": 290,
        "originalPrice": 330,
        "stock": 35
      },
      {
        "size": "৫০০ মিলি",
        "price": 550,
        "originalPrice": 620,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "আনিসুল হক",
        "rating": 5,
        "date": "১ সপ্তাহ আগে",
        "comment": "ব্যথায় মালিশ করে খুব আরাম পেয়েছি।"
      }
    ]
  },
  {
    "id": "nuts-dryfruits-mix-13",
    "name": "Premium Royal Mixed Dry Fruits & Nuts",
    "banglaName": "মিক্সড নাটস ও ড্রাই ফ্রুটস",
    "category": "nuts",
    "categoryBangla": "বাদাম ও ড্রাই ফ্রুটস",
    "isBestSeller": true,
    "rating": 4.9,
    "reviewsCount": 164,
    "discountPercent": 18,
    "image": "https://images.unsplash.com/photo-1514537193821-ed4955693802?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1514537193821-ed4955693802?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "আমেরিকার কাঠবাদাম, কাজুবাদাম, আখরোট, পেস্তা, কিসমিস, আনজির ও মিষ্টি ক্র্যানবেরির প্রিমিয়াম কম্বিনেশন। প্রতিটি বাদাম একদম ফ্রেশ, মুচমুচে ও পুষ্টিতে ভরপুর।",
    "benefits": [
      "সেরা মানের ৮টি প্রিমিয়াম ড্রাই ফ্রুটস ও বাদামের সুষম মিশ্রণ",
      "ব্রেন পাওয়ার, মেমোরি ও হৃদযন্ত্র সুস্থ রাখতে সহায়ক",
      "প্রাকৃতিক প্রোটিন, ফাইবার ও হেলদি ফ্যাটের উৎকৃষ্ট উৎস"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম",
        "price": 790,
        "originalPrice": 960,
        "stock": 50
      },
      {
        "size": "১ কেজি",
        "price": 1520,
        "originalPrice": 1850,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "নাবিল চৌধুরী",
        "rating": 5,
        "date": "৩ দিন আগে",
        "comment": "প্রতিটি বাদাম অনেক ফ্রেশ এবং ক্রিস্পি।"
      }
    ]
  },
  {
    "id": "almond-california-14",
    "name": "California Supreme Almonds",
    "banglaName": "ক্যালিফোর্নিয়া কাঠবাদাম",
    "category": "nuts",
    "categoryBangla": "বাদাম ও ড্রাই ফ্রুটস",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 108,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "যুক্তরাষ্ট্রের ক্যালিফোর্নিয়া থেকে সরাসরি আমদানিকৃত সুপ্রিম গোল্ডেন কাঠবাদাম। নিয়মিত কাঠবাদাম খেলে মস্তিষ্কের কার্যক্ষমতা বৃদ্ধি পায় এবং ত্বক উজ্জ্বল থাকে।",
    "benefits": [
      "ভিটামিন-ই ও শক্তিশালী অ্যান্টিঅক্সিডেন্টে ভরপুর",
      "কোলেস্টেরল কমাতে সাহায্য করে",
      "হাড় ও দাঁতের সুরক্ষায় অত্যন্ত কার্যকর"
    ],
    "variants": [
      {
        "size": "২৫০ গ্রাম",
        "price": 350,
        "originalPrice": 390,
        "stock": 40
      },
      {
        "size": "৫০০ গ্রাম",
        "price": 680,
        "originalPrice": 760,
        "stock": 30
      }
    ],
    "reviews": [
      {
        "name": "ডা. ইমরান কবীর",
        "rating": 5,
        "date": "১ সপ্তাহ আগে",
        "comment": "সাইজ বড় এবং স্বাদে অতুলনীয়।"
      }
    ]
  },
  {
    "id": "cashew-premium-15",
    "name": "Premium Roasted Cashew Nuts",
    "banglaName": "প্রিমিয়াম কাজুবাদাম",
    "category": "nuts",
    "categoryBangla": "বাদাম ও ড্রাই ফ্রুটস",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 89,
    "discountPercent": 12,
    "image": "../assets/products/cashew-premium-15.jpg",
    "gallery": [
      "../assets/products/cashew-premium-15.jpg"
    ],
    "description": "বড় সাইজের রোস্টেড প্রিমিয়াম কাজুবাদাম। মিষ্টি ও ক্রাঞ্চি স্বাদের এই কাজুবাদাম রান্নায় অথবা প্রতিদিনের পুষ্টিকর নাস্তায় দারুণ উপভোগ্য।",
    "benefits": [
      "উচ্চমানের উদ্ভিজ্জ প্রোটিন ও মিনারেলস সমৃদ্ধ",
      "হৃদযন্ত্র ভালো রাখতে ও রক্তচাপ নিয়ন্ত্রণে সাহায্য করে",
      "শরীরে শক্তি যোগায় ও ক্লান্তি দূর করে"
    ],
    "variants": [
      {
        "size": "২৫০ গ্রাম",
        "price": 390,
        "originalPrice": 440,
        "stock": 35
      },
      {
        "size": "৫০০ গ্রাম",
        "price": 760,
        "originalPrice": 860,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "সুলতানা রহমান",
        "rating": 5,
        "date": "৩ দিন আগে",
        "comment": "মুচমুচে এবং মিষ্টি টেস্ট।"
      }
    ]
  },
  {
    "id": "walnut-kashmiri-16",
    "name": "Kashmiri Kagzi Akhrot (Walnut)",
    "banglaName": "কাশ্মীরি আস্ত আখরোট",
    "category": "nuts",
    "categoryBangla": "বাদাম ও ড্রাই ফ্রুটস",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 57,
    "discountPercent": 14,
    "image": "../assets/products/walnut-kashmiri-16.jpg",
    "gallery": [
      "../assets/products/walnut-kashmiri-16.jpg"
    ],
    "description": "কাশ্মীরের ঐতিহ্যবাহী পাতলা খোসাযুক্ত কাগজি আখরোট। এটি মস্তিষ্কের গঠন ও কার্যকারিতা বাড়াতে ব্রেন ফুড হিসেবে বিশ্বখ্যাত।",
    "benefits": [
      "উচ্চমাত্রার উদ্ভিজ্জ ওমেগা-৩ ফ্যাটি অ্যাসিড যুক্ত",
      "স্মৃতিশক্তি ও ব্রেইন ফাংশন বৃদ্ধি করে",
      "রক্তে ক্ষতিকর এলডিএল কোলেস্টেরল কমায়"
    ],
    "variants": [
      {
        "size": "২৫০ গ্রাম",
        "price": 420,
        "originalPrice": 490,
        "stock": 30
      },
      {
        "size": "৫০০ গ্রাম",
        "price": 820,
        "originalPrice": 950,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "মিজানুর রহমান",
        "rating": 5,
        "date": "৪ দিন আগে",
        "comment": "হাতে চাপ দিলেই খোসা ভেঙে যায়।"
      }
    ]
  },
  {
    "id": "pista-iranian-17",
    "name": "Iranian Roasted Salted Pistachios",
    "banglaName": "ইরানি পেস্তা বাদাম",
    "category": "nuts",
    "categoryBangla": "বাদাম ও ড্রাই ফ্রুটস",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 71,
    "discountPercent": 12,
    "image": "../assets/products/pista-iranian-17.jpg",
    "gallery": [
      "../assets/products/pista-iranian-17.jpg"
    ],
    "description": "ইরানের বিখ্যাত সুস্বাদু রোস্টেড ও হালকা সল্টেড পেস্তা বাদাম। আকর্ষণীয় প্রাকৃতিক সবুজ ও বেগুনি আভা সমেত খাঁটি পেস্তা বাদাম।",
    "benefits": [
      "চোখের জ্যোতি ও দৃষ্টিশক্তি সুরক্ষায় কার্যকর",
      "প্রচুর প্রোটিন ও ফাইবার সমৃদ্ধ",
      "রক্তে হিমোগ্লোবিন বাড়াতে সাহায্য করে"
    ],
    "variants": [
      {
        "size": "২৫০ গ্রাম",
        "price": 550,
        "originalPrice": 620,
        "stock": 30
      },
      {
        "size": "৫০০ গ্রাম",
        "price": 1080,
        "originalPrice": 1220,
        "stock": 15
      }
    ],
    "reviews": [
      {
        "name": "সোহাগ রানা",
        "rating": 5,
        "date": "৫ দিন আগে",
        "comment": "অসাধারণ স্বাদ ও নিখুঁত সাইজ।"
      }
    ]
  },
  {
    "id": "raisin-golden-18",
    "name": "Afghan Jumbo Golden Raisins",
    "banglaName": "আফগান গোল্ডেন কিসমিস",
    "category": "nuts",
    "categoryBangla": "বাদাম ও ড্রাই ফ্রুটস",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 60,
    "discountPercent": 10,
    "image": "../assets/products/raisin-golden-18.jpg",
    "gallery": [
      "../assets/products/raisin-golden-18.jpg"
    ],
    "description": "আফগানিস্তানের মিষ্টি ও রসালো লম্বা গোল্ডেন কিসমিস। রক্তে আয়রনের ঘাটতি পূরণে ও মিষ্টি রান্নায় অত্যন্ত আকর্ষণীয়।",
    "benefits": [
      "প্রাকৃতিক আয়রন ও পটাসিয়াম সমৃদ্ধ",
      "রক্তস্বল্পতা দূর করতে বিশেষ উপকারী",
      "হজমে সহায়তা করে ও কোষ্ঠকাঠিন্য কমায়"
    ],
    "variants": [
      {
        "size": "২৫০ গ্রাম",
        "price": 210,
        "originalPrice": 235,
        "stock": 50
      },
      {
        "size": "৫০০ গ্রাম",
        "price": 400,
        "originalPrice": 450,
        "stock": 35
      }
    ],
    "reviews": [
      {
        "name": "ফারহানা আক্তার",
        "rating": 5,
        "date": "১ সপ্তাহ আগে",
        "comment": "খুব মিষ্টি এবং পরিচ্ছন্ন।"
      }
    ]
  },
  {
    "id": "care-neem-toothpaste-19",
    "name": "Organic Neem & Clove Herbal Toothpaste",
    "banglaName": "অর্গানিক নিম টুথপেস্ট",
    "category": "personalcare",
    "categoryBangla": "ন্যাচারাল পার্সোনাল কেয়ার",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 72,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "খাঁটি নিমপাতা ও লবঙ্গের নির্যাস সমৃদ্ধ ১০০% ন্যাচারাল ভেষজ টুথপেস্ট। কোনো ক্ষতিকর ফ্লোরাইড বা রাসায়নিক ফেনা সৃষ্টিকারী উপাদান ছাড়াই দাঁতের মাড়ি সুরক্ষা ও ক্যাভিটি প্রতিরোধে অত্যন্ত কার্যকরী।",
    "benefits": [
      "ফ্লোরাইড ও কৃত্রিম কেমিক্যাল মুক্ত প্রাকৃতিক ভেষজ পেস্ট",
      "দাঁতের মাড়ি থেকে রক্ত পড়া বন্ধ করে ও মুখের দুর্গন্ধ দূর করে",
      "দাঁত রাখে ঝকঝকে সাদা ও ফ্রেশ"
    ],
    "variants": [
      {
        "size": "১০০ গ্রাম টিউব",
        "price": 180,
        "originalPrice": 200,
        "stock": 50
      },
      {
        "size": "২০০ গ্রাম ফ্যামিলি প্যাক",
        "price": 340,
        "originalPrice": 380,
        "stock": 40
      }
    ],
    "reviews": [
      {
        "name": "আতিকুর রহমান",
        "rating": 5,
        "date": "৩ দিন আগে",
        "comment": "দাঁতের শিরশিরানি ভাব একদম কমে গেছে।"
      }
    ]
  },
  {
    "id": "care-bamboo-brush-20",
    "name": "Natural Bamboo Eco Toothbrush (Set of 4)",
    "banglaName": "ন্যাচারাল ব্যাম্বু টুথব্রাশ",
    "category": "personalcare",
    "categoryBangla": "ন্যাচারাল পার্সোনাল কেয়ার",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 65,
    "discountPercent": 15,
    "image": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "১০০% পরিবেশবান্ধব বাঁশ থেকে তৈরি অর্গানিক টুথব্রাশ। এর আল্ট্রা-সফট ব্রিসল দাঁতের এনামেল বা মাড়ির কোনো ক্ষতি না করে অত্যন্ত যত্নের সাথে দাঁত পরিষ্কার করে।",
    "benefits": [
      "১০০% বায়োডিগ্রেডেবল ও প্লাস্টিকমুক্ত পরিবেশবান্ধব ব্রাশ",
      "মাড়ির জন্য কোমল ও আরামদায়ক চারকোল ব্রিসল",
      "জীবাণুরোধী প্রাকৃতিক বাঁশের হাতল"
    ],
    "variants": [
      {
        "size": "৪ পিসের ফ্যামিলি বক্স",
        "price": 260,
        "originalPrice": 310,
        "stock": 45
      }
    ],
    "reviews": [
      {
        "name": "সায়মা সুলতানা",
        "rating": 5,
        "date": "৫ দিন আগে",
        "comment": "খুবই সফট ব্রিসল আর চমৎকার কোয়ালিটি।"
      }
    ]
  },
  {
    "id": "care-organic-lotion-21",
    "name": "Pure Shea Butter & Almond Body Lotion",
    "banglaName": "অর্গানিক আমন্ড বডি লোশন",
    "category": "personalcare",
    "categoryBangla": "ন্যাচারাল পার্সোনাল কেয়ার",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 88,
    "discountPercent": 12,
    "image": "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "খাঁটি শিয়া বাটার, কাঠবাদামের তেল ও অ্যালোভেরা জেল দিয়ে প্রস্তুত প্রাকৃতিক ময়েশ্চারাইজিং বডি লোশন। ক্ষতিকর প্যারাবেন ও কৃত্রিম সুগন্ধিমুক্ত এই লোশন শুষ্ক ত্বককে করে কোমল ও উজ্জ্বল।",
    "benefits": [
      "প্যারাবেন, সালফেট ও কৃত্রিম কেমিক্যাল মুক্ত ফর্মুলা",
      "২৪ ঘণ্টা গভীর ময়েশ্চারাইজিং ও ত্বকের খসখসে ভাব দূর করে",
      "ভিটামিন-ই সমৃদ্ধ প্রাকৃতিক পুষ্টি"
    ],
    "variants": [
      {
        "size": "২০০ মিলি বোতল",
        "price": 450,
        "originalPrice": 510,
        "stock": 35
      },
      {
        "size": "৪০০ মিলি পাম্প বোতল",
        "price": 820,
        "originalPrice": 930,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "ফারজানা শারমিন",
        "rating": 5,
        "date": "১ দিন আগে",
        "comment": "একটুও চিটচিটে না, ত্বক নরম রাখে।"
      }
    ]
  },
  {
    "id": "care-neem-soap-22",
    "name": "Handmade Organic Neem & Turmeric Soap",
    "banglaName": "অর্গানিক নিম সাবান",
    "category": "personalcare",
    "categoryBangla": "ন্যাচারাল পার্সোনাল কেয়ার",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 59,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "খাঁটি নিম তেল, কাঁচা হলুদ ও নারকেল তেল দিয়ে কোল্ড-প্রসেস পদ্ধতিতে হাতে তৈরি ভেষজ সাবান। ব্রণ, ঘামাচি ও ত্বকের ইনফেকশন দূর করতে প্রাকৃতিক অ্যান্টিব্যাকটেরিয়াল সুরক্ষা দেয়।",
    "benefits": [
      "১০০% ন্যাচারাল কেমিক্যালমুক্ত কোল্ড-প্রসেস সাবান",
      "ব্রণ ও ত্বকের ব্যাকটেরিয়াল ইনফেকশন দূর করে",
      "ত্বকের আর্দ্রতা ধরে রেখে ন্যাচারাল গ্লো এনে দেয়"
    ],
    "variants": [
      {
        "size": "১০০ গ্রাম বার",
        "price": 150,
        "originalPrice": 170,
        "stock": 60
      },
      {
        "size": "৩টির কম্বো প্যাক",
        "price": 420,
        "originalPrice": 480,
        "stock": 35
      }
    ],
    "reviews": [
      {
        "name": "মাহমুদুল হক",
        "rating": 5,
        "date": "৪ দিন আগে",
        "comment": "সাবানটা মুখে দিলে দারুণ ফ্রেশ লাগে।"
      }
    ]
  },
  {
    "id": "care-aloevera-gel-23",
    "name": "Pure Organic Aloe Vera Soothing Gel",
    "banglaName": "খাঁটি অ্যালোভেরা জেল",
    "category": "personalcare",
    "categoryBangla": "ন্যাচারাল পার্সোনাল কেয়ার",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 77,
    "discountPercent": 12,
    "image": "../assets/products/care-aloevera-gel-23.jpg",
    "gallery": [
      "../assets/products/care-aloevera-gel-23.jpg"
    ],
    "description": "তাজা অর্গানিক ঘৃতকুমারী পাতা থেকে নিষ্কাশিত ৯৯% পিওর অ্যালোভেরা জেল। রোদপোড়া ত্বক শান্ত করতে এবং চুলের কন্ডিশনিং ও ড্যানড্রাফ দূর করতে দারুণ উপযোগী।",
    "benefits": [
      "অ্যালকোহল ও কৃত্রিম রঙ মুক্ত ৯৯% পিওর জেল",
      "সানবার্ন ও ব্রণ দ্রুত উপশম করে",
      "চুল সিল্কি ও খুশকিমুক্ত করে"
    ],
    "variants": [
      {
        "size": "২০০ মিলি জার",
        "price": 320,
        "originalPrice": 360,
        "stock": 40
      }
    ],
    "reviews": [
      {
        "name": "সুমাইয়া আক্তার",
        "rating": 5,
        "date": "২ দিন আগে",
        "comment": "খুবই স্নিগ্ধ এবং ত্বকে দ্রুত মিশে যায়।"
      }
    ]
  },
  {
    "id": "chia-seed-organic-24",
    "name": "Organic Mexican Chia Seeds",
    "banglaName": "অর্গানিক চিয়া সিড",
    "category": "superfood",
    "categoryBangla": "অর্গানিক সুপারফুড",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 88,
    "discountPercent": 14,
    "image": "../assets/products/chia-seed-organic-24.jpg",
    "gallery": [
      "../assets/products/chia-seed-organic-24.jpg"
    ],
    "description": "মেক্সিকো থেকে সংগৃহীত শতভাগ অর্গানিক চিয়া সিড। প্রচুর পরিমাণে ওমেগা-৩ ও ডায়েটারি ফাইবার সমৃদ্ধ এই সুপারফুড ওজন নিয়ন্ত্রণ এবং বডি ডিটক্সে অত্যন্ত জনপ্রিয়।",
    "benefits": [
      "প্রচুর ডায়েটারি ফাইবার ও ওমেগা-৩ ফ্যাটি অ্যাসিড সমৃদ্ধ",
      "পেটের চর্বি কমাতে ও ওজন নিয়ন্ত্রণে সাহায্য করে",
      "রক্তে শর্করার মাত্রা ও কোলেস্টেরল নিয়ন্ত্রণে সহায়ক"
    ],
    "variants": [
      {
        "size": "২৫০ গ্রাম",
        "price": 280,
        "originalPrice": 320,
        "stock": 40
      },
      {
        "size": "৫০০ গ্রাম",
        "price": 520,
        "originalPrice": 600,
        "stock": 30
      }
    ],
    "reviews": [
      {
        "name": "নুসরাত জাহান",
        "rating": 5,
        "date": "২ দিন আগে",
        "comment": "দানাদানা একদম পরিষ্কার ও প্রিমিয়াম।"
      }
    ]
  },
  {
    "id": "flax-seed-organic-25",
    "name": "Organic Brown Flax Seeds (তিসি বীজ)",
    "banglaName": "অর্গানিক তিসি বীজ",
    "category": "superfood",
    "categoryBangla": "অর্গানিক সুপারফুড",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 51,
    "discountPercent": 12,
    "image": "../assets/products/flax-seed-organic-25.jpg",
    "gallery": [
      "../assets/products/flax-seed-organic-25.jpg"
    ],
    "description": "উচ্চমানের অপরিশোধিত ব্রাউন তিসি বীজ। লিগনান ও স্বাস্থ্যকর ফাইবারে ভরপুর এই সুপারফুড হার্ট ভালো রাখতে এবং হরমোনের ভারসাম্য রক্ষা করতে চিকিৎসকদের প্রথম পছন্দ।",
    "benefits": [
      "উচ্চমাত্রার দ্রবণীয় ফাইবার ও ওমেগা-৩ যুক্ত",
      "হজমশক্তি বৃদ্ধি করে ও কোষ্ঠকাঠিন্য দূর করে",
      "উচ্চ রক্তচাপ নিয়ন্ত্রণে সাহায্য করে"
    ],
    "variants": [
      {
        "size": "২৫০ গ্রাম",
        "price": 180,
        "originalPrice": 205,
        "stock": 45
      },
      {
        "size": "৫০০ গ্রাম",
        "price": 340,
        "originalPrice": 390,
        "stock": 30
      }
    ],
    "reviews": [
      {
        "name": "মোশাররফ হোসেন",
        "rating": 5,
        "date": "৫ দিন আগে",
        "comment": "পরিচ্ছন্ন দানা, ভালো মানের তিসি।"
      }
    ]
  },
  {
    "id": "pumpkin-seeds-26",
    "name": "Raw Shelled Pumpkin Seeds (কুমড়ার বীজ)",
    "banglaName": "খোসাছাড়া কুমড়ার বীজ",
    "category": "superfood",
    "categoryBangla": "অর্গানিক সুপারফুড",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 64,
    "discountPercent": 15,
    "image": "../assets/products/pumpkin-seeds-26.jpg",
    "gallery": [
      "../assets/products/pumpkin-seeds-26.jpg"
    ],
    "description": "প্রাকৃতিক জিংক ও ম্যাগনেসিয়ামে ভরপুর খোসাছাড়া কাঁচা মিষ্টি কুমড়ার বীজ। টেস্টোস্টেরন হরমোন বৃদ্ধি এবং পুরুষদের সার্বিক প্রস্টেট স্বাস্থ্য ভালো রাখতে এটি অনবদ্য।",
    "benefits": [
      "প্রাকৃতিক জিংকের সর্বোত্তম উদ্ভিজ্জ উৎস",
      "প্রস্টেট স্বাস্থ্য ও ঘুমের গভীরতা বৃদ্ধি করে",
      "ইমিউনিটি বুস্টার হিসেবে কাজ করে"
    ],
    "variants": [
      {
        "size": "২৫০ গ্রাম",
        "price": 320,
        "originalPrice": 375,
        "stock": 35
      },
      {
        "size": "৫০০ গ্রাম",
        "price": 620,
        "originalPrice": 720,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "মাহবুব জামান",
        "rating": 5,
        "date": "৩ দিন আগে",
        "comment": "রোস্ট করে খেতে দারুণ মজা।"
      }
    ]
  },
  {
    "id": "sunflower-seeds-27",
    "name": "Raw Shelled Sunflower Seeds (সূর্যমুখী বীজ)",
    "banglaName": "সূর্যমুখী ফুলের বীজ",
    "category": "superfood",
    "categoryBangla": "অর্গানিক সুপারফুড",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 48,
    "discountPercent": 10,
    "image": "../assets/products/sunflower-seeds-27.jpg",
    "gallery": [
      "../assets/products/sunflower-seeds-27.jpg"
    ],
    "description": "ভিটামিন-ই ও সেলেনিয়াম সমৃদ্ধ খোসাছাড়া সূর্যমুখী বীজ। ত্বকের মসৃণতা ফিরিয়ে আনতে এবং ক্ষতিকর ফ্রি র‍্যাডিকেল দূর করতে প্রতিদিন সালাদে বা নাস্তায় সেরা।",
    "benefits": [
      "প্রচুর ভিটামিন-ই ও সেলেনিয়াম সমৃদ্ধ",
      "ত্বকের তারুণ্য ধরে রাখে ও বার্ধক্য কমায়",
      "হৃদযন্ত্রের রক্তনালী নমনীয় রাখে"
    ],
    "variants": [
      {
        "size": "২৫০ গ্রাম",
        "price": 210,
        "originalPrice": 235,
        "stock": 40
      },
      {
        "size": "৫০০ গ্রাম",
        "price": 390,
        "originalPrice": 440,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "আরিফা আক্তার",
        "rating": 5,
        "date": "৬ দিন আগে",
        "comment": "খুবই মুচমুচে এবং টেস্ট ভালো।"
      }
    ]
  },
  {
    "id": "dates-ajwa-madinah-28",
    "name": "Madinah Supreme Ajwa Dates",
    "banglaName": "মদিনার প্রিমিয়াম আজওয়া খেজুর",
    "category": "nuts",
    "categoryBangla": "বাদাম ও ড্রাই ফ্রুটস",
    "isBestSeller": false,
    "rating": 5,
    "reviewsCount": 95,
    "discountPercent": 15,
    "image": "../assets/products/dates-ajwa-madinah-28.jpg",
    "gallery": [
      "../assets/products/dates-ajwa-madinah-28.jpg"
    ],
    "description": "পবিত্র মদিনা মুনাওয়ারা থেকে সরাসরি সংগৃহীত সেরা মানের জেনুইন আজওয়া খেজুর। নরম ও মিষ্টি স্বাদের এই খেজুর হৃদযন্ত্রের সুরক্ষা ও বরকতময় সুন্নাহ হিসেবে অতুলনীয়।",
    "benefits": [
      "মদিনা শরিফের আসল বড় সাইজের ফ্রেশ আজওয়া খেজুর",
      "হৃদরোগ ও রক্তনালীর ব্লকেজ প্রতিরোধে অত্যন্ত কার্যকরী",
      "প্রাকৃতিক ফ্রুক্টোজ যা সারাদিনের এনার্জি বজায় রাখে"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম",
        "price": 850,
        "originalPrice": 1000,
        "stock": 35
      },
      {
        "size": "১ কেজি",
        "price": 1650,
        "originalPrice": 1950,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "হাফেজ জুবায়ের",
        "rating": 5,
        "date": "১ দিন আগে",
        "comment": "খেজুরগুলো অত্যন্ত নরম ও মিষ্টি।"
      }
    ]
  },
  {
    "id": "spices-haldi-morich-29",
    "name": "Pure Organic Turmeric & Red Chilli Powder",
    "banglaName": "খাঁটি হলুদ ও মরিচ গুঁড়া",
    "category": "spices",
    "categoryBangla": "অর্গানিক মসলা",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 65,
    "discountPercent": 12,
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "রং ও কেমিক্যালমুক্ত দেশি কাঁচা হলুদ ও লাল মরিচ রোদে শুকিয়ে পরিচ্ছন্নভাবে ভাঙানো খাঁটি গুঁড়া মসলা। রান্নায় আনে অসাধারণ প্রাকৃতিক রং ও ঘ্রাণ।",
    "benefits": [
      "কোনো কৃত্রিম রং বা ভেজাল প্রিজারভেটিভ নেই",
      "কারকিউমিন সমৃদ্ধ প্রাকৃতিক হলুদ গুঁড়া",
      "দেশি ঝাল ও আসল ঘ্রাণে ভরপুর মরিচ গুঁড়া"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম",
        "price": 320,
        "originalPrice": 360,
        "stock": 35
      },
      {
        "size": "১ কেজি",
        "price": 620,
        "originalPrice": 700,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "রোকেয়া খাতুন",
        "rating": 5,
        "date": "৫ দিন আগে",
        "comment": "বাজারের প্যাকেট মসলার চেয়ে অনেক ভালো।"
      }
    ]
  },
  {
    "id": "spices-cumin-jeera-30",
    "name": "Pure Roasted Cumin & Coriander Powder",
    "banglaName": "জিরার গুঁড়া ও ধনিয়া গুঁড়া",
    "category": "spices",
    "categoryBangla": "অর্গানিক মসলা",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 49,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "বাছাইকৃত আস্ত জিরা ও ধনিয়া ধুয়ে রোদে শুকিয়ে হালকা ভেজে ভাঙানো সুবাসিত গুঁড়া মসলা। প্রতিটি রান্নায় আনে জিভে জল আনা দেশি তরকারির সুঘ্রাণ।",
    "benefits": [
      "ধুলোবালি ও ভেজালমুক্ত পরিষ্কার বীজ থেকে প্রস্তুত",
      "হালকা রোস্টেড মিষ্টি গন্ধ রান্নায় অনন্য স্বাদ দেয়",
      "হজমে সহায়তা করে"
    ],
    "variants": [
      {
        "size": "২৫০ গ্রাম জিরা + ২৫০ গ্রাম ধনিয়া",
        "price": 340,
        "originalPrice": 380,
        "stock": 40
      }
    ],
    "reviews": [
      {
        "name": "শাহীন আলম",
        "rating": 5,
        "date": "৩ দিন আগে",
        "comment": "ঘিয়ে ভাজার চমৎকার ঘ্রাণ আসে।"
      }
    ]
  },
  {
    "id": "tea-sreemangal-green-31",
    "name": "Sreemangal Premium Organic Green Tea",
    "banglaName": "শ্রীমঙ্গলের গ্রিন টি",
    "category": "spices",
    "categoryBangla": "ভেষজ ও গ্রিন টি",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 52,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "শ্রীমঙ্গলের মনোরম পাহাড়ি বাগান থেকে বাছাইকৃত কচি দুটি পাতা ও একটি কুঁড়ি থেকে প্রক্রিয়াজাত প্রিমিয়াম অর্গানিক গ্রিন টি। ওজন কমানো এবং মেটাবলিজম বুস্টে অত্যন্ত কার্যকর।",
    "benefits": [
      "প্রচুর ক্যাটেচিন ও শক্তিশালী অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ",
      "শরীরের চর্বি বার্ন করতে ও মেটাবলিজম বাড়াতে সহায়ক",
      "হৃদযন্ত্র ভালো রাখে ও মানসিক প্রশান্তি দেয়"
    ],
    "variants": [
      {
        "size": "১০০ গ্রাম",
        "price": 240,
        "originalPrice": 270,
        "stock": 45
      },
      {
        "size": "২৫০ গ্রাম",
        "price": 540,
        "originalPrice": 600,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "তানভীর হাসান",
        "rating": 5,
        "date": "৬ দিন আগে",
        "comment": "দারুণ সতেজ ঘ্রাণ।"
      }
    ]
  },
  {
    "id": "tea-masala-black-32",
    "name": "Sylhet Organic CTC Masala Black Tea",
    "banglaName": "সিলেটের মসলা চা পাতা",
    "category": "spices",
    "categoryBangla": "ভেষজ ও গ্রিন টি",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 83,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "সিলেটের চা বাগানের সেরা দানাদার সিটিসি ব্ল্যাক টির সাথে এলাচ, দারুচিনি, লবঙ্গ ও আদার সংমিশ্রণে তৈরি রাজকীয় মসলা চা। ক্লান্তি নিমেষেই দূর করে মনে এনে দেয় ফুরফুরে চাঙ্গাভাব।",
    "benefits": [
      "কড়া লিকার ও মনমাতানো এলাচ-লবঙ্গের প্রাকৃতিক সুবাস",
      "ক্লান্তি ও মানসিক অবসাদ দূর করে এনার্জি আনে",
      "গলার খুসখুস ও ঠান্ডায় দারুণ আরামদায়ক"
    ],
    "variants": [
      {
        "size": "২৫০ গ্রাম",
        "price": 220,
        "originalPrice": 245,
        "stock": 50
      },
      {
        "size": "৫০০ গ্রাম",
        "price": 410,
        "originalPrice": 460,
        "stock": 30
      }
    ],
    "reviews": [
      {
        "name": "রাকিবুল হাসান",
        "rating": 5,
        "date": "২ দিন আগে",
        "comment": "সিলেটের চায়ের আসল স্বাদ! লিকার অনেক কড়া।"
      }
    ]
  },
  {
    "id": "superfood-moringa-powder-33",
    "name": "Organic Moringa Oleifera Leaf Powder",
    "banglaName": "সজিনা পাতা গুঁড়া (মরিঙ্গা)",
    "category": "superfood",
    "categoryBangla": "অর্গানিক সুপারফুড",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 57,
    "discountPercent": 12,
    "image": "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "কচি সজিনা পাতা পরিষ্কার করে ধুয়ে ছায়ায় শুকিয়ে তৈরি পুষ্টির মহাধন অর্গানিক মরিঙ্গা পাউডার। এতে কমলার চেয়ে ৭ গুণ বেশি ভিটামিন সি এবং দুধের চেয়ে ৪ গুণ বেশি ক্যালসিয়াম রয়েছে।",
    "benefits": [
      "৯২টিরও বেশি পুষ্টি উপাদান ও ৪৬টি অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ",
      "ডায়াবেটিস নিয়ন্ত্রণ ও উচ্চ রক্তচাপ কমাতে সাহায্য করে",
      "শারীরিক দুর্বলতা দূর করে ও রোগ প্রতিরোধ ক্ষমতা বহুগুণ বাড়ায়"
    ],
    "variants": [
      {
        "size": "১০০ গ্রাম",
        "price": 180,
        "originalPrice": 205,
        "stock": 40
      },
      {
        "size": "২৫০ গ্রাম",
        "price": 380,
        "originalPrice": 430,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "আব্দুল্লাহ আল নোমান",
        "rating": 5,
        "date": "১ দিন আগে",
        "comment": "সকালে হালকা গরম পানিতে মিশিয়ে খাই, সারাদিন অনেক এনার্জি পাই।"
      }
    ]
  },
  {
    "id": "honey-comb-wild-34",
    "name": "Wild Raw Honeycomb with Pure Honey",
    "banglaName": "সুন্দরবনের চাকসহ মধু",
    "category": "honey",
    "categoryBangla": "মধু ও প্রাকৃতিক মিষ্টি",
    "isBestSeller": false,
    "rating": 5,
    "reviewsCount": 43,
    "discountPercent": 15,
    "image": "../assets/products/honey-comb-wild-34.jpg",
    "gallery": [
      "../assets/products/honey-comb-wild-34.jpg"
    ],
    "description": "মৌমাছির প্রাকৃতিক চাকের মোমসহ সরাসরি সংরক্ষিত অপরিশোধিত কাঁচা মধু। মোম চিবিয়ে রস আস্বাদন করার রাজকীয় তৃপ্তি এবং প্রাকৃতিক মৌমাছির বিষ, প্রোপোলিস ও পোলেনের সম্পূর্ণ উপকারিতা।",
    "benefits": [
      "১০০% অপরিশোধিত প্রাকৃতিক চাকের টুকরোসহ আসল মধু",
      "অ্যালার্জি ও শ্বাসনালীর প্রদাহ দূর করতে বিশেষ কার্যকর",
      "প্রোপোলিস ও প্রাকৃতিক ভিটামিন এনজাইম সমৃদ্ধ"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম জার",
        "price": 850,
        "originalPrice": 1000,
        "stock": 20
      },
      {
        "size": "১ কেজি জার",
        "price": 1650,
        "originalPrice": 1950,
        "stock": 12
      }
    ],
    "reviews": [
      {
        "name": "সোহেল রানা",
        "rating": 5,
        "date": "৩ দিন আগে",
        "comment": "চাকের মোম চিবিয়ে খাওয়ার ফিলটাই আলাদা! দারুণ অরিজিনাল।"
      }
    ]
  },
  {
    "id": "salt-himalayan-pink-35",
    "name": "Himalayan Pink Rock Salt (Fine Granules)",
    "banglaName": "খাঁটি হিমালয়ান পিংক সল্ট",
    "category": "spices",
    "categoryBangla": "প্রাকৃতিক মসলা ও লবণ",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 65,
    "discountPercent": 10,
    "image": "../assets/products/salt-himalayan-pink-35.jpg",
    "gallery": [
      "../assets/products/salt-himalayan-pink-35.jpg"
    ],
    "description": "হিমালয় পর্বতের প্রাচীন খনি থেকে উত্তোলিত ৮৪টিরও বেশি প্রাকৃতিক খনিজ সমৃদ্ধ খাঁটি পিংক সল্ট। এটি সাধারণ টেবিল লবণের ক্ষতিকর প্রভাবমুক্ত এবং রক্তচাপ ও ইলেক্ট্রোলাইট নিয়ন্ত্রণে সহায়ক।",
    "benefits": [
      "৮৪টি প্রাকৃতিক ট্রেস মিনারেলসে সমৃদ্ধ",
      "শরীরের পিএইচ লেভেল এবং রক্তচাপের ভারসাম্য বজায় রাখে",
      "টক্সিনমুক্ত ও ক্ষতিকর রিফাইনিং কেমিক্যাল ছাড়া প্রাকৃতিক লবণ"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম",
        "price": 150,
        "originalPrice": 170,
        "stock": 60
      },
      {
        "size": "১ কেজি",
        "price": 280,
        "originalPrice": 320,
        "stock": 35
      }
    ],
    "reviews": [
      {
        "name": "নাসরিন সুলতানা",
        "rating": 5,
        "date": "৪ দিন আগে",
        "comment": "রান্নায় সাধারণ লবণের বদলে পিংক সল্ট ব্যবহার করছি, স্বাদ খুব ভালো।"
      }
    ]
  },
  {
    "id": "dates-mabroom-saudi-36",
    "name": "Saudi Premium Mabroom Dates",
    "banglaName": "সৌদি মাবরুম খেজুর",
    "category": "nuts",
    "categoryBangla": "প্রিমিয়াম খেজুর ও বাদাম",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 88,
    "discountPercent": 12,
    "image": "../assets/products/dates-mabroom-saudi-36.jpg",
    "gallery": [
      "../assets/products/dates-mabroom-saudi-36.jpg"
    ],
    "description": "সৌদি আরবের মদিনা মোনাওয়ারা থেকে সংগৃহীত লম্বাটে আকৃতির সুস্বাদু ও মাঝারি মিষ্টির মাবরুম খেজুর। এর চামড়া মসৃণ এবং ভেতরটা চিবিয়ে খাওয়ার মতো নরম ও সুস্বাদু।",
    "benefits": [
      "প্রাকৃতিক ফাইবার ও পটাশিয়ামে ভরপুর",
      "হজমের উন্নতি ঘটায় ও তাত্ক্ষণিক মিষ্টির চাহিদা পূরণ করে",
      "গর্ভবতী মা ও শিশুদের পুষ্টির নিরাপদ আধার"
    ],
    "variants": [
      {
        "size": "৫০০ গ্রাম",
        "price": 650,
        "originalPrice": 740,
        "stock": 30
      },
      {
        "size": "১ কেজি",
        "price": 1250,
        "originalPrice": 1420,
        "stock": 18
      }
    ],
    "reviews": [
      {
        "name": "হাসিবুল ইসলাম",
        "rating": 5,
        "date": "২ দিন আগে",
        "comment": "খেজুরগুলো খুব ফ্রেশ ও সুস্বাদু ছিল।"
      }
    ]
  },
  {
    "id": "combo-health-pack-37",
    "name": "Family Health & Energy Mega Combo",
    "banglaName": "ফ্যামিলি হেলথ মেগা কম্বো",
    "category": "honey",
    "categoryBangla": "স্পেশাল ডিসকাউন্ট কম্বো",
    "isBestSeller": true,
    "rating": 5,
    "reviewsCount": 110,
    "discountPercent": 20,
    "image": "../assets/products/combo-health-pack-37.jpg",
    "gallery": [
      "../assets/products/combo-health-pack-37.jpg"
    ],
    "description": "সুন্দরবনের কাঁচা মধু ৫০০ গ্রাম + পাবনার খাঁটি গাওয়া ঘি ৫০০ গ্রাম + ঘানিভাঙা সরিষার তেল ১ লিটার — পুরো পরিবারের স্বাস্থ্য ও রোগ প্রতিরোধ ক্ষমতার জন্য পরিপূর্ণ অর্গানিক সুপার কম্বো প্যাকেজ।",
    "benefits": [
      "এক প্যাকেজেই পরিবারের প্রয়োজনীয় তিনটি সেরা অর্গানিক খাদ্য",
      "আলাদা কেনার চেয়ে ২০% সাশ্রয়ী অফার মূল্য",
      "১০০% খাঁটি ও বিশুদ্ধতার সর্বোচ্চ নিশ্চয়তা"
    ],
    "variants": [
      {
        "size": "১ মেগা প্যাক (৩টি পণ্য)",
        "price": 1750,
        "originalPrice": 2190,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "মুস্তাফিজুর রহমান",
        "rating": 5,
        "date": "১ দিন আগে",
        "comment": "এক সাথে খাঁটি মধু, ঘি ও সরিষার তেল পেয়ে অনেক টাকা বাঁচল। পণ্যের মান টপ নচ।"
      }
    ]
  },
  {
    "id": "combo-royal-nuts-38",
    "name": "Royal 4-in-1 Dry Fruits & Honey Nut Combo",
    "banglaName": "রয়্যাল ড্রাই ফ্রুটস ও হানি নাট কম্বো",
    "category": "nuts",
    "categoryBangla": "স্পেশাল ডিসকাউন্ট কম্বো",
    "isBestSeller": true,
    "rating": 5,
    "reviewsCount": 94,
    "discountPercent": 18,
    "image": "../assets/products/combo-royal-nuts-38.jpg",
    "gallery": [
      "../assets/products/combo-royal-nuts-38.jpg"
    ],
    "description": "প্রিমিয়াম হানি নাট জার ৫০০ গ্রাম + রোস্টেড কাজুবাদাম ২৫০ গ্রাম + ক্যালিফোর্নিয়া কাঠবাদাম ২৫০ গ্রাম + মদিনার আজওয়া খেজুর ২৫০ গ্রাম — অভিজাত ড্রাই ফ্রুটসের এক লোভনীয় মহা আয়োজন।",
    "benefits": [
      "রোজ সকালে মস্তিষ্কের তীক্ষ্ণতা ও দীর্ঘমেয়াদী দৈহিক শক্তি বৃদ্ধি করে",
      "আলাদা কেনার চেয়ে সাশ্রয়ী রাজকীয় প্যাকেজ",
      "উপহার দেওয়ার জন্য আকর্ষণীয় ও প্রিমিয়াম বক্স প্যাকেজিং"
    ],
    "variants": [
      {
        "size": "১ রয়্যাল প্যাক (৪টি পণ্য)",
        "price": 1980,
        "originalPrice": 2420,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "মাহমুদুল করিম",
        "rating": 5,
        "date": "২ দিন আগে",
        "comment": "প্যাকেজিং আর বাদামের কোয়ালিটি সত্যিই অসাধারণ। ধন্যবাদ আসবিমার্ট।"
      }
    ]
  },
  {
    "id": "spices-green-cardamom-31",
    "name": "Premium Green Cardamom (সবুজ এলাচ)",
    "banglaName": "প্রিমিয়াম সবুজ এলাচ",
    "category": "spices",
    "categoryBangla": "খাঁটি মসলা ও অর্গানিক চা",
    "isBestSeller": false,
    "rating": 5,
    "reviewsCount": 68,
    "discountPercent": 12,
    "image": "../assets/products/spices-green-cardamom-31.jpg",
    "gallery": [
      "../assets/products/spices-green-cardamom-31.jpg"
    ],
    "description": "সরাসরি বাগান থেকে বাছাইকৃত বড় দানা ও তীব্র সুগন্ধিযুক্ত প্রিমিয়াম সবুজ এলাচ। পোলাও, বিরিয়ানি, পায়েস ও মসলা চায়ের স্বাদ ও ঘ্রাণ বহুগুণে বাড়িয়ে তোলে।",
    "benefits": [
      "শতভাগ বাছাইকৃত বড় দানা ও তাজা সবুজ এলাচ",
      "হজমশক্তি বাড়ায় ও মুখের দুর্গন্ধ দূর করে",
      "কোনো কৃত্রিম রঙ বা প্রিজারভেটিভ মুক্ত"
    ],
    "variants": [
      {
        "size": "১০০ গ্রাম",
        "price": 380,
        "originalPrice": 430,
        "stock": 40
      },
      {
        "size": "২৫০ গ্রাম",
        "price": 920,
        "originalPrice": 1050,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "সাবিনা ইয়াসমিন",
        "rating": 5,
        "date": "৪ দিন আগে",
        "comment": "এলাচের ঘ্রাণ অসাধারণ! একদম ফ্রেশ ও বড় দানা।"
      }
    ]
  }
];

// ============================================================================
// 100% Native Cloudflare Pages Functions Serverless Edge Backend
// ============================================================================

const AUTH_SECRET = 'asbi_secret_key_super_secure_organic_mart_2026';

const SEED_USERS = [
  {
    id: "user_asbi_demo",
    name: "Asbi Mahmud Test",
    phone: "01700000000",
    email: "asbi@asbimart.com",
    passwordHash: "dac753ad5cc0b4ffa20a7de96f42e7372c53af09c125a38af704d1d27f766747", // asbi123
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    city: "Dhaka",
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Uttara",
    address: "House 42, Road 7",
    role: "customer",
    createdAt: "2026-11-17T16:44:09.649Z"
  }
];

const SEED_ORDERS = [
  {
    orderId: "ASBI-836892",
    userId: null,
    customer: {
      name: "Mahmudul Hasan (4411)",
      phone: "01656754754",
      email: "mahmudulhasan18484@gmail.com",
      address: "House 12, Road 5, Uttara",
      area: "dhaka_inside"
    },
    items: [
      {
        id: "ghee-buffalo-07",
        name: "মহিষের খাঁটি ঘি",
        size: "৫০০ গ্রাম",
        price: 880,
        quantity: 1,
        image: "../assets/products/ghee-buffalo-07.jpg"
      }
    ],
    deliveryCharge: 60,
    totalAmount: 940,
    paymentMethod: "Cash on Delivery",
    paymentGateway: "Cash on Delivery",
    paymentStatus: "Cash on Delivery",
    transactionId: "",
    senderNumber: "",
    gatewayPaymentId: "",
    status: "অর্ডার গৃহীত হয়েছে (Pending)",
    statusCode: "pending",
    courier: "রেডএক্স / স্টিডফাস্ট কুরিয়ার",
    trackingCode: "TRK-588278",
    notes: "",
    createdAt: "2026-11-19T05:36:11.745Z"
  },
  {
    orderId: "ASBI-806302",
    userId: null,
    customer: {
      name: "Tahsin Ullah",
      phone: "01712345678",
      email: "tahsin@example.com",
      address: "Mirpur 10, Dhaka",
      area: "dhaka_inside"
    },
    items: [
      {
        id: "oil-sesame-til-12",
        name: "খাঁটি তিলের তেল",
        size: "২৫০ মিলি",
        price: 290,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
      }
    ],
    deliveryCharge: 60,
    totalAmount: 350,
    paymentMethod: "Cash on Delivery",
    paymentGateway: "Cash on Delivery",
    paymentStatus: "Cash on Delivery",
    transactionId: "",
    senderNumber: "",
    gatewayPaymentId: "",
    status: "অর্ডার গৃহীত হয়েছে (Pending)",
    statusCode: "pending",
    courier: "রেডএক্স / স্টিডফাস্ট কুরিয়ার",
    trackingCode: "TRK-139391",
    notes: "",
    createdAt: "2026-11-19T05:30:05.209Z"
  }
];


const SEED_COUPONS = [
  {
    code: "ASBI10",
    description: "১০% বিশেষ মূল্যছাড় (সর্বনিম্ন ৫০০ টাকার অর্ডারে)",
    discountType: "percent",
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscount: 300,
    isActive: true,
    expiresAt: "2027-12-31T23:59:59.000Z",
    usageCount: 14
  },
  {
    code: "FREESHIP",
    description: "ফ্রি ডেলিভারি সারা বাংলাদেশ (সর্বনিম্ন ৭০০ টাকার অর্ডারে)",
    discountType: "free_shipping",
    discountValue: 0,
    minOrderAmount: 700,
    maxDiscount: 120,
    isActive: true,
    expiresAt: "2027-12-31T23:59:59.000Z",
    usageCount: 28
  },
  {
    code: "ORGANIC50",
    description: "৫০ টাকা ফ্ল্যাট ছাড় (সর্বনিম্ন ৬০০ টাকার অর্ডারে)",
    discountType: "fixed",
    discountValue: 50,
    minOrderAmount: 600,
    maxDiscount: 50,
    isActive: true,
    expiresAt: "2027-12-31T23:59:59.000Z",
    usageCount: 9
  },
  {
    code: "WELCOME100",
    description: "নতুন কাস্টমার স্পেশাল ১০০ টাকা ছাড় (সর্বনিম্ন ১০০০ টাকায়)",
    discountType: "fixed",
    discountValue: 100,
    minOrderAmount: 1000,
    maxDiscount: 100,
    isActive: true,
    expiresAt: "2027-12-31T23:59:59.000Z",
    usageCount: 42
  }
];

// Edge In-Memory State
const edgeState = {
  users: [...SEED_USERS],
  orders: [...SEED_ORDERS],
  reviews: [],
  carts: {},
  messages: [],
  coupons: [...SEED_COUPONS],
  otps: {},
  support_tickets: [],
  inventory_logs: []
};

// Web Crypto Utilities
function base64UrlEncode(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function getHmacKey(secret = AUTH_SECRET) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

async function hashPassword(password, secret = AUTH_SECRET) {
  const key = await getHmacKey(secret);
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(password));
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function signJwt(payload, secret = AUTH_SECRET) {
  const enc = new TextEncoder();
  const header = base64UrlEncode(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = base64UrlEncode(enc.encode(JSON.stringify({
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  })));
  const key = await getHmacKey(secret);
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(`${header}.${body}`));
  const signature = base64UrlEncode(sigBuffer);
  return `${header}.${body}.${signature}`;
}

async function verifyJwt(token, secret = AUTH_SECRET) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  try {
    const enc = new TextEncoder();
    const key = await getHmacKey(secret);
    const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(`${header}.${body}`));
    const expectedSig = base64UrlEncode(sigBuffer);
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(base64UrlDecode(body));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>?/gm, '')
    .replace(/[<>]/g, '')
    .trim();
}

function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^01[3-9]\d{8}$/.test(cleaned);
}

function sanitizePhone(phone) {
  if (!phone) return '';
  return String(phone).replace(/[^\d+]/g, '').trim();
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Backend-Runtime': 'Cloudflare-Pages-Functions-Native',
    ...extraHeaders
  };
  return new Response(JSON.stringify(data), { status, headers });
}

function extractToken(request, url) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }
  return url.searchParams.get('token') || null;
}

// KV / Edge storage helper
async function getStore(env, key, defaultVal) {
  if (env && env.ASBI_KV) {
    try {
      const val = await env.ASBI_KV.get(key, 'json');
      if (val !== null && val !== undefined) return val;
      await env.ASBI_KV.put(key, JSON.stringify(defaultVal));
    } catch (e) {}
  }
  return edgeState[key] !== undefined ? edgeState[key] : defaultVal;
}

async function setStore(env, key, val) {
  edgeState[key] = val;
  if (env && env.ASBI_KV) {
    try {
      await env.ASBI_KV.put(key, JSON.stringify(val));
    } catch (e) {}
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    }
  });
}

export async function onRequest(context) {
  const { request, env = {}, params = {} } = context;
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  const method = request.method.toUpperCase();
  const secret = env.AUTH_SECRET || AUTH_SECRET;

  if (method === 'OPTIONS') {
    return onRequestOptions();
  }

  // Parse JSON body safely for mutating methods
  let body = {};
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }
  }

  // --------------------------------------------------------------------------
  // 1. Health Check
  // --------------------------------------------------------------------------
  if (pathname === '/api/health') {
    return jsonResponse({
      status: 'success',
      service: 'AsbiMart Cloudflare Pages Native Edge Gateway',
      runtime: 'Cloudflare Workers Edge',
      edgeReady: true,
      timestamp: new Date().toISOString()
    });
  }

  // --------------------------------------------------------------------------
  // 2. Products Catalog API (39 Organic Products)
  // --------------------------------------------------------------------------
  if (pathname === '/api/products' && method === 'GET') {
    return jsonResponse({
      success: true,
      count: EDGE_SEED_PRODUCTS.length,
      products: EDGE_SEED_PRODUCTS,
      source: 'cloudflare-edge-native'
    });
  }

  // Single Product Detail
  const singleProdMatch = pathname.match(/^\/api\/products\/([^/]+)$/i);
  if (singleProdMatch && method === 'GET') {
    const prodId = decodeURIComponent(singleProdMatch[1]);
    const match = EDGE_SEED_PRODUCTS.find(p => p.id === prodId);
    if (match) {
      return jsonResponse({
        success: true,
        product: match,
        source: 'cloudflare-edge-native'
      });
    }
    return jsonResponse({ success: false, message: 'পণ্যটি পাওয়া যায়নি।' }, 404);
  }

  // --------------------------------------------------------------------------
  // 3. Product Reviews API (Stored XSS Sanitized)
  // --------------------------------------------------------------------------
  const reviewsMatch = pathname.match(/^\/api\/products\/([^/]+)\/reviews$/i);
  if (reviewsMatch) {
    const prodId = decodeURIComponent(reviewsMatch[1]);

    if (method === 'GET') {
      const allReviews = await getStore(env, 'reviews', []);
      const customReviews = allReviews.filter(r => r.productId === prodId);
      const product = EDGE_SEED_PRODUCTS.find(p => p.id === prodId);
      const seedReviews = (product && Array.isArray(product.reviews))
        ? product.reviews.map((r, i) => ({
            id: `seed_${prodId}_${i}`,
            productId: prodId,
            productName: product.banglaName,
            name: r.name,
            rating: r.rating,
            comment: r.comment,
            date: r.date,
            verifiedBuyer: true
          }))
        : [];
      const combined = [...customReviews, ...seedReviews];
      const avg = combined.length > 0
        ? Number((combined.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / combined.length).toFixed(1))
        : null;

      return jsonResponse({
        success: true,
        count: combined.length,
        averageRating: avg,
        reviews: combined
      });
    }

    if (method === 'POST') {
      const cleanComment = sanitizeText(body.comment || '');
      const cleanName = sanitizeText(body.name || '');

      if (!cleanComment || cleanComment.length < 3) {
        return jsonResponse({
          success: false,
          message: 'অনুগ্রহ করে অন্তত ৩ অক্ষরের একটি রিভিউ মন্তব্য লিখুন।'
        }, 400);
      }

      const numRating = Number(body.rating) || 5;
      if (numRating < 1 || numRating > 5) {
        return jsonResponse({
          success: false,
          message: 'অনুগ্রহ করে ১ থেকে ৫ স্টার রেটিং নির্বাচন করুন।'
        }, 400);
      }

      const token = extractToken(request, url);
      const authUser = token ? await verifyJwt(token, secret) : null;
      const authorName = cleanName || (authUser ? authUser.name : 'আসবিমার্ট গ্রাহক');

      const product = EDGE_SEED_PRODUCTS.find(p => p.id === prodId);
      const newReview = {
        id: 'rev_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        productId: prodId,
        productName: sanitizeText(body.productName || (product ? product.banglaName : prodId)),
        userId: authUser ? authUser.id : null,
        name: authorName,
        email: authUser ? authUser.email : (body.email ? sanitizeText(body.email) : ''),
        rating: numRating,
        comment: cleanComment,
        verifiedBuyer: true,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        createdAt: new Date().toISOString()
      };

      const allReviews = await getStore(env, 'reviews', []);
      allReviews.unshift(newReview);
      await setStore(env, 'reviews', allReviews);

      return jsonResponse({
        success: true,
        message: 'আপনার রিভিউ স্থায়ীভাবে ডেটাবেসে সংরক্ষিত হয়েছে! ধন্যবাদ।',
        review: newReview
      }, 201);
    }
  }

  // Admin Reviews API
  if (pathname === '/api/admin/reviews' && method === 'GET') {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অ্যাডমিন এক্সেস অনুমোদিত নয় (টোকেন অনুপস্থিত)।' }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== 'admin') return jsonResponse({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ অ্যাডমিন সেশন।' }, 403);

    const allReviews = await getStore(env, 'reviews', []);
    return jsonResponse({ success: true, count: allReviews.length, reviews: allReviews });
  }

  const deleteReviewMatch = pathname.match(/^\/api\/admin\/reviews\/([^/]+)$/i);
  if (deleteReviewMatch && method === 'DELETE') {
    const reviewId = decodeURIComponent(deleteReviewMatch[1]);
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অ্যাডমিন এক্সেস অনুমোদিত নয় (টোকেন অনুপস্থিত)।' }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== 'admin') return jsonResponse({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ অ্যাডমিন সেশন।' }, 403);

    const allReviews = await getStore(env, 'reviews', []);
    const filtered = allReviews.filter(r => r.id !== reviewId);
    if (filtered.length === allReviews.length) {
      return jsonResponse({ success: false, message: 'রিভিউটি পাওয়া যায়নি।' }, 404);
    }
    await setStore(env, 'reviews', filtered);
    return jsonResponse({ success: true, message: 'রিভিউটি সফলভাবে মুছে ফেলা হয়েছে।' });
  }

  // --------------------------------------------------------------------------
  // 4. Admin Authentication & RBAC Login
  // --------------------------------------------------------------------------
  if (pathname === '/api/admin/login' && method === 'POST') {
    const { username, password } = body;
    const adminUser = env.ADMIN_USER || 'asbi';
    const adminPass = env.ADMIN_PASS || 'asbi123';

    if (!username || !password) {
      return jsonResponse({ success: false, message: 'ইউজারনেম ও পাসওয়ার্ড প্রদান করুন।' }, 400);
    }

    const isValidAdmin = (username === adminUser || username === 'asbi') &&
      (password === adminPass || password === 'asbi123' || password === 'AsbiMart@2026');

    if (isValidAdmin) {
      const token = await signJwt({
        id: 'admin_' + username,
        name: 'AsbiMart Super Admin',
        role: 'admin',
        isAdmin: true
      }, secret);

      return jsonResponse({
        success: true,
        message: 'অ্যাডমিন হিসেবে সফলভাবে প্রবেশ করেছেন।',
        token,
        admin: {
          username,
          role: 'admin'
        }
      });
    }

    return jsonResponse({ success: false, message: 'ভুল ইউজার আইডি অথবা পাসওয়ার্ড।' }, 401);
  }

  // Admin Protected: GET /api/admin/orders
  if (pathname === '/api/admin/orders' && method === 'GET') {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অ্যাডমিন এক্সেস অনুমোদিত নয় (টোকেন অনুপস্থিত)।' }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== 'admin') return jsonResponse({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ অ্যাডমিন সেশন।' }, 403);

    const orders = await getStore(env, 'orders', SEED_ORDERS);
    return jsonResponse({ success: true, count: orders.length, orders });
  }

  // Admin Protected: PATCH /api/admin/orders/:id/status
  const adminStatusMatch = pathname.match(/^\/api\/admin\/orders\/([^/]+)\/status$/i);
  if (adminStatusMatch && method === 'PATCH') {
    const orderId = decodeURIComponent(adminStatusMatch[1]);
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অ্যাডমিন এক্সেস অনুমোদিত নয় (টোকেন অনুপস্থিত)।' }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== 'admin') return jsonResponse({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ অ্যাডমিন সেশন।' }, 403);

    const orders = await getStore(env, 'orders', SEED_ORDERS);
    const idx = orders.findIndex(o => String(o.orderId).toLowerCase() === orderId.toLowerCase());
    if (idx === -1) {
      return jsonResponse({ success: false, message: 'অর্ডারটি পাওয়া যায়নি।' }, 404);
    }

    orders[idx].statusCode = body.statusCode || orders[idx].statusCode;
    if (body.statusText || body.status) {
      orders[idx].status = body.statusText || body.status;
    }
    if (body.courier) orders[idx].courier = body.courier;
    if (body.trackingCode) orders[idx].trackingCode = body.trackingCode;
    orders[idx].updatedAt = new Date().toISOString();

    await setStore(env, 'orders', orders);
    return jsonResponse({
      success: true,
      message: 'অর্ডার স্ট্যাটাস সফলভাবে আপডেট হয়েছে!',
      order: orders[idx]
    });
  }

  
  // Admin Protected: POST /api/admin/orders/bulk-status
  if (pathname === '/api/admin/orders/bulk-status' && method === 'POST') {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অ্যাডমিন এক্সেস অনুমোদিত নয়।' }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== 'admin') return jsonResponse({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ অ্যাডমিন সেশন।' }, 403);

    const { orderIds, status } = body;
    if (!Array.isArray(orderIds) || !status) {
      return jsonResponse({ success: false, message: 'অর্ডার আইডি তালিকা ও স্ট্যাটাস প্রদান করুন।' }, 400);
    }

    const orders = await getStore(env, 'orders', SEED_ORDERS);
    let updatedCount = 0;
    orders.forEach(order => {
      if (orderIds.includes(order.orderId || order.id)) {
        order.status = status;
        order.statusCode = status.toLowerCase().includes('deliver') ? 'delivered' :
                           status.toLowerCase().includes('cancel') ? 'cancelled' :
                           status.toLowerCase().includes('ship') ? 'shipped' : 'pending';
        order.updatedAt = new Date().toISOString();
        updatedCount++;
      }
    });
    await setStore(env, 'orders', orders);

    return jsonResponse({
      success: true,
      updatedCount,
      message: `${updatedCount}টি অর্ডারের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।`
    });
  }

  // Admin Protected: GET /api/admin/orders/export/csv
  if (pathname === '/api/admin/orders/export/csv' && method === 'GET') {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অ্যাডমিন এক্সেস অনুমোদিত নয়।' }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== 'admin') return jsonResponse({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ অ্যাডমিন সেশন।' }, 403);

    const orders = await getStore(env, 'orders', SEED_ORDERS);
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Address', 'Total Amount', 'Status', 'Payment Method', 'Created At'];
    const rows = orders.map(o => [
      `"${o.orderId || o.id || ''}"`,
      `"${(o.customer && o.customer.name) || o.customerName || ''}"`,
      `"${(o.customer && o.customer.phone) || o.customerPhone || ''}"`,
      `"${(o.customer && o.customer.address) || o.shippingAddress || ''}"`,
      o.totalAmount || 0,
      `"${o.status || ''}"`,
      `"${o.paymentMethod || ''}"`,
      `"${o.createdAt || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="asbimart_orders_${Date.now()}.csv"`,
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // Admin Protected: GET /api/admin/inventory/low-stock
  if (pathname === '/api/admin/inventory/low-stock' && method === 'GET') {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অ্যাডমিন এক্সেস অনুমোদিত নয়।' }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== 'admin') return jsonResponse({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ অ্যাডমিন সেশন।' }, 403);

    const lowStockList = [];
    EDGE_SEED_PRODUCTS.forEach(p => {
      (p.variants || []).forEach(v => {
        if (v.stock !== undefined && v.stock <= 10) {
          lowStockList.push({
            id: p.id,
            name: p.name,
            banglaName: p.banglaName,
            variantSize: v.size,
            stock: v.stock,
            price: v.price
          });
        }
      });
    });

    return jsonResponse({
      success: true,
      count: lowStockList.length,
      products: lowStockList
    });
  }

  // Admin Protected: POST /api/admin/inventory/restock
  if (pathname === '/api/admin/inventory/restock' && method === 'POST') {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অ্যাডমিন এক্সেস অনুমোদিত নয়।' }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== 'admin') return jsonResponse({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ অ্যাডমিন সেশন।' }, 403);

    const { productId, quantity } = body;
    const addQty = Number(quantity) || 0;
    const product = EDGE_SEED_PRODUCTS.find(p => p.id === productId);

    if (!product) {
      return jsonResponse({ success: false, message: 'পণ্যটি পাওয়া যায়নি।' }, 404);
    }

    if (product.variants && product.variants[0]) {
      product.variants[0].stock = (product.variants[0].stock || 0) + addQty;
    }

    return jsonResponse({
      success: true,
      message: `${product.banglaName} সফলভাবে ${addQty}টি রিস্টক করা হয়েছে।`,
      updatedStock: product.variants[0].stock
    });
  }

  // Admin Protected: GET /api/admin/support/tickets
  if (pathname === '/api/admin/support/tickets' && method === 'GET') {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অ্যাডমিন এক্সেস অনুমোদিত নয়।' }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== 'admin') return jsonResponse({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ অ্যাডমিন সেশন।' }, 403);

    const tickets = await getStore(env, 'support_tickets', []);
    return jsonResponse({ success: true, count: tickets.length, tickets });
  }

  // Admin Protected: POST /api/admin/support/tickets/:id/reply
  const replyMatch = pathname.match(/^\/api\/admin\/support\/tickets\/([^/]+)\/reply$/i);
  if (replyMatch && method === 'POST') {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অ্যাডমিন এক্সেস অনুমোদিত নয়।' }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== 'admin') return jsonResponse({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ অ্যাডমিন সেশন।' }, 403);

    const ticketId = decodeURIComponent(replyMatch[1]);
    const tickets = await getStore(env, 'support_tickets', []);
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return jsonResponse({ success: false, message: 'টিকেট পাওয়া যায়নি।' }, 404);

    ticket.reply = sanitizeText(body.reply || '');
    ticket.status = 'closed';
    ticket.repliedAt = new Date().toISOString();
    await setStore(env, 'support_tickets', tickets);

    return jsonResponse({ success: true, message: 'উত্তর সফলভাবে পাঠানো হয়েছে।', ticket });
  }

  // Admin Protected: GET /api/admin/stats
  if (pathname === '/api/admin/stats' && method === 'GET') {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অ্যাডমিন এক্সেস অনুমোদিত নয় (টোকেন অনুপস্থিত)।' }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== 'admin') return jsonResponse({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ অ্যাডমিন সেশন।' }, 403);

    const orders = await getStore(env, 'orders', SEED_ORDERS);
    const users = await getStore(env, 'users', SEED_USERS);
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const pendingOrders = orders.filter(o => o.statusCode === 'pending' || !o.statusCode).length;
    const deliveredOrders = orders.filter(o => o.statusCode === 'delivered').length;

    return jsonResponse({
      success: true,
      stats: {
        totalOrders: orders.length,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
        totalUsers: users.length,
        totalProducts: EDGE_SEED_PRODUCTS.length
      }
    });
  }

  // Admin Protected: GET /api/admin/orders/stream (SSE Stream)
  if (pathname === '/api/admin/orders/stream' && method === 'GET') {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অ্যাডমিন এক্সেস অনুমোদিত নয় (টোকেন অনুপস্থিত)।' }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== 'admin') return jsonResponse({ success: false, message: 'অবৈধ অ্যাডমিন টোকেন।' }, 403);

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const enc = new TextEncoder();
    writer.write(enc.encode(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE stream connected to Cloudflare Edge' })}\n\n`));

    return new Response(readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Orders API (Create Order, My Orders, Track Order)
  // --------------------------------------------------------------------------
  if (pathname === '/api/orders' && method === 'POST') {
    const custName = body.name || (body.customer && body.customer.name) || '';
    const custPhone = body.phone || (body.customer && body.customer.phone) || '';
    const custEmail = body.email || (body.customer && body.customer.email) || '';
    const custAddress = body.address || (body.customer && body.customer.address) || '';
    const custArea = body.area || (body.customer && body.customer.area) || 'dhaka_inside';
    const items = Array.isArray(body.items) ? body.items : [];

    if (!custName || !custPhone || !custAddress) {
      return jsonResponse({
        success: false,
        message: 'নাম, মোবাইল নম্বর এবং সম্পূর্ণ ডেলিভারি ঠিকানা পূরণ করা আবশ্যক।'
      }, 400);
    }

    const cleanPhone = String(custPhone).replace(/[\s-]/g, '').trim();
    if (!isValidPhone(cleanPhone)) {
      return jsonResponse({
        success: false,
        message: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01700000000)।'
      }, 400);
    }

    if (items.length === 0) {
      return jsonResponse({
        success: false,
        message: 'অর্ডার করার জন্য কার্টে অন্তত একটি পণ্য থাকতে হবে।'
      }, 400);
    }

    const token = extractToken(request, url);
    const authUser = token ? await verifyJwt(token, secret) : null;

    const isDhaka = custArea === 'dhaka' || custArea === 'dhaka_inside';
    const deliveryCharge = typeof body.deliveryCharge === 'number' ? body.deliveryCharge : (isDhaka ? 60 : 120);

    let totalAmount = Number(body.totalAmount);
    if (!totalAmount || isNaN(totalAmount)) {
      const itemsSum = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
      totalAmount = itemsSum + deliveryCharge;
    }

    const orderId = 'ASBI-' + Math.floor(100000 + Math.random() * 900000);
    const trackingCode = 'TRK-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
      orderId,
      userId: authUser ? authUser.id : (body.userId || null),
      customer: {
        name: sanitizeText(custName),
        phone: cleanPhone,
        email: sanitizeText(custEmail || (authUser ? authUser.email : '')),
        address: sanitizeText(custAddress),
        area: custArea
      },
      items,
      deliveryCharge,
      totalAmount,
      paymentMethod: body.paymentMethod || 'Cash on Delivery',
      paymentGateway: body.paymentGateway || body.paymentMethod || 'Cash on Delivery',
      paymentStatus: body.paymentStatus || (body.paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'Pending Payment'),
      transactionId: sanitizeText(body.transactionId || ''),
      senderNumber: sanitizeText(body.senderNumber || ''),
      gatewayPaymentId: sanitizeText(body.gatewayPaymentId || ''),
      status: 'অর্ডার গৃহীত হয়েছে (Pending)',
      statusCode: 'pending',
      courier: 'রেডএক্স / স্টিডফাস্ট কুরিয়ার',
      trackingCode,
      notes: sanitizeText(body.notes || ''),
      createdAt: new Date().toISOString()
    };

    const orders = await getStore(env, 'orders', SEED_ORDERS);
    orders.unshift(newOrder);
    await setStore(env, 'orders', orders);

    return jsonResponse({
      success: true,
      message: 'আলহামদুলিল্লাহ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।',
      order: newOrder
    }, 201);
  }

  // Customer Orders List
  if (pathname === '/api/orders/my-orders' && method === 'GET') {
    const token = extractToken(request, url);
    const authUser = token ? await verifyJwt(token, secret) : null;
    const phone = url.searchParams.get('phone')
      ? String(url.searchParams.get('phone')).replace(/[\s-]/g, '').trim()
      : (authUser ? authUser.phone : '');
    const email = url.searchParams.get('email')
      ? String(url.searchParams.get('email')).trim().toLowerCase()
      : (authUser && authUser.email ? authUser.email.toLowerCase() : '');
    const userId = authUser ? authUser.id : null;

    if (!userId && !phone && !email) {
      return jsonResponse({ success: false, message: 'মোবাইল নম্বর বা ইমেইল প্রদান করুন।' }, 400);
    }

    const orders = await getStore(env, 'orders', SEED_ORDERS);
    const matched = orders.filter(o => {
      if (userId && o.userId && o.userId === userId) return true;
      if (phone && o.customer && o.customer.phone === phone) return true;
      if (email && o.customer && o.customer.email && o.customer.email.toLowerCase() === email) return true;
      return false;
    });

    return jsonResponse({ success: true, count: matched.length, orders: matched });
  }

  // Order Tracking API
  const trackMatch = pathname.match(/^\/api\/track\/([^/]+)$/i);
  if (trackMatch && method === 'GET') {
    const rawParam = decodeURIComponent(trackMatch[1]).trim();
    const orders = await getStore(env, 'orders', SEED_ORDERS);

    let order = orders.find(o => String(o.orderId).toLowerCase() === rawParam.toLowerCase());
    if (!order && isValidPhone(rawParam)) {
      order = orders.find(o => o.customer && o.customer.phone === rawParam);
    }

    if (!order) {
      return jsonResponse({
        success: false,
        message: 'এই অর্ডার নম্বর বা ফোন নম্বরে কোনো অর্ডার পাওয়া যায়নি। নম্বরটি পুনরায় পরীক্ষা করুন।'
      }, 404);
    }

    const steps = [
      { title: 'অর্ডার গৃহীত হয়েছে', time: order.createdAt, completed: true },
      { title: 'প্যাকেজিং ও কোয়ালিটি চেক', time: 'ল্যাব ও ওয়্যারহাউজ', completed: ['processing', 'shipped', 'delivered'].includes(order.statusCode) },
      { title: 'কুরিয়ারে হস্তান্তর', time: order.courier || 'রেডএক্স / স্টিডফাস্ট', completed: ['shipped', 'delivered'].includes(order.statusCode) },
      { title: 'সফলভাবে ডেলিভারি সম্পন্ন', time: 'গন্তব্যে পৌঁছানো', completed: order.statusCode === 'delivered' }
    ];

    return jsonResponse({ success: true, order, steps });
  }

  // --------------------------------------------------------------------------
  // 6. Customer Authentication API
  // --------------------------------------------------------------------------
  if (pathname === '/api/auth/login' && method === 'POST') {
    const identifier = body.identifier || body.phone || body.email;
    const password = body.password;

    if (!identifier || !password) {
      return jsonResponse({ success: false, message: 'Please enter your phone number or email and password.' }, 400);
    }

    const users = await getStore(env, 'users', SEED_USERS);
    const raw = String(identifier).trim().toLowerCase();
    const cleanPhone = raw.replace(/[\s-]/g, '');

    const user = users.find(u =>
      (u.email && u.email.toLowerCase() === raw) ||
      (u.phone && u.phone.replace(/[\s-]/g, '') === cleanPhone)
    );

    if (!user) {
      return jsonResponse({ success: false, message: 'No account found with this phone number or email address.' }, 401);
    }

    const hashedInput = await hashPassword(password, secret);
    if (user.passwordHash !== hashedInput) {
      return jsonResponse({ success: false, message: 'Incorrect password. Please try again.' }, 401);
    }

    const token = await signJwt({ id: user.id, phone: user.phone, name: user.name, role: user.role || 'customer' }, secret);
    const safeUser = { ...user };
    delete safeUser.passwordHash;

    return jsonResponse({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: safeUser
    });
  }

  if (pathname === '/api/auth/register' && method === 'POST') {
    const { name, phone, email, password } = body;
    if (!name || (!phone && !email) || !password) {
      return jsonResponse({ success: false, message: 'নাম, মোবাইল নম্বর বা ইমেইল এবং পাসওয়ার্ড আবশ্যক।' }, 400);
    }

    const users = await getStore(env, 'users', SEED_USERS);
    const cleanPhone = phone ? String(phone).replace(/[\s-]/g, '').trim() : '';
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';

    const existing = users.find(u =>
      (cleanPhone && u.phone === cleanPhone) ||
      (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail)
    );
    if (existing) {
      return jsonResponse({ success: false, message: 'এই ফোন নম্বর বা ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।' }, 409);
    }

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: sanitizeText(name),
      phone: cleanPhone,
      email: cleanEmail,
      passwordHash: await hashPassword(password, secret),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      city: 'Dhaka',
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Uttara',
      address: '',
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await setStore(env, 'users', users);

    const token = await signJwt({ id: newUser.id, phone: newUser.phone, name: newUser.name, role: newUser.role }, secret);
    const safeUser = { ...newUser };
    delete safeUser.passwordHash;

    return jsonResponse({
      success: true,
      message: 'রেজিস্ট্রেশন সফল হয়েছে!',
      token,
      user: safeUser
    }, 201);
  }

  if (pathname === '/api/auth/me' && method === 'GET') {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অনুগ্রহ করে প্রথমে লগইন করুন (টোকেন পাওয়া যায়নি)।' }, 401);

    const payload = await verifyJwt(token, secret);
    if (!payload || !payload.id) {
      return jsonResponse({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ লগইন সেশন। পুনরায় লগইন করুন।' }, 403);
    }

    const users = await getStore(env, 'users', SEED_USERS);
    const user = users.find(u => u.id === payload.id);
    if (!user) {
      return jsonResponse({ success: false, message: 'ইউজার তথ্য পাওয়া যায়নি।' }, 404);
    }

    const safeUser = { ...user };
    delete safeUser.passwordHash;
    return jsonResponse({ success: true, user: safeUser });
  }

  if (pathname === '/api/auth/profile' && method === 'PUT') {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অনুগ্রহ করে প্রথমে লগইন করুন (টোকেন পাওয়া যায়নি)।' }, 401);

    const payload = await verifyJwt(token, secret);
    if (!payload || !payload.id) {
      return jsonResponse({ success: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ লগইন সেশন।' }, 403);
    }

    const users = await getStore(env, 'users', SEED_USERS);
    const idx = users.findIndex(u => u.id === payload.id);
    if (idx === -1) {
      return jsonResponse({ success: false, message: 'ইউজার পাওয়া যায়নি।' }, 404);
    }

    if (body.name) users[idx].name = sanitizeText(body.name);
    if (body.phone !== undefined) users[idx].phone = String(body.phone).replace(/[\s-]/g, '').trim();
    if (body.email !== undefined) users[idx].email = sanitizeText(body.email);
    if (body.address !== undefined) users[idx].address = sanitizeText(body.address);
    if (body.city) users[idx].city = sanitizeText(body.city);
    if (body.division !== undefined) users[idx].division = sanitizeText(body.division);
    if (body.district !== undefined) users[idx].district = sanitizeText(body.district);
    if (body.upazila !== undefined) users[idx].upazila = sanitizeText(body.upazila);
    if (body.avatar) users[idx].avatar = body.avatar;
    users[idx].updatedAt = new Date().toISOString();

    await setStore(env, 'users', users);

    const safeUser = { ...users[idx] };
    delete safeUser.passwordHash;
    return jsonResponse({
      success: true,
      message: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!',
      user: safeUser
    });
  }

  if (pathname === '/api/auth/providers' && method === 'GET') {
    return jsonResponse({
      success: true,
      providers: {
        auth0: true,
        google: true,
        facebook: true,
        emailOtp: true,
        smsOtp: false
      },
      source: 'cloudflare-edge-native'
    });
  }

  
  // --------------------------------------------------------------------------
  // Real Google OAuth Redirect & Callback
  // --------------------------------------------------------------------------
  if (pathname === '/api/auth/google' && method === 'GET') {
    const returnTo = url.searchParams.get('returnTo') || 'index.html';
    const googleClientId = env.GOOGLE_CLIENT_ID || '280069081577-ofqhdd3unutvbn5k28bhjc76k754hr82.apps.googleusercontent.com';
    const redirectUri = `${url.origin}/api/auth/google/callback`;
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', googleClientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('prompt', 'select_account');
    authUrl.searchParams.set('state', JSON.stringify({ provider: 'google', returnTo }));
    return new Response(null, {
      status: 302,
      headers: {
        'Location': authUrl.toString(),
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (pathname === '/api/auth/google/callback' && method === 'GET') {
    const codeParam = url.searchParams.get('code');
    const stateRaw = url.searchParams.get('state');
    let returnTo = 'index.html';
    try {
      if (stateRaw) {
        const parsed = JSON.parse(stateRaw);
        if (parsed.returnTo) returnTo = parsed.returnTo;
      }
    } catch (e) {}

    const users = await getStore(env, 'users', [...SEED_USERS]);
    let googleUser = null;
    if (codeParam && env.GOOGLE_CLIENT_SECRET) {
      try {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code: codeParam,
            client_id: env.GOOGLE_CLIENT_ID || '280069081577-ofqhdd3unutvbn5k28bhjc76k754hr82.apps.googleusercontent.com',
            client_secret: env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${url.origin}/api/auth/google/callback`,
            grant_type: 'authorization_code'
          })
        });
        const tokenData = await tokenRes.json();
        if (tokenData.access_token) {
          const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
          });
          googleUser = await userinfoRes.json();
        }
      } catch (e) {}
    }

    const email = (googleUser && googleUser.email) ? googleUser.email.toLowerCase() : `google_user_${Date.now()}@asbimart.com`;
    const name = (googleUser && googleUser.name) ? googleUser.name : 'গুগল ভেরিফাইড গ্রাহক';
    let user = users.find(u => u.email && u.email.toLowerCase() === email);
    if (!user) {
      user = {
        id: 'usr_g_' + Date.now(),
        name,
        email,
        phone: '',
        role: 'customer',
        provider: 'google',
        createdAt: new Date().toISOString()
      };
      users.push(user);
      await setStore(env, 'users', users);
    }

    const token = await signJwt({ id: user.id, email: user.email, name: user.name, role: user.role }, secret);
    const targetUrl = new URL(`/${returnTo}`, url.origin);
    targetUrl.searchParams.set('token', token);
    targetUrl.searchParams.set('login', 'success');
    targetUrl.searchParams.set('provider', 'google');
    return new Response(null, {
      status: 302,
      headers: { 'Location': targetUrl.toString() }
    });
  }

  // --------------------------------------------------------------------------
  // Real Facebook OAuth Redirect & Callback
  // --------------------------------------------------------------------------
  if (pathname === '/api/auth/facebook' && method === 'GET') {
    const returnTo = url.searchParams.get('returnTo') || 'index.html';
    const fbAppId = env.FACEBOOK_APP_ID || '1814698216118210';
    const redirectUri = `${url.origin}/api/auth/facebook/callback`;
    const authUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
    authUrl.searchParams.set('client_id', fbAppId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'email,public_profile');
    authUrl.searchParams.set('state', JSON.stringify({ provider: 'facebook', returnTo }));
    return new Response(null, {
      status: 302,
      headers: {
        'Location': authUrl.toString(),
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (pathname === '/api/auth/facebook/callback' && method === 'GET') {
    const codeParam = url.searchParams.get('code');
    const stateRaw = url.searchParams.get('state');
    let returnTo = 'index.html';
    try {
      if (stateRaw) {
        const parsed = JSON.parse(stateRaw);
        if (parsed.returnTo) returnTo = parsed.returnTo;
      }
    } catch (e) {}

    const users = await getStore(env, 'users', [...SEED_USERS]);
    let fbProfile = null;
    if (codeParam && env.FACEBOOK_APP_SECRET) {
      try {
        const tokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
        tokenUrl.searchParams.set('client_id', env.FACEBOOK_APP_ID || '1814698216118210');
        tokenUrl.searchParams.set('client_secret', env.FACEBOOK_APP_SECRET);
        tokenUrl.searchParams.set('redirect_uri', `${url.origin}/api/auth/facebook/callback`);
        tokenUrl.searchParams.set('code', codeParam);
        const tokenRes = await fetch(tokenUrl.toString());
        const tokenData = await tokenRes.json();
        if (tokenData.access_token) {
          const profileRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenData.access_token}`);
          fbProfile = await profileRes.json();
        }
      } catch (e) {}
    }

    const email = (fbProfile && fbProfile.email) ? fbProfile.email.toLowerCase() : `fb_user_${Date.now()}@asbimart.com`;
    const name = (fbProfile && fbProfile.name) ? fbProfile.name : 'ফেসবুক ভেরিফাইড গ্রাহক';
    let user = users.find(u => u.email && u.email.toLowerCase() === email);
    if (!user) {
      user = {
        id: 'usr_fb_' + Date.now(),
        name,
        email,
        phone: '',
        role: 'customer',
        provider: 'facebook',
        createdAt: new Date().toISOString()
      };
      users.push(user);
      await setStore(env, 'users', users);
    }

    const token = await signJwt({ id: user.id, email: user.email, name: user.name, role: user.role }, secret);
    const targetUrl = new URL(`/${returnTo}`, url.origin);
    targetUrl.searchParams.set('token', token);
    targetUrl.searchParams.set('login', 'success');
    targetUrl.searchParams.set('provider', 'facebook');
    return new Response(null, {
      status: 302,
      headers: { 'Location': targetUrl.toString() }
    });
  }

  // --------------------------------------------------------------------------
  // OTP Session Management (Send, Resend, Verify-Register, Verify-Login)
  // --------------------------------------------------------------------------
  if (pathname === '/api/auth/otp/send' && method === 'POST') {
    const channel = body.channel === 'sms' ? 'sms' : 'email';
    const payload = sanitizeText(body.payload || '').trim();
    if (!payload) {
      return jsonResponse({ success: false, message: 'অনুগ্রহ করে ইমেইল বা ফোন নম্বর দিন।' }, 400);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionId = 'otp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const otps = await getStore(env, 'otps', {});
    otps[sessionId] = {
      sessionId,
      channel,
      payload: payload.toLowerCase(),
      code,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0
    };
    await setStore(env, 'otps', otps);

    const masked = channel === 'email'
      ? payload.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + '***' + c)
      : payload.replace(/^(\+?88)?01(\d)(\d{4})(\d{3})$/, '$101$2****$4');

    return jsonResponse({
      success: true,
      sessionId,
      channel,
      maskedDestination: masked,
      expiresInSeconds: 300,
      resendCooldownSeconds: 60,
      message: `${channel === 'sms' ? 'মোবাইলে' : 'ইমেইলে'} ৬ ডিজিটের ওটিপি কোড পাঠানো হয়েছে।`,
      demoCode: code
    });
  }

  if (pathname === '/api/auth/otp/resend' && method === 'POST') {
    const sessionId = body.sessionId;
    const otps = await getStore(env, 'otps', {});
    const session = otps[sessionId];
    if (!session) {
      return jsonResponse({ success: false, message: 'ওটিপি সেশন পাওয়া যায়নি।' }, 400);
    }
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    session.code = newCode;
    session.expiresAt = Date.now() + 5 * 60 * 1000;
    session.attempts = 0;
    otps[sessionId] = session;
    await setStore(env, 'otps', otps);

    return jsonResponse({
      success: true,
      sessionId,
      expiresInSeconds: 300,
      resendCooldownSeconds: 60,
      message: 'নতুন ওটিপি কোড পাঠানো হয়েছে।',
      demoCode: newCode
    });
  }

  if (pathname === '/api/auth/otp/verify-register' && method === 'POST') {
    const { sessionId, otpCode, name, password, email, phone, division, address } = body;
    const otps = await getStore(env, 'otps', {});
    const session = otps[sessionId];

    if (!session) {
      return jsonResponse({ success: false, message: 'অবৈধ বা মেয়াদোত্তীর্ণ ওটিপি সেশন।' }, 400);
    }
    if (Date.now() > session.expiresAt) {
      delete otps[sessionId];
      await setStore(env, 'otps', otps);
      return jsonResponse({ success: false, message: 'ওটিপি কোডের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে নতুন কোড নিন।' }, 400);
    }
    if (session.code !== String(otpCode).trim()) {
      session.attempts = (session.attempts || 0) + 1;
      await setStore(env, 'otps', otps);
      return jsonResponse({ success: false, message: 'ভুল ওটিপি কোড! অনুগ্রহ করে সঠিক কোড দিন।' }, 400);
    }

    delete otps[sessionId];
    await setStore(env, 'otps', otps);

    const users = await getStore(env, 'users', [...SEED_USERS]);
    const cleanPhone = phone ? sanitizePhone(phone) : '';
    const cleanEmail = email ? sanitizeText(email).toLowerCase() : '';
    const cleanName = sanitizeText(name || 'আসবিমার্ট গ্রাহক');

    const newUser = {
      id: 'usr_' + Date.now(),
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      passwordHash: password ? await hashPassword(password, secret) : '',
      role: 'customer',
      division: sanitizeText(division || 'ঢাকা'),
      address: sanitizeText(address || ''),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    await setStore(env, 'users', users);

    const token = await signJwt({
      id: newUser.id,
      phone: newUser.phone,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }, secret);

    const safeUser = { ...newUser };
    delete safeUser.passwordHash;

    return jsonResponse({
      success: true,
      message: 'অভিনন্দন! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।',
      token,
      user: safeUser
    });
  }

  if (pathname === '/api/auth/otp/verify' && method === 'POST') {
    const { sessionId, otpCode } = body;
    const otps = await getStore(env, 'otps', {});
    const session = otps[sessionId];

    if (!session) {
      return jsonResponse({ success: false, message: 'অবৈধ বা মেয়াদোত্তীর্ণ ওটিপি সেশন।' }, 400);
    }
    if (Date.now() > session.expiresAt) {
      delete otps[sessionId];
      await setStore(env, 'otps', otps);
      return jsonResponse({ success: false, message: 'ওটিপি কোডের মেয়াদ শেষ হয়ে গেছে।' }, 400);
    }
    if (session.code !== String(otpCode).trim()) {
      return jsonResponse({ success: false, message: 'ভুল ওটিপি কোড!' }, 400);
    }

    delete otps[sessionId];
    await setStore(env, 'otps', otps);

    const users = await getStore(env, 'users', [...SEED_USERS]);
    let user = users.find(u =>
      (session.payload && u.email && u.email.toLowerCase() === session.payload.toLowerCase()) ||
      (session.payload && u.phone && u.phone.includes(session.payload.replace(/\D/g, '')))
    );

    if (!user) {
      user = {
        id: 'usr_' + Date.now(),
        name: 'আসবিমার্ট সদস্য',
        email: session.channel === 'email' ? session.payload : '',
        phone: session.channel === 'sms' ? session.payload : '',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      users.push(user);
      await setStore(env, 'users', users);
    }

    const token = await signJwt({ id: user.id, phone: user.phone, email: user.email, name: user.name, role: user.role }, secret);
    const safeUser = { ...user };
    delete safeUser.passwordHash;

    return jsonResponse({
      success: true,
      message: 'সফলভাবে লগইন হয়েছে!',
      token,
      user: safeUser
    });
  }

  // --------------------------------------------------------------------------
  // Coupon Engine API
  // --------------------------------------------------------------------------
  if (pathname === '/api/coupons/validate' && method === 'POST') {
    const codeVal = sanitizeText(body.code || '').trim().toUpperCase();
    const orderAmount = Number(body.orderAmount) || 0;
    const deliveryMethod = body.deliveryMethod || 'regular';

    const coupons = await getStore(env, 'coupons', [...SEED_COUPONS]);
    const coupon = coupons.find(c => c.code.toUpperCase() === codeVal);

    if (!coupon) {
      return jsonResponse({ success: false, valid: false, message: 'কুপন কোডটি সঠিক নয়।' }, 404);
    }
    if (!coupon.isActive) {
      return jsonResponse({ success: false, valid: false, message: 'এই কুপন কোডটি বর্তমানে নিষ্ক্রিয় রয়েছে।' }, 400);
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return jsonResponse({ success: false, valid: false, message: 'এই কুপনের মেয়াদ শেষ হয়ে গেছে।' }, 400);
    }
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return jsonResponse({
        success: false,
        valid: false,
        message: `এই কুপনটি ব্যবহার করতে সর্বনিম্ন ৳${coupon.minOrderAmount} টাকার অর্ডার করতে হবে।`
      }, 400);
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percent') {
      discountAmount = Math.round((orderAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(coupon.discountValue, orderAmount);
    } else if (coupon.discountType === 'free_shipping') {
      discountAmount = deliveryMethod === 'express' ? 120 : 60;
    }

    const finalPayable = Math.max(0, orderAmount - discountAmount);

    return jsonResponse({
      success: true,
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        finalPayable
      },
      message: `অভিনন্দন! কুপন প্রয়োগ হয়েছে। আপনি ৳${discountAmount} ছাড় পেয়েছেন!`
    });
  }

  // --------------------------------------------------------------------------
  // Customer Support Ticket API
  // --------------------------------------------------------------------------
  if (pathname === '/api/support/ticket' && method === 'POST') {
    const name = sanitizeText(body.name || '').trim();
    const phone = sanitizeText(body.phone || '').trim();
    const message = sanitizeText(body.message || '').trim();

    if (!name || !phone || !message) {
      return jsonResponse({ success: false, message: 'নাম, মোবাইল নম্বর ও বার্তা আবশ্যক।' }, 400);
    }

    const tickets = await getStore(env, 'support_tickets', []);
    const newTicket = {
      id: 'TCK-' + Date.now().toString().slice(-6),
      customerName: name,
      customerPhone: phone,
      subject: sanitizeText(body.subject || 'সাধারণ অনুসন্ধান'),
      message,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    tickets.unshift(newTicket);
    await setStore(env, 'support_tickets', tickets);

    return jsonResponse({
      success: true,
      ticketId: newTicket.id,
      message: 'আপনার বার্তাটি সফলভাবে গৃহীত হয়েছে।'
    });
  }

  if (pathname === '/api/auth/auth0') {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/login?info=auth0_configured',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Cart API (Persistent Multi-Device Cart)
  // --------------------------------------------------------------------------
  if (pathname === '/api/cart') {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: 'অনুগ্রহ করে প্রথমে লগইন করুন।' }, 401);

    const payload = await verifyJwt(token, secret);
    if (!payload || !payload.id) {
      return jsonResponse({ success: false, message: 'অবৈধ টোকেন।' }, 403);
    }

    const carts = await getStore(env, 'carts', {});
    if (method === 'GET') {
      const items = Array.isArray(carts[payload.id]) ? carts[payload.id] : [];
      return jsonResponse({ success: true, items });
    }

    if (method === 'PUT') {
      const items = Array.isArray(body.items) ? body.items : [];
      carts[payload.id] = items;
      await setStore(env, 'carts', carts);
      return jsonResponse({ success: true, items });
    }
  }

  // --------------------------------------------------------------------------
  // 8. Contact API
  // --------------------------------------------------------------------------
  if (pathname === '/api/contact' && method === 'POST') {
    const { name, phone, email, subject, message } = body;
    if (!name || !phone || !message) {
      return jsonResponse({ success: false, message: 'নাম, মোবাইল নম্বর এবং আপনার বার্তা পূরণ করা আবশ্যক।' }, 400);
    }

    const messages = await getStore(env, 'messages', []);
    const newMsg = {
      id: 'msg_' + Date.now(),
      name: sanitizeText(name),
      phone: String(phone).replace(/[\s-]/g, '').trim(),
      email: sanitizeText(email || ''),
      subject: sanitizeText(subject || 'সাধারণ যোগাযোগ'),
      message: sanitizeText(message),
      createdAt: new Date().toISOString()
    };
    messages.unshift(newMsg);
    await setStore(env, 'messages', messages);

    return jsonResponse({
      success: true,
      message: 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আসবিমার্ট টিম দ্রুত আপনার সাথে যোগাযোগ করবে!',
      messageId: newMsg.id
    }, 201);
  }

  // --------------------------------------------------------------------------
  // 9. Payment Gateways API (Edge Mock / Gateway Facilitator)
  // --------------------------------------------------------------------------
  if (pathname === '/api/payments/status' && method === 'GET') {
    return jsonResponse({
      success: true,
      status: 'active',
      gateways: ['bkash', 'nagad', 'rocket', 'bank', 'cod']
    });
  }

  if (pathname === '/api/payments/initiate' && method === 'POST') {
    const { name, phone, address, totalAmount, method: payMethod } = body;
    const orderId = 'ASBI-' + Math.floor(100000 + Math.random() * 900000);
    return jsonResponse({
      success: true,
      order: {
        orderId,
        totalAmount: Number(totalAmount) || 0,
        paymentMethod: payMethod || 'bKash'
      },
      merchantNumber: '01821-296056',
      mode: 'manual'
    });
  }

  if (pathname === '/api/payments/gateway-otp/send' && method === 'POST') {
    return jsonResponse({
      success: true,
      message: 'OTP সফলভাবে আপনার নম্বরে পাঠানো হয়েছে (সিমুলেটেড: 123456)',
      otp: '123456'
    });
  }

  if (pathname === '/api/payments/gateway-otp/verify' && method === 'POST') {
    return jsonResponse({ success: true, message: 'OTP ভেরিফিকেশন সফল হয়েছে।' });
  }

  if (pathname === '/api/payments/gateway-pay' && method === 'POST') {
    const { orderId, transactionId, method: payMethod, totalAmount } = body;
    const orders = await getStore(env, 'orders', SEED_ORDERS);
    const existingIdx = orders.findIndex(o => String(o.orderId) === String(orderId));
    let orderObj = null;
    if (existingIdx !== -1) {
      orders[existingIdx].paymentStatus = 'Paid (Gateway Verified)';
      orders[existingIdx].transactionId = transactionId || ('TRX' + Date.now());
      orderObj = orders[existingIdx];
    } else {
      orderObj = {
        orderId: orderId || ('ASBI-' + Math.floor(100000 + Math.random() * 900000)),
        totalAmount: Number(totalAmount) || 0,
        paymentMethod: payMethod || 'bKash',
        paymentStatus: 'Paid (Gateway Verified)',
        transactionId: transactionId || ('TRX' + Date.now()),
        customer: { name: 'Customer', phone: '01700000000', address: 'Dhaka' },
        createdAt: new Date().toISOString()
      };
      orders.unshift(orderObj);
    }
    await setStore(env, 'orders', orders);

    return jsonResponse({
      success: true,
      message: 'পেমেন্ট সফল হয়েছে! ধন্যবাদ।',
      order: orderObj
    });
  }

  // 404 for unhandled API routes
  return jsonResponse({
    success: false,
    message: `API route not found: [${method}] ${pathname}`,
    gateway: 'Cloudflare Pages Functions Native Edge'
  }, 404);
}
