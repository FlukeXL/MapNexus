// ข้อมูลสถานที่ท่องเที่ยวในจังหวัดนครพนม
// แบ่งเป็น 3 หมวด: วัด, คาเฟ่, โรงแรม
// พิกัด GPS: ใช้พิกัดประมาณของนครพนม (สามารถอัพเดทพิกัดจริงทีหลัง)

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
            reviews: 2500,
            lat: 16.9286,
            lng: 104.7142,
            phone: '042-541-062',
            openYear: 'พ.ศ. 8 (สร้างครั้งแรก)',
            history: 'พระธาตุพนมเป็นพระธาตุเจดีย์ที่ศักดิ์สิทธิ์ที่สุดในภาคอีสาน สร้างขึ้นเมื่อประมาณ 2,500 ปีก่อน เพื่อบรรจุพระอุรังคธาตุ (กระดูกหน้าอก) ของพระพุทธเจ้า เป็นที่เคารพสักการะของชาวไทยและลาวมาช้านาน',
            about: 'วัดและพระธาตุศักดิ์สิทธิ์ เปิดให้นมัสการตลอดปี มีงานนมัสการพระธาตุพนมประจำปีในเดือนมีนาคม',
            gallery: [
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
                'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
                'https://images.unsplash.com/photo-1563979036-4a537e0c6c89?w=600&q=80',
                'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600&q=80',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
                'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80',
                'https://images.unsplash.com/photo-1563492065213-f0e6a0e0dc37?w=600&q=80'
            ]
        },
        {
            id: 2,
            name: 'วัดโพธิ์ชัย',
            category: 'วัดและศาสนสถาน',
            description: 'วัดเก่าแก่ริมแม่น้ำโขง สถาปัตยกรรมผสมผสานไทย-ลาว',
            image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.7,
            reviews: 850,
            lat: 17.3917,
            lng: 104.7794,
            phone: '042-511-234',
            openYear: 'พ.ศ. 2300',
            history: 'วัดโพธิ์ชัยเป็นวัดเก่าแก่ที่มีประวัติยาวนานกว่า 200 ปี ตั้งอยู่ริมฝั่งแม่น้ำโขง มีสถาปัตยกรรมที่ผสมผสานระหว่างศิลปะไทยและลาวอย่างงดงาม',
            about: 'วัดพุทธศาสนา เปิดให้เข้าชมทุกวัน มีพระพุทธรูปสำคัญและจิตรกรรมฝาผนังที่งดงาม',
            gallery: [
                'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
                'https://images.unsplash.com/photo-1563979036-4a537e0c6c89?w=600&q=80',
                'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600&q=80',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
                'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80',
                'https://images.unsplash.com/photo-1563492065213-f0e6a0e0dc37?w=600&q=80'
            ]
        },
        {
            id: 3,
            name: 'วัดมหาธาตุ',
            category: 'วัดและศาสนสถาน',
            description: 'วัดประจำจังหวัดนครพนม มีพระพุทธรูปสำคัญ',
            image: 'https://images.unsplash.com/photo-1563979036-4a537e0c6c89?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.6,
            reviews: 650,
            lat: 17.4050,
            lng: 104.7700,
            phone: '042-512-345',
            openYear: 'พ.ศ. 2400',
            history: 'วัดมหาธาตุเป็นวัดประจำจังหวัดนครพนม มีความสำคัญทางประวัติศาสตร์และวัฒนธรรม เป็นศูนย์กลางของชุมชนมาช้านาน',
            about: 'วัดพุทธศาสนาประจำจังหวัด เปิดให้เข้าชมทุกวัน มีพระพุทธรูปสำคัญและกิจกรรมทางศาสนาตลอดปี',
            gallery: [
                'https://images.unsplash.com/photo-1563979036-4a537e0c6c89?w=600&q=80',
                'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
                'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600&q=80',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
                'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80',
                'https://images.unsplash.com/photo-1563492065213-f0e6a0e0dc37?w=600&q=80'
            ]
        },
        {
            id: 4,
            name: 'วัดศรีเทพประดิษฐาราม',
            category: 'วัดและศาสนสถาน',
            description: 'วัดสวยงามริมโขง มีจุดชมวิวพระอาทิตย์ตก',
            image: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.5,
            reviews: 420,
            lat: 17.3800,
            lng: 104.7850,
            phone: '042-513-456',
            openYear: 'พ.ศ. 2450',
            history: 'วัดศรีเทพประดิษฐารามตั้งอยู่ริมฝั่งแม่น้ำโขง เป็นวัดที่มีทัศนียภาพสวยงาม โดยเฉพาะในช่วงพระอาทิตย์ตกดิน',
            about: 'วัดพุทธศาสนาริมโขง มีจุดชมวิวพระอาทิตย์ตกที่สวยงาม เปิดให้เข้าชมทุกวัน',
            gallery: [
                'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600&q=80',
                'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
                'https://images.unsplash.com/photo-1563979036-4a537e0c6c89?w=600&q=80',
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
                'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80',
                'https://images.unsplash.com/photo-1563492065213-f0e6a0e0dc37?w=600&q=80'
            ]
        }
    ],
    
    cafes: [
        {
            id: 5, name: 'Mekong Riverside Café', category: 'คาเฟ่',
            description: 'คาเฟ่ริมโขง บรรยากาศสบายๆ วิวสวยงาม',
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.8, reviews: 1200, lat: 17.4100, lng: 104.7800,
            phone: '042-521-001', openYear: 'พ.ศ. 2558',
            history: 'เปิดให้บริการมาตั้งแต่ปี 2558 เป็นคาเฟ่แห่งแรกที่ตั้งอยู่ริมฝั่งแม่น้ำโขงในนครพนม',
            about: 'คาเฟ่ริมโขง เสิร์ฟกาแฟ เครื่องดื่ม และของว่างหลากหลาย เปิดทุกวัน 8:00-21:00',
            gallery: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80','https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80','https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80']
        },
        {
            id: 6, name: 'Sunset View Coffee', category: 'คาเฟ่',
            description: 'ชมพระอาทิตย์ตกพร้อมกาแฟหอมกรุ่น',
            image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.7, reviews: 980, lat: 17.4000, lng: 104.7750,
            phone: '042-521-002', openYear: 'พ.ศ. 2560',
            history: 'เปิดปี 2560 ตั้งอยู่บนจุดชมวิวพระอาทิตย์ตกที่สวยที่สุดในนครพนม',
            about: 'คาเฟ่วิวพระอาทิตย์ตก เสิร์ฟกาแฟและเครื่องดื่ม เปิดบ่าย 2 โมง ถึง 3 ทุ่ม',
            gallery: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80','https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80','https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80']
        },
        {
            id: 7, name: 'Nakhon Phanom Loft', category: 'คาเฟ่',
            description: 'คาเฟ่สไตล์ลอฟท์ โมเดิร์น มีมุมถ่ายรูปสวยๆ',
            image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.6, reviews: 750, lat: 17.4120, lng: 104.7680,
            phone: '042-521-003', openYear: 'พ.ศ. 2562',
            history: 'เปิดปี 2562 ออกแบบในสไตล์ลอฟท์อินดัสเทรียล เป็นที่นิยมในหมู่คนรุ่นใหม่',
            about: 'คาเฟ่สไตล์ลอฟท์ เสิร์ฟกาแฟ ชา และเบเกอรี่ เปิดทุกวัน 9:00-21:00',
            gallery: ['https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80','https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80','https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80']
        },
        {
            id: 8, name: 'The Garden Café', category: 'คาเฟ่',
            description: 'คาเฟ่ในสวน บรรยากาศร่มรื่น เหมาะพักผ่อน',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.5, reviews: 620, lat: 17.3950, lng: 104.7600,
            phone: '042-521-004', openYear: 'พ.ศ. 2559',
            history: 'เปิดปี 2559 ออกแบบให้เป็นคาเฟ่ในสวนธรรมชาติ ร่มรื่นด้วยต้นไม้นานาพันธุ์',
            about: 'คาเฟ่ในสวน เสิร์ฟกาแฟ น้ำผลไม้ และอาหารว่าง เปิดทุกวัน 8:00-20:00',
            gallery: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80','https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80','https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80']
        },
        {
            id: 9, name: 'Indochina Coffee House', category: 'คาเฟ่',
            description: 'คาเฟ่สไตล์อินโดจีน กาแฟเข้มข้น ขนมอร่อย',
            image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.7, reviews: 890, lat: 17.4080, lng: 104.7720,
            phone: '042-521-005', openYear: 'พ.ศ. 2561',
            history: 'เปิดปี 2561 ได้รับแรงบันดาลใจจากวัฒนธรรมอินโดจีน ตกแต่งด้วยของเก่าและงานศิลปะท้องถิ่น',
            about: 'คาเฟ่สไตล์อินโดจีน เสิร์ฟกาแฟโบราณ ชาไทย และขนมพื้นเมือง เปิดทุกวัน 7:00-21:00',
            gallery: ['https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80','https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80']
        },
        {
            id: 10, name: 'Baan Rim Nam Café', category: 'คาเฟ่',
            description: 'บ้านริมน้ำ บรรยากาศอบอุ่น อาหารอร่อย',
            image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.6, reviews: 710, lat: 17.3980, lng: 104.7820,
            phone: '042-521-006', openYear: 'พ.ศ. 2557',
            history: 'เปิดปี 2557 ดัดแปลงจากบ้านเก่าริมน้ำ รักษาบรรยากาศดั้งเดิมไว้อย่างสวยงาม',
            about: 'คาเฟ่บ้านริมน้ำ เสิร์ฟกาแฟ อาหารไทย และของว่าง เปิดทุกวัน 8:00-21:00',
            gallery: ['https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80','https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80','https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80']
        },
        {
            id: 11, name: 'Vintage Café NP', category: 'คาเฟ่',
            description: 'คาเฟ่วินเทจ ของเก่าเก๋ๆ บรรยากาศโรแมนติก',
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.5, reviews: 580, lat: 17.4150, lng: 104.7650,
            phone: '042-521-007', openYear: 'พ.ศ. 2563',
            history: 'เปิดปี 2563 รวบรวมของเก่าและของสะสมมาตกแต่ง สร้างบรรยากาศย้อนยุค',
            about: 'คาเฟ่วินเทจ เสิร์ฟกาแฟ ชา และเบเกอรี่ เปิดทุกวัน 10:00-22:00',
            gallery: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80','https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80']
        },
        {
            id: 12, name: 'Rooftop Café & Bar', category: 'คาเฟ่',
            description: 'คาเฟ่ชั้นดาดฟ้า วิว 360 องศา',
            image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.8, reviews: 1100, lat: 17.4070, lng: 104.7700,
            phone: '042-521-008', openYear: 'พ.ศ. 2564',
            history: 'เปิดปี 2564 บนชั้นดาดฟ้า มีวิวแม่น้ำโขงและเมืองนครพนม 360 องศา',
            about: 'คาเฟ่ดาดฟ้า เสิร์ฟกาแฟ ค็อกเทล และอาหารเบาๆ เปิดทุกวัน 15:00-24:00',
            gallery: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80','https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80']
        },
        {
            id: 13, name: 'Minimalist Café', category: 'คาเฟ่',
            description: 'คาเฟ่มินิมอล สะอาดตา เงียบสงบ',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.4, reviews: 490, lat: 17.4020, lng: 104.7630,
            phone: '042-521-009', openYear: 'พ.ศ. 2565',
            history: 'เปิดปี 2565 ออกแบบในสไตล์มินิมอลลิสต์ เน้นความเรียบง่ายและสงบ',
            about: 'คาเฟ่มินิมอล เสิร์ฟกาแฟ ชา และขนมเบาๆ เหมาะทำงานหรืออ่านหนังสือ เปิดทุกวัน 8:00-20:00',
            gallery: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80','https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80']
        },
        {
            id: 14, name: 'Artisan Coffee Lab', category: 'คาเฟ่',
            description: 'คาเฟ่สำหรับคนรักกาแฟ บาริสต้ามืออาชีพ',
            image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.9, reviews: 1350, lat: 17.4110, lng: 104.7760,
            phone: '042-521-010', openYear: 'พ.ศ. 2562',
            history: 'เปิดปี 2562 โดยบาริสต้ามืออาชีพ เน้นคุณภาพกาแฟระดับพรีเมียม',
            about: 'คาเฟ่กาแฟพิเศษ เสิร์ฟ Specialty Coffee จากทั่วโลก เปิดทุกวัน 7:00-20:00',
            gallery: ['https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80','https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80']
        },
        {
            id: 15, name: 'Cozy Corner Café', category: 'คาเฟ่',
            description: 'มุมสบายๆ เหมาะทำงาน อ่านหนังสือ',
            image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.5, reviews: 670, lat: 17.3990, lng: 104.7670,
            phone: '042-521-011', openYear: 'พ.ศ. 2560',
            history: 'เปิดปี 2560 ออกแบบให้เป็นพื้นที่ทำงานและพักผ่อน มี WiFi ความเร็วสูง',
            about: 'คาเฟ่ Co-working Space เสิร์ฟกาแฟ ชา มี WiFi ฟรี เปิดทุกวัน 8:00-22:00',
            gallery: ['https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&q=80','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80','https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80']
        },
        {
            id: 16, name: 'Mekong Breeze Café', category: 'คาเฟ่',
            description: 'ลมโขงพัดเย็นสบาย กาแฟหอม ขนมหวาน',
            image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.7, reviews: 820, lat: 17.4060, lng: 104.7780,
            phone: '042-521-012', openYear: 'พ.ศ. 2561',
            history: 'เปิดปี 2561 ตั้งอยู่ริมโขง รับลมเย็นจากแม่น้ำโขงตลอดวัน',
            about: 'คาเฟ่ริมโขง เสิร์ฟกาแฟ ชา และขนมหวานพื้นเมือง เปิดทุกวัน 8:00-21:00',
            gallery: ['https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80','https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80']
        }
    ],
        {
            id: 6,
            name: 'Sunset View Coffee',
            category: 'คาเฟ่',
            description: 'ชมพระอาทิตย์ตกพร้อมกาแฟหอมกรุ่น',
            image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.7,
            reviews: 980,
            lat: 17.4000,
            lng: 104.7750
        },
        {
            id: 7,
            name: 'Nakhon Phanom Loft',
            category: 'คาเฟ่',
            description: 'คาเฟ่สไตล์ลอฟท์ โมเดิร์น มีมุมถ่ายรูปสวยๆ',
            image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.6,
            reviews: 750,
            lat: 17.4120,
            lng: 104.7680
        },
        {
            id: 8,
            name: 'The Garden Café',
            category: 'คาเฟ่',
            description: 'คาเฟ่ในสวน บรรยากาศร่มรื่น เหมาะพักผ่อน',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.5,
            reviews: 620,
            lat: 17.3950,
            lng: 104.7600
        },
        {
            id: 9,
            name: 'Indochina Coffee House',
            category: 'คาเฟ่',
            description: 'คาเฟ่สไตล์อินโดจีน กาแฟเข้มข้น ขนมอร่อย',
            image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.7,
            reviews: 890,
            lat: 17.4080,
            lng: 104.7720
        },
        {
            id: 10,
            name: 'Baan Rim Nam Café',
            category: 'คาเฟ่',
            description: 'บ้านริมน้ำ บรรยากาศอบอุ่น อาหารอร่อย',
            image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.6,
            reviews: 710,
            lat: 17.3980,
            lng: 104.7820
        },
        {
            id: 11,
            name: 'Vintage Café NP',
            category: 'คาเฟ่',
            description: 'คาเฟ่วินเทจ ของเก่าเก๋ๆ บรรยากาศโรแมนติก',
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.5,
            reviews: 580,
            lat: 17.4150,
            lng: 104.7650
        },
        {
            id: 12,
            name: 'Rooftop Café & Bar',
            category: 'คาเฟ่',
            description: 'คาเฟ่ชั้นดาดฟ้า วิว 360 องศา',
            image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.8,
            reviews: 1100,
            lat: 17.4070,
            lng: 104.7700
        },
        {
            id: 13,
            name: 'Minimalist Café',
            category: 'คาเฟ่',
            description: 'คาเฟ่มินิมอล สะอาดตา เงียบสงบ',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.4,
            reviews: 490,
            lat: 17.4020,
            lng: 104.7630
        },
        {
            id: 14,
            name: 'Artisan Coffee Lab',
            category: 'คาเฟ่',
            description: 'คาเฟ่สำหรับคนรักกาแฟ บาริสต้ามืออาชีพ',
            image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.9,
            reviews: 1350,
            lat: 17.4110,
            lng: 104.7760
        },
        {
            id: 15,
            name: 'Cozy Corner Café',
            category: 'คาเฟ่',
            description: 'มุมสบายๆ เหมาะทำงาน อ่านหนังสือ',
            image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.5,
            reviews: 670,
            lat: 17.3990,
            lng: 104.7670
        },
        {
            id: 16,
            name: 'Mekong Breeze Café',
            category: 'คาเฟ่',
            description: 'ลมโขงพัดเย็นสบาย กาแฟหอม ขนมหวาน',
            image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
            location: 'เมืองนครพนม',
            rating: 4.7,
            reviews: 820,
            lat: 17.4060,
            lng: 104.7780
        }
    ],
    
    hotels: [
        {
            id: 17, name: 'The River Hotel Nakhon Phanom', category: 'โรงแรม',
            description: 'โรงแรมหรูริมโขง วิวสวยงาม ห้องพักสะดวกสบาย',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.8, reviews: 2100, price: '2,500 - 4,500 บาท/คืน',
            lat: 17.4090, lng: 104.7790,
            phone: '042-531-001', openYear: 'พ.ศ. 2555',
            history: 'เปิดให้บริการปี 2555 เป็นโรงแรมระดับ 4 ดาวแห่งแรกของนครพนม ตั้งอยู่ริมฝั่งแม่น้ำโขง',
            about: 'โรงแรมหรูริมโขง มีห้องพัก 120 ห้อง สระว่ายน้ำ ร้านอาหาร และสปา เปิดให้บริการตลอด 24 ชั่วโมง',
            gallery: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80','https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80']
        },
        {
            id: 18, name: 'Grand View Hotel', category: 'โรงแรม',
            description: 'โรงแรมใจกลางเมือง สะดวกสบาย ใกล้แหล่งท่องเที่ยว',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.6, reviews: 1500, price: '1,800 - 3,200 บาท/คืน',
            lat: 17.4050, lng: 104.7710,
            phone: '042-531-002', openYear: 'พ.ศ. 2548',
            history: 'เปิดปี 2548 เป็นโรงแรมใจกลางเมืองที่ได้รับความนิยมมายาวนาน ปรับปรุงใหม่ปี 2562',
            about: 'โรงแรมใจกลางเมือง มีห้องพัก 80 ห้อง ร้านอาหาร และห้องประชุม ใกล้ตลาดและแหล่งท่องเที่ยว',
            gallery: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80','https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80']
        },
        {
            id: 19, name: 'Mekong Boutique Hotel', category: 'โรงแรม',
            description: 'โรงแรมบูติกสไตล์โมเดิร์น ออกแบบสวยงาม',
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.7, reviews: 980, price: '2,200 - 3,800 บาท/คืน',
            lat: 17.4030, lng: 104.7770,
            phone: '042-531-003', openYear: 'พ.ศ. 2560',
            history: 'เปิดปี 2560 ออกแบบในสไตล์บูติกโมเดิร์น ผสมผสานความเป็นท้องถิ่นกับความทันสมัย',
            about: 'โรงแรมบูติก มีห้องพัก 45 ห้อง ร้านอาหาร และบาร์ริมโขง ออกแบบสวยงามเป็นเอกลักษณ์',
            gallery: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80','https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80']
        },
        {
            id: 20, name: 'Nakhon Phanom Resort', category: 'โรงแรม',
            description: 'รีสอร์ทสไตล์รีสอร์ท บรรยากาศสงบ มีสระว่ายน้ำ',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.5, reviews: 750, price: '1,500 - 2,800 บาท/คืน',
            lat: 17.3970, lng: 104.7650,
            phone: '042-531-004', openYear: 'พ.ศ. 2552',
            history: 'เปิดปี 2552 เป็นรีสอร์ทแห่งแรกในนครพนมที่มีสระว่ายน้ำขนาดใหญ่',
            about: 'รีสอร์ทบรรยากาศสงบ มีห้องพัก 60 ห้อง สระว่ายน้ำ สปา และร้านอาหาร',
            gallery: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80','https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80']
        },
        {
            id: 21, name: 'Riverside Paradise Hotel', category: 'โรงแรม',
            description: 'โรงแรมริมโขง บรรยากาศสงบ เหมาะพักผ่อน',
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
            location: 'เมืองนครพนม', rating: 4.6, reviews: 890, price: '2,000 - 3,500 บาท/คืน',
            lat: 17.4120, lng: 104.7810,
            phone: '042-531-005', openYear: 'พ.ศ. 2558',
            history: 'เปิดปี 2558 ตั้งอยู่ริมฝั่งโขง บรรยากาศสงบเงียบ เหมาะสำหรับการพักผ่อน',
            about: 'โรงแรมริมโขง มีห้องพัก 55 ห้อง ร้านอาหาร และระเบียงชมวิวแม่น้ำโขง',
            gallery: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80','https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80']
        }
    ]
};

// Export สำหรับใช้ในไฟล์อื่น
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PLACES_DATA;
}
