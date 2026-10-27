import type { Messages } from './en';

export const th: Messages = {
  tabs: {
    home: 'หน้าแรก',
    settings: 'การตั้งค่า',
  },
  home: {
    title: 'ยินดีต้อนรับ',
    subtitle: 'แตะการ์ดเพื่อเปิดหน้ารายละเอียด',
    favorite: 'รายการโปรด',
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
  favorites: {
    add: 'เพิ่มในรายการโปรด',
    remove: 'นำออกจากรายการโปรด',
  },
  sample: {
    title: 'รายการตัวอย่าง',
    subtitle: 'โหลดจากบริการจำลอง ดึงลงเพื่อรีเฟรช',
    search: 'ค้นหารายการ',
    loading: 'กำลังโหลดรายการ',
    error: 'โหลดรายการไม่สำเร็จ',
    retry: 'ลองอีกครั้ง',
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
