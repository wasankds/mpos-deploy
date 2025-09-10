
import { MongoClient } from 'mongodb';
import { formatNumber_as_Thai } from  "./myModule.js"
import * as myDateTime from  "./myDateTime.js"
import { DateTime } from 'luxon';

/***********************************************
************************************************
***********************************************
******************* Data ******************
***********************************************
***********************************************
************************************************/

//================================================
// จับข้อมูลไอเท็มทั้งหมด  - สำหรับใช้ทำ Modal
//
export async function getItems_for_Modal(type='active') {
  const client = new MongoClient(global.dbUrl)
  try{
    await client.connect()
    const db = client.db(global.dbName)
    const coll_items = db.collection(global.dbColl_items)

    //=== ตัวกรองข้อมูล
    if(type == 'active'){
      var filter = { 
        itemStatus: 'active' 
      }
    }else if(type == 'stock')  {
      var filter = { 
        itemStatus: 'active',
        itemStock : "1"
      }
    }

    var DATA_ITEMS =  await coll_items.find(
      filter,
      { projection : { 
          _id : 0 ,
          itemId: 1,             //  '001-011',
          itemStatus: 1,         //  'active',
          itemName: 1,           //  'Test',
          itemPrice: 1,          //
          itemUnit: 1,           //  'คอร์ส',
          itemImage: 1,          //  'item-001-011.png',
          // 
          categoryId: 1,     //  10001,
        }
      },      
    )
    .collation({ locale: "th", numericOrdering: true })
    .sort({ itemName: 1 })
    .toArray();

    return DATA_ITEMS
  }catch(err){
    console.log(err)
    throw err
  }finally{
    client.close()
  }
}


//================================================
// จับข้อมูลไอเท็มทั้งหมด  - สำหรับใช้ทำ Modal
//
export async function getItemsCategory() {
  const client = new MongoClient(global.dbUrl)
  try{
    await client.connect()
    const db = client.db(global.dbName)
    const coll_items = db.collection(global.dbColl_itemsCategory)
    const DATA_ITEMS =  await coll_items.find(
      { categoryStatus: 'active' },
      { projection : { 
          _id : 0 ,
          categoryId: 1 ,        //   10001,
          categoryStatus: 1 ,    //   "active",
          categoryName: 1 ,      //   "อาบน้ำตัดขน",
          categoryColor: 1 ,     //   "DarkSeagreen",
          // dateTimeCanDelete: 1 , //   "2025-09-01 20:18"
        } 
      },
      { sort: { categoryName: 1 } }
    ).toArray()
    return DATA_ITEMS
  }catch(err){
    console.log(err)
    throw err
  }finally{
    client.close()
  }
}

//================================================
// จับข้อมูลไอเท็มทั้งหมด  - สำหรับใช้ทำ Modal
//
export async function getUserBranches(matchedOption) {  
  const client = new MongoClient(global.dbUrl)
  try{

    // if(type == 'active'){
    //   var matchedoption = { branchStatus: 'active' }
    // }else{
    //   var matchedoption = {}
    // }

    await client.connect()
    const db = client.db(global.dbName)
    const coll_items = db.collection(global.dbColl_userBranches)
    const DATA_BRANCHES =  await coll_items.find(
      matchedOption ,
      { projection : { 
          _id : 0 ,
          branchId: 1 ,        //   101,
          branchStatus: 1 ,    //   "active",
          branchName: 1 ,      //   "",
          // dateTimeCanDelete: 1 , //   "2025-09-01 20:18"
        } 
      },
      { sort: { branchId: 1 } }
    ).toArray()
    return DATA_BRANCHES
  }catch(err){
    console.log(err)
    throw err
  }finally{
    client.close()
  }
}

export async function getUserBranchesById(branchId) {
  const client = new MongoClient(global.dbUrl)
  try{
    await client.connect()
    const db = client.db(global.dbName)
    const coll_items = db.collection(global.dbColl_userBranches)
    const branch =  await coll_items.findOne(
      { branchId: branchId},
      { projection : { 
          _id : 0 ,
          branchId: 1 ,        //   101,
          branchStatus: 1 ,    //   "active",
          branchName: 1 ,      //   "",
          // dateTimeCanDelete: 1 , //   "2025-09-01 20:18"
        } 
      },
    )
    return branch
  }catch(err){
    console.log(err)
    throw err
  }finally{
    client.close()
  }
}




