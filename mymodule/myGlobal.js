
import path from 'path'
// ใช้หลายหน้า
global.SYS_NAME = 'MPOS'
global.SYS_NAME2 = ''
global.SYS_VERSION = '2.0'
// ใช้ในหน้า term and conditions
global.SYS_OWNER_FULLNAME = 'นายวสันต์ คุณดิลกเศวต'
global.SYS_OWNER_EMAIL = 'wasankds@gmail.com'
global.SYS_OWNER_PHONE = '081-459-8343'
// Database - dbUrl, dbName ดึงจาก .env 
global.dbColl_settings = 'settings'
global.dbColl_settingsSystem = 'settingsSystem'
global.dbColl_sessions = 'sessions'
global.dbColl_users = 'users'
global.dbColl_userBranches = 'usersBranches'
global.dbColl_usersResetPassword = 'usersResetPassword'
global.dbColl_items = 'items' 
global.dbColl_itemsCategory = 'itemsCategory' 
global.dbColl_warehouseIn = 'doc_warehouseIn' 
global.dbColl_warehouseOut = 'doc_warehouseOut' 
global.dbColl_sales = 'doc_sales' 
global.dbColl_report_warehouseIn_item1 = 'report_warehouseIn_item1' 
global.dbColl_report_warehouseOut_item1 = 'report_warehouseOut_item1' 
global.dbColl_report_sales_item1 = 'report_sales_item1' 
global.dbColl_report_warehouseIn_item2 = 'report_warehouseIn_item2' 
global.dbColl_report_warehouseOut_item2 = 'report_warehouseOut_item2' 
global.dbColl_report_sales_item2 = 'report_sales_item2' 
// global.dbColl_report_warehouseIn = 'report_warehouseIn' 
// global.dbColl_report_warehouseOut = 'report_warehouseOut' 
// global.dbColl_report_sales = 'report_sales' 
// ระบบ
global.PAGE_HOME = 'MPOS'
global.PAGE_TERM = 'ข้อกำหนดและเงื่อนไข'
global.PAGE_SYSTEM_MANUAL = 'การใช้งานระบบ'
global.PAGE_LOGIN = 'เข้าสู่ระบบ'
global.PAGE_MANAGE_USERS = 'จัดการผู้ใช้งาน'
global.PAGE_MANAGE_USER_BRANCHES = 'จัดการสาขาผู้ใช้งาน'
global.PAGE_MANAGE_SETTINGS = 'ตั้งค่า'
global.PAGE_MANAGE_SETTINGS_SYSTEM = 'ตั้งค่าระบบครั้งแรก'
global.PAGE_MANAGE_SESSIONS = 'จัดการเซสชั่น'
global.PAGE_USERS = 'ผู้ใช้งาน'
global.PAGE_USER_INFO = 'ข้อมูลผู้ใช้งาน'
global.PAGE_PASSWORD_FORGOT = 'ลืมรหัสผ่าน'
global.PAGE_PASSWORD_RESET = 'รีเซ็ตรหัสผ่าน'
// เอนทิตี้
global.PAGE_CUSTOMERS = 'ลูกค้า'
global.PAGE_ITEMS = 'ไอเท็ม'
global.PAGE_ITEMS_CATEGORY = 'หมวดหมู่ไอเท็ม'  
// เอกสารและรายงาน
global.PAGE_SALES = 'ขาย'
global.PAGE_WAREHOUSE_IN = 'รับเข้า'
global.PAGE_WAREHOUSE_OUT = 'เบิกออก'
global.PAGE_REPORT_SALES = 'รายงานขาย'
global.PAGE_REPORT_WAREHOUSE_IN = 'รายงานรับเข้า'
global.PAGE_REPORT_WAREHOUSE_OUT = 'รายงานเบิกออก'
// ใช้ใน router
global.PATH_SALES = '/sales'
global.PATH_WAREHOUSE_IN = '/warehouse-in'
global.PATH_WAREHOUSE_OUT = '/warehouse-out'

