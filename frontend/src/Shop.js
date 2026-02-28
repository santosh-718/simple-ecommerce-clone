import React from "react";

function Shop({ userId }) {

  const addToCart = async (productId) => {
    await fetch("http://api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
        quantity: 1
      })
    });
    alert("Added to cart");
  };

  const checkout = async () => {
    await fetch("http://api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        total_amount: 100
      })
    });
    alert("Order placed!");
  };

  return (
    <div>
      <h2>Shop</h2>
      <button onClick={() => addToCart(1)}>Add Product 1</button>
      <br />
      <button onClick={checkout}>Checkout</button>
    </div>
  );
}

export default Shop;