//============================================= 
// จับคบามเปลี่ยนแปลงในเอกสาร 
// หา key อัตโนมัติ ยกเว้น tableRows
// - ใช้กับ quotation
// 
export function getChangeHistory(oldDoc, newDoc) {
  const changes = [];
  for (const key in newDoc) {

    //=== 1.) เป็น table row
    if (key === "tableRows") {
      // ตรวจสอบการเปลี่ยนแปลงในแต่ละแถวของ tableRows
      const oldRows = oldDoc.tableRows || [];
      const newRows = newDoc.tableRows || [];
      // เปรียบเทียบจำนวนแถว
      if (oldRows.length !== newRows.length) {
        changes.push({
          field: "tableRows",
          oldValue: oldRows,
          newValue: newRows
        });
      } else { // เปรียบเทียบแต่ละแถวและแต่ละฟิลด์
        for (let i = 0; i < newRows.length; i++) {
          const oldRow = oldRows[i] || {};
          const newRow = newRows[i] || {};
          for (const rowKey in newRow) {
            if (newRow[rowKey] != oldRow[rowKey]) {
              changes.push({
                field: `tableRows[${i}].${rowKey}`,
                oldValue: oldRow[rowKey],
                newValue: newRow[rowKey]
              });
            }
          }
        }
      }
    } 
    //===
    else {
      if (newDoc[key] !== oldDoc[key]) {
        changes.push({
          field: key,
          oldValue: oldDoc[key],
          newValue: newDoc[key]
        });
      }
    }
  }
  return changes;
}



/***********************************************
************************************************
***********************************************
******************* Warehouse ******************
***********************************************
***********************************************
************************************************/

//============================================= 
// แปลงชนิดข้อมูล พร้อมสำหรับการเขียนลง DB
// - ใช้กับ quotation/invoice
// - ไม่ได้เแปลงทุกตัว แปลงเฉพาะที่ต้องเป็นตัวเลข
export function convert_DataType(doc) {
  doc.docStatusNumber = doc.docStatusNumber ? Number(doc.docStatusNumber) : doc.docStatusNumber 
  doc.branchId = doc.branchId ? Number(doc.branchId) : null
  doc.userId = doc.userId ? Number(doc.userId) : null
  doc.totalAmount = doc.totalAmount ? Number(doc.totalAmount) : null
  doc.paymentAmount1 = doc.paymentAmount1 ? Number(doc.paymentAmount1) : 0
  doc.paymentAmount2 = doc.paymentAmount2 ? Number(doc.paymentAmount2) : 0

  //=== แก้ type ใน tableRows
  doc.tableRows = doc.tableRows.map(row => {
    return {
      // index : !isNaN(row.index) ? Number(row.index) : row.index , // เป็นตัวเลขตั้งแต่แรกอยู่แล้ว
      itemId: row.itemId, // สตริง
      // no: row.no,                // สตริง
      description: row.description, // สตริง
      unit: row.unit ,              // สตริง
      price: !isNaN(row.price) ? Number(row.price) : row.price, // ตัวเลข ***
      quantity: !isNaN(row.quantity) ? Number(row.quantity) : row.quantity, // ตัวเลข ***
      amount: !isNaN(row.amount) ? Number(row.amount) : row.amount // ตัวเลข ***
    }
  })
  return doc
}

//============================================= 
// แปลงชนิดข้อมูล พร้อมสำหรับการเขียนลง DB
// - ใช้กับ quotation/invoice
// - ไม่ได้เแปลงทุกตัว แปลงเฉพาะที่ต้องเป็นตัวเลข
export function convert_DocPrint(doc) {
  doc.totalAmount = formatNumber_as_Thai(doc.totalAmount);
  doc.paymentAmount1 = formatNumber_as_Thai(doc.paymentAmount1);
  doc.paymentAmount2 = formatNumber_as_Thai(doc.paymentAmount2);
  // doc.vatAmount = formatNumber_as_Thai(doc.vatAmount);
  // doc.netAmount = formatNumber_as_Thai(doc.netAmount);
  // จัดรูปแบบตัวเลขใน tableRow
  doc.tableRows = doc.tableRows.map( row => {
    // ถ้าเป็นเซลล์ว่าง ให้เป็นเซลล์ว่างต่อไป
    row.price = row.price && row.price != 0 ? formatNumber_as_Thai(row.price) : '';
    row.quantity = row.quantity && row.quantity != 0 ? row.quantity : '';  
    row.amount = row.amount && row.amount != 0 ? formatNumber_as_Thai(row.amount) : '';
    return row;
  });

  return doc;
}




