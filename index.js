const { parse } = require('csv')
const fs = require('fs')
const express = require('express')
const path = require('path');
const { stringify: stringifySync } = require('csv/sync');
const cors = require('cors')

const app = express()

app.use(express.json());
app.use(cors());

const port = 3000



function readCSV(file) {
  return new Promise((resolve, reject) => {
    try {
      const filePath = path.resolve(file);
      const content = fs.readFileSync(filePath, 'utf8');
      parse(content, { columns: true, skip_empty_lines: true }, (err, records) => {
        if (err) return reject(err);
        resolve(records);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function addToCSV(file, row) {
  return new Promise((resolve, reject) => {
    try {
      const filePath = path.resolve(file);
      let writeHeader = false;
      let prependNewline = false;

      if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
        writeHeader = true;
      } else {
        const contenido = fs.readFileSync(filePath, 'utf8');
        if (!contenido.endsWith('\n')) prependNewline = true;
      }

      const salida = stringifySync([row], { header: writeHeader });
      const finalOutput = (prependNewline ? '\n' : '') + salida;

      fs.appendFile(filePath, finalOutput, (err) => {
        if (err) return reject(err);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

function deleteFromCSV(file, id) {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = path.resolve(file);
      const records = await readCSV(filePath);
      const removed = records.find(r => r.no_ordencompra === String(id));
      if (!removed) return resolve(null);
      const filtered = records.filter(r => r.no_ordencompra !== String(id));
      const salida = stringifySync(filtered, { header: true });
      fs.writeFile(filePath, salida, (err) => {
        if (err) return reject(err);
        resolve(removed);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function updateInCSV(file, id, updates) {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = path.resolve(file);

      const records = await readCSV(filePath);

      const index = records.findIndex(r => r.no_ordencompra === id);
      if (index === -1) return resolve(null);

      if (updates.fecha_oc) {
        records[index].fecha_oc = updates.fecha_oc;
      }
      if (updates.codigo_ean) {
        records[index].codigo_ean = updates.codigo_ean;
      }

      const salida = stringifySync(records, { header: true });

      fs.writeFile(filePath, salida, (err) => {
        if (err) return reject(err);
        resolve(records[index]);
      });
    } catch (err) {
      reject(err);
    }
  });
}

app.get('/api/all', async (req, res) =>{
    try{
        const data = await readCSV('ordenes-compra-seguridad.csv')
        res.send(data)
    } catch (error) {
        res.status(500).json({error:'Error al leer CSV'})
    }
})

app.get('/api/:id', async (req, res) =>{
    try{
        const { id } = req.params
        const data = await readCSV('ordenes-compra-seguridad.csv')
        const answ = data.find(item => item.no_ordencompra === id)

        if(answ){
            res.json(answ)
        } else{
            res.status(400).json({error: 'No se encontró dicho registro'})
        }
    } catch (err){
        res.status(500).json({error: "Error al leer CSV"})
    }
})

app.get('/api/search/:keyvalue', async (req,res) =>{
    try{
        const { keyvalue } = req.params
        console.log(keyvalue)
        const data = await readCSV('ordenes-compra-seguridad.csv')

        const answ = data.filter(item =>

            item.no_ordencompra === keyvalue ||
            item.fecha_oc === keyvalue ||
            item.codigo_ean === keyvalue
        )
        console.log(answ)
        if(answ){
            res.json(answ)
        }else{
            res.status(400).json({error: 'No se encontró dicho registro'})
        }
    } catch(err){
        res.status(500).json({error:"Error al leer CSV"})
    }
})

app.post('/api/create', async (req, res) => {
  const newRow = req.body;
  try {
    await addToCSV('ordenes-compra-seguridad.csv', newRow);
    res.json({ message: 'Fila agregada correctamente', data: newRow });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar fila'});
  }
});

app.delete('/api/:id', async (req, res) => {
    const { id } = req.params
    console.log(id)
    try{
        const deletedRow = await deleteFromCSV('ordenes-compra-seguridad.csv', id)
        if (!deletedRow){
            return res.status(400).json({error:'Fila no encontrada'})
        }else{
            res.json({message:'Fila eliminada correctamente', data: deletedRow})
        }
    }catch (err) {
        res.status(500).json({error: 'Error al eliminar'})
    }
})

app.put('/api/update/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updated = await updateInCSV('ordenes-compra-seguridad.csv', id, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Orden de compra no encontrada' });
    }else{
      res.json({ message: 'Fila actualizada correctamente', data: updated });  
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar fila', details: error.message });
  }
});


app.listen(port,()=>{
    console.log("Escuchando el puerto", port)
})