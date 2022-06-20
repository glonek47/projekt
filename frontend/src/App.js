import axios from "axios";
import { useEffect, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";

function App() {
  const [list, setList] = useState([]);
  const [labelText, setLabelText] = useState("");

  const fetchShoppingList = () => {
    axios.get("http://localhost:8000/").then((x) => {
      setList(x.data);
    });
  };

  const handleProductRemove = (id) => {
    axios
      .delete(`http://localhost:8000/product/${id}`)
      .then((response) => {
        setList(response.data);
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  const handleAddProduct = () => {
    axios
      .post("http://localhost:8000/product", { name: labelText })
      .then((response) => {
        setLabelText("");
        setList(response.data);
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  useEffect(() => {
    fetchShoppingList();
  }, []);

  return (
    <div
      style={{ paddingLeft: "6em", paddingRight: "6em", textAlign: "center", backgroundColor: "grey" }}
    >
      <h3>Shopping list</h3>
      {list?.map((x) => {
        return (
          <div key={x.Id} style={{ paddingTop: "1em", paddingBottom: "1em" }}>
            <label style={{ paddingRight: "1em" }}>{x.Name}</label>
            <BsFillTrashFill
              onClick={() => handleProductRemove(x.Id)}
              size={19}
            />
          </div>
        );
      })}
      <div style={{ paddingBottom: "2em" }}>
        <label>Enter product</label>
        <br />

        <input
          type="text"
          onChange={(e) => setLabelText(e.target.value)}
          value={labelText}
        />
        <button onClick={handleAddProduct}>Add</button>
      </div>
    </div>
  );
}

export default App;
