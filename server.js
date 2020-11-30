const express = require('express')

const ac = require('autocorrect')

const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
const meals = ['lunch', 'dinner']
const emptyMealsMap = days.reduce((acc, curr)=>{
    const ret = JSON.parse(JSON.stringify(acc))
    ret[curr] = meals.reduce((acc2,curr)=>{
        const ret = JSON.parse(JSON.stringify(acc2))

        ret[curr] = 'Undecided'
        return ret
    },{})
    return ret
},{})

const getMealForInput = ac({words:meals})
const getDayForInput = ac({words:days})

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./meals.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the meals database.');
});

db.run("CREATE TABLE IF NOT EXISTS meals (day TEXT, meal TEXT, value TEXT)")

const resetDB = ()=>{
    const stmt = db.prepare('INSERT INTO meals VALUES (?,?,?)')
    
    days.forEach((d)=>{
        meals.forEach((m)=>{
            stmt.run(d, m, 'Nothing Decided')
        })
    })
    stmt.finalize()
}

db.all("SELECT * from meals",(err,rows)=>{
    console.log(err,rows)
    if (rows.length==0) resetDB()
})

// TODO implement getMeals and setMeal

const getMeals = ()=>{
    return new Promise((res,rej)=>{
        db.all("SELECT * from meals",(err,rows)=>{
            if (err) return rej(err)
            
            res(rows.reduce((acc, curr)=>{
                const ret = JSON.parse(JSON.stringify(acc))
                ret[curr.day][curr.meal] = curr.value
                return ret
            },emptyMealsMap))
        })
    })
}
const setMeal = (day, meal, value)=>{
    return new Promise((res,rej)=>{
        const stmt = db.prepare('UPDATE meals SET value=? WHERE day LIKE ? AND meal LIKE ?')
        
        stmt.run([value,day,meal], (err,rows)=>{
            if (err) return rej(err)
            
            res()
        })
    })
}

const app = express()
var expressWs = require('express-ws')(app);

app.get('/api/meals',(req,res)=>{
    getMeals().then(meals=>{
        res.send(meals)
    })
})





const updateAll = async ()=>{
    const meals = await getMeals()
    console.log('updating with: ', meals)
    expressWs.getWss().clients.forEach(c=>{c.send(JSON.stringify({type: 'LIST_LOAD', payload: meals}))})
} 


const processUpdate = async (update) => {
    await setMeal(update.day, update.meal, update.value)
}

app.ws('/ws/meals',(ws)=>{

    getMeals().then(ret=>{
        console.log('testing')
        console.log(ret)
    })


    ws.on('message', async function(msg) {
        if(msg == 'init') {
            getMeals().then(meals=>{
                ws.send(JSON.stringify({type: 'LIST_LOAD', payload: meals}))
            })
            
        } else {
            await processUpdate(JSON.parse(msg))
            await updateAll()
        }
    });
})

app.use(express.json({}))

app.post('/api/meal', async (req,res)=>{
    const {day, meal, value} = req.body

    const realday = getDayForInput(day)
    const realmeal = getMealForInput(meal)

    await setMeal(realday, realmeal, value)
    await updateAll()

    res.sendStatus(204)
})


app.listen(3081, ()=>{
    console.log('listening on 3081')
})