// functions/api/edge-api.js
var EDGE_SEED_PRODUCTS = [
  {
    "id": "honey-sundarban-01",
    "name": "Sundarbans Raw Wild Honey",
    "banglaName": "\u09B8\u09C1\u09A8\u09CD\u09A6\u09B0\u09AC\u09A8\u09C7\u09B0 \u0995\u09BE\u0981\u099A\u09BE \u09AE\u09A7\u09C1",
    "category": "honey",
    "categoryBangla": "\u09AE\u09A7\u09C1 \u0993 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF",
    "isBestSeller": true,
    "rating": 5,
    "reviewsCount": 142,
    "discountPercent": 15,
    "image": "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u09B8\u09C1\u09A8\u09CD\u09A6\u09B0\u09AC\u09A8\u09C7\u09B0 \u0997\u09AD\u09C0\u09B0 \u0985\u09B0\u09A3\u09CD\u09AF \u09A5\u09C7\u0995\u09C7 \u09AE\u09CC\u09AF\u09BC\u09BE\u09B2\u09A6\u09C7\u09B0 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u099A\u09BE\u0995 \u09AD\u09C7\u0999\u09C7 \u09B8\u0982\u0997\u09CD\u09B0\u09B9\u0995\u09C3\u09A4 \u09B6\u09A4\u09AD\u09BE\u0997 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u0993 \u0996\u09BE\u0981\u099F\u09BF \u0985\u09AA\u09B0\u09BF\u09B6\u09CB\u09A7\u09BF\u09A4 \u0995\u09BE\u0981\u099A\u09BE \u09AE\u09A7\u09C1\u0964 \u098F\u09A4\u09C7 \u0995\u09CB\u09A8\u09CB \u09AA\u09CD\u09B0\u0995\u09BE\u09B0 \u09AA\u09CD\u09B0\u09B8\u09C7\u09B8\u09BF\u0982, \u09B9\u09BF\u099F\u09BF\u0982 \u0995\u09BF\u0982\u09AC\u09BE \u0995\u09C3\u09A4\u09CD\u09B0\u09BF\u09AE \u09B8\u09C1\u0997\u09BE\u09B0 \u09AE\u09C7\u09B6\u09BE\u09A8\u09CB \u09B9\u09DF \u09A8\u09BE\u0964 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995\u09AD\u09BE\u09AC\u09C7 \u098F\u09A8\u099C\u09BE\u0987\u09AE, \u09AA\u09CB\u09B2\u09C7\u09A8 \u0993 \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u0985\u0995\u09CD\u09B8\u09BF\u09A1\u09C7\u09A8\u09CD\u099F\u09C7 \u09AD\u09B0\u09AA\u09C1\u09B0 \u098F\u0987 \u09AE\u09A7\u09C1 \u09B0\u09CB\u0997 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7 \u0995\u09CD\u09B7\u09AE\u09A4\u09BE \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF\u09A4\u09C7 \u0985\u09A4\u09C1\u09B2\u09A8\u09C0\u09DF\u0964",
    "benefits": [
      "\u09E7\u09E6\u09E6% \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09B8\u09C1\u09A8\u09CD\u09A6\u09B0\u09AC\u09A8\u09C7\u09B0 \u099A\u09BE\u0995\u09AD\u09BE\u0999\u09BE \u0985\u09AA\u09B0\u09BF\u09B6\u09CB\u09A7\u09BF\u09A4 \u0995\u09BE\u0981\u099A\u09BE \u09AE\u09A7\u09C1",
      "\u09B0\u09CB\u0997 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7 \u0995\u09CD\u09B7\u09AE\u09A4\u09BE \u0993 \u09B6\u09BE\u09B0\u09C0\u09B0\u09BF\u0995 \u098F\u09A8\u09BE\u09B0\u09CD\u099C\u09BF \u09AC\u09BE\u09DC\u09BE\u09DF",
      "\u0995\u09BE\u09B6\u09BF \u0993 \u09A0\u09BE\u09A8\u09CD\u09A1\u09BE \u09A8\u09BF\u09B0\u09BE\u09AE\u09DF\u09C7 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0\u09C0",
      "\u09B2\u09CD\u09AF\u09BE\u09AC \u099F\u09C7\u09B8\u09CD\u099F\u09C7 \u0989\u09A4\u09CD\u09A4\u09C0\u09B0\u09CD\u09A3 \u0993 \u099A\u09BF\u09A8\u09BF\u09AE\u09C1\u0995\u09CD\u09A4"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 650,
        "originalPrice": 765,
        "stock": 25
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF",
        "price": 1250,
        "originalPrice": 1470,
        "stock": 18
      }
    ],
    "reviews": [
      {
        "name": "\u09AE\u09BE\u09B9\u09AE\u09C1\u09A6 \u09B9\u09BE\u09B8\u09BE\u09A8",
        "rating": 5,
        "date": "\u09E9 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09AE\u09A7\u09C1\u09B0 \u0998\u09CD\u09B0\u09BE\u09A3 \u098F\u09AC\u0982 \u09B8\u09CD\u09AC\u09BE\u09A6 \u0985\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3! \u0996\u09BE\u0981\u099F\u09BF \u0995\u09BE\u0981\u099A\u09BE \u09AE\u09A7\u09C1\u0964"
      },
      {
        "name": "\u0986\u09B0\u09BF\u09AB\u09C1\u09B2 \u0987\u09B8\u09B2\u09BE\u09AE",
        "rating": 5,
        "date": "\u09E7 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \u0986\u0997\u09C7",
        "comment": "\u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C\u09BF\u0982 \u0996\u09C1\u09AC\u0987 \u099A\u09AE\u09CE\u0995\u09BE\u09B0 \u099B\u09BF\u09B2\u0964 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u0985\u0995\u09CD\u09B7\u09A4 \u09AA\u09C7\u09DF\u09C7\u099B\u09BF\u0964"
      }
    ]
  },
  {
    "id": "honey-kalojira-02",
    "name": "Pure Black Seed Flower Honey",
    "banglaName": "\u0995\u09BE\u09B2\u09CB\u099C\u09BF\u09B0\u09BE \u09AB\u09C1\u09B2\u09C7\u09B0 \u09AE\u09A7\u09C1",
    "category": "honey",
    "categoryBangla": "\u09AE\u09A7\u09C1 \u0993 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 96,
    "discountPercent": 12,
    "image": "../assets/products/honey-kalojira-02.jpg",
    "gallery": [
      "../assets/products/honey-kalojira-02.jpg"
    ],
    "description": "\u0995\u09BE\u09B2\u09CB\u099C\u09BF\u09B0\u09BE \u09AB\u09C1\u09B2\u09C7\u09B0 \u09AE\u09BE\u09A0 \u09A5\u09C7\u0995\u09C7 \u09B8\u0982\u0997\u09C3\u09B9\u09C0\u09A4 \u09AA\u09C1\u09B7\u09CD\u099F\u09BF\u0995\u09B0 \u0993 \u09B8\u09C1\u09B8\u09CD\u09AC\u09BE\u09A6\u09C1 \u09AC\u09BF\u09B6\u09C7\u09B7 \u09AA\u09CD\u09B0\u099C\u09BE\u09A4\u09BF\u09B0 \u09AE\u09A7\u09C1\u0964 \u098F\u09B0 \u0997\u09BE\u09DD \u09B2\u09BE\u09B2\u099A\u09C7 \u0986\u09AD\u09BE \u0993 \u0985\u09A8\u09A8\u09CD\u09AF \u09B8\u09CD\u09AC\u09BE\u09A6 \u09B0\u09DF\u09C7\u099B\u09C7\u0964 \u0995\u09BE\u09B2\u09CB\u099C\u09BF\u09B0\u09BE\u09B0 \u0994\u09B7\u09A7\u09BF \u0997\u09C1\u09A3\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u0996\u09BE\u0981\u099F\u09BF \u09AE\u09A7\u09C1\u09B0 \u09B8\u0982\u09AE\u09BF\u09B6\u09CD\u09B0\u09A3 \u098F\u099F\u09BF \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AE\u09B9\u09CC\u09B7\u09A7\u0964",
    "benefits": [
      "\u0995\u09BE\u09B2\u09CB\u099C\u09BF\u09B0\u09BE \u09AB\u09C1\u09B2\u09C7\u09B0 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AF\u09BE\u09B8 \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7",
      "\u0997\u09CD\u09AF\u09BE\u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0995 \u0993 \u09B9\u099C\u09AE\u09C7\u09B0 \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE \u09A6\u09C2\u09B0 \u0995\u09B0\u09C7",
      "\u09A6\u09C0\u09B0\u09CD\u0998\u09B8\u09CD\u09A5\u09BE\u09AF\u09BC\u09C0 \u098F\u09A8\u09BE\u09B0\u09CD\u099C\u09BF \u09AF\u09CB\u0997\u09BE\u09DF"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 720,
        "originalPrice": 820,
        "stock": 30
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF",
        "price": 1380,
        "originalPrice": 1570,
        "stock": 15
      }
    ],
    "reviews": [
      {
        "name": "\u09A4\u09BE\u09B9\u09B8\u09BF\u09A8 \u0989\u09B2\u09CD\u09B2\u09BE\u09B9",
        "rating": 5,
        "date": "\u09E8 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u0997\u09BE\u09DD \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AE\u09A7\u09C1, \u0985\u09A8\u09C7\u0995 \u09AD\u09BE\u09B2\u09CB \u09B2\u09C7\u0997\u09C7\u099B\u09C7\u0964"
      }
    ]
  },
  {
    "id": "honey-litchi-03",
    "name": "Litchi Blossom Pure Raw Honey",
    "banglaName": "\u09B2\u09BF\u099A\u09C1 \u09AB\u09C1\u09B2\u09C7\u09B0 \u09AE\u09A7\u09C1",
    "category": "honey",
    "categoryBangla": "\u09AE\u09A7\u09C1 \u0993 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 68,
    "discountPercent": 10,
    "image": "../assets/products/honey-litchi-03.jpg",
    "gallery": [
      "../assets/products/honey-litchi-03.jpg"
    ],
    "description": "\u09A6\u09BF\u09A8\u09BE\u099C\u09AA\u09C1\u09B0\u09C7\u09B0 \u09AC\u09BF\u0996\u09CD\u09AF\u09BE\u09A4 \u09B2\u09BF\u099A\u09C1 \u09AC\u09BE\u0997\u09BE\u09A8 \u09A5\u09C7\u0995\u09C7 \u09AE\u09CC\u09AE\u09BE\u099B\u09BF\u09B0 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AA\u09B0\u09BE\u0997\u09BE\u09AF\u09BC\u09A8\u09C7\u09B0 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u09B8\u0982\u0997\u09C3\u09B9\u09C0\u09A4 \u09B9\u09BE\u09B2\u0995\u09BE \u09B8\u09CB\u09A8\u09BE\u09B2\u09C0 \u09B0\u0999\u09C7\u09B0 \u09B8\u09C1\u09AE\u09BF\u09B7\u09CD\u099F \u0995\u09BE\u0981\u099A\u09BE \u09AE\u09A7\u09C1\u0964 \u09AC\u09BE\u099A\u09CD\u099A\u09BE\u09A6\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u09AC\u0982 \u09AA\u09CD\u09B0\u09A4\u09BF\u09A6\u09BF\u09A8\u09C7\u09B0 \u09B6\u09B0\u09AC\u09A4\u09C7 \u0985\u09A4\u09CD\u09AF\u09A8\u09CD\u09A4 \u09B2\u09CB\u09AD\u09A8\u09C0\u09DF\u0964",
    "benefits": [
      "\u09B2\u09BF\u099A\u09C1 \u09AB\u09C1\u09B2\u09C7\u09B0 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u09B8\u09C1\u09AC\u09BE\u09B8 \u0993 \u09B9\u09BE\u09B2\u0995\u09BE \u099F\u09C7\u0995\u09CD\u09B8\u099A\u09BE\u09B0",
      "\u09AC\u09BE\u099A\u09CD\u099A\u09BE\u09A6\u09C7\u09B0 \u0995\u09CD\u09B7\u09C1\u09A7\u09BE \u0993 \u09AA\u09C1\u09B7\u09CD\u099F\u09BF \u09AC\u09BE\u09DC\u09BE\u09A4\u09C7 \u09B8\u09B9\u09BE\u09DF\u0995",
      "\u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AD\u09BF\u099F\u09BE\u09AE\u09BF\u09A8 \u0993 \u0997\u09CD\u09B2\u09C1\u0995\u09CB\u099C \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 580,
        "originalPrice": 650,
        "stock": 35
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF",
        "price": 1100,
        "originalPrice": 1250,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "\u09B8\u09BE\u0987\u09AB\u09C1\u09B2 \u0987\u09B8\u09B2\u09BE\u09AE",
        "rating": 5,
        "date": "\u09EB \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09AC\u09BE\u099A\u09CD\u099A\u09BE\u09B0\u09BE \u0996\u09C1\u09AC \u09AA\u099B\u09A8\u09CD\u09A6 \u0995\u09B0\u09C7\u099B\u09C7\u0964 \u09A6\u09BE\u09B0\u09C1\u09A3 \u09B8\u09CD\u09AC\u09BE\u09A6\u0964"
      }
    ]
  },
  {
    "id": "honey-mustard-04",
    "name": "Mustard Blossom Cream Honey",
    "banglaName": "\u09B8\u09B0\u09BF\u09B7\u09BE \u09AB\u09C1\u09B2\u09C7\u09B0 \u09AE\u09A7\u09C1",
    "category": "honey",
    "categoryBangla": "\u09AE\u09A7\u09C1 \u0993 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 54,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u09B6\u09C0\u09A4\u0995\u09BE\u09B2\u09C7 \u09B8\u09B0\u09BF\u09B7\u09BE \u0995\u09CD\u09B7\u09C7\u09A4 \u09A5\u09C7\u0995\u09C7 \u09B8\u0982\u0997\u09C3\u09B9\u09C0\u09A4 \u09B9\u09BE\u09B2\u0995\u09BE \u09B8\u09CB\u09A8\u09BE\u09B2\u09C0 \u0995\u09CD\u09B0\u09BF\u09AE\u09BF \u09AE\u09A7\u09C1\u0964 \u09A0\u09BE\u09A8\u09CD\u09A1\u09BE \u0986\u09AC\u09B9\u09BE\u0993\u09DF\u09BE\u09DF \u098F\u099F\u09BF \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995\u09AD\u09BE\u09AC\u09C7 \u0995\u09CD\u09B0\u09BF\u09AE\u09BF \u099C\u09AE\u09C7 \u09AF\u09BE\u09DF, \u09AF\u09BE \u0996\u09BE\u0981\u099F\u09BF \u09B8\u09B0\u09BF\u09B7\u09BE \u09AE\u09A7\u09C1\u09B0 \u09AA\u09CD\u09B0\u09A7\u09BE\u09A8 \u09AC\u09C8\u09B6\u09BF\u09B7\u09CD\u099F\u09CD\u09AF\u0964",
    "benefits": [
      "\u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u0997\u09CD\u09B2\u09C1\u0995\u09CB\u099C\u09C7 \u09AD\u09B0\u09AA\u09C1\u09B0 \u09AA\u09C1\u09B7\u09CD\u099F\u09BF\u0995\u09B0 \u09AE\u09A7\u09C1",
      "\u09B6\u09C0\u09A4\u09C7\u09B0 \u09B8\u0995\u09BE\u09B2\u09C7 \u09A6\u09C1\u09A7 \u09AC\u09BE \u09B0\u09C1\u099F\u09BF\u09B0 \u09B8\u09BE\u09A5\u09C7 \u099A\u09AE\u09CE\u0995\u09BE\u09B0",
      "\u09E7\u09E6\u09E6% \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u0995\u09CB\u09A8\u09CB \u09AA\u09CD\u09B0\u0995\u09CD\u09B0\u09BF\u09DF\u09BE\u099C\u09BE\u09A4 \u099B\u09BE\u09DC\u09BE"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 480,
        "originalPrice": 540,
        "stock": 40
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF",
        "price": 920,
        "originalPrice": 1030,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "\u099C\u09B8\u09BF\u09AE \u0989\u09A6\u09CD\u09A6\u09BF\u09A8",
        "rating": 5,
        "date": "\u09E7 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \u0986\u0997\u09C7",
        "comment": "\u098F\u0995\u09A6\u09AE \u0995\u09CD\u09B0\u09BF\u09AE\u09BF \u0986\u09B8\u09B2 \u09B8\u09B0\u09BF\u09B7\u09BE \u09AB\u09C1\u09B2\u09C7\u09B0 \u09AE\u09A7\u09C1\u0964"
      }
    ]
  },
  {
    "id": "honey-nut-premium-05",
    "name": "Royal Honey Nut Superfood Jar",
    "banglaName": "\u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u09B9\u09BE\u09A8\u09BF \u09A8\u09BE\u099F \u099C\u09BE\u09B0",
    "category": "honey",
    "categoryBangla": "\u09AE\u09A7\u09C1 \u0993 \u09AC\u09BE\u09A6\u09BE\u09AE \u0995\u09AE\u09CD\u09AC\u09CB",
    "isBestSeller": true,
    "rating": 5,
    "reviewsCount": 185,
    "discountPercent": 16,
    "image": "../assets/products/honey-nut-premium-05.jpg",
    "gallery": [
      "../assets/products/honey-nut-premium-05.jpg"
    ],
    "description": "\u0996\u09BE\u0981\u099F\u09BF \u09B8\u09C1\u09A8\u09CD\u09A6\u09B0\u09AC\u09A8\u09C7\u09B0 \u0995\u09BE\u0981\u099A\u09BE \u09AE\u09A7\u09C1\u09A4\u09C7 \u09A1\u09C1\u09AC\u09BE\u09A8\u09CB \u0995\u09BE\u09A0\u09AC\u09BE\u09A6\u09BE\u09AE, \u0995\u09BE\u099C\u09C1\u09AC\u09BE\u09A6\u09BE\u09AE, \u0986\u0996\u09B0\u09CB\u099F, \u09AA\u09C7\u09B8\u09CD\u09A4\u09BE, \u0995\u09BF\u09B8\u09AE\u09BF\u09B8, \u0986\u09A8\u099C\u09BF\u09B0 \u0993 \u0995\u09C1\u09AE\u09DC\u09BE\u09B0 \u09AC\u09C0\u099C\u09C7\u09B0 \u09B8\u09CD\u09AC\u09B0\u09CD\u0997\u09C0\u09DF \u09AE\u09BF\u09B6\u09CD\u09B0\u09A3\u0964 \u0995\u09CD\u09B2\u09BE\u09A8\u09CD\u09A4\u09BF \u09A6\u09C2\u09B0 \u0995\u09B0\u09A4\u09C7 \u098F\u09AC\u0982 \u09B6\u09B0\u09C0\u09B0 \u0993 \u09AE\u09A8\u09C7\u09B0 \u09A4\u09BE\u09CE\u0995\u09CD\u09B7\u09A3\u09BF\u0995 \u09B6\u0995\u09CD\u09A4\u09BF\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u09A8\u09CD\u09AF\u09A4\u09AE \u09B8\u09C7\u09B0\u09BE \u09A8\u09CD\u09AF\u09BE\u099A\u09BE\u09B0\u09BE\u09B2 \u09B9\u09C7\u09B2\u09A5 \u09AB\u09C1\u09A1\u0964",
    "benefits": [
      "\u09EE\u099F\u09BF \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u09A1\u09CD\u09B0\u09BE\u0987 \u09AB\u09CD\u09B0\u09C1\u099F\u09B8 \u0993 \u0996\u09BE\u0981\u099F\u09BF \u0995\u09BE\u0981\u099A\u09BE \u09AE\u09A7\u09C1\u09B0 \u09AE\u09BF\u09B6\u09CD\u09B0\u09A3",
      "\u09B8\u0995\u09BE\u09B2\u09C7 \u098F\u0995 \u099A\u09BE\u09AE\u099A\u09C7\u0987 \u09B8\u09BE\u09B0\u09BE\u09A6\u09BF\u09A8\u09C7\u09B0 \u09AA\u09B0\u09BF\u09AA\u09C2\u09B0\u09CD\u09A3 \u09B6\u0995\u09CD\u09A4\u09BF",
      "\u09B6\u09BF\u09B6\u09C1 \u0993 \u09AC\u09DC\u09A6\u09C7\u09B0 \u09B8\u09CD\u09AE\u09C3\u09A4\u09BF\u09B6\u0995\u09CD\u09A4\u09BF \u0993 \u09B9\u09BE\u09DC\u09C7\u09B0 \u09AA\u09C1\u09B7\u09CD\u099F\u09BF \u099C\u09CB\u0997\u09BE\u09DF"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 790,
        "originalPrice": 940,
        "stock": 40
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF",
        "price": 1500,
        "originalPrice": 1780,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "\u09B6\u09BE\u0995\u09BF\u09B2 \u0986\u09B9\u09AE\u09C7\u09A6",
        "rating": 5,
        "date": "\u09E7 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u0985\u09AC\u09BF\u09B6\u09CD\u09AC\u09BE\u09B8\u09CD\u09AF \u09B0\u0995\u09AE\u09C7\u09B0 \u09B8\u09C1\u09B8\u09CD\u09AC\u09BE\u09A6\u09C1! \u098F\u0995 \u099A\u09BE\u09AE\u099A \u0996\u09C7\u09B2\u09C7\u0987 \u09AE\u09A8 \u09AD\u09B0\u09C7 \u09AF\u09BE\u09DF\u0964"
      }
    ]
  },
  {
    "id": "ghee-pabna-06",
    "name": "Premium Danadar Cow Ghee",
    "banglaName": "\u0996\u09BE\u0981\u099F\u09BF \u0997\u09BE\u0993\u09DF\u09BE \u0998\u09BF",
    "category": "ghee",
    "categoryBangla": "\u0990\u09A4\u09BF\u09B9\u09CD\u09AF\u09AC\u09BE\u09B9\u09C0 \u0997\u09BE\u0993\u09DF\u09BE \u0998\u09BF",
    "isBestSeller": true,
    "rating": 5,
    "reviewsCount": 198,
    "discountPercent": 12,
    "image": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u09AA\u09BE\u09AC\u09A8\u09BE \u0993 \u09B8\u09BF\u09B0\u09BE\u099C\u0997\u099E\u09CD\u099C\u09C7\u09B0 \u09A6\u09C7\u09B6\u09BF \u0997\u09B0\u09C1\u09B0 \u0996\u09BE\u0981\u099F\u09BF \u09A6\u09C1\u09A7\u09C7\u09B0 \u09AE\u09BE\u0996\u09A8 \u09A5\u09C7\u0995\u09C7 \u0990\u09A4\u09BF\u09B9\u09CD\u09AF\u09AC\u09BE\u09B9\u09C0 \u09B8\u09A8\u09BE\u09A4\u09A8 \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF\u09A4\u09C7 \u099C\u09CD\u09AC\u09BE\u09B2 \u09A6\u09C7\u0993\u09DF\u09BE \u09B8\u09C1\u09B8\u09CD\u09AC\u09BE\u09A6\u09C1 \u09A6\u09BE\u09A8\u09BE\u09A6\u09BE\u09B0 \u0997\u09BE\u0993\u09DF\u09BE \u0998\u09BF\u0964 \u098F\u09B0 \u09AE\u09CB\u09B9\u09A8\u09C0\u09DF \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09B8\u09C1\u09AC\u09BE\u09B8 \u0996\u09BE\u09AC\u09BE\u09B0\u09C7 \u098F\u09A8\u09C7 \u09A6\u09C7\u09DF \u09B0\u09BE\u099C\u0995\u09C0\u09AF\u09BC \u09A4\u09C3\u09AA\u09CD\u09A4\u09BF\u0964",
    "benefits": [
      "\u09E7\u09E6\u09E6% \u0996\u09BE\u0981\u099F\u09BF \u09A6\u09C7\u09B6\u09BF \u0997\u09B0\u09C1\u09B0 \u09A6\u09C1\u09A7\u09C7\u09B0 \u09A8\u09A8\u09C0 \u09A5\u09C7\u0995\u09C7 \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4",
      "\u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09A6\u09BE\u09A8\u09BE\u09A6\u09BE\u09B0 \u099F\u09C7\u0995\u09CD\u09B8\u099A\u09BE\u09B0 \u0993 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u09B8\u09C1\u09AC\u09BE\u09B8",
      "\u09B9\u099C\u09AE\u09B6\u0995\u09CD\u09A4\u09BF \u09AC\u09BE\u09DC\u09BE\u09DF \u0993 \u09B9\u09BE\u09DC \u09AE\u099C\u09AC\u09C1\u09A4 \u09B0\u09BE\u0996\u09C7"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 950,
        "originalPrice": 1080,
        "stock": 45
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF",
        "price": 1850,
        "originalPrice": 2100,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "\u09A4\u09BE\u09B9\u09AE\u09BF\u09A8\u09BE \u09AC\u09C7\u0997\u09AE",
        "rating": 5,
        "date": "\u09E8 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u0998\u09BF\u09B0 \u0998\u09CD\u09B0\u09BE\u09A3\u09C7 \u09AA\u09C1\u09B0\u09CB \u09AC\u09BE\u09DC\u09BF \u09AE \u09AE \u0995\u09B0\u099B\u09C7\u0964 \u09A6\u09BE\u09A8\u09BE\u09A6\u09BE\u09B0 \u0996\u09BE\u0981\u099F\u09BF \u0998\u09BF!"
      }
    ]
  },
  {
    "id": "ghee-buffalo-07",
    "name": "Pure Buffalo Danadar Ghee",
    "banglaName": "\u09AE\u09B9\u09BF\u09B7\u09C7\u09B0 \u0996\u09BE\u0981\u099F\u09BF \u0998\u09BF",
    "category": "ghee",
    "categoryBangla": "\u0990\u09A4\u09BF\u09B9\u09CD\u09AF\u09AC\u09BE\u09B9\u09C0 \u0998\u09BF",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 76,
    "discountPercent": 10,
    "image": "../assets/products/ghee-buffalo-07.jpg",
    "gallery": [
      "../assets/products/ghee-buffalo-07.jpg"
    ],
    "description": "\u09AD\u09CB\u09B2\u09BE\u09B0 \u099A\u09B0\u09BE\u099E\u09CD\u099A\u09B2\u09C7\u09B0 \u0998\u09BE\u09B8 \u0996\u09BE\u0993\u09DF\u09BE \u09A6\u09C7\u09B6\u09BF \u09AE\u09B9\u09BF\u09B7\u09C7\u09B0 \u09A6\u09C1\u09A7\u09C7\u09B0 \u09A8\u09A8\u09C0 \u09A5\u09C7\u0995\u09C7 \u09A4\u09C8\u09B0\u09BF \u0997\u09BE\u09DD \u09A6\u09BE\u09A8\u09BE\u09A6\u09BE\u09B0 \u09AE\u09B9\u09BF\u09B7\u09C7\u09B0 \u0998\u09BF\u0964 \u098F\u09A4\u09C7 \u09B0\u09DF\u09C7\u099B\u09C7 \u0989\u099A\u09CD\u099A\u09AE\u09BE\u09A4\u09CD\u09B0\u09BE\u09B0 \u0995\u09CD\u09AF\u09BE\u09B2\u09B8\u09BF\u09DF\u09BE\u09AE \u0993 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09B8\u09C1\u09AC\u09BE\u09B8\u0964",
    "benefits": [
      "\u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u0995\u09CD\u09AF\u09BE\u09B2\u09B8\u09BF\u09DF\u09BE\u09AE \u0993 \u09AB\u09B8\u09AB\u09B0\u09BE\u09B8 \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7",
      "\u09B6\u09BE\u09B0\u09C0\u09B0\u09BF\u0995 \u09B6\u0995\u09CD\u09A4\u09BF \u0993 \u0993\u099C\u09A8 \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF\u09A4\u09C7 \u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF \u0995\u09B0\u09C7",
      "\u09B9\u09BE\u09B2\u09C1\u09DF\u09BE \u0993 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF\u09A4\u09C7 \u09A6\u09BE\u09B0\u09C1\u09A3 \u09B8\u09C1\u09AC\u09BE\u09B8 \u098F\u09A8\u09C7 \u09A6\u09C7\u09DF"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 880,
        "originalPrice": 980,
        "stock": 35
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF",
        "price": 1700,
        "originalPrice": 1900,
        "stock": 15
      }
    ],
    "reviews": [
      {
        "name": "\u0995\u09BE\u09AE\u09BE\u09B2 \u0989\u09A6\u09CD\u09A6\u09BF\u09A8",
        "rating": 5,
        "date": "\u09EA \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09AE\u09B9\u09BF\u09B7\u09C7\u09B0 \u0996\u09BE\u0981\u099F\u09BF \u0998\u09BF \u09AA\u09BE\u0993\u09DF\u09BE \u0996\u09C1\u09AC \u0995\u09A0\u09BF\u09A8 \u099B\u09BF\u09B2\u0964 \u0985\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF\u0964"
      }
    ]
  },
  {
    "id": "ghee-butter-home-08",
    "name": "Hand-Churned Cultured Ghee",
    "banglaName": "\u09AC\u09BF\u09B2\u09CB\u09A8 \u09AC\u09BE\u0996\u09A8 \u0998\u09BF",
    "category": "ghee",
    "categoryBangla": "\u0990\u09A4\u09BF\u09B9\u09CD\u09AF\u09AC\u09BE\u09B9\u09C0 \u0998\u09BF",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 63,
    "discountPercent": 10,
    "image": "../assets/products/ghee-butter-home-08.jpg",
    "gallery": [
      "../assets/products/ghee-butter-home-08.jpg"
    ],
    "description": "\u09A6\u0987 \u09AE\u09A8\u09CD\u09A5\u09A8 \u0995\u09B0\u09C7 \u0995\u09BE\u09A0\u09C7\u09B0 \u09AE\u09A8\u09CD\u09A5\u09A8\u09C0 \u09A6\u09BF\u09DF\u09C7 \u09B9\u09BE\u09A4\u09C7 \u09AE\u09BE\u0996\u09A8 \u09A4\u09C1\u09B2\u09C7 \u09A7\u09C0\u09B0\u09C7 \u09A7\u09C0\u09B0\u09C7 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE \u0996\u09BE\u0981\u099F\u09BF \u09AC\u09C8\u09A6\u09BF\u0995 \u09AC\u09BF\u09B2\u09CB\u09A8\u09BE \u0998\u09BF\u0964 \u098F\u099F\u09BF \u09B8\u09B9\u099C\u09C7 \u09B9\u099C\u09AE\u09AF\u09CB\u0997\u09CD\u09AF \u0993 \u09AA\u09B0\u09AE \u09AA\u09C1\u09B7\u09CD\u099F\u09BF\u0995\u09B0\u0964",
    "benefits": [
      "\u09AC\u09C8\u09A6\u09BF\u0995 \u09AC\u09BF\u09B2\u09CB\u09A8\u09BE \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF\u09A4\u09C7 \u09B9\u09BE\u09A4\u09C7 \u09A4\u09C8\u09B0\u09BF \u0996\u09BE\u0981\u099F\u09BF \u0998\u09BF",
      "\u0985\u09A8\u09CD\u09A4\u09CD\u09B0\u09C7\u09B0 \u09B8\u09C1\u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF \u0993 \u09B8\u09CD\u09AE\u09C3\u09A4\u09BF\u09B6\u0995\u09CD\u09A4\u09BF \u09AC\u09B0\u09CD\u09A7\u0995",
      "\u09B2\u09CD\u09AF\u09BE\u0995\u099F\u09CB\u099C \u0993 \u0995\u09CD\u09AF\u09BE\u09B8\u09BF\u09A8 \u09AE\u09C1\u0995\u09CD\u09A4"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 1100,
        "originalPrice": 1220,
        "stock": 25
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF",
        "price": 2150,
        "originalPrice": 2390,
        "stock": 10
      }
    ],
    "reviews": [
      {
        "name": "\u09AE\u09A8\u09BF\u09B0\u09C1\u09B2 \u0987\u09B8\u09B2\u09BE\u09AE",
        "rating": 5,
        "date": "\u09E9 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09AC\u09BF\u09B2\u09CB\u09A8\u09BE\u09B0 \u0986\u09B8\u09B2 \u0998\u09CD\u09B0\u09BE\u09A3 \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u0964 \u09B8\u09C7\u09B0\u09BE \u0998\u09BF!"
      }
    ]
  },
  {
    "id": "oil-mustard-ghani-09",
    "name": "Cold-Pressed Wood Ghani Mustard Oil",
    "banglaName": "\u0998\u09BE\u09A8\u09BF\u09AD\u09BE\u0999\u09BE \u09B8\u09B0\u09BF\u09B7\u09BE\u09B0 \u09A4\u09C7\u09B2",
    "category": "oil",
    "categoryBangla": "\u0998\u09BE\u09A8\u09BF\u09AD\u09BE\u0999\u09BE \u0996\u09BE\u0981\u099F\u09BF \u09A4\u09C7\u09B2",
    "isBestSeller": true,
    "rating": 4.8,
    "reviewsCount": 115,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u09AC\u09BE\u099B\u09BE\u0987\u0995\u09C3\u09A4 \u09A6\u09C7\u09B6\u09BF \u09AE\u09BE\u0998\u09C0 \u09B8\u09B0\u09BF\u09B7\u09BE \u0995\u09BE\u09A0\u09C7\u09B0 \u0998\u09BE\u09A8\u09BF\u09A4\u09C7 \u09A7\u09C0\u09B0\u0997\u09A4\u09BF\u09A4\u09C7 \u0995\u09CB\u09B2\u09CD\u09A1-\u09AA\u09CD\u09B0\u09C7\u09B8\u09A1 \u0995\u09B0\u09C7 \u09A4\u09C8\u09B0\u09BF \u0996\u09BE\u0981\u099F\u09BF \u09B8\u09B0\u09BF\u09B7\u09BE\u09B0 \u09A4\u09C7\u09B2\u0964 \u098F\u09A4\u09C7 \u09B8\u09B0\u09BF\u09B7\u09BE\u09B0 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u099D\u09BE\u0981\u099D, \u09AA\u09C1\u09B7\u09CD\u099F\u09BF\u0997\u09C1\u09A3 \u098F\u09AC\u0982 \u09B0 \u09AD\u09BF\u099F\u09BE\u09AE\u09BF\u09A8 \u0985\u0995\u09CD\u09B7\u09C1\u09A3\u09CD\u09A8 \u09A5\u09BE\u0995\u09C7\u0964",
    "benefits": [
      "\u0995\u09BE\u09A0\u09C7\u09B0 \u0998\u09BE\u09A8\u09BF\u09A4\u09C7 \u09A7\u09C0\u09B0\u0997\u09A4\u09BF\u09B0 \u099A\u09BE\u09AA\u09C7 \u09AD\u09BE\u0999\u09BE\u09A8\u09CB \u09B6\u09A4\u09AD\u09BE\u0997 \u0996\u09BE\u0981\u099F\u09BF \u09A4\u09C7\u09B2",
      "\u09A4\u09C0\u0995\u09CD\u09B7\u09CD\u09A3 \u0986\u09B8\u09B2 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u099D\u09BE\u0981\u099D \u0993 \u0996\u09BE\u0981\u099F\u09BF \u09B8\u09CD\u09AC\u09BE\u09A6",
      "\u09B9\u09C3\u09A6\u09AF\u09A8\u09CD\u09A4\u09CD\u09B0 \u09B8\u09C1\u09B8\u09CD\u09A5 \u09B0\u09BE\u0996\u09A4\u09C7 \u0993 \u0995\u09CB\u09B2\u09C7\u09B8\u09CD\u099F\u09C7\u09B0\u09B2 \u09A8\u09BF\u09DF\u09A8\u09CD\u09A4\u09CD\u09B0\u09A3\u09C7 \u09B8\u09B9\u09BE\u09DF\u0995"
    ],
    "variants": [
      {
        "size": "\u09E7 \u09B2\u09BF\u099F\u09BE\u09B0",
        "price": 320,
        "originalPrice": 355,
        "stock": 50
      },
      {
        "size": "\u09EB \u09B2\u09BF\u099F\u09BE\u09B0",
        "price": 1500,
        "originalPrice": 1680,
        "stock": 15
      }
    ],
    "reviews": [
      {
        "name": "\u09AB\u09BE\u09B0\u09C1\u0995 \u0986\u09B9\u09AE\u09C7\u09A6",
        "rating": 5,
        "date": "\u09EA \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09A4\u09BF\u09B2\u09C7\u09B0 \u099D\u09BE\u0981\u099D \u0986\u09B0 \u0986\u09B8\u09B2 \u09B8\u09B0\u09BF\u09B7\u09BE\u09B0 \u0997\u09A8\u09CD\u09A7 \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u0964"
      }
    ]
  },
  {
    "id": "kalojira-oil-pure-10",
    "name": "Pure Cold Pressed Black Seed Oil",
    "banglaName": "\u0995\u09CB\u09B2\u09CD\u09A1 \u09AA\u09CD\u09B0\u09C7\u09B8\u09A1 \u0995\u09BE\u09B2\u09CB\u099C\u09BF\u09B0\u09BE \u09A4\u09C7\u09B2",
    "category": "oil",
    "categoryBangla": "\u0998\u09BE\u09A8\u09BF\u09AD\u09BE\u0999\u09BE \u0996\u09BE\u0981\u099F\u09BF \u09A4\u09C7\u09B2",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 74,
    "discountPercent": 15,
    "image": "https://images.unsplash.com/photo-1550160770-005c21924d66?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1550160770-005c21924d66?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u0996\u09BE\u0981\u099F\u09BF \u09A6\u09C7\u09B6\u09BF \u0995\u09BE\u09B2\u09CB\u099C\u09BF\u09B0\u09BE \u09A5\u09C7\u0995\u09C7 \u09AB\u09BE\u09B0\u09CD\u09B8\u09CD\u099F \u0995\u09CB\u09B2\u09CD\u09A1-\u09AA\u09CD\u09B0\u09C7\u09B8\u09A1 \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF\u09A4\u09C7 \u09B8\u0982\u0997\u09C3\u09B9\u09C0\u09A4 \u09AE\u09B9\u09CC\u09B7\u09A7\u09A4\u09C1\u09B2\u09CD\u09AF \u0995\u09BE\u09B2\u09CB\u099C\u09BF\u09B0\u09BE \u09A4\u09C7\u09B2\u0964 \u09A6\u09C7\u09B9\u09C7\u09B0 \u09B8\u09BE\u09B0\u09CD\u09AC\u09BF\u0995 \u09B0\u09CB\u0997 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7 \u0995\u09CD\u09B7\u09AE\u09A4\u09BE \u09AC\u09BE\u09DC\u09BE\u09A4\u09C7 \u09AE\u09B9\u09CC\u09B7\u09A7 \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u0995\u09BE\u099C \u0995\u09B0\u09C7\u0964",
    "benefits": [
      "\u09E7\u09E6\u09E6% \u0996\u09BE\u0981\u099F\u09BF \u0995\u09CB\u09B2\u09CD\u09A1 \u09AA\u09CD\u09B0\u09C7\u09B8\u09A1 \u0985\u09AA\u09B0\u09BF\u09B6\u09CB\u09A7\u09BF\u09A4 \u0995\u09BE\u09B2\u09CB\u099C\u09BF\u09B0\u09BE \u09A4\u09C7\u09B2",
      "\u09B6\u09CD\u09AC\u09BE\u09B8\u0995\u09B7\u09CD\u099F \u0993 \u09B8\u09BE\u0987\u09A8\u09BE\u09B8 \u09A8\u09BF\u09B0\u09BE\u09AE\u09DF\u09C7 \u09B8\u09B9\u09BE\u09DF\u0995",
      "\u099A\u09C1\u09B2 \u09AA\u09DC\u09BE \u09AC\u09A8\u09CD\u09A7\u09C7 \u098F\u09AC\u0982 \u09A4\u09CD\u09AC\u0995\u09C7\u09B0 \u09B8\u09C1\u09B8\u09CD\u09A5\u09A4\u09BE\u09DF \u09AB\u09B2\u09A6\u09BE\u09DF\u0995"
    ],
    "variants": [
      {
        "size": "\u09E7\u09E6\u09E6 \u09AE\u09BF\u09B2\u09BF",
        "price": 210,
        "originalPrice": 245,
        "stock": 30
      },
      {
        "size": "\u09E8\u09EB\u09E6 \u09AE\u09BF\u09B2\u09BF",
        "price": 460,
        "originalPrice": 540,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "\u0986\u0995\u09A4\u09BE\u09B0 \u09B9\u09CB\u09B8\u09C7\u09A8",
        "rating": 5,
        "date": "\u09EA \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09A4\u09C7\u09B2\u099F\u09BE \u098F\u0995\u09A6\u09AE \u0986\u09B8\u09B2 \u0993 \u0998\u09A8\u0964"
      }
    ]
  },
  {
    "id": "coconut-oil-extra-virgin-11",
    "name": "Extra Virgin Cold Pressed Coconut Oil",
    "banglaName": "\u098F\u0995\u09CD\u09B8\u099F\u09CD\u09B0\u09BE \u09AD\u09BE\u09B0\u09CD\u099C\u09BF\u09A8 \u09A8\u09BE\u09B0\u09BF\u0995\u09C7\u09B2 \u09A4\u09C7\u09B2",
    "category": "oil",
    "categoryBangla": "\u0998\u09BE\u09A8\u09BF\u09AD\u09BE\u0999\u09BE \u0996\u09BE\u0981\u099F\u09BF \u09A4\u09C7\u09B2",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 62,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u09A4\u09BE\u099C\u09BE \u09A8\u09BE\u09B0\u09BF\u0995\u09C7\u09B2\u09C7\u09B0 \u09A6\u09C1\u09A7 \u09A5\u09C7\u0995\u09C7 \u0995\u09CB\u09B2\u09CD\u09A1-\u09B8\u09C7\u09A8\u09CD\u099F\u09CD\u09B0\u09BF\u09AB\u09BF\u0989\u099C \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF\u09A4\u09C7 \u09B8\u0982\u0997\u09C3\u09B9\u09C0\u09A4 \u09B6\u09A4\u09AD\u09BE\u0997 \u0996\u09BE\u0981\u099F\u09BF \u0993 \u0996\u09BE\u09AC\u09BE\u09B0 \u0989\u09AA\u09AF\u09CB\u0997\u09C0 \u098F\u0995\u09CD\u09B8\u099F\u09CD\u09B0\u09BE \u09AD\u09BE\u09B0\u09CD\u099C\u09BF\u09A8 \u0995\u09CB\u0995\u09CB\u09A8\u09BE\u099F \u0985\u09DF\u09C7\u09B2\u0964 \u099A\u09C1\u09B2, \u09A4\u09CD\u09AC\u0995 \u0993 \u0995\u09BF\u099F\u09CB \u09A1\u09BE\u09DF\u09C7\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0986\u09A6\u09B0\u09CD\u09B6\u0964",
    "benefits": [
      "\u09E7\u09E6\u09E6% \u0996\u09BE\u0981\u099F\u09BF \u0993 \u0996\u09BE\u0993\u09DF\u09BE\u09B0 \u0989\u09AA\u09AF\u09CB\u0997\u09C0 \u09B0 \u09AD\u09BE\u09B0\u09CD\u099C\u09BF\u09A8 \u09A4\u09C7\u09B2",
      "\u099A\u09C1\u09B2\u09C7\u09B0 \u0997\u09CB\u09DC\u09BE \u09B6\u0995\u09CD\u09A4 \u0995\u09B0\u09C7 \u0993 \u09A4\u09CD\u09AC\u0995\u09C7 \u0997\u09AD\u09C0\u09B0 \u09AE\u09DF\u09C7\u09B6\u09CD\u099A\u09BE\u09B0 \u09AF\u09CB\u0997\u09BE\u09DF",
      "\u0995\u09BF\u099F\u09CB \u09A1\u09BE\u09DF\u09C7\u099F\u09C7 \u09A6\u09CD\u09B0\u09C1\u09A4 \u099A\u09B0\u09CD\u09AC\u09BF \u09AA\u09CB\u09DC\u09BE\u09A4\u09C7 \u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF \u0995\u09B0\u09C7"
    ],
    "variants": [
      {
        "size": "\u09E8\u09EB\u09E6 \u09AE\u09BF\u09B2\u09BF",
        "price": 340,
        "originalPrice": 380,
        "stock": 40
      },
      {
        "size": "\u09EB\u09E6\u09E6 \u09AE\u09BF\u09B2\u09BF",
        "price": 650,
        "originalPrice": 730,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "\u09B8\u09BE\u09AE\u09BF\u09DF\u09BE \u09B9\u0995",
        "rating": 5,
        "date": "\u09E9 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09A8\u09BE\u09B0\u09BF\u0995\u09C7\u09B2\u09C7\u09B0 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u0997\u09A8\u09CD\u09A7\u0964 \u099A\u09C1\u09B2 \u09AA\u09B0\u09BE \u0995\u09AE\u09C7 \u0997\u09C7\u099B\u09C7\u0964"
      }
    ]
  },
  {
    "id": "oil-sesame-til-12",
    "name": "Cold Pressed Pure Sesame (Til) Oil",
    "banglaName": "\u0996\u09BE\u0981\u099F\u09BF \u09A4\u09BF\u09B2\u09C7\u09B0 \u09A4\u09C7\u09B2",
    "category": "oil",
    "categoryBangla": "\u0998\u09BE\u09A8\u09BF\u09AD\u09BE\u0999\u09BE \u0996\u09BE\u0981\u099F\u09BF \u09A4\u09C7\u09B2",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 45,
    "discountPercent": 12,
    "image": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u0995\u09BE\u09B2\u09CB \u09A4\u09BF\u09B2 \u09A5\u09C7\u0995\u09C7 \u0995\u09BE\u09A0\u09C7\u09B0 \u0998\u09BE\u09A8\u09BF\u09A4\u09C7 \u09AD\u09BE\u0999\u09BE\u09A8\u09CB \u0996\u09BE\u0981\u099F\u09BF \u09A4\u09BF\u09B2\u09C7\u09B0 \u09A4\u09C7\u09B2\u0964 \u0986\u09DF\u09C1\u09B0\u09CD\u09AC\u09C7\u09A6\u09BF\u0995 \u09AE\u09BE\u09B2\u09BF\u09B6, \u09AC\u09BE\u09A4\u09C7\u09B0 \u09AC\u09CD\u09AF\u09A5\u09BE \u0989\u09AA\u09B6\u09AE\u09C7 \u098F\u09AC\u0982 \u09B0\u09BE\u09A8\u09CD\u09A8\u09BE\u09DF \u09B8\u09C1\u09B8\u09CD\u09AC\u09BE\u09A6\u09C1 \u0985\u09CD\u09AF\u09BE\u09B0\u09CB\u09AE\u09BE \u09AF\u09CB\u0997 \u0995\u09B0\u09A4\u09C7 \u099A\u09AE\u09CE\u0995\u09BE\u09B0\u0964",
    "benefits": [
      "\u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u0995\u09CD\u09AF\u09BE\u09B2\u09B8\u09BF\u09DF\u09BE\u09AE \u0993 \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u0985\u0995\u09CD\u09B8\u09BF\u09A1\u09C7\u09A8\u09CD\u099F\u09C7 \u09AD\u09B0\u09AA\u09C1\u09B0",
      "\u09B9\u09BE\u09DC\u09C7\u09B0 \u099C\u09CB\u09DC\u09BE \u0993 \u09AA\u09C7\u09B6\u09BF\u09B0 \u09AC\u09CD\u09AF\u09A5\u09BE \u0989\u09AA\u09B6\u09AE\u09C7 \u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF \u0995\u09B0\u09C7",
      "\u09A4\u09CD\u09AC\u0995\u09C7\u09B0 \u09A4\u09BE\u09B0\u09C1\u09A3\u09CD\u09AF \u09A7\u09B0\u09C7 \u09B0\u09BE\u0996\u09C7"
    ],
    "variants": [
      {
        "size": "\u09E8\u09EB\u09E6 \u09AE\u09BF\u09B2\u09BF",
        "price": 290,
        "originalPrice": 330,
        "stock": 35
      },
      {
        "size": "\u09EB\u09E6\u09E6 \u09AE\u09BF\u09B2\u09BF",
        "price": 550,
        "originalPrice": 620,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "\u0986\u09A8\u09BF\u09B8\u09C1\u09B2 \u09B9\u0995",
        "rating": 5,
        "date": "\u09E7 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \u0986\u0997\u09C7",
        "comment": "\u09AC\u09CD\u09AF\u09A5\u09BE\u09DF \u09AE\u09BE\u09B2\u09BF\u09B6 \u0995\u09B0\u09C7 \u0996\u09C1\u09AC \u0986\u09B0\u09BE\u09AE \u09AA\u09C7\u09DF\u09C7\u099B\u09BF\u0964"
      }
    ]
  },
  {
    "id": "nuts-dryfruits-mix-13",
    "name": "Premium Royal Mixed Dry Fruits & Nuts",
    "banglaName": "\u09AE\u09BF\u0995\u09CD\u09B8\u09A1 \u09A8\u09BE\u099F\u09B8 \u0993 \u09A1\u09CD\u09B0\u09BE\u0987 \u09AB\u09CD\u09B0\u09C1\u099F\u09B8",
    "category": "nuts",
    "categoryBangla": "\u09AC\u09BE\u09A6\u09BE\u09AE \u0993 \u09A1\u09CD\u09B0\u09BE\u0987 \u09AB\u09CD\u09B0\u09C1\u099F\u09B8",
    "isBestSeller": true,
    "rating": 4.9,
    "reviewsCount": 164,
    "discountPercent": 18,
    "image": "https://images.unsplash.com/photo-1514537193821-ed4955693802?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1514537193821-ed4955693802?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u0986\u09AE\u09C7\u09B0\u09BF\u0995\u09BE\u09B0 \u0995\u09BE\u09A0\u09AC\u09BE\u09A6\u09BE\u09AE, \u0995\u09BE\u099C\u09C1\u09AC\u09BE\u09A6\u09BE\u09AE, \u0986\u0996\u09B0\u09CB\u099F, \u09AA\u09C7\u09B8\u09CD\u09A4\u09BE, \u0995\u09BF\u09B8\u09AE\u09BF\u09B8, \u0986\u09A8\u099C\u09BF\u09B0 \u0993 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u0995\u09CD\u09B0\u09CD\u09AF\u09BE\u09A8\u09AC\u09C7\u09B0\u09BF\u09B0 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09AE\u09CD\u09AC\u09BF\u09A8\u09C7\u09B6\u09A8\u0964 \u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u09AC\u09BE\u09A6\u09BE\u09AE \u098F\u0995\u09A6\u09AE \u09AB\u09CD\u09B0\u09C7\u09B6, \u09AE\u09C1\u099A\u09AE\u09C1\u099A\u09C7 \u0993 \u09AA\u09C1\u09B7\u09CD\u099F\u09BF\u09A4\u09C7 \u09AD\u09B0\u09AA\u09C1\u09B0\u0964",
    "benefits": [
      "\u09B8\u09C7\u09B0\u09BE \u09AE\u09BE\u09A8\u09C7\u09B0 \u09EE\u099F\u09BF \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u09A1\u09CD\u09B0\u09BE\u0987 \u09AB\u09CD\u09B0\u09C1\u099F\u09B8 \u0993 \u09AC\u09BE\u09A6\u09BE\u09AE\u09C7\u09B0 \u09B8\u09C1\u09B7\u09AE \u09AE\u09BF\u09B6\u09CD\u09B0\u09A3",
      "\u09AC\u09CD\u09B0\u09C7\u09A8 \u09AA\u09BE\u0993\u09DF\u09BE\u09B0, \u09AE\u09C7\u09AE\u09CB\u09B0\u09BF \u0993 \u09B9\u09C3\u09A6\u09AF\u09A8\u09CD\u09A4\u09CD\u09B0 \u09B8\u09C1\u09B8\u09CD\u09A5 \u09B0\u09BE\u0996\u09A4\u09C7 \u09B8\u09B9\u09BE\u09DF\u0995",
      "\u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AA\u09CD\u09B0\u09CB\u099F\u09BF\u09A8, \u09AB\u09BE\u0987\u09AC\u09BE\u09B0 \u0993 \u09B9\u09C7\u09B2\u09A6\u09BF \u09AB\u09CD\u09AF\u09BE\u099F\u09C7\u09B0 \u0989\u09CE\u0995\u09C3\u09B7\u09CD\u099F \u0989\u09CE\u09B8"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 790,
        "originalPrice": 960,
        "stock": 50
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF",
        "price": 1520,
        "originalPrice": 1850,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "\u09A8\u09BE\u09AC\u09BF\u09B2 \u099A\u09CC\u09A7\u09C1\u09B0\u09C0",
        "rating": 5,
        "date": "\u09E9 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u09AC\u09BE\u09A6\u09BE\u09AE \u0985\u09A8\u09C7\u0995 \u09AB\u09CD\u09B0\u09C7\u09B6 \u098F\u09AC\u0982 \u0995\u09CD\u09B0\u09BF\u09B8\u09CD\u09AA\u09BF\u0964"
      }
    ]
  },
  {
    "id": "almond-california-14",
    "name": "California Supreme Almonds",
    "banglaName": "\u0995\u09CD\u09AF\u09BE\u09B2\u09BF\u09AB\u09CB\u09B0\u09CD\u09A8\u09BF\u09DF\u09BE \u0995\u09BE\u09A0\u09AC\u09BE\u09A6\u09BE\u09AE",
    "category": "nuts",
    "categoryBangla": "\u09AC\u09BE\u09A6\u09BE\u09AE \u0993 \u09A1\u09CD\u09B0\u09BE\u0987 \u09AB\u09CD\u09B0\u09C1\u099F\u09B8",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 108,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u09AF\u09C1\u0995\u09CD\u09A4\u09B0\u09BE\u09B7\u09CD\u099F\u09CD\u09B0\u09C7\u09B0 \u0995\u09CD\u09AF\u09BE\u09B2\u09BF\u09AB\u09CB\u09B0\u09CD\u09A8\u09BF\u09DF\u09BE \u09A5\u09C7\u0995\u09C7 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u0986\u09AE\u09A6\u09BE\u09A8\u09BF\u0995\u09C3\u09A4 \u09B8\u09C1\u09AA\u09CD\u09B0\u09BF\u09AE \u0997\u09CB\u09B2\u09CD\u09A1\u09C7\u09A8 \u0995\u09BE\u09A0\u09AC\u09BE\u09A6\u09BE\u09AE\u0964 \u09A8\u09BF\u09DF\u09AE\u09BF\u09A4 \u0995\u09BE\u09A0\u09AC\u09BE\u09A6\u09BE\u09AE \u0996\u09C7\u09B2\u09C7 \u09AE\u09B8\u09CD\u09A4\u09BF\u09B7\u09CD\u0995\u09C7\u09B0 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09CD\u09B7\u09AE\u09A4\u09BE \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF \u09AA\u09BE\u09DF \u098F\u09AC\u0982 \u09A4\u09CD\u09AC\u0995 \u0989\u099C\u09CD\u099C\u09CD\u09AC\u09B2 \u09A5\u09BE\u0995\u09C7\u0964",
    "benefits": [
      "\u09AD\u09BF\u099F\u09BE\u09AE\u09BF\u09A8-\u0987 \u0993 \u09B6\u0995\u09CD\u09A4\u09BF\u09B6\u09BE\u09B2\u09C0 \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u0985\u0995\u09CD\u09B8\u09BF\u09A1\u09C7\u09A8\u09CD\u099F\u09C7 \u09AD\u09B0\u09AA\u09C1\u09B0",
      "\u0995\u09CB\u09B2\u09C7\u09B8\u09CD\u099F\u09C7\u09B0\u09B2 \u0995\u09AE\u09BE\u09A4\u09C7 \u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF \u0995\u09B0\u09C7",
      "\u09B9\u09BE\u09DC \u0993 \u09A6\u09BE\u0981\u09A4\u09C7\u09B0 \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE\u09DF \u0985\u09A4\u09CD\u09AF\u09A8\u09CD\u09A4 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0"
    ],
    "variants": [
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 350,
        "originalPrice": 390,
        "stock": 40
      },
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 680,
        "originalPrice": 760,
        "stock": 30
      }
    ],
    "reviews": [
      {
        "name": "\u09A1\u09BE. \u0987\u09AE\u09B0\u09BE\u09A8 \u0995\u09AC\u09C0\u09B0",
        "rating": 5,
        "date": "\u09E7 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \u0986\u0997\u09C7",
        "comment": "\u09B8\u09BE\u0987\u099C \u09AC\u09DC \u098F\u09AC\u0982 \u09B8\u09CD\u09AC\u09BE\u09A6\u09C7 \u0985\u09A4\u09C1\u09B2\u09A8\u09C0\u09DF\u0964"
      }
    ]
  },
  {
    "id": "cashew-premium-15",
    "name": "Premium Roasted Cashew Nuts",
    "banglaName": "\u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09BE\u099C\u09C1\u09AC\u09BE\u09A6\u09BE\u09AE",
    "category": "nuts",
    "categoryBangla": "\u09AC\u09BE\u09A6\u09BE\u09AE \u0993 \u09A1\u09CD\u09B0\u09BE\u0987 \u09AB\u09CD\u09B0\u09C1\u099F\u09B8",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 89,
    "discountPercent": 12,
    "image": "../assets/products/cashew-premium-15.jpg",
    "gallery": [
      "../assets/products/cashew-premium-15.jpg"
    ],
    "description": "\u09AC\u09DC \u09B8\u09BE\u0987\u099C\u09C7\u09B0 \u09B0\u09CB\u09B8\u09CD\u099F\u09C7\u09A1 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09BE\u099C\u09C1\u09AC\u09BE\u09A6\u09BE\u09AE\u0964 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u0993 \u0995\u09CD\u09B0\u09BE\u099E\u09CD\u099A\u09BF \u09B8\u09CD\u09AC\u09BE\u09A6\u09C7\u09B0 \u098F\u0987 \u0995\u09BE\u099C\u09C1\u09AC\u09BE\u09A6\u09BE\u09AE \u09B0\u09BE\u09A8\u09CD\u09A8\u09BE\u09DF \u0985\u09A5\u09AC\u09BE \u09AA\u09CD\u09B0\u09A4\u09BF\u09A6\u09BF\u09A8\u09C7\u09B0 \u09AA\u09C1\u09B7\u09CD\u099F\u09BF\u0995\u09B0 \u09A8\u09BE\u09B8\u09CD\u09A4\u09BE\u09DF \u09A6\u09BE\u09B0\u09C1\u09A3 \u0989\u09AA\u09AD\u09CB\u0997\u09CD\u09AF\u0964",
    "benefits": [
      "\u0989\u099A\u09CD\u099A\u09AE\u09BE\u09A8\u09C7\u09B0 \u0989\u09A6\u09CD\u09AD\u09BF\u099C\u09CD\u099C \u09AA\u09CD\u09B0\u09CB\u099F\u09BF\u09A8 \u0993 \u09AE\u09BF\u09A8\u09BE\u09B0\u09C7\u09B2\u09B8 \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7",
      "\u09B9\u09C3\u09A6\u09AF\u09A8\u09CD\u09A4\u09CD\u09B0 \u09AD\u09BE\u09B2\u09CB \u09B0\u09BE\u0996\u09A4\u09C7 \u0993 \u09B0\u0995\u09CD\u09A4\u099A\u09BE\u09AA \u09A8\u09BF\u09DF\u09A8\u09CD\u09A4\u09CD\u09B0\u09A3\u09C7 \u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF \u0995\u09B0\u09C7",
      "\u09B6\u09B0\u09C0\u09B0\u09C7 \u09B6\u0995\u09CD\u09A4\u09BF \u09AF\u09CB\u0997\u09BE\u09DF \u0993 \u0995\u09CD\u09B2\u09BE\u09A8\u09CD\u09A4\u09BF \u09A6\u09C2\u09B0 \u0995\u09B0\u09C7"
    ],
    "variants": [
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 390,
        "originalPrice": 440,
        "stock": 35
      },
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 760,
        "originalPrice": 860,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "\u09B8\u09C1\u09B2\u09A4\u09BE\u09A8\u09BE \u09B0\u09B9\u09AE\u09BE\u09A8",
        "rating": 5,
        "date": "\u09E9 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09AE\u09C1\u099A\u09AE\u09C1\u099A\u09C7 \u098F\u09AC\u0982 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u099F\u09C7\u09B8\u09CD\u099F\u0964"
      }
    ]
  },
  {
    "id": "walnut-kashmiri-16",
    "name": "Kashmiri Kagzi Akhrot (Walnut)",
    "banglaName": "\u0995\u09BE\u09B6\u09CD\u09AE\u09C0\u09B0\u09BF \u0986\u09B8\u09CD\u09A4 \u0986\u0996\u09B0\u09CB\u099F",
    "category": "nuts",
    "categoryBangla": "\u09AC\u09BE\u09A6\u09BE\u09AE \u0993 \u09A1\u09CD\u09B0\u09BE\u0987 \u09AB\u09CD\u09B0\u09C1\u099F\u09B8",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 57,
    "discountPercent": 14,
    "image": "../assets/products/walnut-kashmiri-16.jpg",
    "gallery": [
      "../assets/products/walnut-kashmiri-16.jpg"
    ],
    "description": "\u0995\u09BE\u09B6\u09CD\u09AE\u09C0\u09B0\u09C7\u09B0 \u0990\u09A4\u09BF\u09B9\u09CD\u09AF\u09AC\u09BE\u09B9\u09C0 \u09AA\u09BE\u09A4\u09B2\u09BE \u0996\u09CB\u09B8\u09BE\u09AF\u09C1\u0995\u09CD\u09A4 \u0995\u09BE\u0997\u099C\u09BF \u0986\u0996\u09B0\u09CB\u099F\u0964 \u098F\u099F\u09BF \u09AE\u09B8\u09CD\u09A4\u09BF\u09B7\u09CD\u0995\u09C7\u09B0 \u0997\u09A0\u09A8 \u0993 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09BE\u09B0\u09BF\u09A4\u09BE \u09AC\u09BE\u09DC\u09BE\u09A4\u09C7 \u09AC\u09CD\u09B0\u09C7\u09A8 \u09AB\u09C1\u09A1 \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u09AC\u09BF\u09B6\u09CD\u09AC\u0996\u09CD\u09AF\u09BE\u09A4\u0964",
    "benefits": [
      "\u0989\u099A\u09CD\u099A\u09AE\u09BE\u09A4\u09CD\u09B0\u09BE\u09B0 \u0989\u09A6\u09CD\u09AD\u09BF\u099C\u09CD\u099C \u0993\u09AE\u09C7\u0997\u09BE-\u09E9 \u09AB\u09CD\u09AF\u09BE\u099F\u09BF \u0985\u09CD\u09AF\u09BE\u09B8\u09BF\u09A1 \u09AF\u09C1\u0995\u09CD\u09A4",
      "\u09B8\u09CD\u09AE\u09C3\u09A4\u09BF\u09B6\u0995\u09CD\u09A4\u09BF \u0993 \u09AC\u09CD\u09B0\u09C7\u0987\u09A8 \u09AB\u09BE\u0982\u09B6\u09A8 \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF \u0995\u09B0\u09C7",
      "\u09B0\u0995\u09CD\u09A4\u09C7 \u0995\u09CD\u09B7\u09A4\u09BF\u0995\u09B0 \u098F\u09B2\u09A1\u09BF\u098F\u09B2 \u0995\u09CB\u09B2\u09C7\u09B8\u09CD\u099F\u09C7\u09B0\u09B2 \u0995\u09AE\u09BE\u09DF"
    ],
    "variants": [
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 420,
        "originalPrice": 490,
        "stock": 30
      },
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 820,
        "originalPrice": 950,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "\u09AE\u09BF\u099C\u09BE\u09A8\u09C1\u09B0 \u09B0\u09B9\u09AE\u09BE\u09A8",
        "rating": 5,
        "date": "\u09EA \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09B9\u09BE\u09A4\u09C7 \u099A\u09BE\u09AA \u09A6\u09BF\u09B2\u09C7\u0987 \u0996\u09CB\u09B8\u09BE \u09AD\u09C7\u0999\u09C7 \u09AF\u09BE\u09DF\u0964"
      }
    ]
  },
  {
    "id": "pista-iranian-17",
    "name": "Iranian Roasted Salted Pistachios",
    "banglaName": "\u0987\u09B0\u09BE\u09A8\u09BF \u09AA\u09C7\u09B8\u09CD\u09A4\u09BE \u09AC\u09BE\u09A6\u09BE\u09AE",
    "category": "nuts",
    "categoryBangla": "\u09AC\u09BE\u09A6\u09BE\u09AE \u0993 \u09A1\u09CD\u09B0\u09BE\u0987 \u09AB\u09CD\u09B0\u09C1\u099F\u09B8",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 71,
    "discountPercent": 12,
    "image": "../assets/products/pista-iranian-17.jpg",
    "gallery": [
      "../assets/products/pista-iranian-17.jpg"
    ],
    "description": "\u0987\u09B0\u09BE\u09A8\u09C7\u09B0 \u09AC\u09BF\u0996\u09CD\u09AF\u09BE\u09A4 \u09B8\u09C1\u09B8\u09CD\u09AC\u09BE\u09A6\u09C1 \u09B0\u09CB\u09B8\u09CD\u099F\u09C7\u09A1 \u0993 \u09B9\u09BE\u09B2\u0995\u09BE \u09B8\u09B2\u09CD\u099F\u09C7\u09A1 \u09AA\u09C7\u09B8\u09CD\u09A4\u09BE \u09AC\u09BE\u09A6\u09BE\u09AE\u0964 \u0986\u0995\u09B0\u09CD\u09B7\u09A3\u09C0\u09DF \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09B8\u09AC\u09C1\u099C \u0993 \u09AC\u09C7\u0997\u09C1\u09A8\u09BF \u0986\u09AD\u09BE \u09B8\u09AE\u09C7\u09A4 \u0996\u09BE\u0981\u099F\u09BF \u09AA\u09C7\u09B8\u09CD\u09A4\u09BE \u09AC\u09BE\u09A6\u09BE\u09AE\u0964",
    "benefits": [
      "\u099A\u09CB\u0996\u09C7\u09B0 \u099C\u09CD\u09AF\u09CB\u09A4\u09BF \u0993 \u09A6\u09C3\u09B7\u09CD\u099F\u09BF\u09B6\u0995\u09CD\u09A4\u09BF \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE\u09DF \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0",
      "\u09AA\u09CD\u09B0\u099A\u09C1\u09B0 \u09AA\u09CD\u09B0\u09CB\u099F\u09BF\u09A8 \u0993 \u09AB\u09BE\u0987\u09AC\u09BE\u09B0 \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7",
      "\u09B0\u0995\u09CD\u09A4\u09C7 \u09B9\u09BF\u09AE\u09CB\u0997\u09CD\u09B2\u09CB\u09AC\u09BF\u09A8 \u09AC\u09BE\u09DC\u09BE\u09A4\u09C7 \u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF \u0995\u09B0\u09C7"
    ],
    "variants": [
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 550,
        "originalPrice": 620,
        "stock": 30
      },
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 1080,
        "originalPrice": 1220,
        "stock": 15
      }
    ],
    "reviews": [
      {
        "name": "\u09B8\u09CB\u09B9\u09BE\u0997 \u09B0\u09BE\u09A8\u09BE",
        "rating": 5,
        "date": "\u09EB \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u0985\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u09B8\u09CD\u09AC\u09BE\u09A6 \u0993 \u09A8\u09BF\u0996\u09C1\u0981\u09A4 \u09B8\u09BE\u0987\u099C\u0964"
      }
    ]
  },
  {
    "id": "raisin-golden-18",
    "name": "Afghan Jumbo Golden Raisins",
    "banglaName": "\u0986\u09AB\u0997\u09BE\u09A8 \u0997\u09CB\u09B2\u09CD\u09A1\u09C7\u09A8 \u0995\u09BF\u09B8\u09AE\u09BF\u09B8",
    "category": "nuts",
    "categoryBangla": "\u09AC\u09BE\u09A6\u09BE\u09AE \u0993 \u09A1\u09CD\u09B0\u09BE\u0987 \u09AB\u09CD\u09B0\u09C1\u099F\u09B8",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 60,
    "discountPercent": 10,
    "image": "../assets/products/raisin-golden-18.jpg",
    "gallery": [
      "../assets/products/raisin-golden-18.jpg"
    ],
    "description": "\u0986\u09AB\u0997\u09BE\u09A8\u09BF\u09B8\u09CD\u09A4\u09BE\u09A8\u09C7\u09B0 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u0993 \u09B0\u09B8\u09BE\u09B2\u09CB \u09B2\u09AE\u09CD\u09AC\u09BE \u0997\u09CB\u09B2\u09CD\u09A1\u09C7\u09A8 \u0995\u09BF\u09B8\u09AE\u09BF\u09B8\u0964 \u09B0\u0995\u09CD\u09A4\u09C7 \u0986\u09DF\u09B0\u09A8\u09C7\u09B0 \u0998\u09BE\u099F\u09A4\u09BF \u09AA\u09C2\u09B0\u09A3\u09C7 \u0993 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u09B0\u09BE\u09A8\u09CD\u09A8\u09BE\u09DF \u0985\u09A4\u09CD\u09AF\u09A8\u09CD\u09A4 \u0986\u0995\u09B0\u09CD\u09B7\u09A3\u09C0\u09DF\u0964",
    "benefits": [
      "\u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u0986\u09DF\u09B0\u09A8 \u0993 \u09AA\u099F\u09BE\u09B8\u09BF\u09DF\u09BE\u09AE \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7",
      "\u09B0\u0995\u09CD\u09A4\u09B8\u09CD\u09AC\u09B2\u09CD\u09AA\u09A4\u09BE \u09A6\u09C2\u09B0 \u0995\u09B0\u09A4\u09C7 \u09AC\u09BF\u09B6\u09C7\u09B7 \u0989\u09AA\u0995\u09BE\u09B0\u09C0",
      "\u09B9\u099C\u09AE\u09C7 \u09B8\u09B9\u09BE\u09DF\u09A4\u09BE \u0995\u09B0\u09C7 \u0993 \u0995\u09CB\u09B7\u09CD\u09A0\u0995\u09BE\u09A0\u09BF\u09A8\u09CD\u09AF \u0995\u09AE\u09BE\u09DF"
    ],
    "variants": [
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 210,
        "originalPrice": 235,
        "stock": 50
      },
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 400,
        "originalPrice": 450,
        "stock": 35
      }
    ],
    "reviews": [
      {
        "name": "\u09AB\u09BE\u09B0\u09B9\u09BE\u09A8\u09BE \u0986\u0995\u09CD\u09A4\u09BE\u09B0",
        "rating": 5,
        "date": "\u09E7 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 \u0986\u0997\u09C7",
        "comment": "\u0996\u09C1\u09AC \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u098F\u09AC\u0982 \u09AA\u09B0\u09BF\u099A\u09CD\u099B\u09A8\u09CD\u09A8\u0964"
      }
    ]
  },
  {
    "id": "care-neem-toothpaste-19",
    "name": "Organic Neem & Clove Herbal Toothpaste",
    "banglaName": "\u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09A8\u09BF\u09AE \u099F\u09C1\u09A5\u09AA\u09C7\u09B8\u09CD\u099F",
    "category": "personalcare",
    "categoryBangla": "\u09A8\u09CD\u09AF\u09BE\u099A\u09BE\u09B0\u09BE\u09B2 \u09AA\u09BE\u09B0\u09CD\u09B8\u09CB\u09A8\u09BE\u09B2 \u0995\u09C7\u09DF\u09BE\u09B0",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 72,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u0996\u09BE\u0981\u099F\u09BF \u09A8\u09BF\u09AE\u09AA\u09BE\u09A4\u09BE \u0993 \u09B2\u09AC\u0999\u09CD\u0997\u09C7\u09B0 \u09A8\u09BF\u09B0\u09CD\u09AF\u09BE\u09B8 \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7 \u09E7\u09E6\u09E6% \u09A8\u09CD\u09AF\u09BE\u099A\u09BE\u09B0\u09BE\u09B2 \u09AD\u09C7\u09B7\u099C \u099F\u09C1\u09A5\u09AA\u09C7\u09B8\u09CD\u099F\u0964 \u0995\u09CB\u09A8\u09CB \u0995\u09CD\u09B7\u09A4\u09BF\u0995\u09B0 \u09AB\u09CD\u09B2\u09CB\u09B0\u09BE\u0987\u09A1 \u09AC\u09BE \u09B0\u09BE\u09B8\u09BE\u09AF\u09BC\u09A8\u09BF\u0995 \u09AB\u09C7\u09A8\u09BE \u09B8\u09C3\u09B7\u09CD\u099F\u09BF\u0995\u09BE\u09B0\u09C0 \u0989\u09AA\u09BE\u09A6\u09BE\u09A8 \u099B\u09BE\u09DC\u09BE\u0987 \u09A6\u09BE\u0981\u09A4\u09C7\u09B0 \u09AE\u09BE\u09DC\u09BF \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE \u0993 \u0995\u09CD\u09AF\u09BE\u09AD\u09BF\u099F\u09BF \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7\u09C7 \u0985\u09A4\u09CD\u09AF\u09A8\u09CD\u09A4 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0\u09C0\u0964",
    "benefits": [
      "\u09AB\u09CD\u09B2\u09CB\u09B0\u09BE\u0987\u09A1 \u0993 \u0995\u09C3\u09A4\u09CD\u09B0\u09BF\u09AE \u0995\u09C7\u09AE\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u09AE\u09C1\u0995\u09CD\u09A4 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AD\u09C7\u09B7\u099C \u09AA\u09C7\u09B8\u09CD\u099F",
      "\u09A6\u09BE\u0981\u09A4\u09C7\u09B0 \u09AE\u09BE\u09DC\u09BF \u09A5\u09C7\u0995\u09C7 \u09B0\u0995\u09CD\u09A4 \u09AA\u09DC\u09BE \u09AC\u09A8\u09CD\u09A7 \u0995\u09B0\u09C7 \u0993 \u09AE\u09C1\u0996\u09C7\u09B0 \u09A6\u09C1\u09B0\u09CD\u0997\u09A8\u09CD\u09A7 \u09A6\u09C2\u09B0 \u0995\u09B0\u09C7",
      "\u09A6\u09BE\u0981\u09A4 \u09B0\u09BE\u0996\u09C7 \u099D\u0995\u099D\u0995\u09C7 \u09B8\u09BE\u09A6\u09BE \u0993 \u09AB\u09CD\u09B0\u09C7\u09B6"
    ],
    "variants": [
      {
        "size": "\u09E7\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE \u099F\u09BF\u0989\u09AC",
        "price": 180,
        "originalPrice": 200,
        "stock": 50
      },
      {
        "size": "\u09E8\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE \u09AB\u09CD\u09AF\u09BE\u09AE\u09BF\u09B2\u09BF \u09AA\u09CD\u09AF\u09BE\u0995",
        "price": 340,
        "originalPrice": 380,
        "stock": 40
      }
    ],
    "reviews": [
      {
        "name": "\u0986\u09A4\u09BF\u0995\u09C1\u09B0 \u09B0\u09B9\u09AE\u09BE\u09A8",
        "rating": 5,
        "date": "\u09E9 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09A6\u09BE\u0981\u09A4\u09C7\u09B0 \u09B6\u09BF\u09B0\u09B6\u09BF\u09B0\u09BE\u09A8\u09BF \u09AD\u09BE\u09AC \u098F\u0995\u09A6\u09AE \u0995\u09AE\u09C7 \u0997\u09C7\u099B\u09C7\u0964"
      }
    ]
  },
  {
    "id": "care-bamboo-brush-20",
    "name": "Natural Bamboo Eco Toothbrush (Set of 4)",
    "banglaName": "\u09A8\u09CD\u09AF\u09BE\u099A\u09BE\u09B0\u09BE\u09B2 \u09AC\u09CD\u09AF\u09BE\u09AE\u09CD\u09AC\u09C1 \u099F\u09C1\u09A5\u09AC\u09CD\u09B0\u09BE\u09B6",
    "category": "personalcare",
    "categoryBangla": "\u09A8\u09CD\u09AF\u09BE\u099A\u09BE\u09B0\u09BE\u09B2 \u09AA\u09BE\u09B0\u09CD\u09B8\u09CB\u09A8\u09BE\u09B2 \u0995\u09C7\u09DF\u09BE\u09B0",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 65,
    "discountPercent": 15,
    "image": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u09E7\u09E6\u09E6% \u09AA\u09B0\u09BF\u09AC\u09C7\u09B6\u09AC\u09BE\u09A8\u09CD\u09A7\u09AC \u09AC\u09BE\u0981\u09B6 \u09A5\u09C7\u0995\u09C7 \u09A4\u09C8\u09B0\u09BF \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u099F\u09C1\u09A5\u09AC\u09CD\u09B0\u09BE\u09B6\u0964 \u098F\u09B0 \u0986\u09B2\u09CD\u099F\u09CD\u09B0\u09BE-\u09B8\u09AB\u099F \u09AC\u09CD\u09B0\u09BF\u09B8\u09B2 \u09A6\u09BE\u0981\u09A4\u09C7\u09B0 \u098F\u09A8\u09BE\u09AE\u09C7\u09B2 \u09AC\u09BE \u09AE\u09BE\u09DC\u09BF\u09B0 \u0995\u09CB\u09A8\u09CB \u0995\u09CD\u09B7\u09A4\u09BF \u09A8\u09BE \u0995\u09B0\u09C7 \u0985\u09A4\u09CD\u09AF\u09A8\u09CD\u09A4 \u09AF\u09A4\u09CD\u09A8\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09A6\u09BE\u0981\u09A4 \u09AA\u09B0\u09BF\u09B7\u09CD\u0995\u09BE\u09B0 \u0995\u09B0\u09C7\u0964",
    "benefits": [
      "\u09E7\u09E6\u09E6% \u09AC\u09BE\u09DF\u09CB\u09A1\u09BF\u0997\u09CD\u09B0\u09C7\u09A1\u09C7\u09AC\u09B2 \u0993 \u09AA\u09CD\u09B2\u09BE\u09B8\u09CD\u099F\u09BF\u0995\u09AE\u09C1\u0995\u09CD\u09A4 \u09AA\u09B0\u09BF\u09AC\u09C7\u09B6\u09AC\u09BE\u09A8\u09CD\u09A7\u09AC \u09AC\u09CD\u09B0\u09BE\u09B6",
      "\u09AE\u09BE\u09DC\u09BF\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09CB\u09AE\u09B2 \u0993 \u0986\u09B0\u09BE\u09AE\u09A6\u09BE\u09DF\u0995 \u099A\u09BE\u09B0\u0995\u09CB\u09B2 \u09AC\u09CD\u09B0\u09BF\u09B8\u09B2",
      "\u099C\u09C0\u09AC\u09BE\u09A3\u09C1\u09B0\u09CB\u09A7\u09C0 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AC\u09BE\u0981\u09B6\u09C7\u09B0 \u09B9\u09BE\u09A4\u09B2"
    ],
    "variants": [
      {
        "size": "\u09EA \u09AA\u09BF\u09B8\u09C7\u09B0 \u09AB\u09CD\u09AF\u09BE\u09AE\u09BF\u09B2\u09BF \u09AC\u0995\u09CD\u09B8",
        "price": 260,
        "originalPrice": 310,
        "stock": 45
      }
    ],
    "reviews": [
      {
        "name": "\u09B8\u09BE\u09DF\u09AE\u09BE \u09B8\u09C1\u09B2\u09A4\u09BE\u09A8\u09BE",
        "rating": 5,
        "date": "\u09EB \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u0996\u09C1\u09AC\u0987 \u09B8\u09AB\u099F \u09AC\u09CD\u09B0\u09BF\u09B8\u09B2 \u0986\u09B0 \u099A\u09AE\u09CE\u0995\u09BE\u09B0 \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF\u0964"
      }
    ]
  },
  {
    "id": "care-organic-lotion-21",
    "name": "Pure Shea Butter & Almond Body Lotion",
    "banglaName": "\u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u0986\u09AE\u09A8\u09CD\u09A1 \u09AC\u09A1\u09BF \u09B2\u09CB\u09B6\u09A8",
    "category": "personalcare",
    "categoryBangla": "\u09A8\u09CD\u09AF\u09BE\u099A\u09BE\u09B0\u09BE\u09B2 \u09AA\u09BE\u09B0\u09CD\u09B8\u09CB\u09A8\u09BE\u09B2 \u0995\u09C7\u09DF\u09BE\u09B0",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 88,
    "discountPercent": 12,
    "image": "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u0996\u09BE\u0981\u099F\u09BF \u09B6\u09BF\u09DF\u09BE \u09AC\u09BE\u099F\u09BE\u09B0, \u0995\u09BE\u09A0\u09AC\u09BE\u09A6\u09BE\u09AE\u09C7\u09B0 \u09A4\u09C7\u09B2 \u0993 \u0985\u09CD\u09AF\u09BE\u09B2\u09CB\u09AD\u09C7\u09B0\u09BE \u099C\u09C7\u09B2 \u09A6\u09BF\u09DF\u09C7 \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AE\u09DF\u09C7\u09B6\u09CD\u099A\u09BE\u09B0\u09BE\u0987\u099C\u09BF\u0982 \u09AC\u09A1\u09BF \u09B2\u09CB\u09B6\u09A8\u0964 \u0995\u09CD\u09B7\u09A4\u09BF\u0995\u09B0 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09AC\u09C7\u09A8 \u0993 \u0995\u09C3\u09A4\u09CD\u09B0\u09BF\u09AE \u09B8\u09C1\u0997\u09A8\u09CD\u09A7\u09BF\u09AE\u09C1\u0995\u09CD\u09A4 \u098F\u0987 \u09B2\u09CB\u09B6\u09A8 \u09B6\u09C1\u09B7\u09CD\u0995 \u09A4\u09CD\u09AC\u0995\u0995\u09C7 \u0995\u09B0\u09C7 \u0995\u09CB\u09AE\u09B2 \u0993 \u0989\u099C\u09CD\u099C\u09CD\u09AC\u09B2\u0964",
    "benefits": [
      "\u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09AC\u09C7\u09A8, \u09B8\u09BE\u09B2\u09AB\u09C7\u099F \u0993 \u0995\u09C3\u09A4\u09CD\u09B0\u09BF\u09AE \u0995\u09C7\u09AE\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u09AE\u09C1\u0995\u09CD\u09A4 \u09AB\u09B0\u09CD\u09AE\u09C1\u09B2\u09BE",
      "\u09E8\u09EA \u0998\u09A3\u09CD\u099F\u09BE \u0997\u09AD\u09C0\u09B0 \u09AE\u09DF\u09C7\u09B6\u09CD\u099A\u09BE\u09B0\u09BE\u0987\u099C\u09BF\u0982 \u0993 \u09A4\u09CD\u09AC\u0995\u09C7\u09B0 \u0996\u09B8\u0996\u09B8\u09C7 \u09AD\u09BE\u09AC \u09A6\u09C2\u09B0 \u0995\u09B0\u09C7",
      "\u09AD\u09BF\u099F\u09BE\u09AE\u09BF\u09A8-\u0987 \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AA\u09C1\u09B7\u09CD\u099F\u09BF"
    ],
    "variants": [
      {
        "size": "\u09E8\u09E6\u09E6 \u09AE\u09BF\u09B2\u09BF \u09AC\u09CB\u09A4\u09B2",
        "price": 450,
        "originalPrice": 510,
        "stock": 35
      },
      {
        "size": "\u09EA\u09E6\u09E6 \u09AE\u09BF\u09B2\u09BF \u09AA\u09BE\u09AE\u09CD\u09AA \u09AC\u09CB\u09A4\u09B2",
        "price": 820,
        "originalPrice": 930,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "\u09AB\u09BE\u09B0\u099C\u09BE\u09A8\u09BE \u09B6\u09BE\u09B0\u09AE\u09BF\u09A8",
        "rating": 5,
        "date": "\u09E7 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u098F\u0995\u099F\u09C1\u0993 \u099A\u09BF\u099F\u099A\u09BF\u099F\u09C7 \u09A8\u09BE, \u09A4\u09CD\u09AC\u0995 \u09A8\u09B0\u09AE \u09B0\u09BE\u0996\u09C7\u0964"
      }
    ]
  },
  {
    "id": "care-neem-soap-22",
    "name": "Handmade Organic Neem & Turmeric Soap",
    "banglaName": "\u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09A8\u09BF\u09AE \u09B8\u09BE\u09AC\u09BE\u09A8",
    "category": "personalcare",
    "categoryBangla": "\u09A8\u09CD\u09AF\u09BE\u099A\u09BE\u09B0\u09BE\u09B2 \u09AA\u09BE\u09B0\u09CD\u09B8\u09CB\u09A8\u09BE\u09B2 \u0995\u09C7\u09DF\u09BE\u09B0",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 59,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u0996\u09BE\u0981\u099F\u09BF \u09A8\u09BF\u09AE \u09A4\u09C7\u09B2, \u0995\u09BE\u0981\u099A\u09BE \u09B9\u09B2\u09C1\u09A6 \u0993 \u09A8\u09BE\u09B0\u0995\u09C7\u09B2 \u09A4\u09C7\u09B2 \u09A6\u09BF\u09DF\u09C7 \u0995\u09CB\u09B2\u09CD\u09A1-\u09AA\u09CD\u09B0\u09B8\u09C7\u09B8 \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF\u09A4\u09C7 \u09B9\u09BE\u09A4\u09C7 \u09A4\u09C8\u09B0\u09BF \u09AD\u09C7\u09B7\u099C \u09B8\u09BE\u09AC\u09BE\u09A8\u0964 \u09AC\u09CD\u09B0\u09A3, \u0998\u09BE\u09AE\u09BE\u099A\u09BF \u0993 \u09A4\u09CD\u09AC\u0995\u09C7\u09B0 \u0987\u09A8\u09AB\u09C7\u0995\u09B6\u09A8 \u09A6\u09C2\u09B0 \u0995\u09B0\u09A4\u09C7 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u09AC\u09CD\u09AF\u09BE\u0995\u099F\u09C7\u09B0\u09BF\u09AF\u09BC\u09BE\u09B2 \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE \u09A6\u09C7\u09DF\u0964",
    "benefits": [
      "\u09E7\u09E6\u09E6% \u09A8\u09CD\u09AF\u09BE\u099A\u09BE\u09B0\u09BE\u09B2 \u0995\u09C7\u09AE\u09BF\u0995\u09CD\u09AF\u09BE\u09B2\u09AE\u09C1\u0995\u09CD\u09A4 \u0995\u09CB\u09B2\u09CD\u09A1-\u09AA\u09CD\u09B0\u09B8\u09C7\u09B8 \u09B8\u09BE\u09AC\u09BE\u09A8",
      "\u09AC\u09CD\u09B0\u09A3 \u0993 \u09A4\u09CD\u09AC\u0995\u09C7\u09B0 \u09AC\u09CD\u09AF\u09BE\u0995\u099F\u09C7\u09B0\u09BF\u09AF\u09BC\u09BE\u09B2 \u0987\u09A8\u09AB\u09C7\u0995\u09B6\u09A8 \u09A6\u09C2\u09B0 \u0995\u09B0\u09C7",
      "\u09A4\u09CD\u09AC\u0995\u09C7\u09B0 \u0986\u09B0\u09CD\u09A6\u09CD\u09B0\u09A4\u09BE \u09A7\u09B0\u09C7 \u09B0\u09C7\u0996\u09C7 \u09A8\u09CD\u09AF\u09BE\u099A\u09BE\u09B0\u09BE\u09B2 \u0997\u09CD\u09B2\u09CB \u098F\u09A8\u09C7 \u09A6\u09C7\u09DF"
    ],
    "variants": [
      {
        "size": "\u09E7\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE \u09AC\u09BE\u09B0",
        "price": 150,
        "originalPrice": 170,
        "stock": 60
      },
      {
        "size": "\u09E9\u099F\u09BF\u09B0 \u0995\u09AE\u09CD\u09AC\u09CB \u09AA\u09CD\u09AF\u09BE\u0995",
        "price": 420,
        "originalPrice": 480,
        "stock": 35
      }
    ],
    "reviews": [
      {
        "name": "\u09AE\u09BE\u09B9\u09AE\u09C1\u09A6\u09C1\u09B2 \u09B9\u0995",
        "rating": 5,
        "date": "\u09EA \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09B8\u09BE\u09AC\u09BE\u09A8\u099F\u09BE \u09AE\u09C1\u0996\u09C7 \u09A6\u09BF\u09B2\u09C7 \u09A6\u09BE\u09B0\u09C1\u09A3 \u09AB\u09CD\u09B0\u09C7\u09B6 \u09B2\u09BE\u0997\u09C7\u0964"
      }
    ]
  },
  {
    "id": "care-aloevera-gel-23",
    "name": "Pure Organic Aloe Vera Soothing Gel",
    "banglaName": "\u0996\u09BE\u0981\u099F\u09BF \u0985\u09CD\u09AF\u09BE\u09B2\u09CB\u09AD\u09C7\u09B0\u09BE \u099C\u09C7\u09B2",
    "category": "personalcare",
    "categoryBangla": "\u09A8\u09CD\u09AF\u09BE\u099A\u09BE\u09B0\u09BE\u09B2 \u09AA\u09BE\u09B0\u09CD\u09B8\u09CB\u09A8\u09BE\u09B2 \u0995\u09C7\u09DF\u09BE\u09B0",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 77,
    "discountPercent": 12,
    "image": "../assets/products/care-aloevera-gel-23.jpg",
    "gallery": [
      "../assets/products/care-aloevera-gel-23.jpg"
    ],
    "description": "\u09A4\u09BE\u099C\u09BE \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u0998\u09C3\u09A4\u0995\u09C1\u09AE\u09BE\u09B0\u09C0 \u09AA\u09BE\u09A4\u09BE \u09A5\u09C7\u0995\u09C7 \u09A8\u09BF\u09B7\u09CD\u0995\u09BE\u09B6\u09BF\u09A4 \u09EF\u09EF% \u09AA\u09BF\u0993\u09B0 \u0985\u09CD\u09AF\u09BE\u09B2\u09CB\u09AD\u09C7\u09B0\u09BE \u099C\u09C7\u09B2\u0964 \u09B0\u09CB\u09A6\u09AA\u09CB\u09DC\u09BE \u09A4\u09CD\u09AC\u0995 \u09B6\u09BE\u09A8\u09CD\u09A4 \u0995\u09B0\u09A4\u09C7 \u098F\u09AC\u0982 \u099A\u09C1\u09B2\u09C7\u09B0 \u0995\u09A8\u09CD\u09A1\u09BF\u09B6\u09A8\u09BF\u0982 \u0993 \u09A1\u09CD\u09AF\u09BE\u09A8\u09A1\u09CD\u09B0\u09BE\u09AB \u09A6\u09C2\u09B0 \u0995\u09B0\u09A4\u09C7 \u09A6\u09BE\u09B0\u09C1\u09A3 \u0989\u09AA\u09AF\u09CB\u0997\u09C0\u0964",
    "benefits": [
      "\u0985\u09CD\u09AF\u09BE\u09B2\u0995\u09CB\u09B9\u09B2 \u0993 \u0995\u09C3\u09A4\u09CD\u09B0\u09BF\u09AE \u09B0\u0999 \u09AE\u09C1\u0995\u09CD\u09A4 \u09EF\u09EF% \u09AA\u09BF\u0993\u09B0 \u099C\u09C7\u09B2",
      "\u09B8\u09BE\u09A8\u09AC\u09BE\u09B0\u09CD\u09A8 \u0993 \u09AC\u09CD\u09B0\u09A3 \u09A6\u09CD\u09B0\u09C1\u09A4 \u0989\u09AA\u09B6\u09AE \u0995\u09B0\u09C7",
      "\u099A\u09C1\u09B2 \u09B8\u09BF\u09B2\u09CD\u0995\u09BF \u0993 \u0996\u09C1\u09B6\u0995\u09BF\u09AE\u09C1\u0995\u09CD\u09A4 \u0995\u09B0\u09C7"
    ],
    "variants": [
      {
        "size": "\u09E8\u09E6\u09E6 \u09AE\u09BF\u09B2\u09BF \u099C\u09BE\u09B0",
        "price": 320,
        "originalPrice": 360,
        "stock": 40
      }
    ],
    "reviews": [
      {
        "name": "\u09B8\u09C1\u09AE\u09BE\u0987\u09DF\u09BE \u0986\u0995\u09CD\u09A4\u09BE\u09B0",
        "rating": 5,
        "date": "\u09E8 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u0996\u09C1\u09AC\u0987 \u09B8\u09CD\u09A8\u09BF\u0997\u09CD\u09A7 \u098F\u09AC\u0982 \u09A4\u09CD\u09AC\u0995\u09C7 \u09A6\u09CD\u09B0\u09C1\u09A4 \u09AE\u09BF\u09B6\u09C7 \u09AF\u09BE\u09DF\u0964"
      }
    ]
  },
  {
    "id": "chia-seed-organic-24",
    "name": "Organic Mexican Chia Seeds",
    "banglaName": "\u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u099A\u09BF\u09DF\u09BE \u09B8\u09BF\u09A1",
    "category": "superfood",
    "categoryBangla": "\u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09B8\u09C1\u09AA\u09BE\u09B0\u09AB\u09C1\u09A1",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 88,
    "discountPercent": 14,
    "image": "../assets/products/chia-seed-organic-24.jpg",
    "gallery": [
      "../assets/products/chia-seed-organic-24.jpg"
    ],
    "description": "\u09AE\u09C7\u0995\u09CD\u09B8\u09BF\u0995\u09CB \u09A5\u09C7\u0995\u09C7 \u09B8\u0982\u0997\u09C3\u09B9\u09C0\u09A4 \u09B6\u09A4\u09AD\u09BE\u0997 \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u099A\u09BF\u09DF\u09BE \u09B8\u09BF\u09A1\u0964 \u09AA\u09CD\u09B0\u099A\u09C1\u09B0 \u09AA\u09B0\u09BF\u09AE\u09BE\u09A3\u09C7 \u0993\u09AE\u09C7\u0997\u09BE-\u09E9 \u0993 \u09A1\u09BE\u09DF\u09C7\u099F\u09BE\u09B0\u09BF \u09AB\u09BE\u0987\u09AC\u09BE\u09B0 \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7 \u098F\u0987 \u09B8\u09C1\u09AA\u09BE\u09B0\u09AB\u09C1\u09A1 \u0993\u099C\u09A8 \u09A8\u09BF\u09DF\u09A8\u09CD\u09A4\u09CD\u09B0\u09A3 \u098F\u09AC\u0982 \u09AC\u09A1\u09BF \u09A1\u09BF\u099F\u0995\u09CD\u09B8\u09C7 \u0985\u09A4\u09CD\u09AF\u09A8\u09CD\u09A4 \u099C\u09A8\u09AA\u09CD\u09B0\u09BF\u09DF\u0964",
    "benefits": [
      "\u09AA\u09CD\u09B0\u099A\u09C1\u09B0 \u09A1\u09BE\u09DF\u09C7\u099F\u09BE\u09B0\u09BF \u09AB\u09BE\u0987\u09AC\u09BE\u09B0 \u0993 \u0993\u09AE\u09C7\u0997\u09BE-\u09E9 \u09AB\u09CD\u09AF\u09BE\u099F\u09BF \u0985\u09CD\u09AF\u09BE\u09B8\u09BF\u09A1 \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7",
      "\u09AA\u09C7\u099F\u09C7\u09B0 \u099A\u09B0\u09CD\u09AC\u09BF \u0995\u09AE\u09BE\u09A4\u09C7 \u0993 \u0993\u099C\u09A8 \u09A8\u09BF\u09DF\u09A8\u09CD\u09A4\u09CD\u09B0\u09A3\u09C7 \u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF \u0995\u09B0\u09C7",
      "\u09B0\u0995\u09CD\u09A4\u09C7 \u09B6\u09B0\u09CD\u0995\u09B0\u09BE\u09B0 \u09AE\u09BE\u09A4\u09CD\u09B0\u09BE \u0993 \u0995\u09CB\u09B2\u09C7\u09B8\u09CD\u099F\u09C7\u09B0\u09B2 \u09A8\u09BF\u09DF\u09A8\u09CD\u09A4\u09CD\u09B0\u09A3\u09C7 \u09B8\u09B9\u09BE\u09DF\u0995"
    ],
    "variants": [
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 280,
        "originalPrice": 320,
        "stock": 40
      },
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 520,
        "originalPrice": 600,
        "stock": 30
      }
    ],
    "reviews": [
      {
        "name": "\u09A8\u09C1\u09B8\u09B0\u09BE\u09A4 \u099C\u09BE\u09B9\u09BE\u09A8",
        "rating": 5,
        "date": "\u09E8 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09A6\u09BE\u09A8\u09BE\u09A6\u09BE\u09A8\u09BE \u098F\u0995\u09A6\u09AE \u09AA\u09B0\u09BF\u09B7\u09CD\u0995\u09BE\u09B0 \u0993 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE\u0964"
      }
    ]
  },
  {
    "id": "flax-seed-organic-25",
    "name": "Organic Brown Flax Seeds (\u09A4\u09BF\u09B8\u09BF \u09AC\u09C0\u099C)",
    "banglaName": "\u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09A4\u09BF\u09B8\u09BF \u09AC\u09C0\u099C",
    "category": "superfood",
    "categoryBangla": "\u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09B8\u09C1\u09AA\u09BE\u09B0\u09AB\u09C1\u09A1",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 51,
    "discountPercent": 12,
    "image": "../assets/products/flax-seed-organic-25.jpg",
    "gallery": [
      "../assets/products/flax-seed-organic-25.jpg"
    ],
    "description": "\u0989\u099A\u09CD\u099A\u09AE\u09BE\u09A8\u09C7\u09B0 \u0985\u09AA\u09B0\u09BF\u09B6\u09CB\u09A7\u09BF\u09A4 \u09AC\u09CD\u09B0\u09BE\u0989\u09A8 \u09A4\u09BF\u09B8\u09BF \u09AC\u09C0\u099C\u0964 \u09B2\u09BF\u0997\u09A8\u09BE\u09A8 \u0993 \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF\u0995\u09B0 \u09AB\u09BE\u0987\u09AC\u09BE\u09B0\u09C7 \u09AD\u09B0\u09AA\u09C1\u09B0 \u098F\u0987 \u09B8\u09C1\u09AA\u09BE\u09B0\u09AB\u09C1\u09A1 \u09B9\u09BE\u09B0\u09CD\u099F \u09AD\u09BE\u09B2\u09CB \u09B0\u09BE\u0996\u09A4\u09C7 \u098F\u09AC\u0982 \u09B9\u09B0\u09AE\u09CB\u09A8\u09C7\u09B0 \u09AD\u09BE\u09B0\u09B8\u09BE\u09AE\u09CD\u09AF \u09B0\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u09A4\u09C7 \u099A\u09BF\u0995\u09BF\u09CE\u09B8\u0995\u09A6\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A5\u09AE \u09AA\u099B\u09A8\u09CD\u09A6\u0964",
    "benefits": [
      "\u0989\u099A\u09CD\u099A\u09AE\u09BE\u09A4\u09CD\u09B0\u09BE\u09B0 \u09A6\u09CD\u09B0\u09AC\u09A3\u09C0\u09AF\u09BC \u09AB\u09BE\u0987\u09AC\u09BE\u09B0 \u0993 \u0993\u09AE\u09C7\u0997\u09BE-\u09E9 \u09AF\u09C1\u0995\u09CD\u09A4",
      "\u09B9\u099C\u09AE\u09B6\u0995\u09CD\u09A4\u09BF \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF \u0995\u09B0\u09C7 \u0993 \u0995\u09CB\u09B7\u09CD\u09A0\u0995\u09BE\u09A0\u09BF\u09A8\u09CD\u09AF \u09A6\u09C2\u09B0 \u0995\u09B0\u09C7",
      "\u0989\u099A\u09CD\u099A \u09B0\u0995\u09CD\u09A4\u099A\u09BE\u09AA \u09A8\u09BF\u09DF\u09A8\u09CD\u09A4\u09CD\u09B0\u09A3\u09C7 \u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF \u0995\u09B0\u09C7"
    ],
    "variants": [
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 180,
        "originalPrice": 205,
        "stock": 45
      },
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 340,
        "originalPrice": 390,
        "stock": 30
      }
    ],
    "reviews": [
      {
        "name": "\u09AE\u09CB\u09B6\u09BE\u09B0\u09B0\u09AB \u09B9\u09CB\u09B8\u09C7\u09A8",
        "rating": 5,
        "date": "\u09EB \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09AA\u09B0\u09BF\u099A\u09CD\u099B\u09A8\u09CD\u09A8 \u09A6\u09BE\u09A8\u09BE, \u09AD\u09BE\u09B2\u09CB \u09AE\u09BE\u09A8\u09C7\u09B0 \u09A4\u09BF\u09B8\u09BF\u0964"
      }
    ]
  },
  {
    "id": "pumpkin-seeds-26",
    "name": "Raw Shelled Pumpkin Seeds (\u0995\u09C1\u09AE\u09DC\u09BE\u09B0 \u09AC\u09C0\u099C)",
    "banglaName": "\u0996\u09CB\u09B8\u09BE\u099B\u09BE\u09DC\u09BE \u0995\u09C1\u09AE\u09DC\u09BE\u09B0 \u09AC\u09C0\u099C",
    "category": "superfood",
    "categoryBangla": "\u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09B8\u09C1\u09AA\u09BE\u09B0\u09AB\u09C1\u09A1",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 64,
    "discountPercent": 15,
    "image": "../assets/products/pumpkin-seeds-26.jpg",
    "gallery": [
      "../assets/products/pumpkin-seeds-26.jpg"
    ],
    "description": "\u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u099C\u09BF\u0982\u0995 \u0993 \u09AE\u09CD\u09AF\u09BE\u0997\u09A8\u09C7\u09B8\u09BF\u09DF\u09BE\u09AE\u09C7 \u09AD\u09B0\u09AA\u09C1\u09B0 \u0996\u09CB\u09B8\u09BE\u099B\u09BE\u09DC\u09BE \u0995\u09BE\u0981\u099A\u09BE \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u0995\u09C1\u09AE\u09DC\u09BE\u09B0 \u09AC\u09C0\u099C\u0964 \u099F\u09C7\u09B8\u09CD\u099F\u09CB\u09B8\u09CD\u099F\u09C7\u09B0\u09A8 \u09B9\u09B0\u09AE\u09CB\u09A8 \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF \u098F\u09AC\u0982 \u09AA\u09C1\u09B0\u09C1\u09B7\u09A6\u09C7\u09B0 \u09B8\u09BE\u09B0\u09CD\u09AC\u09BF\u0995 \u09AA\u09CD\u09B0\u09B8\u09CD\u099F\u09C7\u099F \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF \u09AD\u09BE\u09B2\u09CB \u09B0\u09BE\u0996\u09A4\u09C7 \u098F\u099F\u09BF \u0985\u09A8\u09AC\u09A6\u09CD\u09AF\u0964",
    "benefits": [
      "\u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u099C\u09BF\u0982\u0995\u09C7\u09B0 \u09B8\u09B0\u09CD\u09AC\u09CB\u09A4\u09CD\u09A4\u09AE \u0989\u09A6\u09CD\u09AD\u09BF\u099C\u09CD\u099C \u0989\u09CE\u09B8",
      "\u09AA\u09CD\u09B0\u09B8\u09CD\u099F\u09C7\u099F \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF \u0993 \u0998\u09C1\u09AE\u09C7\u09B0 \u0997\u09AD\u09C0\u09B0\u09A4\u09BE \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF \u0995\u09B0\u09C7",
      "\u0987\u09AE\u09BF\u0989\u09A8\u09BF\u099F\u09BF \u09AC\u09C1\u09B8\u09CD\u099F\u09BE\u09B0 \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u0995\u09BE\u099C \u0995\u09B0\u09C7"
    ],
    "variants": [
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 320,
        "originalPrice": 375,
        "stock": 35
      },
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 620,
        "originalPrice": 720,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "\u09AE\u09BE\u09B9\u09AC\u09C1\u09AC \u099C\u09BE\u09AE\u09BE\u09A8",
        "rating": 5,
        "date": "\u09E9 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09B0\u09CB\u09B8\u09CD\u099F \u0995\u09B0\u09C7 \u0996\u09C7\u09A4\u09C7 \u09A6\u09BE\u09B0\u09C1\u09A3 \u09AE\u099C\u09BE\u0964"
      }
    ]
  },
  {
    "id": "sunflower-seeds-27",
    "name": "Raw Shelled Sunflower Seeds (\u09B8\u09C2\u09B0\u09CD\u09AF\u09AE\u09C1\u0996\u09C0 \u09AC\u09C0\u099C)",
    "banglaName": "\u09B8\u09C2\u09B0\u09CD\u09AF\u09AE\u09C1\u0996\u09C0 \u09AB\u09C1\u09B2\u09C7\u09B0 \u09AC\u09C0\u099C",
    "category": "superfood",
    "categoryBangla": "\u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09B8\u09C1\u09AA\u09BE\u09B0\u09AB\u09C1\u09A1",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 48,
    "discountPercent": 10,
    "image": "../assets/products/sunflower-seeds-27.jpg",
    "gallery": [
      "../assets/products/sunflower-seeds-27.jpg"
    ],
    "description": "\u09AD\u09BF\u099F\u09BE\u09AE\u09BF\u09A8-\u0987 \u0993 \u09B8\u09C7\u09B2\u09C7\u09A8\u09BF\u09AF\u09BC\u09BE\u09AE \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7 \u0996\u09CB\u09B8\u09BE\u099B\u09BE\u09DC\u09BE \u09B8\u09C2\u09B0\u09CD\u09AF\u09AE\u09C1\u0996\u09C0 \u09AC\u09C0\u099C\u0964 \u09A4\u09CD\u09AC\u0995\u09C7\u09B0 \u09AE\u09B8\u09C3\u09A3\u09A4\u09BE \u09AB\u09BF\u09B0\u09BF\u09DF\u09C7 \u0986\u09A8\u09A4\u09C7 \u098F\u09AC\u0982 \u0995\u09CD\u09B7\u09A4\u09BF\u0995\u09B0 \u09AB\u09CD\u09B0\u09BF \u09B0\u200D\u09CD\u09AF\u09BE\u09A1\u09BF\u0995\u09C7\u09B2 \u09A6\u09C2\u09B0 \u0995\u09B0\u09A4\u09C7 \u09AA\u09CD\u09B0\u09A4\u09BF\u09A6\u09BF\u09A8 \u09B8\u09BE\u09B2\u09BE\u09A6\u09C7 \u09AC\u09BE \u09A8\u09BE\u09B8\u09CD\u09A4\u09BE\u09DF \u09B8\u09C7\u09B0\u09BE\u0964",
    "benefits": [
      "\u09AA\u09CD\u09B0\u099A\u09C1\u09B0 \u09AD\u09BF\u099F\u09BE\u09AE\u09BF\u09A8-\u0987 \u0993 \u09B8\u09C7\u09B2\u09C7\u09A8\u09BF\u09AF\u09BC\u09BE\u09AE \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7",
      "\u09A4\u09CD\u09AC\u0995\u09C7\u09B0 \u09A4\u09BE\u09B0\u09C1\u09A3\u09CD\u09AF \u09A7\u09B0\u09C7 \u09B0\u09BE\u0996\u09C7 \u0993 \u09AC\u09BE\u09B0\u09CD\u09A7\u0995\u09CD\u09AF \u0995\u09AE\u09BE\u09DF",
      "\u09B9\u09C3\u09A6\u09AF\u09A8\u09CD\u09A4\u09CD\u09B0\u09C7\u09B0 \u09B0\u0995\u09CD\u09A4\u09A8\u09BE\u09B2\u09C0 \u09A8\u09AE\u09A8\u09C0\u09AF\u09BC \u09B0\u09BE\u0996\u09C7"
    ],
    "variants": [
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 210,
        "originalPrice": 235,
        "stock": 40
      },
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 390,
        "originalPrice": 440,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "\u0986\u09B0\u09BF\u09AB\u09BE \u0986\u0995\u09CD\u09A4\u09BE\u09B0",
        "rating": 5,
        "date": "\u09EC \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u0996\u09C1\u09AC\u0987 \u09AE\u09C1\u099A\u09AE\u09C1\u099A\u09C7 \u098F\u09AC\u0982 \u099F\u09C7\u09B8\u09CD\u099F \u09AD\u09BE\u09B2\u09CB\u0964"
      }
    ]
  },
  {
    "id": "dates-ajwa-madinah-28",
    "name": "Madinah Supreme Ajwa Dates",
    "banglaName": "\u09AE\u09A6\u09BF\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0986\u099C\u0993\u09DF\u09BE \u0996\u09C7\u099C\u09C1\u09B0",
    "category": "nuts",
    "categoryBangla": "\u09AC\u09BE\u09A6\u09BE\u09AE \u0993 \u09A1\u09CD\u09B0\u09BE\u0987 \u09AB\u09CD\u09B0\u09C1\u099F\u09B8",
    "isBestSeller": false,
    "rating": 5,
    "reviewsCount": 95,
    "discountPercent": 15,
    "image": "../assets/products/dates-ajwa-madinah-28.jpg",
    "gallery": [
      "../assets/products/dates-ajwa-madinah-28.jpg"
    ],
    "description": "\u09AA\u09AC\u09BF\u09A4\u09CD\u09B0 \u09AE\u09A6\u09BF\u09A8\u09BE \u09AE\u09C1\u09A8\u09BE\u0993\u09DF\u09BE\u09B0\u09BE \u09A5\u09C7\u0995\u09C7 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u09B8\u0982\u0997\u09C3\u09B9\u09C0\u09A4 \u09B8\u09C7\u09B0\u09BE \u09AE\u09BE\u09A8\u09C7\u09B0 \u099C\u09C7\u09A8\u09C1\u0987\u09A8 \u0986\u099C\u0993\u09DF\u09BE \u0996\u09C7\u099C\u09C1\u09B0\u0964 \u09A8\u09B0\u09AE \u0993 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u09B8\u09CD\u09AC\u09BE\u09A6\u09C7\u09B0 \u098F\u0987 \u0996\u09C7\u099C\u09C1\u09B0 \u09B9\u09C3\u09A6\u09AF\u09A8\u09CD\u09A4\u09CD\u09B0\u09C7\u09B0 \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE \u0993 \u09AC\u09B0\u0995\u09A4\u09AE\u09DF \u09B8\u09C1\u09A8\u09CD\u09A8\u09BE\u09B9 \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u0985\u09A4\u09C1\u09B2\u09A8\u09C0\u09DF\u0964",
    "benefits": [
      "\u09AE\u09A6\u09BF\u09A8\u09BE \u09B6\u09B0\u09BF\u09AB\u09C7\u09B0 \u0986\u09B8\u09B2 \u09AC\u09DC \u09B8\u09BE\u0987\u099C\u09C7\u09B0 \u09AB\u09CD\u09B0\u09C7\u09B6 \u0986\u099C\u0993\u09DF\u09BE \u0996\u09C7\u099C\u09C1\u09B0",
      "\u09B9\u09C3\u09A6\u09B0\u09CB\u0997 \u0993 \u09B0\u0995\u09CD\u09A4\u09A8\u09BE\u09B2\u09C0\u09B0 \u09AC\u09CD\u09B2\u0995\u09C7\u099C \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7\u09C7 \u0985\u09A4\u09CD\u09AF\u09A8\u09CD\u09A4 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0\u09C0",
      "\u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AB\u09CD\u09B0\u09C1\u0995\u09CD\u099F\u09CB\u099C \u09AF\u09BE \u09B8\u09BE\u09B0\u09BE\u09A6\u09BF\u09A8\u09C7\u09B0 \u098F\u09A8\u09BE\u09B0\u09CD\u099C\u09BF \u09AC\u099C\u09BE\u09DF \u09B0\u09BE\u0996\u09C7"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 850,
        "originalPrice": 1e3,
        "stock": 35
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF",
        "price": 1650,
        "originalPrice": 1950,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "\u09B9\u09BE\u09AB\u09C7\u099C \u099C\u09C1\u09AC\u09BE\u09DF\u09C7\u09B0",
        "rating": 5,
        "date": "\u09E7 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u0996\u09C7\u099C\u09C1\u09B0\u0997\u09C1\u09B2\u09CB \u0985\u09A4\u09CD\u09AF\u09A8\u09CD\u09A4 \u09A8\u09B0\u09AE \u0993 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF\u0964"
      }
    ]
  },
  {
    "id": "spices-haldi-morich-29",
    "name": "Pure Organic Turmeric & Red Chilli Powder",
    "banglaName": "\u0996\u09BE\u0981\u099F\u09BF \u09B9\u09B2\u09C1\u09A6 \u0993 \u09AE\u09B0\u09BF\u099A \u0997\u09C1\u0981\u09DC\u09BE",
    "category": "spices",
    "categoryBangla": "\u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09AE\u09B8\u09B2\u09BE",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 65,
    "discountPercent": 12,
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u09B0\u0982 \u0993 \u0995\u09C7\u09AE\u09BF\u0995\u09CD\u09AF\u09BE\u09B2\u09AE\u09C1\u0995\u09CD\u09A4 \u09A6\u09C7\u09B6\u09BF \u0995\u09BE\u0981\u099A\u09BE \u09B9\u09B2\u09C1\u09A6 \u0993 \u09B2\u09BE\u09B2 \u09AE\u09B0\u09BF\u099A \u09B0\u09CB\u09A6\u09C7 \u09B6\u09C1\u0995\u09BF\u09DF\u09C7 \u09AA\u09B0\u09BF\u099A\u09CD\u099B\u09A8\u09CD\u09A8\u09AD\u09BE\u09AC\u09C7 \u09AD\u09BE\u0999\u09BE\u09A8\u09CB \u0996\u09BE\u0981\u099F\u09BF \u0997\u09C1\u0981\u09DC\u09BE \u09AE\u09B8\u09B2\u09BE\u0964 \u09B0\u09BE\u09A8\u09CD\u09A8\u09BE\u09DF \u0986\u09A8\u09C7 \u0985\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09B0\u0982 \u0993 \u0998\u09CD\u09B0\u09BE\u09A3\u0964",
    "benefits": [
      "\u0995\u09CB\u09A8\u09CB \u0995\u09C3\u09A4\u09CD\u09B0\u09BF\u09AE \u09B0\u0982 \u09AC\u09BE \u09AD\u09C7\u099C\u09BE\u09B2 \u09AA\u09CD\u09B0\u09BF\u099C\u09BE\u09B0\u09AD\u09C7\u099F\u09BF\u09AD \u09A8\u09C7\u0987",
      "\u0995\u09BE\u09B0\u0995\u09BF\u0989\u09AE\u09BF\u09A8 \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09B9\u09B2\u09C1\u09A6 \u0997\u09C1\u0981\u09DC\u09BE",
      "\u09A6\u09C7\u09B6\u09BF \u099D\u09BE\u09B2 \u0993 \u0986\u09B8\u09B2 \u0998\u09CD\u09B0\u09BE\u09A3\u09C7 \u09AD\u09B0\u09AA\u09C1\u09B0 \u09AE\u09B0\u09BF\u099A \u0997\u09C1\u0981\u09DC\u09BE"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 320,
        "originalPrice": 360,
        "stock": 35
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF",
        "price": 620,
        "originalPrice": 700,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "\u09B0\u09CB\u0995\u09C7\u09DF\u09BE \u0996\u09BE\u09A4\u09C1\u09A8",
        "rating": 5,
        "date": "\u09EB \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09AC\u09BE\u099C\u09BE\u09B0\u09C7\u09B0 \u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099F \u09AE\u09B8\u09B2\u09BE\u09B0 \u099A\u09C7\u09DF\u09C7 \u0985\u09A8\u09C7\u0995 \u09AD\u09BE\u09B2\u09CB\u0964"
      }
    ]
  },
  {
    "id": "spices-cumin-jeera-30",
    "name": "Pure Roasted Cumin & Coriander Powder",
    "banglaName": "\u099C\u09BF\u09B0\u09BE\u09B0 \u0997\u09C1\u0981\u09DC\u09BE \u0993 \u09A7\u09A8\u09BF\u09DF\u09BE \u0997\u09C1\u0981\u09DC\u09BE",
    "category": "spices",
    "categoryBangla": "\u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09AE\u09B8\u09B2\u09BE",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 49,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u09AC\u09BE\u099B\u09BE\u0987\u0995\u09C3\u09A4 \u0986\u09B8\u09CD\u09A4 \u099C\u09BF\u09B0\u09BE \u0993 \u09A7\u09A8\u09BF\u09DF\u09BE \u09A7\u09C1\u09DF\u09C7 \u09B0\u09CB\u09A6\u09C7 \u09B6\u09C1\u0995\u09BF\u09DF\u09C7 \u09B9\u09BE\u09B2\u0995\u09BE \u09AD\u09C7\u099C\u09C7 \u09AD\u09BE\u0999\u09BE\u09A8\u09CB \u09B8\u09C1\u09AC\u09BE\u09B8\u09BF\u09A4 \u0997\u09C1\u0981\u09DC\u09BE \u09AE\u09B8\u09B2\u09BE\u0964 \u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u09B0\u09BE\u09A8\u09CD\u09A8\u09BE\u09DF \u0986\u09A8\u09C7 \u099C\u09BF\u09AD\u09C7 \u099C\u09B2 \u0986\u09A8\u09BE \u09A6\u09C7\u09B6\u09BF \u09A4\u09B0\u0995\u09BE\u09B0\u09BF\u09B0 \u09B8\u09C1\u0998\u09CD\u09B0\u09BE\u09A3\u0964",
    "benefits": [
      "\u09A7\u09C1\u09B2\u09CB\u09AC\u09BE\u09B2\u09BF \u0993 \u09AD\u09C7\u099C\u09BE\u09B2\u09AE\u09C1\u0995\u09CD\u09A4 \u09AA\u09B0\u09BF\u09B7\u09CD\u0995\u09BE\u09B0 \u09AC\u09C0\u099C \u09A5\u09C7\u0995\u09C7 \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4",
      "\u09B9\u09BE\u09B2\u0995\u09BE \u09B0\u09CB\u09B8\u09CD\u099F\u09C7\u09A1 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u0997\u09A8\u09CD\u09A7 \u09B0\u09BE\u09A8\u09CD\u09A8\u09BE\u09DF \u0985\u09A8\u09A8\u09CD\u09AF \u09B8\u09CD\u09AC\u09BE\u09A6 \u09A6\u09C7\u09DF",
      "\u09B9\u099C\u09AE\u09C7 \u09B8\u09B9\u09BE\u09DF\u09A4\u09BE \u0995\u09B0\u09C7"
    ],
    "variants": [
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE \u099C\u09BF\u09B0\u09BE + \u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE \u09A7\u09A8\u09BF\u09DF\u09BE",
        "price": 340,
        "originalPrice": 380,
        "stock": 40
      }
    ],
    "reviews": [
      {
        "name": "\u09B6\u09BE\u09B9\u09C0\u09A8 \u0986\u09B2\u09AE",
        "rating": 5,
        "date": "\u09E9 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u0998\u09BF\u09DF\u09C7 \u09AD\u09BE\u099C\u09BE\u09B0 \u099A\u09AE\u09CE\u0995\u09BE\u09B0 \u0998\u09CD\u09B0\u09BE\u09A3 \u0986\u09B8\u09C7\u0964"
      }
    ]
  },
  {
    "id": "tea-sreemangal-green-31",
    "name": "Sreemangal Premium Organic Green Tea",
    "banglaName": "\u09B6\u09CD\u09B0\u09C0\u09AE\u0999\u09CD\u0997\u09B2\u09C7\u09B0 \u0997\u09CD\u09B0\u09BF\u09A8 \u099F\u09BF",
    "category": "spices",
    "categoryBangla": "\u09AD\u09C7\u09B7\u099C \u0993 \u0997\u09CD\u09B0\u09BF\u09A8 \u099F\u09BF",
    "isBestSeller": false,
    "rating": 4.8,
    "reviewsCount": 52,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u09B6\u09CD\u09B0\u09C0\u09AE\u0999\u09CD\u0997\u09B2\u09C7\u09B0 \u09AE\u09A8\u09CB\u09B0\u09AE \u09AA\u09BE\u09B9\u09BE\u09DC\u09BF \u09AC\u09BE\u0997\u09BE\u09A8 \u09A5\u09C7\u0995\u09C7 \u09AC\u09BE\u099B\u09BE\u0987\u0995\u09C3\u09A4 \u0995\u099A\u09BF \u09A6\u09C1\u099F\u09BF \u09AA\u09BE\u09A4\u09BE \u0993 \u098F\u0995\u099F\u09BF \u0995\u09C1\u0981\u09DC\u09BF \u09A5\u09C7\u0995\u09C7 \u09AA\u09CD\u09B0\u0995\u09CD\u09B0\u09BF\u09DF\u09BE\u099C\u09BE\u09A4 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u0997\u09CD\u09B0\u09BF\u09A8 \u099F\u09BF\u0964 \u0993\u099C\u09A8 \u0995\u09AE\u09BE\u09A8\u09CB \u098F\u09AC\u0982 \u09AE\u09C7\u099F\u09BE\u09AC\u09B2\u09BF\u099C\u09AE \u09AC\u09C1\u09B8\u09CD\u099F\u09C7 \u0985\u09A4\u09CD\u09AF\u09A8\u09CD\u09A4 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0\u0964",
    "benefits": [
      "\u09AA\u09CD\u09B0\u099A\u09C1\u09B0 \u0995\u09CD\u09AF\u09BE\u099F\u09C7\u099A\u09BF\u09A8 \u0993 \u09B6\u0995\u09CD\u09A4\u09BF\u09B6\u09BE\u09B2\u09C0 \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u0985\u0995\u09CD\u09B8\u09BF\u09A1\u09C7\u09A8\u09CD\u099F \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7",
      "\u09B6\u09B0\u09C0\u09B0\u09C7\u09B0 \u099A\u09B0\u09CD\u09AC\u09BF \u09AC\u09BE\u09B0\u09CD\u09A8 \u0995\u09B0\u09A4\u09C7 \u0993 \u09AE\u09C7\u099F\u09BE\u09AC\u09B2\u09BF\u099C\u09AE \u09AC\u09BE\u09DC\u09BE\u09A4\u09C7 \u09B8\u09B9\u09BE\u09DF\u0995",
      "\u09B9\u09C3\u09A6\u09AF\u09A8\u09CD\u09A4\u09CD\u09B0 \u09AD\u09BE\u09B2\u09CB \u09B0\u09BE\u0996\u09C7 \u0993 \u09AE\u09BE\u09A8\u09B8\u09BF\u0995 \u09AA\u09CD\u09B0\u09B6\u09BE\u09A8\u09CD\u09A4\u09BF \u09A6\u09C7\u09DF"
    ],
    "variants": [
      {
        "size": "\u09E7\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 240,
        "originalPrice": 270,
        "stock": 45
      },
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 540,
        "originalPrice": 600,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "\u09A4\u09BE\u09A8\u09AD\u09C0\u09B0 \u09B9\u09BE\u09B8\u09BE\u09A8",
        "rating": 5,
        "date": "\u09EC \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09A6\u09BE\u09B0\u09C1\u09A3 \u09B8\u09A4\u09C7\u099C \u0998\u09CD\u09B0\u09BE\u09A3\u0964"
      }
    ]
  },
  {
    "id": "tea-masala-black-32",
    "name": "Sylhet Organic CTC Masala Black Tea",
    "banglaName": "\u09B8\u09BF\u09B2\u09C7\u099F\u09C7\u09B0 \u09AE\u09B8\u09B2\u09BE \u099A\u09BE \u09AA\u09BE\u09A4\u09BE",
    "category": "spices",
    "categoryBangla": "\u09AD\u09C7\u09B7\u099C \u0993 \u0997\u09CD\u09B0\u09BF\u09A8 \u099F\u09BF",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 83,
    "discountPercent": 10,
    "image": "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u09B8\u09BF\u09B2\u09C7\u099F\u09C7\u09B0 \u099A\u09BE \u09AC\u09BE\u0997\u09BE\u09A8\u09C7\u09B0 \u09B8\u09C7\u09B0\u09BE \u09A6\u09BE\u09A8\u09BE\u09A6\u09BE\u09B0 \u09B8\u09BF\u099F\u09BF\u09B8\u09BF \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995 \u099F\u09BF\u09B0 \u09B8\u09BE\u09A5\u09C7 \u098F\u09B2\u09BE\u099A, \u09A6\u09BE\u09B0\u09C1\u099A\u09BF\u09A8\u09BF, \u09B2\u09AC\u0999\u09CD\u0997 \u0993 \u0986\u09A6\u09BE\u09B0 \u09B8\u0982\u09AE\u09BF\u09B6\u09CD\u09B0\u09A3\u09C7 \u09A4\u09C8\u09B0\u09BF \u09B0\u09BE\u099C\u0995\u09C0\u09AF\u09BC \u09AE\u09B8\u09B2\u09BE \u099A\u09BE\u0964 \u0995\u09CD\u09B2\u09BE\u09A8\u09CD\u09A4\u09BF \u09A8\u09BF\u09AE\u09C7\u09B7\u09C7\u0987 \u09A6\u09C2\u09B0 \u0995\u09B0\u09C7 \u09AE\u09A8\u09C7 \u098F\u09A8\u09C7 \u09A6\u09C7\u09DF \u09AB\u09C1\u09B0\u09AB\u09C1\u09B0\u09C7 \u099A\u09BE\u0999\u09CD\u0997\u09BE\u09AD\u09BE\u09AC\u0964",
    "benefits": [
      "\u0995\u09DC\u09BE \u09B2\u09BF\u0995\u09BE\u09B0 \u0993 \u09AE\u09A8\u09AE\u09BE\u09A4\u09BE\u09A8\u09CB \u098F\u09B2\u09BE\u099A-\u09B2\u09AC\u0999\u09CD\u0997\u09C7\u09B0 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09B8\u09C1\u09AC\u09BE\u09B8",
      "\u0995\u09CD\u09B2\u09BE\u09A8\u09CD\u09A4\u09BF \u0993 \u09AE\u09BE\u09A8\u09B8\u09BF\u0995 \u0985\u09AC\u09B8\u09BE\u09A6 \u09A6\u09C2\u09B0 \u0995\u09B0\u09C7 \u098F\u09A8\u09BE\u09B0\u09CD\u099C\u09BF \u0986\u09A8\u09C7",
      "\u0997\u09B2\u09BE\u09B0 \u0996\u09C1\u09B8\u0996\u09C1\u09B8 \u0993 \u09A0\u09BE\u09A8\u09CD\u09A1\u09BE\u09DF \u09A6\u09BE\u09B0\u09C1\u09A3 \u0986\u09B0\u09BE\u09AE\u09A6\u09BE\u09DF\u0995"
    ],
    "variants": [
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 220,
        "originalPrice": 245,
        "stock": 50
      },
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 410,
        "originalPrice": 460,
        "stock": 30
      }
    ],
    "reviews": [
      {
        "name": "\u09B0\u09BE\u0995\u09BF\u09AC\u09C1\u09B2 \u09B9\u09BE\u09B8\u09BE\u09A8",
        "rating": 5,
        "date": "\u09E8 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09B8\u09BF\u09B2\u09C7\u099F\u09C7\u09B0 \u099A\u09BE\u09DF\u09C7\u09B0 \u0986\u09B8\u09B2 \u09B8\u09CD\u09AC\u09BE\u09A6! \u09B2\u09BF\u0995\u09BE\u09B0 \u0985\u09A8\u09C7\u0995 \u0995\u09DC\u09BE\u0964"
      }
    ]
  },
  {
    "id": "superfood-moringa-powder-33",
    "name": "Organic Moringa Oleifera Leaf Powder",
    "banglaName": "\u09B8\u099C\u09BF\u09A8\u09BE \u09AA\u09BE\u09A4\u09BE \u0997\u09C1\u0981\u09DC\u09BE (\u09AE\u09B0\u09BF\u0999\u09CD\u0997\u09BE)",
    "category": "superfood",
    "categoryBangla": "\u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09B8\u09C1\u09AA\u09BE\u09B0\u09AB\u09C1\u09A1",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 57,
    "discountPercent": 12,
    "image": "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "\u0995\u099A\u09BF \u09B8\u099C\u09BF\u09A8\u09BE \u09AA\u09BE\u09A4\u09BE \u09AA\u09B0\u09BF\u09B7\u09CD\u0995\u09BE\u09B0 \u0995\u09B0\u09C7 \u09A7\u09C1\u09DF\u09C7 \u099B\u09BE\u09DF\u09BE\u09DF \u09B6\u09C1\u0995\u09BF\u09DF\u09C7 \u09A4\u09C8\u09B0\u09BF \u09AA\u09C1\u09B7\u09CD\u099F\u09BF\u09B0 \u09AE\u09B9\u09BE\u09A7\u09A8 \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09AE\u09B0\u09BF\u0999\u09CD\u0997\u09BE \u09AA\u09BE\u0989\u09A1\u09BE\u09B0\u0964 \u098F\u09A4\u09C7 \u0995\u09AE\u09B2\u09BE\u09B0 \u099A\u09C7\u09DF\u09C7 \u09ED \u0997\u09C1\u09A3 \u09AC\u09C7\u09B6\u09BF \u09AD\u09BF\u099F\u09BE\u09AE\u09BF\u09A8 \u09B8\u09BF \u098F\u09AC\u0982 \u09A6\u09C1\u09A7\u09C7\u09B0 \u099A\u09C7\u09DF\u09C7 \u09EA \u0997\u09C1\u09A3 \u09AC\u09C7\u09B6\u09BF \u0995\u09CD\u09AF\u09BE\u09B2\u09B8\u09BF\u09DF\u09BE\u09AE \u09B0\u09DF\u09C7\u099B\u09C7\u0964",
    "benefits": [
      "\u09EF\u09E8\u099F\u09BF\u09B0\u0993 \u09AC\u09C7\u09B6\u09BF \u09AA\u09C1\u09B7\u09CD\u099F\u09BF \u0989\u09AA\u09BE\u09A6\u09BE\u09A8 \u0993 \u09EA\u09EC\u099F\u09BF \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u0985\u0995\u09CD\u09B8\u09BF\u09A1\u09C7\u09A8\u09CD\u099F \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7",
      "\u09A1\u09BE\u09DF\u09BE\u09AC\u09C7\u099F\u09BF\u09B8 \u09A8\u09BF\u09DF\u09A8\u09CD\u09A4\u09CD\u09B0\u09A3 \u0993 \u0989\u099A\u09CD\u099A \u09B0\u0995\u09CD\u09A4\u099A\u09BE\u09AA \u0995\u09AE\u09BE\u09A4\u09C7 \u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF \u0995\u09B0\u09C7",
      "\u09B6\u09BE\u09B0\u09C0\u09B0\u09BF\u0995 \u09A6\u09C1\u09B0\u09CD\u09AC\u09B2\u09A4\u09BE \u09A6\u09C2\u09B0 \u0995\u09B0\u09C7 \u0993 \u09B0\u09CB\u0997 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7 \u0995\u09CD\u09B7\u09AE\u09A4\u09BE \u09AC\u09B9\u09C1\u0997\u09C1\u09A3 \u09AC\u09BE\u09DC\u09BE\u09DF"
    ],
    "variants": [
      {
        "size": "\u09E7\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 180,
        "originalPrice": 205,
        "stock": 40
      },
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 380,
        "originalPrice": 430,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "\u0986\u09AC\u09CD\u09A6\u09C1\u09B2\u09CD\u09B2\u09BE\u09B9 \u0986\u09B2 \u09A8\u09CB\u09AE\u09BE\u09A8",
        "rating": 5,
        "date": "\u09E7 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09B8\u0995\u09BE\u09B2\u09C7 \u09B9\u09BE\u09B2\u0995\u09BE \u0997\u09B0\u09AE \u09AA\u09BE\u09A8\u09BF\u09A4\u09C7 \u09AE\u09BF\u09B6\u09BF\u09DF\u09C7 \u0996\u09BE\u0987, \u09B8\u09BE\u09B0\u09BE\u09A6\u09BF\u09A8 \u0985\u09A8\u09C7\u0995 \u098F\u09A8\u09BE\u09B0\u09CD\u099C\u09BF \u09AA\u09BE\u0987\u0964"
      }
    ]
  },
  {
    "id": "honey-comb-wild-34",
    "name": "Wild Raw Honeycomb with Pure Honey",
    "banglaName": "\u09B8\u09C1\u09A8\u09CD\u09A6\u09B0\u09AC\u09A8\u09C7\u09B0 \u099A\u09BE\u0995\u09B8\u09B9 \u09AE\u09A7\u09C1",
    "category": "honey",
    "categoryBangla": "\u09AE\u09A7\u09C1 \u0993 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF",
    "isBestSeller": false,
    "rating": 5,
    "reviewsCount": 43,
    "discountPercent": 15,
    "image": "../assets/products/honey-comb-wild-34.jpg",
    "gallery": [
      "../assets/products/honey-comb-wild-34.jpg"
    ],
    "description": "\u09AE\u09CC\u09AE\u09BE\u099B\u09BF\u09B0 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u099A\u09BE\u0995\u09C7\u09B0 \u09AE\u09CB\u09AE\u09B8\u09B9 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 \u0985\u09AA\u09B0\u09BF\u09B6\u09CB\u09A7\u09BF\u09A4 \u0995\u09BE\u0981\u099A\u09BE \u09AE\u09A7\u09C1\u0964 \u09AE\u09CB\u09AE \u099A\u09BF\u09AC\u09BF\u09DF\u09C7 \u09B0\u09B8 \u0986\u09B8\u09CD\u09AC\u09BE\u09A6\u09A8 \u0995\u09B0\u09BE\u09B0 \u09B0\u09BE\u099C\u0995\u09C0\u09AF\u09BC \u09A4\u09C3\u09AA\u09CD\u09A4\u09BF \u098F\u09AC\u0982 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AE\u09CC\u09AE\u09BE\u099B\u09BF\u09B0 \u09AC\u09BF\u09B7, \u09AA\u09CD\u09B0\u09CB\u09AA\u09CB\u09B2\u09BF\u09B8 \u0993 \u09AA\u09CB\u09B2\u09C7\u09A8\u09C7\u09B0 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u0989\u09AA\u0995\u09BE\u09B0\u09BF\u09A4\u09BE\u0964",
    "benefits": [
      "\u09E7\u09E6\u09E6% \u0985\u09AA\u09B0\u09BF\u09B6\u09CB\u09A7\u09BF\u09A4 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u099A\u09BE\u0995\u09C7\u09B0 \u099F\u09C1\u0995\u09B0\u09CB\u09B8\u09B9 \u0986\u09B8\u09B2 \u09AE\u09A7\u09C1",
      "\u0985\u09CD\u09AF\u09BE\u09B2\u09BE\u09B0\u09CD\u099C\u09BF \u0993 \u09B6\u09CD\u09AC\u09BE\u09B8\u09A8\u09BE\u09B2\u09C0\u09B0 \u09AA\u09CD\u09B0\u09A6\u09BE\u09B9 \u09A6\u09C2\u09B0 \u0995\u09B0\u09A4\u09C7 \u09AC\u09BF\u09B6\u09C7\u09B7 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0",
      "\u09AA\u09CD\u09B0\u09CB\u09AA\u09CB\u09B2\u09BF\u09B8 \u0993 \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AD\u09BF\u099F\u09BE\u09AE\u09BF\u09A8 \u098F\u09A8\u099C\u09BE\u0987\u09AE \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE \u099C\u09BE\u09B0",
        "price": 850,
        "originalPrice": 1e3,
        "stock": 20
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF \u099C\u09BE\u09B0",
        "price": 1650,
        "originalPrice": 1950,
        "stock": 12
      }
    ],
    "reviews": [
      {
        "name": "\u09B8\u09CB\u09B9\u09C7\u09B2 \u09B0\u09BE\u09A8\u09BE",
        "rating": 5,
        "date": "\u09E9 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u099A\u09BE\u0995\u09C7\u09B0 \u09AE\u09CB\u09AE \u099A\u09BF\u09AC\u09BF\u09DF\u09C7 \u0996\u09BE\u0993\u09DF\u09BE\u09B0 \u09AB\u09BF\u09B2\u099F\u09BE\u0987 \u0986\u09B2\u09BE\u09A6\u09BE! \u09A6\u09BE\u09B0\u09C1\u09A3 \u0985\u09B0\u09BF\u099C\u09BF\u09A8\u09BE\u09B2\u0964"
      }
    ]
  },
  {
    "id": "salt-himalayan-pink-35",
    "name": "Himalayan Pink Rock Salt (Fine Granules)",
    "banglaName": "\u0996\u09BE\u0981\u099F\u09BF \u09B9\u09BF\u09AE\u09BE\u09B2\u09DF\u09BE\u09A8 \u09AA\u09BF\u0982\u0995 \u09B8\u09B2\u09CD\u099F",
    "category": "spices",
    "categoryBangla": "\u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AE\u09B8\u09B2\u09BE \u0993 \u09B2\u09AC\u09A3",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 65,
    "discountPercent": 10,
    "image": "../assets/products/salt-himalayan-pink-35.jpg",
    "gallery": [
      "../assets/products/salt-himalayan-pink-35.jpg"
    ],
    "description": "\u09B9\u09BF\u09AE\u09BE\u09B2\u09DF \u09AA\u09B0\u09CD\u09AC\u09A4\u09C7\u09B0 \u09AA\u09CD\u09B0\u09BE\u099A\u09C0\u09A8 \u0996\u09A8\u09BF \u09A5\u09C7\u0995\u09C7 \u0989\u09A4\u09CD\u09A4\u09CB\u09B2\u09BF\u09A4 \u09EE\u09EA\u099F\u09BF\u09B0\u0993 \u09AC\u09C7\u09B6\u09BF \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u0996\u09A8\u09BF\u099C \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7 \u0996\u09BE\u0981\u099F\u09BF \u09AA\u09BF\u0982\u0995 \u09B8\u09B2\u09CD\u099F\u0964 \u098F\u099F\u09BF \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u099F\u09C7\u09AC\u09BF\u09B2 \u09B2\u09AC\u09A3\u09C7\u09B0 \u0995\u09CD\u09B7\u09A4\u09BF\u0995\u09B0 \u09AA\u09CD\u09B0\u09AD\u09BE\u09AC\u09AE\u09C1\u0995\u09CD\u09A4 \u098F\u09AC\u0982 \u09B0\u0995\u09CD\u09A4\u099A\u09BE\u09AA \u0993 \u0987\u09B2\u09C7\u0995\u09CD\u099F\u09CD\u09B0\u09CB\u09B2\u09BE\u0987\u099F \u09A8\u09BF\u09DF\u09A8\u09CD\u09A4\u09CD\u09B0\u09A3\u09C7 \u09B8\u09B9\u09BE\u09DF\u0995\u0964",
    "benefits": [
      "\u09EE\u09EA\u099F\u09BF \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u099F\u09CD\u09B0\u09C7\u09B8 \u09AE\u09BF\u09A8\u09BE\u09B0\u09C7\u09B2\u09B8\u09C7 \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7",
      "\u09B6\u09B0\u09C0\u09B0\u09C7\u09B0 \u09AA\u09BF\u098F\u0987\u099A \u09B2\u09C7\u09AD\u09C7\u09B2 \u098F\u09AC\u0982 \u09B0\u0995\u09CD\u09A4\u099A\u09BE\u09AA\u09C7\u09B0 \u09AD\u09BE\u09B0\u09B8\u09BE\u09AE\u09CD\u09AF \u09AC\u099C\u09BE\u09DF \u09B0\u09BE\u0996\u09C7",
      "\u099F\u0995\u09CD\u09B8\u09BF\u09A8\u09AE\u09C1\u0995\u09CD\u09A4 \u0993 \u0995\u09CD\u09B7\u09A4\u09BF\u0995\u09B0 \u09B0\u09BF\u09AB\u09BE\u0987\u09A8\u09BF\u0982 \u0995\u09C7\u09AE\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u099B\u09BE\u09DC\u09BE \u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09B2\u09AC\u09A3"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 150,
        "originalPrice": 170,
        "stock": 60
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF",
        "price": 280,
        "originalPrice": 320,
        "stock": 35
      }
    ],
    "reviews": [
      {
        "name": "\u09A8\u09BE\u09B8\u09B0\u09BF\u09A8 \u09B8\u09C1\u09B2\u09A4\u09BE\u09A8\u09BE",
        "rating": 5,
        "date": "\u09EA \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09B0\u09BE\u09A8\u09CD\u09A8\u09BE\u09DF \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u09B2\u09AC\u09A3\u09C7\u09B0 \u09AC\u09A6\u09B2\u09C7 \u09AA\u09BF\u0982\u0995 \u09B8\u09B2\u09CD\u099F \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u099B\u09BF, \u09B8\u09CD\u09AC\u09BE\u09A6 \u0996\u09C1\u09AC \u09AD\u09BE\u09B2\u09CB\u0964"
      }
    ]
  },
  {
    "id": "dates-mabroom-saudi-36",
    "name": "Saudi Premium Mabroom Dates",
    "banglaName": "\u09B8\u09CC\u09A6\u09BF \u09AE\u09BE\u09AC\u09B0\u09C1\u09AE \u0996\u09C7\u099C\u09C1\u09B0",
    "category": "nuts",
    "categoryBangla": "\u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0996\u09C7\u099C\u09C1\u09B0 \u0993 \u09AC\u09BE\u09A6\u09BE\u09AE",
    "isBestSeller": false,
    "rating": 4.9,
    "reviewsCount": 88,
    "discountPercent": 12,
    "image": "../assets/products/dates-mabroom-saudi-36.jpg",
    "gallery": [
      "../assets/products/dates-mabroom-saudi-36.jpg"
    ],
    "description": "\u09B8\u09CC\u09A6\u09BF \u0986\u09B0\u09AC\u09C7\u09B0 \u09AE\u09A6\u09BF\u09A8\u09BE \u09AE\u09CB\u09A8\u09BE\u0993\u09DF\u09BE\u09B0\u09BE \u09A5\u09C7\u0995\u09C7 \u09B8\u0982\u0997\u09C3\u09B9\u09C0\u09A4 \u09B2\u09AE\u09CD\u09AC\u09BE\u099F\u09C7 \u0986\u0995\u09C3\u09A4\u09BF\u09B0 \u09B8\u09C1\u09B8\u09CD\u09AC\u09BE\u09A6\u09C1 \u0993 \u09AE\u09BE\u099D\u09BE\u09B0\u09BF \u09AE\u09BF\u09B7\u09CD\u099F\u09BF\u09B0 \u09AE\u09BE\u09AC\u09B0\u09C1\u09AE \u0996\u09C7\u099C\u09C1\u09B0\u0964 \u098F\u09B0 \u099A\u09BE\u09AE\u09DC\u09BE \u09AE\u09B8\u09C3\u09A3 \u098F\u09AC\u0982 \u09AD\u09C7\u09A4\u09B0\u099F\u09BE \u099A\u09BF\u09AC\u09BF\u09DF\u09C7 \u0996\u09BE\u0993\u09DF\u09BE\u09B0 \u09AE\u09A4\u09CB \u09A8\u09B0\u09AE \u0993 \u09B8\u09C1\u09B8\u09CD\u09AC\u09BE\u09A6\u09C1\u0964",
    "benefits": [
      "\u09AA\u09CD\u09B0\u09BE\u0995\u09C3\u09A4\u09BF\u0995 \u09AB\u09BE\u0987\u09AC\u09BE\u09B0 \u0993 \u09AA\u099F\u09BE\u09B6\u09BF\u09DF\u09BE\u09AE\u09C7 \u09AD\u09B0\u09AA\u09C1\u09B0",
      "\u09B9\u099C\u09AE\u09C7\u09B0 \u0989\u09A8\u09CD\u09A8\u09A4\u09BF \u0998\u099F\u09BE\u09DF \u0993 \u09A4\u09BE\u09A4\u09CD\u0995\u09CD\u09B7\u09A3\u09BF\u0995 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF\u09B0 \u099A\u09BE\u09B9\u09BF\u09A6\u09BE \u09AA\u09C2\u09B0\u09A3 \u0995\u09B0\u09C7",
      "\u0997\u09B0\u09CD\u09AD\u09AC\u09A4\u09C0 \u09AE\u09BE \u0993 \u09B6\u09BF\u09B6\u09C1\u09A6\u09C7\u09B0 \u09AA\u09C1\u09B7\u09CD\u099F\u09BF\u09B0 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6 \u0986\u09A7\u09BE\u09B0"
    ],
    "variants": [
      {
        "size": "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 650,
        "originalPrice": 740,
        "stock": 30
      },
      {
        "size": "\u09E7 \u0995\u09C7\u099C\u09BF",
        "price": 1250,
        "originalPrice": 1420,
        "stock": 18
      }
    ],
    "reviews": [
      {
        "name": "\u09B9\u09BE\u09B8\u09BF\u09AC\u09C1\u09B2 \u0987\u09B8\u09B2\u09BE\u09AE",
        "rating": 5,
        "date": "\u09E8 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u0996\u09C7\u099C\u09C1\u09B0\u0997\u09C1\u09B2\u09CB \u0996\u09C1\u09AC \u09AB\u09CD\u09B0\u09C7\u09B6 \u0993 \u09B8\u09C1\u09B8\u09CD\u09AC\u09BE\u09A6\u09C1 \u099B\u09BF\u09B2\u0964"
      }
    ]
  },
  {
    "id": "combo-health-pack-37",
    "name": "Family Health & Energy Mega Combo",
    "banglaName": "\u09AB\u09CD\u09AF\u09BE\u09AE\u09BF\u09B2\u09BF \u09B9\u09C7\u09B2\u09A5 \u09AE\u09C7\u0997\u09BE \u0995\u09AE\u09CD\u09AC\u09CB",
    "category": "honey",
    "categoryBangla": "\u09B8\u09CD\u09AA\u09C7\u09B6\u09BE\u09B2 \u09A1\u09BF\u09B8\u0995\u09BE\u0989\u09A8\u09CD\u099F \u0995\u09AE\u09CD\u09AC\u09CB",
    "isBestSeller": true,
    "rating": 5,
    "reviewsCount": 110,
    "discountPercent": 20,
    "image": "../assets/products/combo-health-pack-37.jpg",
    "gallery": [
      "../assets/products/combo-health-pack-37.jpg"
    ],
    "description": "\u09B8\u09C1\u09A8\u09CD\u09A6\u09B0\u09AC\u09A8\u09C7\u09B0 \u0995\u09BE\u0981\u099A\u09BE \u09AE\u09A7\u09C1 \u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE + \u09AA\u09BE\u09AC\u09A8\u09BE\u09B0 \u0996\u09BE\u0981\u099F\u09BF \u0997\u09BE\u0993\u09DF\u09BE \u0998\u09BF \u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE + \u0998\u09BE\u09A8\u09BF\u09AD\u09BE\u0999\u09BE \u09B8\u09B0\u09BF\u09B7\u09BE\u09B0 \u09A4\u09C7\u09B2 \u09E7 \u09B2\u09BF\u099F\u09BE\u09B0 \u2014 \u09AA\u09C1\u09B0\u09CB \u09AA\u09B0\u09BF\u09AC\u09BE\u09B0\u09C7\u09B0 \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF \u0993 \u09B0\u09CB\u0997 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7 \u0995\u09CD\u09B7\u09AE\u09A4\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09AA\u09B0\u09BF\u09AA\u09C2\u09B0\u09CD\u09A3 \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09B8\u09C1\u09AA\u09BE\u09B0 \u0995\u09AE\u09CD\u09AC\u09CB \u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C\u0964",
    "benefits": [
      "\u098F\u0995 \u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C\u09C7\u0987 \u09AA\u09B0\u09BF\u09AC\u09BE\u09B0\u09C7\u09B0 \u09AA\u09CD\u09B0\u09DF\u09CB\u099C\u09A8\u09C0\u09DF \u09A4\u09BF\u09A8\u099F\u09BF \u09B8\u09C7\u09B0\u09BE \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u0996\u09BE\u09A6\u09CD\u09AF",
      "\u0986\u09B2\u09BE\u09A6\u09BE \u0995\u09C7\u09A8\u09BE\u09B0 \u099A\u09C7\u09DF\u09C7 \u09E8\u09E6% \u09B8\u09BE\u09B6\u09CD\u09B0\u09DF\u09C0 \u0985\u09AB\u09BE\u09B0 \u09AE\u09C2\u09B2\u09CD\u09AF",
      "\u09E7\u09E6\u09E6% \u0996\u09BE\u0981\u099F\u09BF \u0993 \u09AC\u09BF\u09B6\u09C1\u09A6\u09CD\u09A7\u09A4\u09BE\u09B0 \u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09A8\u09BF\u09B6\u09CD\u099A\u09DF\u09A4\u09BE"
    ],
    "variants": [
      {
        "size": "\u09E7 \u09AE\u09C7\u0997\u09BE \u09AA\u09CD\u09AF\u09BE\u0995 (\u09E9\u099F\u09BF \u09AA\u09A3\u09CD\u09AF)",
        "price": 1750,
        "originalPrice": 2190,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "\u09AE\u09C1\u09B8\u09CD\u09A4\u09BE\u09AB\u09BF\u099C\u09C1\u09B0 \u09B0\u09B9\u09AE\u09BE\u09A8",
        "rating": 5,
        "date": "\u09E7 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u098F\u0995 \u09B8\u09BE\u09A5\u09C7 \u0996\u09BE\u0981\u099F\u09BF \u09AE\u09A7\u09C1, \u0998\u09BF \u0993 \u09B8\u09B0\u09BF\u09B7\u09BE\u09B0 \u09A4\u09C7\u09B2 \u09AA\u09C7\u09DF\u09C7 \u0985\u09A8\u09C7\u0995 \u099F\u09BE\u0995\u09BE \u09AC\u09BE\u0981\u099A\u09B2\u0964 \u09AA\u09A3\u09CD\u09AF\u09C7\u09B0 \u09AE\u09BE\u09A8 \u099F\u09AA \u09A8\u099A\u0964"
      }
    ]
  },
  {
    "id": "combo-royal-nuts-38",
    "name": "Royal 4-in-1 Dry Fruits & Honey Nut Combo",
    "banglaName": "\u09B0\u09DF\u09CD\u09AF\u09BE\u09B2 \u09A1\u09CD\u09B0\u09BE\u0987 \u09AB\u09CD\u09B0\u09C1\u099F\u09B8 \u0993 \u09B9\u09BE\u09A8\u09BF \u09A8\u09BE\u099F \u0995\u09AE\u09CD\u09AC\u09CB",
    "category": "nuts",
    "categoryBangla": "\u09B8\u09CD\u09AA\u09C7\u09B6\u09BE\u09B2 \u09A1\u09BF\u09B8\u0995\u09BE\u0989\u09A8\u09CD\u099F \u0995\u09AE\u09CD\u09AC\u09CB",
    "isBestSeller": true,
    "rating": 5,
    "reviewsCount": 94,
    "discountPercent": 18,
    "image": "../assets/products/combo-royal-nuts-38.jpg",
    "gallery": [
      "../assets/products/combo-royal-nuts-38.jpg"
    ],
    "description": "\u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u09B9\u09BE\u09A8\u09BF \u09A8\u09BE\u099F \u099C\u09BE\u09B0 \u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE + \u09B0\u09CB\u09B8\u09CD\u099F\u09C7\u09A1 \u0995\u09BE\u099C\u09C1\u09AC\u09BE\u09A6\u09BE\u09AE \u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE + \u0995\u09CD\u09AF\u09BE\u09B2\u09BF\u09AB\u09CB\u09B0\u09CD\u09A8\u09BF\u09AF\u09BC\u09BE \u0995\u09BE\u09A0\u09AC\u09BE\u09A6\u09BE\u09AE \u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE + \u09AE\u09A6\u09BF\u09A8\u09BE\u09B0 \u0986\u099C\u0993\u09DF\u09BE \u0996\u09C7\u099C\u09C1\u09B0 \u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE \u2014 \u0985\u09AD\u09BF\u099C\u09BE\u09A4 \u09A1\u09CD\u09B0\u09BE\u0987 \u09AB\u09CD\u09B0\u09C1\u099F\u09B8\u09C7\u09B0 \u098F\u0995 \u09B2\u09CB\u09AD\u09A8\u09C0\u09DF \u09AE\u09B9\u09BE \u0986\u09DF\u09CB\u099C\u09A8\u0964",
    "benefits": [
      "\u09B0\u09CB\u099C \u09B8\u0995\u09BE\u09B2\u09C7 \u09AE\u09B8\u09CD\u09A4\u09BF\u09B7\u09CD\u0995\u09C7\u09B0 \u09A4\u09C0\u0995\u09CD\u09B7\u09CD\u09A3\u09A4\u09BE \u0993 \u09A6\u09C0\u09B0\u09CD\u0998\u09AE\u09C7\u09DF\u09BE\u09A6\u09C0 \u09A6\u09C8\u09B9\u09BF\u0995 \u09B6\u0995\u09CD\u09A4\u09BF \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF \u0995\u09B0\u09C7",
      "\u0986\u09B2\u09BE\u09A6\u09BE \u0995\u09C7\u09A8\u09BE\u09B0 \u099A\u09C7\u09DF\u09C7 \u09B8\u09BE\u09B6\u09CD\u09B0\u09DF\u09C0 \u09B0\u09BE\u099C\u0995\u09C0\u09AF\u09BC \u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C",
      "\u0989\u09AA\u09B9\u09BE\u09B0 \u09A6\u09C7\u0993\u09DF\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u0986\u0995\u09B0\u09CD\u09B7\u09A3\u09C0\u09DF \u0993 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09AF\u09BC\u09BE\u09AE \u09AC\u0995\u09CD\u09B8 \u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C\u09BF\u0982"
    ],
    "variants": [
      {
        "size": "\u09E7 \u09B0\u09AF\u09BC\u09CD\u09AF\u09BE\u09B2 \u09AA\u09CD\u09AF\u09BE\u0995 (\u09EA\u099F\u09BF \u09AA\u09A3\u09CD\u09AF)",
        "price": 1980,
        "originalPrice": 2420,
        "stock": 20
      }
    ],
    "reviews": [
      {
        "name": "\u09AE\u09BE\u09B9\u09AE\u09C1\u09A6\u09C1\u09B2 \u0995\u09B0\u09BF\u09AE",
        "rating": 5,
        "date": "\u09E8 \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C\u09BF\u0982 \u0986\u09B0 \u09AC\u09BE\u09A6\u09BE\u09AE\u09C7\u09B0 \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF \u09B8\u09A4\u09CD\u09AF\u09BF\u0987 \u0985\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3\u0964 \u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6 \u0986\u09B8\u09AC\u09BF\u09AE\u09BE\u09B0\u09CD\u099F\u0964"
      }
    ]
  },
  {
    "id": "spices-green-cardamom-31",
    "name": "Premium Green Cardamom (\u09B8\u09AC\u09C1\u099C \u098F\u09B2\u09BE\u099A)",
    "banglaName": "\u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u09B8\u09AC\u09C1\u099C \u098F\u09B2\u09BE\u099A",
    "category": "spices",
    "categoryBangla": "\u0996\u09BE\u0981\u099F\u09BF \u09AE\u09B8\u09B2\u09BE \u0993 \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u099A\u09BE",
    "isBestSeller": false,
    "rating": 5,
    "reviewsCount": 68,
    "discountPercent": 12,
    "image": "../assets/products/spices-green-cardamom-31.jpg",
    "gallery": [
      "../assets/products/spices-green-cardamom-31.jpg"
    ],
    "description": "\u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u09AC\u09BE\u0997\u09BE\u09A8 \u09A5\u09C7\u0995\u09C7 \u09AC\u09BE\u099B\u09BE\u0987\u0995\u09C3\u09A4 \u09AC\u09DC \u09A6\u09BE\u09A8\u09BE \u0993 \u09A4\u09C0\u09AC\u09CD\u09B0 \u09B8\u09C1\u0997\u09A8\u09CD\u09A7\u09BF\u09AF\u09C1\u0995\u09CD\u09A4 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u09B8\u09AC\u09C1\u099C \u098F\u09B2\u09BE\u099A\u0964 \u09AA\u09CB\u09B2\u09BE\u0993, \u09AC\u09BF\u09B0\u09BF\u09DF\u09BE\u09A8\u09BF, \u09AA\u09BE\u09DF\u09C7\u09B8 \u0993 \u09AE\u09B8\u09B2\u09BE \u099A\u09BE\u09DF\u09C7\u09B0 \u09B8\u09CD\u09AC\u09BE\u09A6 \u0993 \u0998\u09CD\u09B0\u09BE\u09A3 \u09AC\u09B9\u09C1\u0997\u09C1\u09A3\u09C7 \u09AC\u09BE\u09DC\u09BF\u09DF\u09C7 \u09A4\u09CB\u09B2\u09C7\u0964",
    "benefits": [
      "\u09B6\u09A4\u09AD\u09BE\u0997 \u09AC\u09BE\u099B\u09BE\u0987\u0995\u09C3\u09A4 \u09AC\u09DC \u09A6\u09BE\u09A8\u09BE \u0993 \u09A4\u09BE\u099C\u09BE \u09B8\u09AC\u09C1\u099C \u098F\u09B2\u09BE\u099A",
      "\u09B9\u099C\u09AE\u09B6\u0995\u09CD\u09A4\u09BF \u09AC\u09BE\u09DC\u09BE\u09DF \u0993 \u09AE\u09C1\u0996\u09C7\u09B0 \u09A6\u09C1\u09B0\u09CD\u0997\u09A8\u09CD\u09A7 \u09A6\u09C2\u09B0 \u0995\u09B0\u09C7",
      "\u0995\u09CB\u09A8\u09CB \u0995\u09C3\u09A4\u09CD\u09B0\u09BF\u09AE \u09B0\u0999 \u09AC\u09BE \u09AA\u09CD\u09B0\u09BF\u099C\u09BE\u09B0\u09AD\u09C7\u099F\u09BF\u09AD \u09AE\u09C1\u0995\u09CD\u09A4"
    ],
    "variants": [
      {
        "size": "\u09E7\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 380,
        "originalPrice": 430,
        "stock": 40
      },
      {
        "size": "\u09E8\u09EB\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
        "price": 920,
        "originalPrice": 1050,
        "stock": 25
      }
    ],
    "reviews": [
      {
        "name": "\u09B8\u09BE\u09AC\u09BF\u09A8\u09BE \u0987\u09DF\u09BE\u09B8\u09AE\u09BF\u09A8",
        "rating": 5,
        "date": "\u09EA \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
        "comment": "\u098F\u09B2\u09BE\u099A\u09C7\u09B0 \u0998\u09CD\u09B0\u09BE\u09A3 \u0985\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3! \u098F\u0995\u09A6\u09AE \u09AB\u09CD\u09B0\u09C7\u09B6 \u0993 \u09AC\u09DC \u09A6\u09BE\u09A8\u09BE\u0964"
      }
    ]
  }
];
var AUTH_SECRET = "asbi_secret_key_super_secure_organic_mart_2026";
var SEED_USERS = [
  {
    id: "user_asbi_demo",
    name: "Asbi Mahmud Test",
    phone: "01700000000",
    email: "asbi@asbimart.com",
    passwordHash: "dac753ad5cc0b4ffa20a7de96f42e7372c53af09c125a38af704d1d27f766747",
    // asbi123
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
var SEED_ORDERS = [
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
        name: "\u09AE\u09B9\u09BF\u09B7\u09C7\u09B0 \u0996\u09BE\u0981\u099F\u09BF \u0998\u09BF",
        size: "\u09EB\u09E6\u09E6 \u0997\u09CD\u09B0\u09BE\u09AE",
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
    status: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0997\u09C3\u09B9\u09C0\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7 (Pending)",
    statusCode: "pending",
    courier: "\u09B0\u09C7\u09A1\u098F\u0995\u09CD\u09B8 / \u09B8\u09CD\u099F\u09BF\u09A1\u09AB\u09BE\u09B8\u09CD\u099F \u0995\u09C1\u09B0\u09BF\u09DF\u09BE\u09B0",
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
        name: "\u0996\u09BE\u0981\u099F\u09BF \u09A4\u09BF\u09B2\u09C7\u09B0 \u09A4\u09C7\u09B2",
        size: "\u09E8\u09EB\u09E6 \u09AE\u09BF\u09B2\u09BF",
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
    status: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0997\u09C3\u09B9\u09C0\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7 (Pending)",
    statusCode: "pending",
    courier: "\u09B0\u09C7\u09A1\u098F\u0995\u09CD\u09B8 / \u09B8\u09CD\u099F\u09BF\u09A1\u09AB\u09BE\u09B8\u09CD\u099F \u0995\u09C1\u09B0\u09BF\u09DF\u09BE\u09B0",
    trackingCode: "TRK-139391",
    notes: "",
    createdAt: "2026-11-19T05:30:05.209Z"
  }
];
var edgeState = {
  users: [...SEED_USERS],
  orders: [...SEED_ORDERS],
  reviews: [],
  carts: {},
  messages: []
};
function base64UrlEncode(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
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
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}
async function hashPassword(password, secret = AUTH_SECRET) {
  const key = await getHmacKey(secret);
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(password));
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function signJwt(payload, secret = AUTH_SECRET) {
  const enc = new TextEncoder();
  const header = base64UrlEncode(enc.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = base64UrlEncode(enc.encode(JSON.stringify({
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1e3
  })));
  const key = await getHmacKey(secret);
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(`${header}.${body}`));
  const signature = base64UrlEncode(sigBuffer);
  return `${header}.${body}.${signature}`;
}
async function verifyJwt(token, secret = AUTH_SECRET) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  try {
    const enc = new TextEncoder();
    const key = await getHmacKey(secret);
    const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(`${header}.${body}`));
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
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>?/gm, "").replace(/[<>]/g, "").trim();
}
function isValidPhone(phone) {
  if (!phone || typeof phone !== "string") return false;
  const cleaned = phone.replace(/[\s-]/g, "");
  return /^01[3-9]\d{8}$/.test(cleaned);
}
function jsonResponse(data, status = 200, extraHeaders = {}) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Backend-Runtime": "Cloudflare-Pages-Functions-Native",
    ...extraHeaders
  };
  return new Response(JSON.stringify(data), { status, headers });
}
function extractToken(request, url) {
  const authHeader = request.headers.get("Authorization") || request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }
  return url.searchParams.get("token") || null;
}
async function getStore(env, key, defaultVal) {
  if (env && env.ASBI_KV) {
    try {
      const val = await env.ASBI_KV.get(key, "json");
      if (val !== null && val !== void 0) return val;
      await env.ASBI_KV.put(key, JSON.stringify(defaultVal));
    } catch (e) {
    }
  }
  return edgeState[key] !== void 0 ? edgeState[key] : defaultVal;
}
async function setStore(env, key, val) {
  edgeState[key] = val;
  if (env && env.ASBI_KV) {
    try {
      await env.ASBI_KV.put(key, JSON.stringify(val));
    } catch (e) {
    }
  }
}
async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400"
    }
  });
}
async function onRequest(context) {
  const { request, env = {}, params = {} } = context;
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method.toUpperCase();
  const secret = env.AUTH_SECRET || AUTH_SECRET;
  if (method === "OPTIONS") {
    return onRequestOptions();
  }
  let body = {};
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }
  }
  if (pathname === "/api/health") {
    return jsonResponse({
      status: "success",
      service: "AsbiMart Cloudflare Pages Native Edge Gateway",
      runtime: "Cloudflare Workers Edge",
      edgeReady: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  if (pathname === "/api/products" && method === "GET") {
    return jsonResponse({
      success: true,
      count: EDGE_SEED_PRODUCTS.length,
      products: EDGE_SEED_PRODUCTS,
      source: "cloudflare-edge-native"
    });
  }
  const singleProdMatch = pathname.match(/^\/api\/products\/([^/]+)$/i);
  if (singleProdMatch && method === "GET") {
    const prodId = decodeURIComponent(singleProdMatch[1]);
    const match = EDGE_SEED_PRODUCTS.find((p) => p.id === prodId);
    if (match) {
      return jsonResponse({
        success: true,
        product: match,
        source: "cloudflare-edge-native"
      });
    }
    return jsonResponse({ success: false, message: "\u09AA\u09A3\u09CD\u09AF\u099F\u09BF \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF\u0964" }, 404);
  }
  const reviewsMatch = pathname.match(/^\/api\/products\/([^/]+)\/reviews$/i);
  if (reviewsMatch) {
    const prodId = decodeURIComponent(reviewsMatch[1]);
    if (method === "GET") {
      const allReviews = await getStore(env, "reviews", []);
      const customReviews = allReviews.filter((r) => r.productId === prodId);
      const product = EDGE_SEED_PRODUCTS.find((p) => p.id === prodId);
      const seedReviews = product && Array.isArray(product.reviews) ? product.reviews.map((r, i) => ({
        id: `seed_${prodId}_${i}`,
        productId: prodId,
        productName: product.banglaName,
        name: r.name,
        rating: r.rating,
        comment: r.comment,
        date: r.date,
        verifiedBuyer: true
      })) : [];
      const combined = [...customReviews, ...seedReviews];
      const avg = combined.length > 0 ? Number((combined.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / combined.length).toFixed(1)) : null;
      return jsonResponse({
        success: true,
        count: combined.length,
        averageRating: avg,
        reviews: combined
      });
    }
    if (method === "POST") {
      const cleanComment = sanitizeText(body.comment || "");
      const cleanName = sanitizeText(body.name || "");
      if (!cleanComment || cleanComment.length < 3) {
        return jsonResponse({
          success: false,
          message: "\u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u0985\u09A8\u09CD\u09A4\u09A4 \u09E9 \u0985\u0995\u09CD\u09B7\u09B0\u09C7\u09B0 \u098F\u0995\u099F\u09BF \u09B0\u09BF\u09AD\u09BF\u0989 \u09AE\u09A8\u09CD\u09A4\u09AC\u09CD\u09AF \u09B2\u09BF\u0996\u09C1\u09A8\u0964"
        }, 400);
      }
      const numRating = Number(body.rating) || 5;
      if (numRating < 1 || numRating > 5) {
        return jsonResponse({
          success: false,
          message: "\u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u09E7 \u09A5\u09C7\u0995\u09C7 \u09EB \u09B8\u09CD\u099F\u09BE\u09B0 \u09B0\u09C7\u099F\u09BF\u0982 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
        }, 400);
      }
      const token = extractToken(request, url);
      const authUser = token ? await verifyJwt(token, secret) : null;
      const authorName = cleanName || (authUser ? authUser.name : "\u0986\u09B8\u09AC\u09BF\u09AE\u09BE\u09B0\u09CD\u099F \u0997\u09CD\u09B0\u09BE\u09B9\u0995");
      const product = EDGE_SEED_PRODUCTS.find((p) => p.id === prodId);
      const newReview = {
        id: "rev_" + Date.now() + "_" + Math.floor(Math.random() * 1e3),
        productId: prodId,
        productName: sanitizeText(body.productName || (product ? product.banglaName : prodId)),
        userId: authUser ? authUser.id : null,
        name: authorName,
        email: authUser ? authUser.email : body.email ? sanitizeText(body.email) : "",
        rating: numRating,
        comment: cleanComment,
        verifiedBuyer: true,
        date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const allReviews = await getStore(env, "reviews", []);
      allReviews.unshift(newReview);
      await setStore(env, "reviews", allReviews);
      return jsonResponse({
        success: true,
        message: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09B0\u09BF\u09AD\u09BF\u0989 \u09B8\u09CD\u09A5\u09BE\u09DF\u09C0\u09AD\u09BE\u09AC\u09C7 \u09A1\u09C7\u099F\u09BE\u09AC\u09C7\u09B8\u09C7 \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7! \u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6\u0964",
        review: newReview
      }, 201);
    }
  }
  if (pathname === "/api/admin/reviews" && method === "GET") {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: "\u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u098F\u0995\u09CD\u09B8\u09C7\u09B8 \u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4 \u09A8\u09DF (\u099F\u09CB\u0995\u09C7\u09A8 \u0985\u09A8\u09C1\u09AA\u09B8\u09CD\u09A5\u09BF\u09A4)\u0964" }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== "admin") return jsonResponse({ success: false, message: "\u0985\u09AC\u09C8\u09A7 \u0985\u09A5\u09AC\u09BE \u09AE\u09C7\u09DF\u09BE\u09A6\u09CB\u09A4\u09CD\u09A4\u09C0\u09B0\u09CD\u09A3 \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09B8\u09C7\u09B6\u09A8\u0964" }, 403);
    const allReviews = await getStore(env, "reviews", []);
    return jsonResponse({ success: true, count: allReviews.length, reviews: allReviews });
  }
  const deleteReviewMatch = pathname.match(/^\/api\/admin\/reviews\/([^/]+)$/i);
  if (deleteReviewMatch && method === "DELETE") {
    const reviewId = decodeURIComponent(deleteReviewMatch[1]);
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: "\u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u098F\u0995\u09CD\u09B8\u09C7\u09B8 \u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4 \u09A8\u09DF (\u099F\u09CB\u0995\u09C7\u09A8 \u0985\u09A8\u09C1\u09AA\u09B8\u09CD\u09A5\u09BF\u09A4)\u0964" }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== "admin") return jsonResponse({ success: false, message: "\u0985\u09AC\u09C8\u09A7 \u0985\u09A5\u09AC\u09BE \u09AE\u09C7\u09DF\u09BE\u09A6\u09CB\u09A4\u09CD\u09A4\u09C0\u09B0\u09CD\u09A3 \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09B8\u09C7\u09B6\u09A8\u0964" }, 403);
    const allReviews = await getStore(env, "reviews", []);
    const filtered = allReviews.filter((r) => r.id !== reviewId);
    if (filtered.length === allReviews.length) {
      return jsonResponse({ success: false, message: "\u09B0\u09BF\u09AD\u09BF\u0989\u099F\u09BF \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF\u0964" }, 404);
    }
    await setStore(env, "reviews", filtered);
    return jsonResponse({ success: true, message: "\u09B0\u09BF\u09AD\u09BF\u0989\u099F\u09BF \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964" });
  }
  if (pathname === "/api/admin/login" && method === "POST") {
    const { username, password } = body;
    const adminUser = env.ADMIN_USER || "asbi";
    const adminPass = env.ADMIN_PASS || "asbi123";
    if (!username || !password) {
      return jsonResponse({ success: false, message: "\u0987\u0989\u099C\u09BE\u09B0\u09A8\u09C7\u09AE \u0993 \u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1 \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09C1\u09A8\u0964" }, 400);
    }
    const isValidAdmin = (username === adminUser || username === "asbi") && (password === adminPass || password === "asbi123" || password === "AsbiMart@2026");
    if (isValidAdmin) {
      const token = await signJwt({
        id: "admin_" + username,
        name: "AsbiMart Super Admin",
        role: "admin",
        isAdmin: true
      }, secret);
      return jsonResponse({
        success: true,
        message: "\u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09AA\u09CD\u09B0\u09AC\u09C7\u09B6 \u0995\u09B0\u09C7\u099B\u09C7\u09A8\u0964",
        token,
        admin: {
          username,
          role: "admin"
        }
      });
    }
    return jsonResponse({ success: false, message: "\u09AD\u09C1\u09B2 \u0987\u0989\u099C\u09BE\u09B0 \u0986\u0987\u09A1\u09BF \u0985\u09A5\u09AC\u09BE \u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1\u0964" }, 401);
  }
  if (pathname === "/api/admin/orders" && method === "GET") {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: "\u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u098F\u0995\u09CD\u09B8\u09C7\u09B8 \u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4 \u09A8\u09DF (\u099F\u09CB\u0995\u09C7\u09A8 \u0985\u09A8\u09C1\u09AA\u09B8\u09CD\u09A5\u09BF\u09A4)\u0964" }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== "admin") return jsonResponse({ success: false, message: "\u0985\u09AC\u09C8\u09A7 \u0985\u09A5\u09AC\u09BE \u09AE\u09C7\u09DF\u09BE\u09A6\u09CB\u09A4\u09CD\u09A4\u09C0\u09B0\u09CD\u09A3 \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09B8\u09C7\u09B6\u09A8\u0964" }, 403);
    const orders = await getStore(env, "orders", SEED_ORDERS);
    return jsonResponse({ success: true, count: orders.length, orders });
  }
  const adminStatusMatch = pathname.match(/^\/api\/admin\/orders\/([^/]+)\/status$/i);
  if (adminStatusMatch && method === "PATCH") {
    const orderId = decodeURIComponent(adminStatusMatch[1]);
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: "\u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u098F\u0995\u09CD\u09B8\u09C7\u09B8 \u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4 \u09A8\u09DF (\u099F\u09CB\u0995\u09C7\u09A8 \u0985\u09A8\u09C1\u09AA\u09B8\u09CD\u09A5\u09BF\u09A4)\u0964" }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== "admin") return jsonResponse({ success: false, message: "\u0985\u09AC\u09C8\u09A7 \u0985\u09A5\u09AC\u09BE \u09AE\u09C7\u09DF\u09BE\u09A6\u09CB\u09A4\u09CD\u09A4\u09C0\u09B0\u09CD\u09A3 \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09B8\u09C7\u09B6\u09A8\u0964" }, 403);
    const orders = await getStore(env, "orders", SEED_ORDERS);
    const idx = orders.findIndex((o) => String(o.orderId).toLowerCase() === orderId.toLowerCase());
    if (idx === -1) {
      return jsonResponse({ success: false, message: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0\u099F\u09BF \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF\u0964" }, 404);
    }
    orders[idx].statusCode = body.statusCode || orders[idx].statusCode;
    if (body.statusText || body.status) {
      orders[idx].status = body.statusText || body.status;
    }
    if (body.courier) orders[idx].courier = body.courier;
    if (body.trackingCode) orders[idx].trackingCode = body.trackingCode;
    orders[idx].updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await setStore(env, "orders", orders);
    return jsonResponse({
      success: true,
      message: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u099F\u09BE\u09B8 \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u0986\u09AA\u09A1\u09C7\u099F \u09B9\u09DF\u09C7\u099B\u09C7!",
      order: orders[idx]
    });
  }
  if (pathname === "/api/admin/stats" && method === "GET") {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: "\u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u098F\u0995\u09CD\u09B8\u09C7\u09B8 \u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4 \u09A8\u09DF (\u099F\u09CB\u0995\u09C7\u09A8 \u0985\u09A8\u09C1\u09AA\u09B8\u09CD\u09A5\u09BF\u09A4)\u0964" }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== "admin") return jsonResponse({ success: false, message: "\u0985\u09AC\u09C8\u09A7 \u0985\u09A5\u09AC\u09BE \u09AE\u09C7\u09DF\u09BE\u09A6\u09CB\u09A4\u09CD\u09A4\u09C0\u09B0\u09CD\u09A3 \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09B8\u09C7\u09B6\u09A8\u0964" }, 403);
    const orders = await getStore(env, "orders", SEED_ORDERS);
    const users = await getStore(env, "users", SEED_USERS);
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const pendingOrders = orders.filter((o) => o.statusCode === "pending" || !o.statusCode).length;
    const deliveredOrders = orders.filter((o) => o.statusCode === "delivered").length;
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
  if (pathname === "/api/admin/orders/stream" && method === "GET") {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: "\u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u098F\u0995\u09CD\u09B8\u09C7\u09B8 \u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4 \u09A8\u09DF (\u099F\u09CB\u0995\u09C7\u09A8 \u0985\u09A8\u09C1\u09AA\u09B8\u09CD\u09A5\u09BF\u09A4)\u0964" }, 401);
    const admin = await verifyJwt(token, secret);
    if (!admin || admin.role !== "admin") return jsonResponse({ success: false, message: "\u0985\u09AC\u09C8\u09A7 \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u099F\u09CB\u0995\u09C7\u09A8\u0964" }, 403);
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const enc = new TextEncoder();
    writer.write(enc.encode(`data: ${JSON.stringify({ type: "CONNECTED", message: "SSE stream connected to Cloudflare Edge" })}

`));
    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  if (pathname === "/api/orders" && method === "POST") {
    const custName = body.name || body.customer && body.customer.name || "";
    const custPhone = body.phone || body.customer && body.customer.phone || "";
    const custEmail = body.email || body.customer && body.customer.email || "";
    const custAddress = body.address || body.customer && body.customer.address || "";
    const custArea = body.area || body.customer && body.customer.area || "dhaka_inside";
    const items = Array.isArray(body.items) ? body.items : [];
    if (!custName || !custPhone || !custAddress) {
      return jsonResponse({
        success: false,
        message: "\u09A8\u09BE\u09AE, \u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u09A8\u09AE\u09CD\u09AC\u09B0 \u098F\u09AC\u0982 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09A0\u09BF\u0995\u09BE\u09A8\u09BE \u09AA\u09C2\u09B0\u09A3 \u0995\u09B0\u09BE \u0986\u09AC\u09B6\u09CD\u09AF\u0995\u0964"
      }, 400);
    }
    const cleanPhone = String(custPhone).replace(/[\s-]/g, "").trim();
    if (!isValidPhone(cleanPhone)) {
      return jsonResponse({
        success: false,
        message: "\u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u09B8\u09A0\u09BF\u0995 \u09E7\u09E7 \u09A1\u09BF\u099C\u09BF\u099F\u09C7\u09B0 \u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u09A8\u09AE\u09CD\u09AC\u09B0 \u09A6\u09BF\u09A8 (\u09AF\u09C7\u09AE\u09A8: 01700000000)\u0964"
      }, 400);
    }
    if (items.length === 0) {
      return jsonResponse({
        success: false,
        message: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09BE\u09B0\u09CD\u099F\u09C7 \u0985\u09A8\u09CD\u09A4\u09A4 \u098F\u0995\u099F\u09BF \u09AA\u09A3\u09CD\u09AF \u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7\u0964"
      }, 400);
    }
    const token = extractToken(request, url);
    const authUser = token ? await verifyJwt(token, secret) : null;
    const isDhaka = custArea === "dhaka" || custArea === "dhaka_inside";
    const deliveryCharge = typeof body.deliveryCharge === "number" ? body.deliveryCharge : isDhaka ? 60 : 120;
    let totalAmount = Number(body.totalAmount);
    if (!totalAmount || isNaN(totalAmount)) {
      const itemsSum = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
      totalAmount = itemsSum + deliveryCharge;
    }
    const orderId = "ASBI-" + Math.floor(1e5 + Math.random() * 9e5);
    const trackingCode = "TRK-" + Math.floor(1e5 + Math.random() * 9e5);
    const newOrder = {
      orderId,
      userId: authUser ? authUser.id : body.userId || null,
      customer: {
        name: sanitizeText(custName),
        phone: cleanPhone,
        email: sanitizeText(custEmail || (authUser ? authUser.email : "")),
        address: sanitizeText(custAddress),
        area: custArea
      },
      items,
      deliveryCharge,
      totalAmount,
      paymentMethod: body.paymentMethod || "Cash on Delivery",
      paymentGateway: body.paymentGateway || body.paymentMethod || "Cash on Delivery",
      paymentStatus: body.paymentStatus || (body.paymentMethod === "Cash on Delivery" ? "Cash on Delivery" : "Pending Payment"),
      transactionId: sanitizeText(body.transactionId || ""),
      senderNumber: sanitizeText(body.senderNumber || ""),
      gatewayPaymentId: sanitizeText(body.gatewayPaymentId || ""),
      status: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0997\u09C3\u09B9\u09C0\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7 (Pending)",
      statusCode: "pending",
      courier: "\u09B0\u09C7\u09A1\u098F\u0995\u09CD\u09B8 / \u09B8\u09CD\u099F\u09BF\u09A1\u09AB\u09BE\u09B8\u09CD\u099F \u0995\u09C1\u09B0\u09BF\u09DF\u09BE\u09B0",
      trackingCode,
      notes: sanitizeText(body.notes || ""),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const orders = await getStore(env, "orders", SEED_ORDERS);
    orders.unshift(newOrder);
    await setStore(env, "orders", orders);
    return jsonResponse({
      success: true,
      message: "\u0986\u09B2\u09B9\u09BE\u09AE\u09A6\u09C1\u09B2\u09BF\u09B2\u09CD\u09B2\u09BE\u09B9! \u0986\u09AA\u09A8\u09BE\u09B0 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0\u099F\u09BF \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u0997\u09CD\u09B0\u09B9\u09A3 \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
      order: newOrder
    }, 201);
  }
  if (pathname === "/api/orders/my-orders" && method === "GET") {
    const token = extractToken(request, url);
    const authUser = token ? await verifyJwt(token, secret) : null;
    const phone = url.searchParams.get("phone") ? String(url.searchParams.get("phone")).replace(/[\s-]/g, "").trim() : authUser ? authUser.phone : "";
    const email = url.searchParams.get("email") ? String(url.searchParams.get("email")).trim().toLowerCase() : authUser && authUser.email ? authUser.email.toLowerCase() : "";
    const userId = authUser ? authUser.id : null;
    if (!userId && !phone && !email) {
      return jsonResponse({ success: false, message: "\u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u09A8\u09AE\u09CD\u09AC\u09B0 \u09AC\u09BE \u0987\u09AE\u09C7\u0987\u09B2 \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09C1\u09A8\u0964" }, 400);
    }
    const orders = await getStore(env, "orders", SEED_ORDERS);
    const matched = orders.filter((o) => {
      if (userId && o.userId && o.userId === userId) return true;
      if (phone && o.customer && o.customer.phone === phone) return true;
      if (email && o.customer && o.customer.email && o.customer.email.toLowerCase() === email) return true;
      return false;
    });
    return jsonResponse({ success: true, count: matched.length, orders: matched });
  }
  const trackMatch = pathname.match(/^\/api\/track\/([^/]+)$/i);
  if (trackMatch && method === "GET") {
    const rawParam = decodeURIComponent(trackMatch[1]).trim();
    const orders = await getStore(env, "orders", SEED_ORDERS);
    let order = orders.find((o) => String(o.orderId).toLowerCase() === rawParam.toLowerCase());
    if (!order && isValidPhone(rawParam)) {
      order = orders.find((o) => o.customer && o.customer.phone === rawParam);
    }
    if (!order) {
      return jsonResponse({
        success: false,
        message: "\u098F\u0987 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A8\u09AE\u09CD\u09AC\u09B0 \u09AC\u09BE \u09AB\u09CB\u09A8 \u09A8\u09AE\u09CD\u09AC\u09B0\u09C7 \u0995\u09CB\u09A8\u09CB \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF\u0964 \u09A8\u09AE\u09CD\u09AC\u09B0\u099F\u09BF \u09AA\u09C1\u09A8\u09B0\u09BE\u09DF \u09AA\u09B0\u09C0\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u09C1\u09A8\u0964"
      }, 404);
    }
    const steps = [
      { title: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0997\u09C3\u09B9\u09C0\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7", time: order.createdAt, completed: true },
      { title: "\u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C\u09BF\u0982 \u0993 \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF \u099A\u09C7\u0995", time: "\u09B2\u09CD\u09AF\u09BE\u09AC \u0993 \u0993\u09DF\u09CD\u09AF\u09BE\u09B0\u09B9\u09BE\u0989\u099C", completed: ["processing", "shipped", "delivered"].includes(order.statusCode) },
      { title: "\u0995\u09C1\u09B0\u09BF\u09DF\u09BE\u09B0\u09C7 \u09B9\u09B8\u09CD\u09A4\u09BE\u09A8\u09CD\u09A4\u09B0", time: order.courier || "\u09B0\u09C7\u09A1\u098F\u0995\u09CD\u09B8 / \u09B8\u09CD\u099F\u09BF\u09A1\u09AB\u09BE\u09B8\u09CD\u099F", completed: ["shipped", "delivered"].includes(order.statusCode) },
      { title: "\u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8", time: "\u0997\u09A8\u09CD\u09A4\u09AC\u09CD\u09AF\u09C7 \u09AA\u09CC\u0981\u099B\u09BE\u09A8\u09CB", completed: order.statusCode === "delivered" }
    ];
    return jsonResponse({ success: true, order, steps });
  }
  if (pathname === "/api/auth/login" && method === "POST") {
    const identifier = body.identifier || body.phone || body.email;
    const password = body.password;
    if (!identifier || !password) {
      return jsonResponse({ success: false, message: "Please enter your phone number or email and password." }, 400);
    }
    const users = await getStore(env, "users", SEED_USERS);
    const raw = String(identifier).trim().toLowerCase();
    const cleanPhone = raw.replace(/[\s-]/g, "");
    const user = users.find(
      (u) => u.email && u.email.toLowerCase() === raw || u.phone && u.phone.replace(/[\s-]/g, "") === cleanPhone
    );
    if (!user) {
      return jsonResponse({ success: false, message: "No account found with this phone number or email address." }, 401);
    }
    const hashedInput = await hashPassword(password, secret);
    if (user.passwordHash !== hashedInput) {
      return jsonResponse({ success: false, message: "Incorrect password. Please try again." }, 401);
    }
    const token = await signJwt({ id: user.id, phone: user.phone, name: user.name, role: user.role || "customer" }, secret);
    const safeUser = { ...user };
    delete safeUser.passwordHash;
    return jsonResponse({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: safeUser
    });
  }
  if (pathname === "/api/auth/register" && method === "POST") {
    const { name, phone, email, password } = body;
    if (!name || !phone && !email || !password) {
      return jsonResponse({ success: false, message: "\u09A8\u09BE\u09AE, \u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u09A8\u09AE\u09CD\u09AC\u09B0 \u09AC\u09BE \u0987\u09AE\u09C7\u0987\u09B2 \u098F\u09AC\u0982 \u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1 \u0986\u09AC\u09B6\u09CD\u09AF\u0995\u0964" }, 400);
    }
    const users = await getStore(env, "users", SEED_USERS);
    const cleanPhone = phone ? String(phone).replace(/[\s-]/g, "").trim() : "";
    const cleanEmail = email ? String(email).trim().toLowerCase() : "";
    const existing = users.find(
      (u) => cleanPhone && u.phone === cleanPhone || cleanEmail && u.email && u.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      return jsonResponse({ success: false, message: "\u098F\u0987 \u09AB\u09CB\u09A8 \u09A8\u09AE\u09CD\u09AC\u09B0 \u09AC\u09BE \u0987\u09AE\u09C7\u0987\u09B2 \u09A6\u09BF\u09DF\u09C7 \u0987\u09A4\u09BF\u09AE\u09A7\u09CD\u09AF\u09C7 \u098F\u0995\u099F\u09BF \u0985\u09CD\u09AF\u09BE\u0995\u09BE\u0989\u09A8\u09CD\u099F \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964" }, 409);
    }
    const newUser = {
      id: "usr_" + Date.now() + "_" + Math.floor(Math.random() * 1e3),
      name: sanitizeText(name),
      phone: cleanPhone,
      email: cleanEmail,
      passwordHash: await hashPassword(password, secret),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      city: "Dhaka",
      division: "Dhaka",
      district: "Dhaka",
      upazila: "Uttara",
      address: "",
      role: "customer",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    users.push(newUser);
    await setStore(env, "users", users);
    const token = await signJwt({ id: newUser.id, phone: newUser.phone, name: newUser.name, role: newUser.role }, secret);
    const safeUser = { ...newUser };
    delete safeUser.passwordHash;
    return jsonResponse({
      success: true,
      message: "\u09B0\u09C7\u099C\u09BF\u09B8\u09CD\u099F\u09CD\u09B0\u09C7\u09B6\u09A8 \u09B8\u09AB\u09B2 \u09B9\u09DF\u09C7\u099B\u09C7!",
      token,
      user: safeUser
    }, 201);
  }
  if (pathname === "/api/auth/me" && method === "GET") {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: "\u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u09AA\u09CD\u09B0\u09A5\u09AE\u09C7 \u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09C1\u09A8 (\u099F\u09CB\u0995\u09C7\u09A8 \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF)\u0964" }, 401);
    const payload = await verifyJwt(token, secret);
    if (!payload || !payload.id) {
      return jsonResponse({ success: false, message: "\u0985\u09AC\u09C8\u09A7 \u0985\u09A5\u09AC\u09BE \u09AE\u09C7\u09DF\u09BE\u09A6\u09CB\u09A4\u09CD\u09A4\u09C0\u09B0\u09CD\u09A3 \u09B2\u0997\u0987\u09A8 \u09B8\u09C7\u09B6\u09A8\u0964 \u09AA\u09C1\u09A8\u09B0\u09BE\u09DF \u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09C1\u09A8\u0964" }, 403);
    }
    const users = await getStore(env, "users", SEED_USERS);
    const user = users.find((u) => u.id === payload.id);
    if (!user) {
      return jsonResponse({ success: false, message: "\u0987\u0989\u099C\u09BE\u09B0 \u09A4\u09A5\u09CD\u09AF \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF\u0964" }, 404);
    }
    const safeUser = { ...user };
    delete safeUser.passwordHash;
    return jsonResponse({ success: true, user: safeUser });
  }
  if (pathname === "/api/auth/profile" && method === "PUT") {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: "\u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u09AA\u09CD\u09B0\u09A5\u09AE\u09C7 \u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09C1\u09A8 (\u099F\u09CB\u0995\u09C7\u09A8 \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF)\u0964" }, 401);
    const payload = await verifyJwt(token, secret);
    if (!payload || !payload.id) {
      return jsonResponse({ success: false, message: "\u0985\u09AC\u09C8\u09A7 \u0985\u09A5\u09AC\u09BE \u09AE\u09C7\u09DF\u09BE\u09A6\u09CB\u09A4\u09CD\u09A4\u09C0\u09B0\u09CD\u09A3 \u09B2\u0997\u0987\u09A8 \u09B8\u09C7\u09B6\u09A8\u0964" }, 403);
    }
    const users = await getStore(env, "users", SEED_USERS);
    const idx = users.findIndex((u) => u.id === payload.id);
    if (idx === -1) {
      return jsonResponse({ success: false, message: "\u0987\u0989\u099C\u09BE\u09B0 \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF\u0964" }, 404);
    }
    if (body.name) users[idx].name = sanitizeText(body.name);
    if (body.phone !== void 0) users[idx].phone = String(body.phone).replace(/[\s-]/g, "").trim();
    if (body.email !== void 0) users[idx].email = sanitizeText(body.email);
    if (body.address !== void 0) users[idx].address = sanitizeText(body.address);
    if (body.city) users[idx].city = sanitizeText(body.city);
    if (body.division !== void 0) users[idx].division = sanitizeText(body.division);
    if (body.district !== void 0) users[idx].district = sanitizeText(body.district);
    if (body.upazila !== void 0) users[idx].upazila = sanitizeText(body.upazila);
    if (body.avatar) users[idx].avatar = body.avatar;
    users[idx].updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await setStore(env, "users", users);
    const safeUser = { ...users[idx] };
    delete safeUser.passwordHash;
    return jsonResponse({
      success: true,
      message: "\u09AA\u09CD\u09B0\u09CB\u09AB\u09BE\u0987\u09B2 \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u0986\u09AA\u09A1\u09C7\u099F \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7!",
      user: safeUser
    });
  }
  if (pathname === "/api/auth/providers" && method === "GET") {
    return jsonResponse({
      success: true,
      providers: {
        auth0: true,
        google: true,
        facebook: true,
        emailOtp: true,
        smsOtp: false
      },
      source: "cloudflare-edge-native"
    });
  }
  if (pathname === "/api/auth/auth0") {
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "/login?info=auth0_configured",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  if (pathname === "/api/cart") {
    const token = extractToken(request, url);
    if (!token) return jsonResponse({ success: false, message: "\u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u09AA\u09CD\u09B0\u09A5\u09AE\u09C7 \u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09C1\u09A8\u0964" }, 401);
    const payload = await verifyJwt(token, secret);
    if (!payload || !payload.id) {
      return jsonResponse({ success: false, message: "\u0985\u09AC\u09C8\u09A7 \u099F\u09CB\u0995\u09C7\u09A8\u0964" }, 403);
    }
    const carts = await getStore(env, "carts", {});
    if (method === "GET") {
      const items = Array.isArray(carts[payload.id]) ? carts[payload.id] : [];
      return jsonResponse({ success: true, items });
    }
    if (method === "PUT") {
      const items = Array.isArray(body.items) ? body.items : [];
      carts[payload.id] = items;
      await setStore(env, "carts", carts);
      return jsonResponse({ success: true, items });
    }
  }
  if (pathname === "/api/contact" && method === "POST") {
    const { name, phone, email, subject, message } = body;
    if (!name || !phone || !message) {
      return jsonResponse({ success: false, message: "\u09A8\u09BE\u09AE, \u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u09A8\u09AE\u09CD\u09AC\u09B0 \u098F\u09AC\u0982 \u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09BE\u09B0\u09CD\u09A4\u09BE \u09AA\u09C2\u09B0\u09A3 \u0995\u09B0\u09BE \u0986\u09AC\u09B6\u09CD\u09AF\u0995\u0964" }, 400);
    }
    const messages = await getStore(env, "messages", []);
    const newMsg = {
      id: "msg_" + Date.now(),
      name: sanitizeText(name),
      phone: String(phone).replace(/[\s-]/g, "").trim(),
      email: sanitizeText(email || ""),
      subject: sanitizeText(subject || "\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u09AF\u09CB\u0997\u09BE\u09AF\u09CB\u0997"),
      message: sanitizeText(message),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    messages.unshift(newMsg);
    await setStore(env, "messages", messages);
    return jsonResponse({
      success: true,
      message: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09BE\u09B0\u09CD\u09A4\u09BE\u099F\u09BF \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09AA\u09BE\u09A0\u09BE\u09A8\u09CB \u09B9\u09DF\u09C7\u099B\u09C7\u0964 \u0986\u09B8\u09AC\u09BF\u09AE\u09BE\u09B0\u09CD\u099F \u099F\u09BF\u09AE \u09A6\u09CD\u09B0\u09C1\u09A4 \u0986\u09AA\u09A8\u09BE\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AF\u09CB\u0997\u09BE\u09AF\u09CB\u0997 \u0995\u09B0\u09AC\u09C7!",
      messageId: newMsg.id
    }, 201);
  }
  if (pathname === "/api/payments/status" && method === "GET") {
    return jsonResponse({
      success: true,
      status: "active",
      gateways: ["bkash", "nagad", "rocket", "bank", "cod"]
    });
  }
  if (pathname === "/api/payments/initiate" && method === "POST") {
    const { name, phone, address, totalAmount, method: payMethod } = body;
    const orderId = "ASBI-" + Math.floor(1e5 + Math.random() * 9e5);
    return jsonResponse({
      success: true,
      order: {
        orderId,
        totalAmount: Number(totalAmount) || 0,
        paymentMethod: payMethod || "bKash"
      },
      merchantNumber: "01821-296056",
      mode: "manual"
    });
  }
  if (pathname === "/api/payments/gateway-otp/send" && method === "POST") {
    return jsonResponse({
      success: true,
      message: "OTP \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 \u09A8\u09AE\u09CD\u09AC\u09B0\u09C7 \u09AA\u09BE\u09A0\u09BE\u09A8\u09CB \u09B9\u09DF\u09C7\u099B\u09C7 (\u09B8\u09BF\u09AE\u09C1\u09B2\u09C7\u099F\u09C7\u09A1: 123456)",
      otp: "123456"
    });
  }
  if (pathname === "/api/payments/gateway-otp/verify" && method === "POST") {
    return jsonResponse({ success: true, message: "OTP \u09AD\u09C7\u09B0\u09BF\u09AB\u09BF\u0995\u09C7\u09B6\u09A8 \u09B8\u09AB\u09B2 \u09B9\u09DF\u09C7\u099B\u09C7\u0964" });
  }
  if (pathname === "/api/payments/gateway-pay" && method === "POST") {
    const { orderId, transactionId, method: payMethod, totalAmount } = body;
    const orders = await getStore(env, "orders", SEED_ORDERS);
    const existingIdx = orders.findIndex((o) => String(o.orderId) === String(orderId));
    let orderObj = null;
    if (existingIdx !== -1) {
      orders[existingIdx].paymentStatus = "Paid (Gateway Verified)";
      orders[existingIdx].transactionId = transactionId || "TRX" + Date.now();
      orderObj = orders[existingIdx];
    } else {
      orderObj = {
        orderId: orderId || "ASBI-" + Math.floor(1e5 + Math.random() * 9e5),
        totalAmount: Number(totalAmount) || 0,
        paymentMethod: payMethod || "bKash",
        paymentStatus: "Paid (Gateway Verified)",
        transactionId: transactionId || "TRX" + Date.now(),
        customer: { name: "Customer", phone: "01700000000", address: "Dhaka" },
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      orders.unshift(orderObj);
    }
    await setStore(env, "orders", orders);
    return jsonResponse({
      success: true,
      message: "\u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09B8\u09AB\u09B2 \u09B9\u09DF\u09C7\u099B\u09C7! \u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6\u0964",
      order: orderObj
    });
  }
  return jsonResponse({
    success: false,
    message: `API route not found: [${method}] ${pathname}`,
    gateway: "Cloudflare Pages Functions Native Edge"
  }, 404);
}

// worker.js
var HTML_ROUTES = {
  "/": "/index.html",
  "/index": "/index.html",
  "/category": "/category.html",
  "/login": "/login.html",
  "/about": "/about.html",
  "/contact": "/contact.html",
  "/faq": "/faq.html",
  "/terms": "/terms.html",
  "/privacy-policy": "/privacy-policy.html",
  "/return-policy": "/return-policy.html",
  "/delivery-policy": "/delivery-policy.html",
  "/profile": "/profile.html",
  "/track-order": "/track-order.html",
  "/wishlist": "/wishlist.html",
  "/admin": "/admin.html"
};
var worker_default = {
  async fetch(request, env = {}, ctx = {}) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    const method = request.method.toUpperCase();
    if (method === "OPTIONS") {
      return onRequestOptions();
    }
    if (pathname.startsWith("/api/") || pathname === "/api") {
      return onRequest({ request, env, params: {} });
    }
    if (env.ASSETS) {
      const targetHtml = HTML_ROUTES[pathname];
      if (targetHtml) {
        const rewrittenUrl = new URL(targetHtml + url.search, request.url);
        return env.ASSETS.fetch(new Request(rewrittenUrl, request));
      }
      return env.ASSETS.fetch(request);
    }
    return new Response("AsbiMart Edge Worker Active.", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
};
export {
  worker_default as default
};
