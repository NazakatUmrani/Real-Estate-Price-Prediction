import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import SearchableDropdown from './components/custom/SearchableDropdown'

interface FormData {
  area: string;
  bhk: string;
  bathrooms: string;
  location: string;
}

interface Location {
  id: string;
  label: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    area: '',
    bhk: '',
    bathrooms: '',
    location: ''
  })
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<number | null>(null)

  // BHK options
  const bhkOptions: Location[] = [
    { id: '1', label: '1 BHK' },
    { id: '2', label: '2 BHK' },
    { id: '3', label: '3 BHK' },
    { id: '4', label: '4 BHK' },
    { id: '5', label: '5 BHK' }
  ]

  // Bathroom options
  const bathroomOptions: Location[] = [
    { id: '1', label: '1 Bathroom' },
    { id: '2', label: '2 Bathrooms' },
    { id: '3', label: '3 Bathrooms' },
    { id: '4', label: '4 Bathrooms' },
    { id: '5', label: '5 Bathrooms' }
  ]

  // Fetch locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:5000/locations')
        const data = await response.json()
        
        // Capitalize each word in location names
        const locationOptions: Location[] = data.locations.map((location: string) => ({
          id: location,
          label: location.replace(/\b\w/g, char => char.toUpperCase())
        }))
        
        setLocations(locationOptions)
      } catch (error) {
        console.error('Error fetching locations:', error)
        // Fallback locations with capitalized names
        setLocations([])
      }
    }

    fetchLocations()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDropdownChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePredict = async () => {
    if (!formData.area || !formData.bhk || !formData.bathrooms || !formData.location) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)
    setPrediction(null)

    try {
      const response = await fetch('http://localhost:5000/predict_price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sqft: parseInt(formData.area),
          bhk: parseInt(formData.bhk),
          bath: parseInt(formData.bathrooms),
          location: formData.location
        })
      })

      const data = await response.json()
      setPrediction(data.estimated_price)
    } catch (error) {
      console.error('Error making prediction:', error)
      alert('Error making prediction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      area: '',
      bhk: '',
      bathrooms: '',
      location: ''
    })
    setPrediction(null)
  }

  return (
    <div className="h-dvh overflow-y-scroll w-full bg-background p-4 grid place-items-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            House Price Predictor
          </CardTitle>
          <CardDescription className="text-center">
            Enter property details to get an estimated price prediction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Area Input */}
            <div className="space-y-2">
              <label htmlFor="area" className="text-sm font-medium">
                Area (Square Feet) <span className="text-destructive">*</span>
              </label>
              <Input
                id="area"
                name="area"
                type="number"
                placeholder="Enter area in square feet (e.g. 1000)"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full py-6"
              />
            </div>

            {/* BHK Dropdown */}
            <div className="space-y-2">
              <SearchableDropdown
                htmlFor="bhk"
                options={bhkOptions}
                value={formData.bhk}
                onChange={handleDropdownChange}
                label="BHK"
                placeholder="Select BHK"
                searchPlaceholder="Search BHK..."
                required
              />
            </div>

            {/* Bathrooms Dropdown */}
            <div className="space-y-2">
              <SearchableDropdown
                htmlFor="bathrooms"
                options={bathroomOptions}
                value={formData.bathrooms}
                onChange={handleDropdownChange}
                label="Bathrooms"
                placeholder="Select bathrooms"
                searchPlaceholder="Search bathrooms..."
                required
              />
            </div>

            {/* Location Dropdown */}
            <div className="space-y-2">
              <SearchableDropdown
                htmlFor="location"
                options={locations}
                value={formData.location}
                onChange={handleDropdownChange}
                label="Location"
                placeholder="Select location"
                searchPlaceholder="Search locations..."
                required
                disabled={locations.length === 0}
              />
            </div>
          </div>

          {/* Prediction Result */}
          {prediction !== null && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Predicted Price</h3>
              <p className="text-2xl font-bold text-primary">
                ₹{prediction.toLocaleString()} Lacs
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handlePredict}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Predicting...' : 'Predict Price'}
            </Button>
            <Button
              onClick={resetForm}
              variant="outline"
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App