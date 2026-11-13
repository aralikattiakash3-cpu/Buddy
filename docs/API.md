# KrishiSeva AI — API Documentation

Base URL prefix: `/api/v1`

All responses follow a consistent JSON format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "error": null
}
```

Error format:

```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "details": []
  }
}
```

---

## 1. System Health Checks (Public)

### `GET /health`
Returns service uptime and timestamp.

### `GET /health/ready`
Checks readiness of external dependencies (Supabase, Google Gemini AI).

---

## 2. Profile Endpoints (Protected)

Header: `Authorization: Bearer <supabase_jwt>`

### `GET /profile`
Retrieves the authenticated farmer's profile.

### `PUT /profile`
Updates farmer profile fields.
```json
{
  "fullName": "Ramesh Kumar",
  "phone": "+91 9876543210",
  "state": "Karnataka",
  "district": "Dharwad",
  "village": "Navalgund",
  "preferredLanguage": "kn",
  "farmingExperience": "5-10 years",
  "landArea": 3.5,
  "landUnit": "acre",
  "farmingType": "Conventional Farming"
}
```

---

## 3. Crop Recommendation Endpoints

### `POST /crop-recommendations`
Generates top 5 suitable crops based on soil, location, season, and irrigation.
```json
{
  "state": "Karnataka",
  "district": "Dharwad",
  "soilType": "Black Soil (Regur)",
  "soilPh": 6.8,
  "nitrogen": 180,
  "phosphorus": 55,
  "potassium": 120,
  "landArea": 3.5,
  "landUnit": "acre",
  "irrigationType": "rainfed",
  "waterAvailability": "medium",
  "season": "kharif",
  "farmingObjective": "Maximum Commercial Yield"
}
```

### `GET /crop-recommendations`
Lists the authenticated user's previous crop recommendations.

### `GET /crop-recommendations/:id`
Retrieves a single crop recommendation record.

### `DELETE /crop-recommendations/:id`
Deletes a crop recommendation record.

---

## 4. Crop Cultivation Advisory

### `POST /crop-advisories`
Generates a complete stage-by-stage cultivation guide for a specific crop.
```json
{
  "cropName": "Tomato",
  "cropVariety": "Arka Rakshak",
  "growthStage": "Flowering / Bud Formation",
  "soilType": "Red Soil",
  "irrigationType": "drip",
  "location": {
    "state": "Karnataka",
    "district": "Kolar"
  },
  "currentProblem": "Early leaf curl observed"
}
```

### `GET /crop-advisories`
Lists crop cultivation guides.

### `DELETE /crop-advisories/:id`
Deletes a crop advisory guide.

---

## 5. Crop Disease Detection

### `POST /disease-detection`
Multimodal visual analysis of a crop leaf or stem photo.
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `image`: File (JPG, PNG, WEBP, max 8MB)
  - `cropName`: String (optional)
  - `plantPart`: String (optional, e.g. "Leaves")
  - `symptoms`: String (optional)
  - `duration`: String (optional)
  - `location`: String (optional)

### `GET /disease-detection`
Lists user's disease analyses.

### `DELETE /disease-detection/:id`
Deletes a disease analysis record.

---

## 6. Fertilizer & Nutrient Advisory

### `POST /fertilizer-advisory`
Generates stage-specific nutrient management recommendations and deficiency prevention.
```json
{
  "cropName": "Maize",
  "growthStage": "Vegetative Growth",
  "soilType": "Loamy Soil",
  "soilPh": 6.5,
  "soilTestAvailable": true,
  "organicFertilizerAvailable": true
}
```

### `GET /fertilizer-advisory`
Lists fertilizer advisory reports.

---

## 7. Irrigation Advisory

### `POST /irrigation-advisory`
Generates water management guidelines and water conservation methods.
```json
{
  "cropName": "Sugarcane",
  "growthStage": "Tillering / Branching",
  "soilType": "Clay Loam",
  "irrigationType": "drip",
  "waterAvailability": "medium"
}
```

### `GET /irrigation-advisory`
Lists irrigation reports.

---

## 8. Agricultural AI Chatbot

### `POST /chat/sessions`
Creates a new conversation session.
```json
{ "title": "Tomato Pests Consultation" }
```

### `GET /chat/sessions`
Lists user's chat sessions.

### `GET /chat/sessions/:id`
Retrieves chat session with full message history.

### `POST /chat/sessions/:id/messages`
Sends a message to the AI assistant with conversation context.
```json
{
  "message": "What is the best organic treatment for powdery mildew in cucumber?",
  "language": "en"
}
```

### `DELETE /chat/sessions/:id`
Deletes a chat session and all associated messages.

---

## 9. Dashboard Analytics

### `GET /dashboard/summary`
Calculates real authenticated statistics:
- Total advisories generated
- Crop recommendations count
- Disease analyses count
- Fertilizer and irrigation counts
- Farmer profile summary
- Recent activity list

---

## 10. Printable Reports

### `GET /reports/:type/:id`
Retrieves report and farmer profile data formatted for PDF printing.
Types: `crop-recommendation`, `crop-advisory`, `disease-detection`, `fertilizer`, `irrigation`.
