import "./styles.css";
import { React, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";



export default function App() {
  const [crypto, setCrypto] = useState([]);    //state  variable to store data fetched from the API call
  const [search, setSearch] = useState("");    // state variable to store the searched symbol 
  const [specificcrypto, setSpecificcrypto] = useState([]);  //state variable to store the specific crypto searched from the API call
  let symbol;
  const [submitbutton, setSubmitbutton] = useState(false);   //state variable to confirm if the button is clicked or not
  const [symbolfilter, setSymbolfilter] = useState("");    //state variable to store the value of the symbol filter 

  
  //used useEffect here for the initial rendering and fetching the data from the API call
  useEffect(() => {
    fetch("https://api.wazirx.com/sapi/v1/tickers/24hr")
      .then((response) => response.json())
      .then((data) => setCrypto([...data]));
  }, []);

  //setinterval used here to further fetch API after every 2 min
  setInterval(() => {
    fetch("https://api.wazirx.com/sapi/v1/tickers/24hr")
      .then((response) => response.json())
      .then((data) => setCrypto([...data]));
  }, 1000 * 120);

  
 // function created which stores the input typed by the user in symbol variable declared above. Also it checks if the the user backspace the input box 
 // and if the input box is completely empty then it shows the entire list by default
  function searchedCrypto(e) {
    if (e.target.value === "") {
      setSubmitbutton(false);
    }
    symbol = e.target.value;
    console.log(symbol);
    setSearch(e.target.value);
  }

  //function created to first update the submit button state to true to confirm if the user has clicked on the submit button or not. 
  //if the user has clicked then it filters the crypto [] and only shows the symbol asked.
  function submitsearchCrypto() {
    setSubmitbutton(true);

    setSpecificcrypto(
      crypto.filter((e) => {
        return e.symbol === search;
      })
    );
    console.log(specificcrypto);
  }

  //function created to accept the dropdown filter to load the list either in ascending or descending order. 
  //used sort method to do that.
  function handleChange(event) {
    if (event.target.value === "atoz") {
      const sorteddata = crypto.sort((a, b) => {
        return a.symbol > b.symbol ? 1 : -1;
      });
      setCrypto([...sorteddata]);
    } else {
      const sorteddata = crypto.sort((a, b) => {
        return a.symbol < b.symbol ? 1 : -1;
      });
      setCrypto([...sorteddata]);
    }
  }

  return (
    <div className="App">
      <p>Search Symbol: </p>
      <input onChange={searchedCrypto} />
      <button onClick={submitsearchCrypto}>Search</button>
      <table>
      
        <tr>
          <th>
           //used material UI dropdown filter box here to give user an option to list symbols in A-Z(asc) or Z-A(desc) order
            <Box
              style={{
                backgroundColor: "lightcyan"
              }}
              sx={{ minWidth: 120 }}
            >
              <FormControl fullWidth>
                <InputLabel
                  style={{
                    color: "black",
                    fontWeight: "bold"
                  }}
                  id="demo-simple-select-label"
                >
                  Symbol
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={symbolfilter}
                  label="Symbol"
                  onChange={handleChange}
                >
                  <MenuItem value={"atoz"}>Symbol - (A-Z)</MenuItem>
                  <MenuItem value={"ztoa"}>Symbol - (Z-A)</MenuItem>
                </Select>
              </FormControl>
            </Box>

          </th>
          <th>Open Price</th>
          <th>Low Price</th>
          <th>High Price</th>
        </tr>
// mentioned a ternary operator to show a specific symbol only if the submit button has been clicked
        {submitbutton
          ? specificcrypto.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.symbol}</td>
                  <td>{val.openPrice}</td>
                  <td>{val.lowPrice}</td>
                  <td>{val.highPrice}</td>
                </tr>
              );
            })
          : crypto.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.symbol}</td>
                  <td>{val.openPrice}</td>
                  <td>{val.lowPrice}</td>
                  <td>{val.highPrice}</td>
                </tr>
              );
            })}
      </table>
    </div>
  );
}
