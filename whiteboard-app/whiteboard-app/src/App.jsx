import './App.css'
import Container from "../components/container/Container.jsx";
import {AppRoot} from "@telegram-apps/telegram-ui";
import '@telegram-apps/telegram-ui/dist/styles.css';

function App() {

  return (
      <AppRoot>
        <Container/>
      </AppRoot>
  )
}

export default App
