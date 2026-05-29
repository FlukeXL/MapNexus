// ===================================
// ตัวอย่างการใส่รูปเอง
// คัดลอกโค้ดนี้ไปแทนที่ใน places-data.js
// ===================================

const PLACES_DATA = {
    temples: [
        {
            id: 1,
            name: 'พระธาตุพนม',
            category: 'วัดและศาสนสถาน',
            description: 'พระธาตุศักดิ์สิทธิ์คู่บ้านคู่เมืองนครพนม อายุกว่า 2,000 ปี',
            // ⬇️ แก้ไขตรงนี้ - ใส่ path ของรูปที่คุณวาง
            image: 'assets\images\places\temples\Phatea Phanom.jpg',
            location: 'อำเภอธาตุพนม',
            rating: 4.9,
            reviews: 2500
        },
        {
            id: 2,
            name: 'วัดโพธิ์ชัย',
            category: 'วัดและศาสนสถาน',
            description: 'วัดเก่าแก่ริมแม่น้ำโขง สถาปัตยกรรมผสมผสานไทย-ลาว',
            // ⬇️ แก้ไขตรงนี้
            image: 'assets/images/places/temples/wat-pho-chai.jpg',
            location: 'เมืองนครพนม',
            rating: 4.7,
            reviews: 850
        },
        {
            id: 3,
            name: 'วัดมหาธาตุ',
            category: 'วัดและศาสนสถาน',
            description: 'วัดประจำจังหวัดนครพนม มีพระพุทธรูปสำคัญ',
            // ⬇️ แก้ไขตรงนี้
            image: 'assets/images/places/temples/wat-mahathat.jpg',
            location: 'เมืองนครพนม',
            rating: 4.6,
            reviews: 650
        },
        {
            id: 4,
            name: 'วัดศรีเทพประดิษฐาราม',
            category: 'วัดและศาสนสถาน',
            description: 'วัดสวยงามริมโขง มีจุดชมวิวพระอาทิตย์ตก',
            // ⬇️ แก้ไขตรงนี้
            image: 'assets/images/places/temples/wat-sri-thep.jpg',
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
            // ⬇️ แก้ไขตรงนี้
            image: 'assets/images/places/cafes/mekong-riverside-cafe.jpg',
            location: 'เมืองนครพนม',
            rating: 4.8,
            reviews: 1200
        },
        {
            id: 6,
            name: 'Sunset View Coffee',
            category: 'คาเฟ่',
            description: 'ชมพระอาทิตย์ตกพร้อมกาแฟหอมกรุ่น',
            // ⬇️ แก้ไขตรงนี้
            image: 'assets/images/places/cafes/sunset-view-coffee.jpg',
            location: 'เมืองนครพนม',
            rating: 4.7,
            reviews: 980
        },
        {
            id: 7,
            name: 'Nakhon Phanom Loft',
            category: 'คาเฟ่',
            description: 'คาเฟ่สไตล์ลอฟท์ โมเดิร์น มีมุมถ่ายรูปสวยๆ',
            // ⬇️ แก้ไขตรงนี้
            image: 'assets/images/places/cafes/nakhon-phanom-loft.jpg',
            location: 'เมืองนครพนม',
            rating: 4.6,
            reviews: 750
        },
        // ... เพิ่มคาเฟ่อื่นๆ ต่อ
    ],
    
    hotels: [
        {
            id: 17,
            name: 'The River Hotel Nakhon Phanom',
            category: 'โรงแรม',
            description: 'โรงแรมหรูริมโขง วิวสวยงาม ห้องพักสะดวกสบาย',
            // ⬇️ แก้ไขตรงนี้
            image: 'assets/images/places/hotels/the-river-hotel.jpg',
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
            // ⬇️ แก้ไขตรงนี้
            image: 'assets/images/places/hotels/grand-view-hotel.jpg',
            location: 'เมืองนครพนม',
            rating: 4.6,
            reviews: 1500,
            price: '1,800 - 3,200 บาท/คืน'
        },
        // ... เพิ่มโรงแรมอื่นๆ ต่อ
    ],
    
    // ⭐ ใหม่! สถานที่ธรรมชาติ
    nature: [
        {
            id: 21,
            name: 'แม่น้ำโขง',
            category: 'ธรรมชาติ',
            description: 'ชมพระอาทิตย์ตกริมโขงที่สวยงามที่สุด',
            // ⬇️ แก้ไขตรงนี้
            image: 'assets/images/places/nature/mekong-river.jpg',
            location: 'เมืองนครพนม',
            rating: 4.9,
            reviews: 3200
        },
        {
            id: 22,
            name: 'ภูลังกา',
            category: 'ธรรมชาติ',
            description: 'ภูเขาสวยงาม ชมทะเลหมอก ดูดาว',
            // ⬇️ แก้ไขตรงนี้
            image: 'assets/images/places/nature/phu-langka.jpg',
            location: 'อำเภอบ้านแพง',
            rating: 4.8,
            reviews: 1800
        },
        {
            id: 23,
            name: 'แก่งกะเบา',
            category: 'ธรรมชาติ',
            description: 'แก่งหินสวยงามริมโขง เหมาะปิกนิก',
            // ⬇️ แก้ไขตรงนี้
            image: 'assets/images/places/nature/kaeng-kabao.jpg',
            location: 'อำเภอท่าอุเทน',
            rating: 4.7,
            reviews: 1200
        },
        {
            id: 24,
            name: 'ทะเลสาบเรณูนคร',
            category: 'ธรรมชาติ',
            description: 'ทะเลสาบขนาดใหญ่ บรรยากาศสงบ',
            // ⬇️ แก้ไขตรงนี้
            image: 'assets/images/places/nature/renu-nakhon-lake.jpg',
            location: 'อำเภอเรณูนคร',
            rating: 4.6,
            reviews: 950
        }
        // ... เพิ่มสถานที่ธรรมชาติอื่นๆ ต่อ
    ]
};

// Export สำหรับใช้ในไฟล์อื่น
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PLACES_DATA;
}
