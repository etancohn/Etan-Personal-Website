import React from "react";
import "./ShoppingList.css";
import "../../../global.css";
import GreenNavbar from "../../../components/GreenNavbar";

export default function ShoppingList() {
  // State to store the items
  const [items, setItems] = React.useState([]);

  // Function to add an item to the list
  const addItem = () => setItems([...items, { s: "", checked: false }]);

  // Function to delete an item from the list
  const deleteItem = (index) => {
    console.log(`items: ${items}`)
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((item, i) => {
        return i !== index;
      });
      console.log(updatedItems);
      return updatedItems;
    });
  };

  // Function to handle text input changes
  const handleText = (e, index) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].s = e.target.value;
      return updatedItems;
    });
  };

  // Function to handle checkbox changes
  const handleCheck = (e, index) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].checked = e.target.checked;
      return updatedItems;
    });
  };

  // Function to handle key press events
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  return (
    <div className="shopping-list">
      <GreenNavbar />
      <div className="shopping-list-container">
        <h1 className="title">
          Shopping List
        </h1>

        <div className="shopping-list-items">
          {items.length === 0 && <p className="no-items">No Items</p>}
          {items.map((item, index) => (
            <div
              className={`shopping-list-item ${
                index % 2 === 0 ? "even-item" : "odd-item"
              }`}
              key={index}
            >
              <div className="check-container">
                <input
                  className="check"
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => handleCheck(e, index)}
                />
              </div>

              <div className="text-container">
                <input
                  type="text"
                  className={`item-text ${
                    items[index].checked ? "text-crossed-out" : ""
                  }`}
                  value={item.s}
                  placeholder={`Item ${index + 1}`}
                  onChange={(e) => handleText(e, index)}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </div>
              <div className="delete-btn-container">
                <button className="delete-btn" onClick={() => deleteItem(index)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="add-button" onClick={addItem}>
          Add Item
        </button>
      </div>
    </div>
  );
}
