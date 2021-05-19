import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_DELETE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from "../constants/cartConstants";

export const addToCart = (id, qty) => async (dispatch, getState) => {
  // getState is used to save things in local storage
  try {
    const res = await axios.get(`/api/products/${id}`);
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: res.data._id,
        name: res.data.name,
        image: res.data.image,
        countInStock: res.data.countInStock,
        price: res.data.price,
        qty,
      },
    });
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    ); // as we can only save strings in local storage.
  } catch (error) {}
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CART_DELETE_ITEM, payload: id });
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  } catch (error) {}
};

export const saveShippingAddress = (dat) => async (dispatch, getState) => {
  try {
    dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: dat });
    localStorage.setItem("shippingAddress", JSON.stringify(dat));
  } catch (error) {}
};

export const savePaymentMethod = (paymentMethod) => async (dispatch) => {
  try {
    dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: paymentMethod });
    localStorage.setItem("paymentMethod", JSON.stringify(paymentMethod));
  } catch (error) {}
};
