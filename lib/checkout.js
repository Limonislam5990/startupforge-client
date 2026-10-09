import { apiJson } from "./api";

// Creates a Stripe Checkout session on the server and sends the browser to it.
export async function startCheckout() {
  const data = await apiJson("/payments/create-checkout-session", { method: "POST" });
  if (!data?.url) throw new Error("Could not start the payment. Please try again.");
  window.location.href = data.url;
}
