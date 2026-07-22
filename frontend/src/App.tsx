import { useState } from 'react';
import Scanner from '../components/Scanner';

// Define what a Product looks like based on our Python backend
interface Product {
  sku: string;
  name: string;
  price: number;
  stock_quantity: number;
  expiry_date: string | null;
}

function App() {
  // State to hold our data
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // The function that talks to FastAPI
  const handleProductScan = async (qrCode: string) => {
    setLoading(true);
    setError('');
    setProduct(null);

    try {
      // Send a GET request to your Python API
      const response = await fetch(`http://localhost:8000/catalog/scan/${qrCode}`);
      
      // If the backend threw an error (like expired or not found)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong.");
      }

      // If successful, parse the JSON and save it to state
      const data = await response.json();
      setProduct(data);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4">
      <header className="w-full max-w-md py-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">QR Self-Checkout</h1>
        <p className="text-slate-500 text-sm mt-1">Scan & Pay on your mobile</p>
      </header>

      <main className="w-full max-w-md flex-1 bg-white rounded-2xl shadow-sm p-6 border border-slate-100 flex flex-col gap-6">
        
        {/* The Scanner Component */}
        <Scanner onScan={handleProductScan} />

        {/* Loading State */}
        {loading && <p className="text-center text-blue-500 font-medium">Looking up product...</p>}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Product Details Card (Only shows if a product is found) */}
        {product && (
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-bold text-slate-800">{product.name}</h2>
              <span className="text-lg font-black text-blue-600">₹{product.price.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-1 text-sm text-slate-500">
              <p>SKU: {product.sku}</p>
              <p>In Stock: <span className="font-semibold">{product.stock_quantity}</span></p>
              {product.expiry_date && (
                <p>Expires: <span className="font-semibold text-slate-700">{product.expiry_date}</span></p>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default App;