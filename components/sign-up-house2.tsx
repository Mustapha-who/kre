'use client'
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from 'next/navigation'
import { Calendar, MapPin, Home, Bath, Sofa, Image as ImageIcon, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SignUpHouse2() {
  const params = useParams();
  const router = useRouter();
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
    street: "",
    latitude: "",
    longitude: "",
    images: new Array(15).fill(null) as (File | null)[], // 0: main, 1-4: mini required, 5-14: optional
  });
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [galleryHover, setGalleryHover] = useState<number | null>(null)
  const [visibleOptionalImages, setVisibleOptionalImages] = useState(1) // Start with 6th image visible
  
  const fileInputRefs = Array.from({ length: 15 }, () => useRef<HTMLInputElement>(null));

  // Get ownerId from URL params (/sign-up-house/[ownerId])
  const ownerId =
    params?.id && !Array.isArray(params.id)
      ? Number(params.id)
      : params?.ownerId && !Array.isArray(params.ownerId)
      ? Number(params.ownerId)
      : null;

  useEffect(() => {
    setIsMounted(true);
    if (typeof ownerId !== "number" || isNaN(ownerId) || ownerId <= 0) {
      setError("Owner information missing");
    }
  }, [ownerId, router])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx?: number) {
    const { name, value, files } = e.target as any
    if (name === "images" && files && typeof idx === "number") {
      setForm(f => {
        const newImages = [...f.images];
        newImages[idx] = files[0] || null;
        
        // If this is an optional image (index 5+) and it's the last visible one, show next one
        if (idx >= 5 && files[0] && idx === 4 + visibleOptionalImages && visibleOptionalImages < 10) {
          setVisibleOptionalImages(prev => prev + 1);
        }
        
        return { ...f, images: newImages };
      });
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  function handleFurnishingSelect(status: string) {
    setForm(f => ({ ...f, furnishingStatus: status }))
    setDropdownOpen(false)
  }

  function handleGalleryClick(idx: number) {
    fileInputRefs[idx]?.current?.click();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!ownerId) {
      setError("Owner information missing")
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("ownerId", ownerId.toString())
      formData.append("title", form.title)
      formData.append("description", form.description)
      formData.append("monthlyRent", form.monthlyRent)
      formData.append("numberOfRooms", form.numberOfRooms)
      formData.append("numberOfBathrooms", form.numberOfBathrooms)
      formData.append("furnishingStatus", form.furnishingStatus)
      formData.append("city", form.city)
      formData.append("country", form.country)
      formData.append("regionName", form.regionName)
      formData.append("postalCode", form.postalCode)
      formData.append("street", form.street)
      formData.append("latitude", form.latitude)
      formData.append("longitude", form.longitude)
      form.images.forEach((file) => {
        if (file) formData.append("images", file)
      })
      const res = await fetch("/api/house/submit", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit house")
      }
      router.push("/main?showHouseSubmitted=1")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit house")
    } finally {
      setLoading(false)
    }
  }

  // Generate previews for all 15 images
  const [imagePreviews, setImagePreviews] = useState<string[]>(new Array(15).fill(""));
  useEffect(() => {
    const urls = form.images.map(file => file ? URL.createObjectURL(file) : "");
    setImagePreviews(urls);
    return () => {
      urls.forEach(url => url && URL.revokeObjectURL(url));
    };
  }, [form.images]);

  // Helper to render image or fallback
  function renderImage(src: string, alt: string, className: string) {
    if (!src) return null;
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Fill in Your House Details</h1>
      {!ownerId && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Owner information is missing. Please complete the owner registration first.
        </div>
      )}
      
      {/* Required Images Gallery */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Required Images</h3>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Main image */}
          <div
            className="relative rounded-lg overflow-hidden h-64 md:h-[400px] md:w-2/3 group border bg-muted flex items-center justify-center"
            onMouseEnter={() => setGalleryHover(-1)}
            onMouseLeave={() => setGalleryHover(null)}
            onClick={() => handleGalleryClick(0)}
            style={{ cursor: "pointer" }}
          >
            {renderImage(
              imagePreviews[0],
              "Featured",
              "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            ) || (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon className="w-12 h-12" />
                <span className="ml-2 text-sm">Main Image (Required)</span>
              </div>
            )}
            <input
              ref={fileInputRefs[0]}
              id="main-image"
              name="images"
              type="file"
              accept="image/*"
              onChange={e => handleChange(e, 0)}
              className="hidden"
            />
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition bg-black/40 ${galleryHover === -1 ? "opacity-100" : "opacity-0"}`}>
              <ImageIcon className="w-10 h-10 text-white mb-2" />
              <span className="text-white font-semibold">Click to add/change main image</span>
            </div>
          </div>
          
          {/* 2x2 grid for required mini images */}
          <div className="grid grid-cols-2 grid-rows-2 gap-2 md:w-[350px] h-64 md:h-[400px]">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="relative rounded-lg overflow-hidden h-full group border bg-muted flex items-center justify-center"
                onMouseEnter={() => setGalleryHover(idx)}
                onMouseLeave={() => setGalleryHover(null)}
                onClick={() => handleGalleryClick(idx)}
                style={{ cursor: "pointer" }}
              >
                {imagePreviews[idx] ? (
                  renderImage(
                    imagePreviews[idx],
                    `House image ${idx + 1}`,
                    "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Plus className="w-8 h-8" />
                    <span className="ml-1 text-xs">Required</span>
                  </div>
                )}
                <input
                  ref={fileInputRefs[idx]}
                  id={`image-${idx}`}
                  name="images"
                  type="file"
                  accept="image/*"
                  onChange={e => handleChange(e, idx)}
                  className="hidden"
                />
                <div className={`absolute inset-0 flex flex-col items-center justify-center transition bg-black/40 ${galleryHover === idx ? "opacity-100" : "opacity-0"}`}>
                  <ImageIcon className="w-8 h-8 text-white mb-1" />
                  <span className="text-xs text-white text-center">
                    {imagePreviews[idx] ? 'Change image' : 'Add image (Required)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optional Additional Images */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Additional Images (Optional)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Array.from({ length: visibleOptionalImages }, (_, i) => {
            const idx = i + 5; // Start from index 5
            return (
              <div
                key={idx}
                className="relative rounded-lg overflow-hidden h-32 group border bg-muted flex items-center justify-center"
                onMouseEnter={() => setGalleryHover(idx)}
                onMouseLeave={() => setGalleryHover(null)}
                onClick={() => handleGalleryClick(idx)}
                style={{ cursor: "pointer" }}
              >
                {imagePreviews[idx] ? (
                  renderImage(
                    imagePreviews[idx],
                    `Additional image ${i + 1}`,
                    "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Plus className="w-6 h-6" />
                  </div>
                )}
                <input
                  ref={fileInputRefs[idx]}
                  id={`image-${idx}`}
                  name="images"
                  type="file"
                  accept="image/*"
                  onChange={e => handleChange(e, idx)}
                  className="hidden"
                />
                <div className={`absolute inset-0 flex flex-col items-center justify-center transition bg-black/40 ${galleryHover === idx ? "opacity-100" : "opacity-0"}`}>
                  <ImageIcon className="w-6 h-6 text-white mb-1" />
                  <span className="text-xs text-white text-center">
                    {imagePreviews[idx] ? 'Change' : `Add image ${i + 1}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {visibleOptionalImages < 10 && (
          <p className="text-sm text-muted-foreground mt-2">
            {15 - 5 - visibleOptionalImages} more optional images can be added
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
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
            </div>
            <Badge variant="secondary" className="self-start">
              Available
            </Badge>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Posted</p>
                <p className="font-medium">{isMounted && new Date().toLocaleDateString()}</p>
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sofa className="h-4 w-4" />
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-40 justify-between">
                      {form.furnishingStatus || "Select status"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    <DropdownMenuItem onClick={() => handleFurnishingSelect("Furnished")}>
                      Furnished
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFurnishingSelect("Semi-Furnished")}>
                      Semi-Furnished
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFurnishingSelect("Unfurnished")}>
                      Unfurnished
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                name="regionName"
                placeholder="Region Name"
                value={form.regionName}
                onChange={handleChange}
                required
              />
              <Input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
              />
              <Input
                name="country"
                placeholder="Country"
                value={form.country}
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
              <Input
                name="street"
                placeholder="Street"
                value={form.street}
                onChange={handleChange}
              />
              <div className="flex gap-2">
                <Input
                  name="latitude"
                  placeholder="Latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  type="number"
                  step="any"
                  className="w-1/2"
                />
                <Input
                  name="longitude"
                  placeholder="Longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  type="number"
                  step="any"
                  className="w-1/2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || !ownerId}
        >
          {loading ? "Submitting..." : "Submit Listing"}
        </Button>
      </form>
    </div>
  )
}