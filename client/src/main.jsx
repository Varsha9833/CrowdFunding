import React from "react";
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import {ThirdwebProvider} from '@thirdweb-dev/react'; 

import { StateContextProvider } from "./context";

import App from './App';
import './index.css'; 

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <ThirdwebProvider
        clientId="99080b06a641faf1eb2dc30623fdc398"
        activeChain={{
        chainId: 11155111, // Sepolia testnet
        
        rpc: ["https://eth-sepolia.g.alchemy.com/v2/qSW2DpAGZvacOOQ3mD_ua"],

        // 🔽 REQUIRED FIELDS
        nativeCurrency: {
          name: "Sepolia Ether",
          symbol: "ETH",
          decimals: 18,
        },
        shortName: "sep",
        slug: "sepolia",
        name: "Ethereum Sepolia",
        testnet: true,
      }}
      >
        <Router>
          <StateContextProvider>
            <App />
          </StateContextProvider>
          
        </Router>
      </ThirdwebProvider>
    </React.StrictMode>
  );
} else {
  console.error('❌ No root element found. Make sure your index.html contains: <div id="root"></div>');
}
