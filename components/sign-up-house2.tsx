'use client'
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Home, Bath, Sofa, Image as ImageIcon } from "lucide-react"

export function SignUpHouse2({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    monthlyRent: "",
    numberOfRooms: "",
    numberOfBathrooms: "",
    furnishingStatus: "",
    city: "",
    country: "",
    regionName: "",
    postalCode: "",
    images: [] as File[],
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, files } = e.target as any
    if (name === "images" && files) {
      setForm(f => ({ ...f, images: Array.from(files) }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    // Here you would send the data to your API
    // For now, just call onSubmit if provided
    if (onSubmit) onSubmit(form)
    setLoading(false)
  }

  // For preview
  const mainImage = form.images[0] ? URL.createObjectURL(form.images[0]) : "/placeholder-house.jpg"
  const thumbnailImages = form.images.slice(1, 5).map(file => URL.createObjectURL(file))

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Enhanced Images Gallery */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          {/* Main Featured Image */}
          <div className="md:col-span-4 lg:col-span-3 rounded-lg overflow-hidden h-64 md:h-96 relative group border">
            <img
              src={mainImage}
              alt="Featured"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          {/* Thumbnail Grid */}
          {thumbnailImages.length > 0 && (
            <div className="hidden lg:grid grid-cols-4 gap-3">
              {thumbnailImages.map((img, index) => (
                <div
                  key={index}
                  className="rounded-md overflow-hidden h-24 border"
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-2">
          <Label htmlFor="images" className="font-semibold">Upload House Images</Label>
          <Input
            id="images"
            name="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="mt-2"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Input
                name="title"
                placeholder="House Title"
                value={form.title}
                onChange={handleChange}
                className="text-2xl font-bold tracking-tight mb-2"
                required
              />
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <Input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="w-32"
                  required
                />
                <span>,</span>
                <Input
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-32"
                  required
                />
              </div>
            </div>
            <Badge variant="secondary" className="self-start">
              Available
            </Badge>
          </div>

          <Separator className="my-4" />

          {/* Key Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Posted</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Rent</p>
                <Input
                  name="monthlyRent"
                  type="number"
                  placeholder="Rent"
                  value={form.monthlyRent}
                  onChange={handleChange}
                  className="font-medium text-primary"
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-muted/50">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rooms</p>
                <Input
                  name="numberOfRooms"
                  type="number"
                  placeholder="Rooms"
                  value={form.numberOfRooms}
                  onChange={handleChange}
                  className="font-medium"
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-muted/50">
                <Bath className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <Input
                  name="numberOfBathrooms"
                  type="number"
                  placeholder="Bathrooms"
                  value={form.numberOfBathrooms}
                  onChange={handleChange}
                  className="font-medium"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              name="description"
              placeholder="Describe your house..."
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sofa className="h-4 w-4" />
                <Input
                  name="furnishingStatus"
                  placeholder="Furnishing Status"
                  value={form.furnishingStatus}
                  onChange={handleChange}
                  className="w-40"
                  required
                />
              </Badge>
              {/* Add more features as needed */}
            </div>
          </CardContent>
        </Card>

        {/* Region */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Input
                name="regionName"
                placeholder="Region Name"
                value={form.regionName}
                onChange={handleChange}
                required
              />
              <Input
                name="postalCode"
                placeholder="Postal Code"
                value={form.postalCode}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  )
}
