import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import { BsTrash} from "react-icons/bs";

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
    <div className="mainWrapper">
      <h3 className="header">SHOPPING LIST</h3>
      {list?.length === 0 && <label>NO ITEMS IN SHOPPING LIST</label>}
      {list?.map((item) => {
        return (
          <ListElement item={item} handleProductRemove={handleProductRemove} />
        );
      })}
      <div className="actionWrapper">
        <input
          type="text"
          className="customInput"
          onChange={(e) => setLabelText(e.target.value)}
          value={labelText}
        />
        <button className="customButton" onClick={handleAddProduct}>
          ADD PRODUCT
        </button>
      </div>
    </div>
  );
}

const ListElement = ({ item, handleProductRemove }) => {
  const [fade, setFade] = useState(false);
  return (
    <div key={item.Id} className={`${fade ? "fade" : ""} listElement`}>
      <label style={{ paddingRight: "1em" }}>{item.Name}</label>
      <BsTrash
        onClick={() => {
          setFade(true);
          setTimeout(() => {
            handleProductRemove(item.Id);
          }, [520]);
        }}
        size={19}
      />
    </div>
  );
};

export default App;