// ค่าคงที่
// ทดสอบกับ tualeklek ใช้ 80 เท่านั้น - แก้ให้ตรงกับใช้งานจริง
// ใช้งานจริงบน VPS แบบ Subdomain ให้สร้าง Subdomain ก่อน - ดูเรื่อง nginx 
global.SYSTEM_START = {
  PORT_SERVER: 80, 
  PORT_DEV: 80, 
  DEPLOY: 1, // 0 = dev, 1 = prod-ต้องเป็น 1 เลย ไม่เช่นนั้นเข้าจากโดเมนไม่ได้  
  LOCALHOST_ALLOW: 'http://localhost',
  DOMAIN_ALLOW: 'https://tualeklek.com', 
}
// ค่าคงที่
//=== นโยบาย
// O : แก้ได้ทุกสาขา - สร้างออเดอร์ได้
// S : แก้ได้ทุกสาขา - สร้างออเดอร์ไม่ได้
// A : แก้ได้เฉพาะสาขาของตนเอง(แก้ได้ของทุกคน) - สร้างออเดอร์ได้เฉพาะสาขาของตนเอง
// U : แก้ไม่ได้เลย - สร้างออเดอร์ได้เฉพาะสาขาของตนเอง
//=== เอกสารลบไม่ได้เลย
// - [1,2] แก้ได้หลังสร้างแล้ว 30 นาที - ออเดอร์ควรจบใน 30 นาที
// 
global.USER_AUTHORITIES = ["O", "S", "A", "U"]
const docStatus = [
  { statusNumber : 0, statusName : 'ว่าง' } , 
  { statusNumber : 1, statusName : 'สร้าง' } , 
  { statusNumber : 2, statusName : 'จบ' } ,
  { statusNumber : 10, statusName : 'ยกเลิก' } 
]
global.DOC_STATUS = docStatus
global.DOC_STATUS_TITLE = docStatus.reduce( (acc, obj) => {  
  acc += `${obj.statusNumber} : ${obj.statusName}` + '\n'
  return acc
}, 'เลขสถานะ\n\n');


// Message ต่างๆ
global.USERNAME_PATTERN = "^[a-z0-9_.]{6,}$"
global.USERNAME_DESCRIPTION = "อักษรที่สามารถใช้เป็นชื่อยูสเซอร์ได้ a-z, 0-9, . หรือ _ อย่างน้อย 6 ตัวอักษร"
global.USER_SIGNATURE_DESCRIPTION = "ไฟล์ภาพ .png ไม่เกิน 1MB เท่านั้น ขนาดที่แนะนำ 330x120px"
global.PASSWORD_PATTERN = "^[a-zA-Z0-9._!@#%&*+\\-=]{6,}$"
global.PASSWORD_DESCRIPTION = "อักษรที่สามารถใช้เป็นพาสเวิร์ดได้ a-z, A-Z, 0-9, ., _, !, @, #, %, &, *, -, +, = อย่างน้อย 6 ตัวอักษร"
global.EMAIL_PATTERN = "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
global.PHONE_PATTERN = "^[0-9]{10}$"
global.PHONE_DESCRIPTION = "เบอร์โทรศัพท์ 9-10 หลัก"
global.ITEM_TYPE_PATTERN = "^[a-zA-Z0-9_\\-]{5,}$"
global.ITEM_TYPE_DESCRIPTION = "อักษรที่สามารถใช้เป็นไอดีได้ a-z, A-Z, 0-9, _, - อย่างน้อย 5 ตัวอักษร"
// global.CUSTOMER_PATTERN = "^(?=.*[a-zA-Z0-9ก-ฮ_+\\/\\-\\(\\)])([a-zA-Z0-9ก-ฮ,_+\\/\\-\\s\\(\\)]{4,})$"
// global.CUSTOMER_DESCRIPTION = "อักษรที่สามารถใช้เป็นชื่องานได้ ก-ฮ, a-z, A-Z, 0-9, _, +, -, ช่องว่าง อย่างน้อย 4 ตัวอักษร"
global.CUSTOMER_TAXID_PATTERN = "^(?=.*[0-9]{13,})[0-9]{13,}$"
global.CUSTOMER_TAXID_DESCRIPTION = "ตัวเลข 13 หลักขึ้นไป"
global.CUSTOMER_IDENTITYID_PATTERN = "^[0-9]{13}$"
global.CUSTOMER_IDENTITYID_DESCRIPTION = "ตัวเลข 13 หลัก"
global.MONTH_NAMES = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน','กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
global.MONTH_NAMES_SHORT = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."]
// ชื่อไฟล์ต่างๆ
global.SIGNATURE_SUFFIX = "_SIGNATURE" // คำลงท้ายภาพลายเซ็น
global.LOGO_QUOTATION_FILENAME = 'HEADER_QUOTATION_LOGO.png'
global.LOGO_INVOICE_FILENAME = 'HEADER_INVOICE_LOGO.png'
global.LOGO_RECEIPT_FILENAME = 'HEADER_RECEIPT_LOGO.png'
global.LOGO_BILL_FILENAME = 'HEADER_BILL_LOGO.png'