//============================================= 
// จับชื่อข้อมูลจาก url
// เพราะใช้ router ซ้ำกับ
// - ใช้กับ warehouse-in , warehouse-out , sales
// - ต้องมาจับข้อมูลจากที่นี่เสมอ
// - แก้ไขเอกสารได้ใน 4 ชั่วโมง ถ้าเลยจะเปลี่ยนสถานะเป็น 2 อัตโนมัติ ตอนโหลดเอกสาร
export function get_Info_ByUrl(originalUrl) {

  //=== กลุ่มเอกสาร
  if(originalUrl.startsWith(global.PATH_WAREHOUSE_IN)){
    return {
      docTitle : global.PAGE_WAREHOUSE_IN ,
      docType : 'warehouseIn' ,  // เพิ่มเติม เพื่อใช้ในฟังก์ชัน create_Row() ใน warehouse_modal.js
      folderName: global.folderWarehouseIn, 
      collectionName: global.dbColl_warehouseIn,
      hoursCanEdit : 1,    // แก้ไขได้ 1 ชั่วโมง
      hoursCanCancel : 2,   // ยกเลิกได้ 2 ชั่วโมง
    }
  }else if(originalUrl.startsWith(global.PATH_WAREHOUSE_OUT)){
    return {
      docTitle : global.PAGE_WAREHOUSE_OUT ,
      docType : 'warehouseOut' ,  // เพิ่มเติม เพื่อใช้ในฟังก์ชัน create_Row() ใน warehouse_modal.js
      folderName: global.folderWarehouseOut,
      collectionName:global.dbColl_warehouseOut,
      hoursCanEdit : 0,     // แก้ไม่ได้เลย
      hoursCanCancel : 1,   // ยกเลิกได้ 1 ชั่วโมง
    }
  }else if(originalUrl.startsWith(global.PATH_SALES)) {
    return {
      docTitle : global.PAGE_SALES ,
      docType : 'sales' ,  // เพิ่มเติม เพื่อใช้ในฟังก์ชัน create_Row() ใน warehouse_modal.js
      folderName: global.folderSales,
      collectionName:global.dbColl_sales,
      hoursCanEdit : 0,    // ใครก็แก้ไม่ได้เลย
      hoursCanCancel : 1,  // ยกเลิกได้ 1 ชั่วโมง
    }
  }
  //==== กลุ่มรายงาน
  else if(originalUrl.startsWith(`/report${global.PATH_WAREHOUSE_IN}`)){
    return {
      docTitle : global.PAGE_REPORT_WAREHOUSE_IN ,
      docType : 'warehouseIn' , 
      collectionName: global.dbColl_warehouseIn, // ดึง
    }
  }else if(originalUrl.startsWith(`/report${global.PATH_WAREHOUSE_OUT}`)){
    return { 
      docTitle : global.PAGE_REPORT_WAREHOUSE_OUT ,
      docType : 'warehouseOut' ,
      collectionName:global.dbColl_warehouseOut,
    }
  } else if(originalUrl.startsWith(`/report${global.PATH_SALES}`)) {
    return {
      docTitle : global.PAGE_REPORT_SALES ,
      docType : 'sales' ,
      collectionName:global.dbColl_sales,
    }
  }

  //==== กลุ่มรายงาน - ไอเท็ม
  else if(originalUrl.startsWith(`/report/items${global.PATH_WAREHOUSE_IN}`)){
    return {
      docTitle : 'รายงานไอเท็มรับเข้า' ,
      docType : 'warehouseIn' , 
      collectionName: global.dbColl_warehouseIn, // ดึง
    }
  }else if(originalUrl.startsWith(`/report/items${global.PATH_WAREHOUSE_OUT}`)){
    return { 
      docTitle : 'รายงานไอเท็มเบิกออก' ,
      docType : 'warehouseOut' ,
      collectionName:global.dbColl_warehouseOut,
    }
  } else if(originalUrl.startsWith(`/report/items${global.PATH_SALES}`)) {
    return {
      docTitle : 'รายงานขายไอเท็ม' ,
      docType : 'sales' ,
      collectionName:global.dbColl_sales,
    }
  }

}

