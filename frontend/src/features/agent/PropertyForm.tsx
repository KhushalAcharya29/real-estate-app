import { useState } from "react";
import { useCreatePropertyMutation } from "../../app/api";
import { toast } from "react-hot-toast"; 

// 1. Define the Error Interface
interface ApiError {
  data?: {
    message?: string;
  };
}

export default function PropertyForm({ onCreated }: { onCreated?: () => void }) {
  const [createProperty, { isLoading }] = useCreatePropertyMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    areaSqFt: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const propertyData = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      location: { city: form.city, address: form.address },
      bedrooms: Number(form.bedrooms) || undefined,
      bathrooms: Number(form.bathrooms) || undefined,
      areaSqFt: Number(form.areaSqFt) || undefined,
      images: form.image ? [form.image] : [],
    };

    try {
      await createProperty(propertyData).unwrap();
      toast.success("Property listed successfully!");
      setForm({
        title: "",
        description: "",
        price: "",
        city: "",
        address: "",
        bedrooms: "",
        bathrooms: "",
        areaSqFt: "",
        image: "",
      });
      onCreated?.(); 
    } catch (err) { 
      const apiError = err as ApiError;
      toast.error(apiError.data?.message || "Failed to create property.");
    }
  };

  // Helper classes for consistent input styling
  const inputClass = "w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg text-sm">📝</span>
          List a New Property
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* --- Section 1: Basic Info --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Property Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Luxury Apartment in Bandra"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Describe the key features..."
              value={form.description}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Price (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                className={`${inputClass} pl-8`}
                required
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* --- Section 2: Location --- */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Mumbai"
                value={form.city}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input
                type="text"
                name="address"
                placeholder="Street name, Area"
                value={form.address}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* --- Section 3: Specs --- */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Property Specs</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                placeholder="0"
                value={form.bedrooms}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                placeholder="0"
                value={form.bathrooms}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Area (sq ft)</label>
              <input
                type="number"
                name="areaSqFt"
                placeholder="0"
                value={form.areaSqFt}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* --- Section 4: Media --- */}
        <div>
          <label className={labelClass}>Cover Image URL</label>
          <input
            type="text"
            name="image"
            placeholder="https://example.com/image.jpg"
            value={form.image}
            onChange={handleChange}
            className={inputClass}
          />
          <p className="text-xs text-gray-400 mt-1">Paste a direct link to an image hosted online.</p>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Listing...
              </>
            ) : (
              "Publish Listing"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}