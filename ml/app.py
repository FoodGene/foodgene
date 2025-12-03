from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.predict import router as predict_router
from src.api.healthcheck import router as health_router
from src.api.email import router as email_router

app = FastAPI(
    title="FoodGene ML Service",
    version="1.0.0",
    description="Machine learning microservice for predictions, vision, NLP, and crop yield"
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/health")
app.include_router(predict_router, prefix="/predict")
app.include_router(email_router, prefix="/api")

@app.get("/")
def index():
    return {"message": "FoodGene ML Service is running"}