//============================================= 
// จับชื่อ collection จาก path
// เช่น /warehouse/in จะได้ global.dbColl_warehouseIn
// 
export function get_StatusName_byStatusNumber(docStatusNumber) {
  const statusFind = global.DOC_STATUS.find( obj => {
    return obj.statusNumber == docStatusNumber
  })
  // console.log("statusFind ===> ", statusFind)
  return statusFind?.statusName || ''
}







/***********************************************
************************************************
***********************************************
******************* Report ******************
***********************************************
***********************************************
************************************************/

//================================================
// จับเดือนที่ไม่ซ้ำในเอกสาร
// ผลลัพธ์ เช่น 
// monthDocs ===>  [ { month: '2025-08', monthName: 'สิงหาคม 2025' } ]
// โดย docDateTime อยู่ในรูปแบบ 2025-08-05 15:57
//
export async function getDocs_MonthUnique(collDocName) {
  const client = new MongoClient(global.dbUrl)
  try{
    await client.connect()
    const db = client.db(global.dbName)
    const collection = db.collection(collDocName)

    //=== 2.) คำนวณเดือนใน docs ทั้งหมด -  Month
    const datesDocs = await collection.distinct("docDateTime", {})
    const monthDocsUnique = [...new Set(datesDocs.map(date => date.slice(0, 7)))]
    //== 2.1) เพิ่มชื่อเดือนและปีเข้าไป 
    const monthDocs = monthDocsUnique.map( month => {
      const [year, monthNum] = month.split("-");
      return { month, monthName: `${global.MONTH_NAMES[parseInt(monthNum)-1]} ${year}` }
    })
    monthDocs.sort( (a,b) => {
      return a.month > b.month ? -1 : 1
    })

    return monthDocs
  }catch(err){
    console.log(err)
    throw err
  }finally{
    client.close()
  }
}











// //================================================
// // จับข้อมูลผู้ใช้ทั้งหมด  - สำหรับใช้ทำ Modal
// // 
// export async function getCustomers_for_Modal() {
//   const client = new MongoClient(global.dbUrl)
//   try{
//     await client.connect()
//     const db = client.db(global.dbName)
//     const collection = db.collection(global.dbColl_customers)
//     var DATA_CUSTOMERS =  await collection.find(
//       { customerStatus: 'active' },
//       { projection : { 
//           _id : 0 ,
//           customerId: 1,         //  10004,
//           customerStatus: 1,     //  'active',
//           customerName: 1,       //  'ห้างหุ้นส่วนจำกัด สมาร์ทเทค',
//           customerType: 1,       //  
//           customerAddress1: 1,   //  '12/34 ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ',
//           customerAddress2: 1,   //  'กรุงเทพมหานคร 10240',
//           customerTaxId: 1,      //  '3456789012345',
//           customerIdentityId: 1, //  '',
//           customerWebsite: 1,    //  'www.ssssmmmmttttt.com',
//           customerPhone: 1,      //  'โทรฯ 012-012-0123',
//           customerEmail: 1,      //  'ssssmmmmttttt@smt.co.th',
//           customerContactPerson: 1, 
//         }
//       }
//     ).toArray()

//     return DATA_CUSTOMERS
//   }catch(err){
//     console.log(err)
//     throw err
//   }finally{
//     client.close()
//   }
// }


//================================================
// จับข้อมูลผู้ใช้ทั้งหมด  - สำหรับใช้ทำรายงาน
// 
export async function getUsers_for_report(matchedOption) {
  const client = new MongoClient(global.dbUrl)
  try{
    await client.connect()
    const db = client.db(global.dbName)
    const collection = db.collection(global.dbColl_users)

    var dataUsers =  await collection.find(
      matchedOption ,
      { projection : { 
          _id: 0 , 
          userIsActive: 1 ,
          userId: 1 , 
          branchId: 1 , 
          userAuthority: 1 , 
          userFullname: { $concat: ["$userPrefix"," ","$userFirstname"," ","$userLastname"] },
        }
      }
    ).toArray()
    // console.log(dataUsers)

    return dataUsers
  }catch(err){
    console.log(err)
    throw err
  }finally{
    client.close()
  }
}


