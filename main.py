from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from car_data import CAR_DATABASE

app = FastAPI(title="Pro Car Specs Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_seating_capacity(body_style: str) -> str:
    """خوارزمية ذكية لتحديد عدد المقاعد بناءً على شكل وهيئة السيارة"""
    body = body_style.lower()
    if any(k in body for k in ['hypercar', 'supercar', 'track sports coupe']):
        return "2 Passengers"
    elif any(k in body for k in ['coupe', 'sports coupe', 'drag muscle coupe']):
        return "4 Passengers (2+2)"
    elif any(k in body for k in ['suv', 'sedan', 'hatchback', 'muscle sedan']):
        return "5 Passengers"
    return "5 Passengers"

@app.get("/api/search")
def search_car_specs(make: str = "", model: str = "", year: str = ""):
    clean_make = make.strip().lower()
    clean_model = model.strip().lower()
    clean_year = year.strip() if year.strip() else "2024"
    
    if not clean_make:
        return {"success": False, "message": "Please enter a valid vehicle make.", "data": None}

    # تصحيح المسميات الشائعة
    make_alias = {
        "borsh": "porsche", "porsh": "porsche", "firari": "ferrari", "lamborgeny": "lamborghini",
        "lambo": "lamborghini", "bintely": "bentley", "rolys roys": "rollsroyce", "rolls roys": "rollsroyce",
        "bagany": "pagani", "toyouta": "toyota", "volks wagn": "volkswagen", "honday": "hyundai"
    }
    
    search_make = make_alias.get(clean_make, clean_make)

    # التحقق المباشر من وجود الماركة والموديل داخل قاعدة البيانات
    if search_make in CAR_DATABASE:
        brand_models = CAR_DATABASE[search_make]
        
        matched_key = None
        for key in brand_models.keys():
            if key in clean_model or clean_model in key:
                matched_key = key
                break
        
        if matched_key:
            spec = brand_models[matched_key]
            
            # جلب عدد الركاب من car_data إذا كان مكتوباً، وإلا حسابه ديناميكياً
            seats = spec.get("seats") or get_seating_capacity(spec.get("body", ""))

            return {
                "success": True,
                "data": {
                    "title": f"{spec['title']} ({clean_year})",
                    "status": "Verified Specs Profile",
                    "year": clean_year,
                    "engine_specs": {
                        "configuration": spec["engine"],
                        "drivetrain": spec["drive"],
                        "transmission": spec["trans"],
                        "fuel_type": "High Octane Gasoline / Performance Fuel"
                    },
                    "performance": {
                        "estimated_hp": spec["hp"],
                        "acceleration": spec["accel"],
                        "top_speed": spec["speed"],
                        "torque": "Optimized Factory Spec"
                    },
                    "dimensions_and_class": {
                        "body_style": spec["body"],
                        "seating_capacity": seats,
                        "platform_status": "Production Model Spec"
                    }
                }
            }

    return {
        "success": False,
        "message": f"Invalid vehicle name or model ('{make} {model}'). Please check spelling.",
        "data": None
    }