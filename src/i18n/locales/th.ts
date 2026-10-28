import type { Messages } from './en';

export const th: Messages = {
  common: {
    retry: 'ลองอีกครั้ง',
    ok: 'เข้าใจแล้ว',
    cart: 'ตะกร้า',
  },
  tabs: {
    home: 'หน้าแรก',
    products: 'สินค้า',
    settings: 'การตั้งค่า',
  },
  home: {
    title: 'ยินดีต้อนรับ',
    subtitle: 'แตะการ์ดเพื่อเปิดหน้ารายละเอียด',
    openSample: 'เปิดรายการตัวอย่าง',
    items: {
      gettingStarted: {
        title: 'เริ่มต้นใช้งาน',
        description: 'โครงสร้างโปรเจกต์ สคริปต์ และข้อตกลงในการเขียนโค้ด',
      },
      designSystem: {
        title: 'ระบบดีไซน์',
        description: 'โทเคน ธีมสว่าง/มืด และคอมโพเนนต์ที่ใช้ร่วมกัน',
      },
      navigation: {
        title: 'การนำทาง',
        description: 'Native stack แบบกำหนดไทป์ พร้อมแท็บด้านล่างแบบซ้อน',
      },
      appContext: {
        title: 'Context ของแอป',
        description: 'แชร์สถานะผ่าน React context ลองเพิ่มรายการโปรดดู',
      },
    },
  },
  details: {
    itemNumber: id => `รายการที่ ${id}`,
    note: {
      label: 'โน้ต',
      placeholder: 'พิมพ์อะไรก็ได้…',
      helperText: 'ตัวอย่างคอมโพเนนต์ TextField ที่ใช้ร่วมกัน',
    },
    goBack: 'ย้อนกลับ',
    openSettings: 'เปิดการตั้งค่า',
  },
  productList: {
    hotDeals: 'ดีลเด็ด',
    favorites: 'รายการโปรด',
    favoritesEmpty: 'กด “เพิ่มในรายการโปรด” ที่หน้าสินค้าเพื่อเก็บไว้ที่นี่',
    favoritesError: 'โหลดรายการโปรดไม่สำเร็จ',
    loading: 'กำลังโหลดสินค้า',
    error: 'โหลดสินค้าไม่สำเร็จ',
    empty: 'ยังไม่มีสินค้า',
    loadMoreError: 'โหลดสินค้าเพิ่มไม่สำเร็จ',
    rating: (rate, count) => `${rate.toFixed(1)} (${count})`,
  },
  productDetail: {
    title: 'รายละเอียดสินค้า',
    addToCart: 'เพิ่มลงตะกร้า',
    viewImage: 'ดูรูปขนาดใหญ่',
    closeImage: 'ปิด',
    loading: 'กำลังโหลดสินค้า',
    error: 'โหลดสินค้านี้ไม่สำเร็จ',
    notFound: 'ไม่พบสินค้านี้แล้ว',
    rating: (rate, count) => `คะแนน ${rate.toFixed(1)} จาก 5 · ${count} รีวิว`,
  },
  cart: {
    title: 'ตะกร้า',
    loading: 'กำลังโหลดตะกร้า',
    error: 'โหลดตะกร้าไม่สำเร็จ',
    empty: 'ยังไม่มีสินค้าในตะกร้า',
    itemCount: count => `${count} รายการ`,
    removeItem: title => `นำ ${title} ออกจากตะกร้า`,
    removeAll: 'ลบทั้งหมด',
    total: 'ยอดรวม',
    submit: 'สั่งซื้อ',
  },
  favorites: {
    label: 'รายการโปรด',
    add: 'เพิ่มในรายการโปรด',
    remove: 'นำออกจากรายการโปรด',
    fullTitle: 'รายการโปรดเต็มแล้ว',
    fullMessage: max =>
      `เก็บรายการโปรดได้สูงสุด ${max} รายการ ลบรายการเดิมออกก่อนจึงจะเพิ่มได้`,
  },
  sample: {
    title: 'รายการตัวอย่าง',
    subtitle: 'โหลดจากบริการจำลอง ดึงลงเพื่อรีเฟรช',
    search: 'ค้นหารายการ',
    loading: 'กำลังโหลดรายการ',
    error: 'โหลดรายการไม่สำเร็จ',
    empty: 'ยังไม่มีรายการ',
    noResults: query => `ไม่พบรายการที่ตรงกับ “${query}”`,
  },
  settings: {
    appearance: 'ลักษณะที่ปรากฏ',
    colorSchemes: {
      system: 'ตามระบบ',
      light: 'สว่าง',
      dark: 'มืด',
    },
    language: 'ภาษา',
    components: 'คอมโพเนนต์',
    buttons: {
      primary: 'หลัก',
      secondary: 'รอง',
      ghost: 'โปร่ง',
      danger: 'อันตราย',
      loading: 'กำลังโหลด',
      disabled: 'ปิดใช้งาน',
    },
    card: {
      title: 'การ์ด',
      description: 'คอนเทนเนอร์พื้นผิวพร้อมโทเคนเส้นขอบและมุมโค้ง',
    },
  },
};
