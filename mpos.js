import 'dotenv/config' ; 
import express from 'express' ; 
import session from 'express-session' ; 
import cookieParser from 'cookie-parser' ; 
import flash from 'connect-flash' ; 
import { MongoClient } from 'mongodb' ; 
import MongoDBSession from 'connect-mongodb-session'  ; 
global.IS_PRODUCTION = process.env.IS_PRODUCTION == 1 ? true : false ;
global.PROJECT_DIR = process.cwd()
global.dbName = process.env.DB_NAME
global.dbUrl = process.env.DB_URL
global.mymoduleFolder = global.IS_PRODUCTION ? 'mymodule-min' : 'mymodule'
const routesFolder = global.IS_PRODUCTION ? 'routes-min' : 'routes'
await import(`./${mymoduleFolder}/myGlobal.js`) // กำหนด global ตัวแปรต่างๆ
await import(`./${mymoduleFolder}/myDbStart.js`) // สร้าง index ให้กับ collection ต่างๆ
await import(`./${mymoduleFolder}/mySchedule.js`) // รันปิดเอกสารตอนตี2ทุกวัน 
const app = express()
async function loadSettingSystemStart() {
  const client = new MongoClient(global.dbUrl)
  await client.connect()
  const db = client.db(global.dbName)
  const findSettingSystem = await db.collection(global.dbColl_settingsSystem).findOne({})
  await client.close()
  return findSettingSystem ? findSettingSystem  : global.SYSTEM_START
}
global.SETTINGS_SYSTEM = await loadSettingSystemStart()
const PORT = SETTINGS_SYSTEM.DEPLOY == 0 ? SETTINGS_SYSTEM.PORT_DEV : SETTINGS_SYSTEM.PORT_SERVER
global.DOMAIN_ALLOW = SETTINGS_SYSTEM.DEPLOY == 0 ? `${SETTINGS_SYSTEM.LOCALHOST_ALLOW}:${PORT}` : `${SETTINGS_SYSTEM.DOMAIN_ALLOW}`
//=== Sessionss
const MongoStore = MongoDBSession(session)
app.use(session({
  secret: 'mpos.node.apps.key.sign.cookie',
  cookie: {
    maxAge: 1000*60*60*24*30, // 30 days
    // Prevent client-side JavaScript from accessing the cookie
    // secure: process.env.DEPLOY == 'dev' ? false : true, // ตัวนี้ทำให้มีปัญหาให้ปิดไป
    httpOnly: IS_PRODUCTION ? true : false,
  },
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    uri: global.dbUrl,
    databaseName: global.dbName,
    collection: global.dbColl_sessions,
  }),
}))
//=== สำหรับการตั้งค่า Express
app.set('view engine', 'ejs')
app.use(flash())
app.use(cookieParser())
app.use(express.json({limit:'50mb'})) // 50mb กรณีอัปโหลดไฟล์จาก fetch ต้องอนุญาตไฟล์ที่ใหญ่ขึ้น
app.use(express.urlencoded({extended:true,limit:'50mb'}))
app.use(express.static(global.folderPublic)) // ถ้าไม่มีจะหา public ไม่เจอ
app.use((req, res, next) => {
  const allowedOrigins = [ 
    SETTINGS_SYSTEM.DOMAIN_ALLOW, // สำหรับใช้งานจริง
    `${SETTINGS_SYSTEM.LOCALHOST_ALLOW}:${PORT}` , // สำหรับทดสอบยิง fetch บนเครื่องตัวเอง 
    // 'http://127.0.0.1:5500' // สำหรับทดสอบยิง fetch จากไฟล์ html ที่ใช้ live server
  ]
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  } else { // Optional: If you want to explicitly deny access for non-allowed origins:
    res.header('Access-Control-Allow-Origin', 'null') 
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
if( process.env.USE_STARTAPP_ROUTER == 1 ) { // เปิดใช้ตอนเซ็ตระบบเท่านั้น เปิด/เปิดใน .env
  app.use((await import(`./${routesFolder}/startAppRouter.js`)).default) 
}
app.use((await import(`./${routesFolder}/homeRouter.js`)).default) 
app.use((await import(`./${routesFolder}/loginRouter.js`)).default)
app.use((await import(`./${routesFolder}/manageSettingsRouter.js`)).default)
app.use((await import(`./${routesFolder}/manageSettingsSystemRouter.js`)).default)
app.use((await import(`./${routesFolder}/manageSessionsRouter.js`)).default)
app.use((await import(`./${routesFolder}/manageUsersRouter.js`)).default)
app.use((await import(`./${routesFolder}/manageUserBranchesRouter.js`)).default)
app.use((await import(`./${routesFolder}/userInfoRouter.js`)).default);
app.use((await import(`./${routesFolder}/passwordRouter.js`)).default);
app.use((await import(`./${routesFolder}/itemsRouter.js`)).default);
app.use((await import(`./${routesFolder}/itemsCategoryRouter.js`)).default);
app.use((await import(`./${routesFolder}/docGeneralRouter.js`)).default)
app.use((await import(`./${routesFolder}/docMainRouter.js`)).default);
app.use((await import(`./${routesFolder}/reportDocsRouter.js`)).default);
app.use((await import(`./${routesFolder}/reportItemsRouter.js`)).default); // ยังไม้่ได้ทำ - สำหรับเวอร์ชั่นจ่ายเงิน
app.use( (err, req, res, next) => {
  res.status(err.status || 500);
  const errHtml = `<h1 style="color:blue">กำลังอัปเดทข้อมูล</h1>
    <p style="color:red">"err.status ===> " ${err.status}</p>
    <p style="color:red">"err.stack ===> " ${err.stack}</p>`
  res.send(errHtml)
  next()
})
app.get('*', (req,res) => {
  res.status(404).sendFile(file404)
})
//=== Start the server
app.listen(PORT, () => {
  console.log(`========== Server@${DOMAIN_ALLOW} ===========`)
  console.log("- IS_PRODUCTION ", global.IS_PRODUCTION)
  console.log("- global.DOMAIN_ALLOW ", global.DOMAIN_ALLOW)
})






