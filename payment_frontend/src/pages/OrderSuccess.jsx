export const OrderSuccess = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Order Successful</h1>
        <p className="text-lg text-gray-500 mt-4">
          Your order has been placed successfully.
        </p>
        <button className="btn mt-4">Go to Orders</button>
      </div>
    </div>
  );
};