//================================================
// จับข้อมูลไอเท็มทั้งหมด  - สำหรับใช้ทำรายงาน
//
export async function getItems_for_report() {
  const client = new MongoClient(global.dbUrl)
  try{
    await client.connect()
    const db = client.db(global.dbName)
    const coll_items = db.collection(global.dbColl_items)

    const dataItems = await coll_items.aggregate([
      // { $match: {} },
      { $project: { _id: 0 } },
      { $sort: { itemId: 1 } }
    ]).toArray()
    dataItems.forEach( obj => {
      for( let key in obj){
        if (key == 'itemName' || key == 'itemDesc') {
          obj[key] = obj[key].replace(/"/g, `\\"`).replace(/\r\n|\r|\n/g,"\\n")
        }
      }
    })

    return dataItems
  }catch(err){
    console.log(err)
    throw err
  }finally{
    client.close()
  }
}




//================================================
//
//
export async function getDocs_Conclude(collDocName) {
  const client = new MongoClient(global.dbUrl)
  try{
    await client.connect()
    const db = client.db(global.dbName)
    const collection = db.collection(collDocName)
    const dataDocConclude = await collection.find(
      {},
      { projection : { 
          _id: 0, 
          docId:1,   
          docDateTime:1, // docDate:1, 
          docStatusNumber:1, 
          customerName:1 
        } 
      }
    ).toArray()

    return dataDocConclude
  }catch(err){
    console.log(err)
    throw err
  }finally{
    client.close()
  }
}




//================================================
// ตรวจสอบวัน
//
export async function check_DocDateTime_CanEdit(docFind, collectionName, userId) {
  try{
    const nowLocal = DateTime.now().setZone('Asia/Bangkok').toFormat('yyyy-MM-dd HH:mm')
    const {diffDhm, diffMs} = myDateTime.calc_DiffDateTime(nowLocal , docFind.dateTimeCanEdit)
    // console.log('------- check EDIT -------')
    // console.log("diffDhm ===> ", diffDhm)
    // console.log("diffMs ===> ", diffMs)
    if(diffMs <= 0){ // เกินเวลาแก้ไข
      const client = new MongoClient(global.dbUrl)
      await client.connect()
      const db = client.db(global.dbName)
      const collection = db.collection(collectionName)
      const rtnUpdate = await collection.updateOne( 
        { 
          docId: docFind.docId,
          userId: userId,
        }, 
        { 
          $set: { 
            docStatusNumber: 2,
            canEdit : false,
          } 
        }
      );
      client.close()

      // ถ้าเกินเวลาคืนสถานะ 2  ไม่เกินคืนสถานะเดิม
      return {
        canEdit : false,
        docStatusNumber : rtnUpdate.modifiedCount > 0 ? 2 : docFind.docStatusNumber,
        dateTimeEditRemain : diffDhm,
      }
    }else{
      return {
        canEdit : true,
        docStatusNumber : docFind.docStatusNumber,
        dateTimeEditRemain : diffDhm,
      }
    }
  }catch(err){
    return err
  }
}

//================================================
// ตรวจสอบวัน
//
export async function check_DocDateTime_CanCancel(docFind, collectionName, userId) {
  try{
    // const nowLocal = myDateTime.nowLocal().slice(0, 16).replace("T", " ") // 2025-09-05 15:57
    const nowLocal = DateTime.now().setZone('Asia/Bangkok').toFormat('yyyy-MM-dd HH:mm')
    const {diffDhm, diffMs} = myDateTime.calc_DiffDateTime(nowLocal, docFind.dateTimeCanCancel )
    // console.log('------- check CANCEL -------')
    // console.log("diffDhm ===> ", diffDhm)
    // console.log("diffMs ===> ", diffMs)
    if(diffMs <= 0){
      // console.log('---- เกินเวลายกเลิก ----')
      const client = new MongoClient(global.dbUrl)
      await client.connect()
      const db = client.db(global.dbName)
      const collection = db.collection(collectionName)
      await collection.updateOne( 
        { 
          docId: docFind.docId,
          userId: userId, // ของตัวเองเท่านั้น
        }, 
        { $set: { canCancel : false,} }
      );
      client.close()     

      // ถ้าเกินเวลาคืนสถานะ 2  ไม่เกินคืนสถานะเดิม
      return {
        canCancel : false,
        dateTimeCancelRemain : diffDhm,
      }
    }else{
      // console.log('---- ยังไม่เกินเวลายกเลิก ----')
      return {
        canCancel : true,
        dateTimeCancelRemain : diffDhm ,
      }
    }
  }catch(err){
    return err
  }
}






// //================================================
// // ใช้สำหรับจับชื่อ collection จาก docTitle
// // เช่น docTitle === global.PAGE_QUOTATION จะได้ global.dbColl_quotation
// // 
// export function getCollName_by_DocTitle(docTitle) {

//   //=== เอกสาร
//   if(docTitle === global.PAGE_QUOTATION){
//     var collName = global.dbColl_quotation
//   }else  if(docTitle === global.PAGE_INVOICE){
//     var collName = global.dbColl_invoice
//   }else if(docTitle === global.PAGE_RECEIPT){
//     var collName = global.dbColl_receipt
//   }else if(docTitle === global.PAGE_BILL){
//     var collName = global.dbColl_bill
//   }
//   //=== รายงาน
//   else if(docTitle === global.PAGE_REPORT_QUOTATION){
//     var collName = global.dbColl_quotation
//   }else if(docTitle === global.PAGE_REPORT_INVOICE){
//     var collName = global.dbColl_invoice
//   }else if(docTitle === global.PAGE_REPORT_RECEIPT){
//     var collName = global.dbColl_receipt
//   }else if(docTitle === global.PAGE_REPORT_BILL){
//     var collName = global.dbColl_bill
//   }
//   //=== อื่นๆ - ไม่ควรมีแบบนี้ 
//   else{
//     var collName = ''
//   }
//   return collName
// }



// //============================================= 
// // แปลงชนิดข้อมูล พร้อมสำหรับการเขียนลง DB
// // - ใช้กับ quotation/invoice
// // - ไม่ได้เแปลงทุกตัว แปลงเฉพาะที่ต้องเป็นตัวเลข
// export function convert_DocDataType(doc) {
//   doc.docStatusNumber = doc.docStatusNumber ? Number(doc.docStatusNumber) : doc.docStatusNumber 
//   doc.customerId = doc.customerId ? Number(doc.customerId) : doc.customerId 
//   doc.proposerId = doc.proposerId ? Number(doc.proposerId) : doc.proposerId  
//   doc.totalAmount = doc.totalAmount ? Number(doc.totalAmount) : doc.totalAmount
//   doc.vatAmount = doc.vatAmount ? Number(doc.vatAmount) : doc.vatAmount
//   doc.netAmount = doc.netAmount ? Number(doc.netAmount) : doc.netAmount
//   //=== แก้ type ใน tableRows
//   doc.tableRows = doc.tableRows.map(row => {
//     return {
//       index : !isNaN(row.index) ? Number(row.index) : row.index , // เป็นตัวเลขตั้งแต่แรกอยู่แล้ว
//       itemId: row.itemId, // สตริง
//       no: row.no,         // สตริง
//       description: row.description, // สตริง
//       unit: row.unit ,    // สตริง
//       price: !isNaN(row.price) ? Number(row.price) : row.price, // ตัวเลข ***
//       quantity: !isNaN(row.quantity) ? Number(row.quantity) : row.quantity, // ตัวเลข ***
//       amount: !isNaN(row.amount) ? Number(row.amount) : row.amount // ตัวเลข ***
//     }
//   })
//   return doc
// }






// //============================================= 
// // จับชื่อ collection จาก path
// // เช่น /warehouse/in จะได้ global.dbColl_warehouseIn
// // 
// export function get_Warehouse_DbName(originalUrl) {
//   if(originalUrl.startsWith(global.PATH_WAREHOUSE_IN)){
//     return {
//       collectionName: global.dbColl_warehouseIn,
//       docType : 'in'  // เพิ่มเติม เพื่อใช้ในฟังก์ชัน create_Row() ใน warehouse_modal.js
//     }
//   }else if(originalUrl.startsWith(global.PATH_WAREHOUSE_OUT)){
//     return {
//       collectionName:global.dbColl_warehouseOut,
//       docType : 'out'  // เพิ่มเติม เพื่อใช้ในฟังก์ชัน create_Row() ใน warehouse_modal.js
//     }
//   }
// }
// //============================================= 
// // จับชื่อโฟลเดอร์ จาก path
// // เช่น /warehouse/in จะได้ global.folderWarehouseIn
// // 
// export function get_Warehouse_FolderName(originalUrl) {
//   if(originalUrl.startsWith(global.PATH_WAREHOUSE_IN)){
//     return {folderName: global.folderWarehouseIn}
//   }else if(originalUrl.startsWith(global.PATH_WAREHOUSE_OUT)){
//     return {folderName: global.folderWarehouseOut}
//   }
// }