let data = JSON.parse(require('fs').readFileSync('jsondata.json', 'utf8'))

let tables = {

}

function modifyRow(table_id, row_id, data, isWriteOver) {
  if (!tables[table_id]) {
    tables[table_id] = {}
  }
  
  if (!data) return
  
  
  if (!!tables[table_id][row_id]) {
    if (!Array.isArray(tables[table_id][row_id])) {
      tables[table_id][row_id] = [tables[table_id][row_id]]
    }
    
    tables[table_id][row_id] = [...tables[table_id][row_id], data]
    return
  }
  
  tables[table_id][row_id] = data
}


for (let entry of data) {
  switch (entry.op_type) {
    case 'modify_row': {
      modifyRow(entry.table_id, entry.row_id, entry.updated, true)
      break
    }
    case 'modify_rows': {
      Object.entries(entry.updated).forEach(([key, obj]) => {
        modifyRow(entry.table_id, key, obj, true)
      })
      break
    }
    case 'delete_row': {
      modifyRow(entry.table_id, entry.row_id, null)
	  break
    }
    case 'delete_rows': {
		entry.deleted_rows.forEach((obj, i) => {
			modifyRow(entry.table_id, obj._id, null)
	   })
	  break
    }
    case 'insert_row': {
      modifyRow(entry.table_id, entry.row_id, entry.row_data)
      break
    }
    case 'insert_rows': {
      entry.row_datas.forEach((obj, i) => {
        modifyRow(entry.table_id, entry.row_ids[i], obj)
      })
      break
    }
    
    case 'rename_column':
    case 'resize_column':
    case 'modify_sorts':
    case 'modify_row_color': {
      break
    }
    default: {
      console.error("Unknown type", entry.op_type)
    }
  }
}

let newFields = {}
let keys = []
for (let [key, objs] of Object.entries(tables['0000'])) {
  let data = {}
  if (!Array.isArray(objs)) {
    objs = [ objs ]
  }
  
  for (let obj of objs) {

	keys.push(...Object.keys(obj))
    
    for (let [key, val] of Object.entries(obj)) {
      if (!data[key]) {
        data[key] = []
      }
      
      data[key] = Array.from(new Set([...data[key], val.trim ? val.trim() : val])).flatMap(x => x).filter(x => !!x)
    }
    
    
  }
  
  delete data["_last_modifier"]
  delete data["_id"]
  delete data["_participants"]
  delete data["_creator"]
  delete data["_ctime"]
  delete data["_mtime"]
  delete data["_last_modifier"]
  delete data["_last_modifier"]
  delete data["_last_modifier"]
  
  
  newFields[key] = data
}

let last = Object.values(newFields).map(object => {
let t = Object.fromEntries(Object.entries(object).map(([_, vals]) => [_, vals[vals.length-1]]))

delete t['LIs6']
delete t['j4R5']
delete t['Z5Hp']

const {

"0000": name,
"KTWa": key,
"Vt4p": reg_name,
"Eucb": reg_email,

} = t

return {
name, key, reg_name, reg_email
}

})


let fixedLast = {}

for (let object of Object.values(last)) {
  fixedLast[object.key] = object
}
fixedLast = Object.values(fixedLast)

const ObjectsToCsv = require('objects-to-csv');
 

// If you use "await", code must be inside an asynchronous function:
(async () => {
  const csv = new ObjectsToCsv(fixedLast);
 
  // Save to file:
  await csv.toDisk('./test.csv');
 
  // Return the CSV file as string:
  console.log(await csv.toString());
})();