// ไฟล์และโฟลเดอร์
global.folderPublic = pathToFolder('public')
global.folderImages = pathToFolder('public','images')
global.folderViews = pathToFolder('views')
global.folderPartials = pathToFolder('views','partials')
global.folderForms = pathToFolder('views','forms')
global.folderItems = pathToFolder('items')
global.folderWarehouseIn = pathToFolder('warehouse-in')
global.folderWarehouseOut = pathToFolder('warehouse-out')
global.folderSales = pathToFolder('sales')
// global.folderUsers = pathToFolder('users')
// global.folderDocs = pathToFolder('docs')
global.file404 = pathToFolder('public','static', '404.html')
global.folderScreenshot = pathToFolder('public','images', 'screenshot')
function pathToFolder( ...args){  
  const rootFolder = process.cwd()
  return path.join(rootFolder, ...args)
}


global.NAV_LEFT = [
  // { // หน้าแรก ==================
  //   path: '/', 
  //   title: PAGE_HOME,
  //   icon: 'fas fa-house' ,
  //   // menuColor : 'menu-blue', // ไม่มีในหน้า home
  //   userAuthorities: ['O','S','A', 'U'],
  //   separator: false,    
  // },
  {
    path: '/sales',
    title: PAGE_SALES,
    // icon: 'fas fa-shopping-cart',
    icon: 'fas fa-cash-register',
    menuColor : 'menu-blue',
    userAuthorities: ['O','S','A', 'U'],
    separator: false, 
  },
]


global.NAV_REPORT = [  // รายงาน
  {
    path: '/report/sales',
    title: PAGE_REPORT_SALES,
    icon: 'fas fa-cash-register',
    menuColor : 'menu-blue',
    userAuthorities: ['O','S','A', 'U'],
    separator: false, 
  },
  {
    path: '/report/warehouse-in',
    title: PAGE_REPORT_WAREHOUSE_IN,
    icon: 'fas fa-arrow-circle-right',
    menuColor : 'menu-green',
    userAuthorities: ['O','S','A', 'U'],
    separator: false, 
  },
  {
    path: '/report/warehouse-out',
    title: PAGE_REPORT_WAREHOUSE_OUT,
    icon: 'fas fa-arrow-circle-left',
    menuColor : 'menu-orange',
    userAuthorities: ['O','S','A', 'U'],
    separator: false, 
  },
]


/*
ตัวอย่างไอคอน fa- ที่นิยมใช้กับเมนู "รายงาน" (Reports):

1. 'fas fa-chart-line'        // กราฟเส้น (ยอดนิยมสำหรับรายงาน)
2. 'fas fa-chart-bar'         // กราฟแท่ง
3. 'fas fa-file-alt'          // เอกสารรายงาน
4. 'fas fa-table'             // ตารางข้อมูล
5. 'fas fa-clipboard-list'    // รายการใน clipboard

// ตัวอย่างการใช้งานในเมนู:
// icon: 'fas fa-chart-line'
*/

