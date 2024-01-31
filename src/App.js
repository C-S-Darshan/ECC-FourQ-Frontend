import './App.css';
import Authenticate from './Components/Authentication';
import AccountProvider from './Context/AccountProvider';

function App() {
  return (
    <div className="App">
      <AccountProvider>
      <h1>Chat app based on FourQ ECC</h1>
      <Authenticate/>
      </AccountProvider>
    </div>
  );
}

export default App;
