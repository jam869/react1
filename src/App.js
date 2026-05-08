import logo from './logo.svg';
import './App.css';


function Salutations(props){
  return <p>Bonjour {props.nom}</p>
}

const Employes = (props) => 
  <div style = {{backgroundColor: "darkcyan", width:"250px"}}>
    <h3>Les employes</h3>
    {props.children} 
  </div>
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        <Employes>
          <Salutations nom="Alice" />
          <Salutations nom="Bob" />
          <Salutations nom="Charlie" />
        </Employes>

          </p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
