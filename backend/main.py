from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import product_collection

# 1. Initialize the FastAPI application
app = FastAPI(title="QR Self-Checkout System API")

# 2. Configure CORS to allow your React app to send requests
# Your frontend is running on port 5173, so we must explicitly allow it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Define the scan endpoint
@app.get("/catalog/scan/{qr_code}")
def scan_product(qr_code: str):
    # Search the MongoDB collection for a product with the matching 'qr_value'
    product = product_collection.find_one({"qr_value": qr_code})
    
    # Validation: If the product isn't found, raise a 404 error
    if not product:
        raise HTTPException(status_code=404, detail="Product not found in system.")
        
    # Validation: Ensure the product status is active
    if product.get("status") != "active":
        raise HTTPException(status_code=400, detail="This product is currently inactive.")
        
    # Validation: Ensure the product is in stock
    if product.get("stock_quantity", 0) <= 0:
        raise HTTPException(status_code=400, detail="This item is out of stock.")

    # MongoDB returns an '_id' field as an ObjectId, which is not JSON serializable.
    # We must convert it to a string for the frontend.
    product["_id"] = str(product["_id"])
    
    # Return the product details as a JSON response
    return product