global.NAV_WAREHOUSE = [
  {
    path: '/warehouse-in',
    title: PAGE_WAREHOUSE_IN,
    menuColor : 'menu-green',
    icon: 'fas fa-arrow-circle-right',
    userAuthorities: ['O','S','A'],
    separator: false, 
  },
  {
    path: '/warehouse-out',
    title: PAGE_WAREHOUSE_OUT,
    menuColor : 'menu-orange',
    icon: 'fas fa-arrow-circle-left',
    userAuthorities: ['O','S','A'],
    separator: false, 
  }
]
global.NAV_ITEMS = [
  {
    path: '/items',
    title: PAGE_ITEMS,
    menuColor : 'menu-pink',
    icon: 'fas fa-box',
    userAuthorities: ['O','S'],
    separator: false, 
  },
  {
    path: '/items-category',
    title: PAGE_ITEMS_CATEGORY,
    menuColor : 'menu-pink',
    icon: 'fas fa-layer-group',
    userAuthorities: ['O','S'],
    separator: false, 
  },
]

global.NAV_USERS = [ // ผู้ใช้งาน
  {
    path: '/manage/users',
    title: PAGE_MANAGE_USERS,
    menuColor : 'menu-silver',
    icon: 'fas fa-users',
    userAuthorities: ['O','S'],
    separator: false
  },
  {
    path: '/manage/user-branches',
    title: PAGE_MANAGE_USER_BRANCHES,
    menuColor : 'menu-silver',
    icon: 'fas fa-code-branch',
    userAuthorities: ['O','S'],
    separator: false
  },
  {
    path: '/manage/sessions',
    title: PAGE_MANAGE_SESSIONS,
    icon: 'fas fa-user-clock',
    menuColor : 'menu-silver',
    userAuthorities: ['O','S'],
    separator: false
  }
]

//======================== 
// เมนูด้านขวา
// 
global.NAV_RIGHT = [
  {
    path: '/manage/settings',
    title: PAGE_MANAGE_SETTINGS,
    icon: 'fas fa-sliders-h',
    menuColor : 'menu-silver',
    userAuthorities: ['O','S'],
    separator: false, 
  },
  {
    path: '/manage/settings/system',
    title: PAGE_MANAGE_SETTINGS_SYSTEM,
    icon: 'fas fa-gear',
    menuColor : 'menu-silver',
    userAuthorities: ['O','S'],
    separator: false
  },
  {
    path: '/term-and-conditions',
    title: PAGE_TERM,
    icon: 'fas fa-file-contract',
    menuColor : 'menu-silver',
    userAuthorities: ['O','S'],
    separator: false
  },
]




  // {
  //   path: '/files-manager',
  //   title: PAGE_FILES_MANAGER,
  //   icon: 'fas fa-file-alt me-1',
  //   userAuthorities: ['O'],
  //   separator: false    
  // },
  // {
  //   path: '/manage/users',
  //   title: PAGE_MANAGE_USERS,
  //   icon: 'fas fa-users',
  //   userAuthorities: ['O'],
  //   separator: false    
  // },
  // {
  //   path: '/manage/users',
  //   title: PAGE_MANAGE_USERS,
  //   icon: 'fas fa-users',
  //   userAuthorities: ['O'],
  //   separator: false    
  // },
  // {
  //   path: '/manage/settings',
  //   title: PAGE_MANAGE_SETTINGS,
  //   icon: 'fas fa-sliders-h',
  //   userAuthorities: ['O'],
  //   separator: false
  // },
  // {
  //   path: '/manage/settings/system',
  //   title: PAGE_MANAGE_SETTINGS_SYSTEM,
  //   icon: 'fas fa-gear',
  //   userAuthorities: ['O'],
  //   separator: false
  // },












  

// global.dbColl_settings_Quotation = 'settings_Quotation'
// global.dbColl_settings_Invoice = 'settings_Invoice'
// global.dbColl_settings_Receipt = 'settings_Receipt'
// global.dbColl_settings_Bill = 'settings_Bill'


// global.dbColl_customers = 'customers' 
// global.dbColl_quotation = 'quotation' 
// global.dbColl_invoice = 'invoice' 
// global.dbColl_receipt = 'receipt'
// global.dbColl_bill = 'bill'