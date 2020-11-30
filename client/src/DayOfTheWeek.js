import Meal from './Meal.js'


const meals = ['lunch','dinner']

function DayOfTheWeek({day}) {
    return (
      <div className="dotw">
        <header>{day}</header>
        <div className="meals-column">
            {meals.map((meal)=>((<Meal day={day} meal={meal} key={day + '-' + meal}/>)))}
        </div>
      </div>
    )
  }
  
  export default DayOfTheWeek;
  