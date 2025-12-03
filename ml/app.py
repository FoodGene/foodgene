from fastapi import FastAPI
from src.api.predict import router as predict_router
from src.api.healthcheck import router as health_router

app = FastAPI(
    title="FoodGene ML Service",
    version="1.0.0",
    description="Machine learning microservice for predictions, vision, NLP, and crop yield"
)

app.include_router(health_router, prefix="/health")
app.include_router(predict_router, prefix="/predict")

@app.get("/")
def index():
    return {"message": "FoodGene ML Service is running"}
