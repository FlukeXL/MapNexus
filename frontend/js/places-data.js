// ข้อมูลสถานที่ท่องเที่ยวในจังหวัดนครพนม
// แบ่งเป็น 3 หมวด: วัด, คาเฟ่, โรงแรม

const PLACES_DATA = {
    temples: [
        {
            id: 1,
            name: 'พระธาตุพนม',
            category: 'วัดและศาสนสถาน',
            description: 'พระธาตุศักดิ์สิทธิ์คู่บ้านคู่เมืองนครพนม อายุกว่า 2,000 ปี',
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
            location: 'อำเภอธาตุพนม',
            rating: 4.9,
            reviews: 2500
        },
        {
            id: 2,
            name: 'วัดโพธิ์ชัย',
            category: 'วัดและศาสนสถาน',
            description: 'วัดเก่าแก่ริมแม่น้ำโขง สถาปัตยกรรมผสมผสานไทย-ลาว',
            image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.7,
            reviews: 850
        },
        {
            id: 3,
            name: 'วัดมหาธาตุ',
            category: 'วัดและศาสนสถาน',
            description: 'วัดประจำจังหวัดนครพนม มีพระพุทธรูปสำคัญ',
            image: 'https://images.unsplash.com/photo-1563979036-4a537e0c6c89?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.6,
            reviews: 650
        },
        {
            id: 4,
            name: 'วัดศรีเทพประดิษฐาราม',
            category: 'วัดและศาสนสถาน',
            description: 'วัดสวยงามริมโขง มีจุดชมวิวพระอาทิตย์ตก',
            image: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.5,
            reviews: 420
        }
    ],
    
    cafes: [
        {
            id: 5,
            name: 'Mekong Riverside Café',
            category: 'คาเฟ่',
            description: 'คาเฟ่ริมโขง บรรยากาศสบายๆ วิวสวยงาม',
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.8,
            reviews: 1200
        },
        {
            id: 6,
            name: 'Sunset View Coffee',
            category: 'คาเฟ่',
            description: 'ชมพระอาทิตย์ตกพร้อมกาแฟหอมกรุ่น',
            image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.7,
            reviews: 980
        },
        {
            id: 7,
            name: 'Nakhon Phanom Loft',
            category: 'คาเฟ่',
            description: 'คาเฟ่สไตล์ลอฟท์ โมเดิร์น มีมุมถ่ายรูปสวยๆ',
            image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.6,
            reviews: 750
        },
        {
            id: 8,
            name: 'The Garden Café',
            category: 'คาเฟ่',
            description: 'คาเฟ่ในสวน บรรยากาศร่มรื่น เหมาะพักผ่อน',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.5,
            reviews: 620
        },
        {
            id: 9,
            name: 'Indochina Coffee House',
            category: 'คาเฟ่',
            description: 'คาเฟ่สไตล์อินโดจีน กาแฟเข้มข้น ขนมอร่อย',
            image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.7,
            reviews: 890
        },
        {
            id: 10,
            name: 'Baan Rim Nam Café',
            category: 'คาเฟ่',
            description: 'บ้านริมน้ำ บรรยากาศอบอุ่น อาหารอร่อย',
            image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.6,
            reviews: 710
        },
        {
            id: 11,
            name: 'Vintage Café NP',
            category: 'คาเฟ่',
            description: 'คาเฟ่วินเทจ ของเก่าเก๋ๆ บรรยากาศโรแมนติก',
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.5,
            reviews: 580
        },
        {
            id: 12,
            name: 'Rooftop Café & Bar',
            category: 'คาเฟ่',
            description: 'คาเฟ่ชั้นดาดฟ้า วิว 360 องศา',
            image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.8,
            reviews: 1100
        },
        {
            id: 13,
            name: 'Minimalist Café',
            category: 'คาเฟ่',
            description: 'คาเฟ่มินิมอล สะอาดตา เงียบสงบ',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.4,
            reviews: 490
        },
        {
            id: 14,
            name: 'Artisan Coffee Lab',
            category: 'คาเฟ่',
            description: 'คาเฟ่สำหรับคนรักกาแฟ บาริสต้ามืออาชีพ',
            image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.9,
            reviews: 1350
        },
        {
            id: 15,
            name: 'Cozy Corner Café',
            category: 'คาเฟ่',
            description: 'มุมสบายๆ เหมาะทำงาน อ่านหนังสือ',
            image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.5,
            reviews: 670
        },
        {
            id: 16,
            name: 'Mekong Breeze Café',
            category: 'คาเฟ่',
            description: 'ลมโขงพัดเย็นสบาย กาแฟหอม ขนมหวาน',
            image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.7,
            reviews: 820
        }
    ],
    
    hotels: [
        {
            id: 17,
            name: 'The River Hotel Nakhon Phanom',
            category: 'โรงแรม',
            description: 'โรงแรมหรูริมโขง วิวสวยงาม ห้องพักสะดวกสบาย',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.8,
            reviews: 2100,
            price: '2,500 - 4,500 บาท/คืน'
        },
        {
            id: 18,
            name: 'Grand View Hotel',
            category: 'โรงแรม',
            description: 'โรงแรมใจกลางเมือง สะดวกสบาย ใกล้แหล่งท่องเที่ยว',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.6,
            reviews: 1500,
            price: '1,800 - 3,200 บาท/คืน'
        },
        {
            id: 19,
            name: 'Mekong Boutique Hotel',
            category: 'โรงแรม',
            description: 'โรงแรมบูติกสไตล์โมเดิร์น ออกแบบสวยงาม',
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.7,
            reviews: 980,
            price: '2,200 - 3,800 บาท/คืน'
        },
        {
            id: 20,
            name: 'Nakhon Phanom Resort',
            category: 'โรงแรม',
            description: 'รีสอร์ทสไตล์รีสอร์ท บรรยากาศสงบ มีสระว่ายน้ำ',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.5,
            reviews: 750,
            price: '1,500 - 2,800 บาท/คืน'
        },
    ]
};

// Export สำหรับใช้ในไฟล์อื่น
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PLACES_DATA;
}
