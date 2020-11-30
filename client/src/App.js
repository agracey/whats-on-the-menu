import './App.css';

import DayOfTheWeek from './DayOfTheWeek.js'

const days = ['monday', 'tuesday', 'wednesday','thursday','friday', 'saturday', 'sunday']

function App() {
  return (
    <div className="Menu">
      <div>
        {days.map((day)=>((
          <DayOfTheWeek day={day} key={day}/>
        )))}
      </div>
    </div>
  );
}

export default App;
