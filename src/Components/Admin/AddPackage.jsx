import React, { useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

const steps = ["Basic Info", "Itinerary", "Highlights & Inclusions", "Special Options"];

const AddPackage = ({pkg}) => {
  const [activeStep, setActiveStep] = useState(0);
 const [packageData, setPackageData] = useState(
  pkg || {
    id: "",
    title: "",
    description: "",
    category: "Spiritual",
    region: "North India",
    duration: "",
    price: "",
    imageUrl: "",
    itinerary: [""],
    highlights: [""],
    inclusions: [""],
    exclusions: [""],
    isGroupTourAvailable: false,
    isLadiesSpecial: false,
    customizable: false,
    hide: false,
  }
);
  console.log(pkg);
    const [uploading, setUploading] = useState(false);
  const handleNext = (e) => {
    e.preventDefault();
    setActiveStep((prev) => prev + 1)};
  const handleBack = (e) => {
    e.preventDefault();
    setActiveStep((prev) => prev - 1)};

useEffect(() => {
  if (pkg) {
    setPackageData({
      ...pkg,
      itinerary: pkg.itinerary?.length ? pkg.itinerary : [""],
      highlights: pkg.highlights?.length ? pkg.highlights : [""],
      inclusions: pkg.inclusions?.length ? pkg.inclusions : [""],
      exclusions: pkg.exclusions?.length ? pkg.exclusions : [""],
    });
  }
}, [pkg]);
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert("Please upload an image smaller than 5MB.");
    return;
  }

  setUploading(true);
  const formData = new FormData();
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET); // replace with your Cloudinary preset

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, 
      {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await response.json();
    setPackageData((prev) => ({ ...prev, imageUrl: data.secure_url }));
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    alert("Image upload failed. Please check your preset or file size.");
  } finally {
    setUploading(false);
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPackageData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...packageData[field]];
    updatedArray[index] = value;
    setPackageData((prev) => ({ ...prev, [field]: updatedArray }));
  };
  const removeArrayItem = (field, index) => {
    const updatedArray = packageData[field].filter((_, i) => i !== index);
    setPackageData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const addArrayItem = (field) => {
    setPackageData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const docId = packageData.id || packageData.title.toLowerCase().replace(/\s+/g, "-");
  await setDoc(doc(db, "packages", docId), packageData);
  alert(pkg ? "Package updated successfully!" : "Package added successfully!");
  setActiveStep(0);
};


  return (
    <div className="add-package-container">
      <h2 className="add-package-title">
        {pkg ? "Edit Package" : "Add New Tour Package"}
      </h2>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit} className="package-form">
        {activeStep === 0 && (
          <div className="step-content">
            <TextField label="Title" name="title" value={packageData.title} onChange={handleChange} required fullWidth />
            <TextField label="Description" name="description" value={packageData.description} onChange={handleChange} multiline rows={3} fullWidth />
            <TextField
              select
              label="Category"
              name="category"
              value={packageData.category}
              onChange={handleChange}
              fullWidth
              SelectProps={{ native: true }}
              defaultValue="Spiritual"
            >
              <option value="Spiritual">Spiritual</option>
              <option value="Hill Station">Hill Station</option>
              <option value="Beach & Island">Beach & Island</option>
              <option value="Nature & Serenity">Nature & Serenity</option>
              <option value="International">International</option>
              <option value="Special Tours">Special Tours</option>
              <option value="Other">Other</option>
            </TextField>

            <TextField
              select
              label="Region"
              name="region"
              value={packageData.region}
              onChange={handleChange}
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value="North India">North India</option>
              <option value="South India">South India</option>
              <option value="East India">East India</option>
              <option value="West India">West India</option>
              <option value="International">International</option>
            </TextField>
            <TextField label="Duration" name="duration" value={packageData.duration} onChange={handleChange} fullWidth placeholder="6D/7N" />
            <TextField label="Price (INR)" name="price" value={packageData.price} onChange={handleChange} fullWidth />
            <div className="upload-section">
              <label htmlFor="imageUpload" className="upload-label">
                Upload Package Image
              </label>

              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {uploading && <p className="uploading-text">Uploading...</p>}
              {packageData.imageUrl && (
                <img src={packageData.imageUrl} alt="Preview" className="preview-img" />
              )}
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="step-content">
            <h3>Itinerary</h3>
            {packageData.itinerary.map((day, index) => (
              <div key={index} className="array-field">
                <TextField
                  label={`Day ${index + 1}`}
                  value={day}
                  onChange={(e) => handleArrayChange("itinerary", index, e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeArrayItem("itinerary", index)}
                >
                  −
                </button>
              </div>
            ))}
          <Button type="button" onClick={() => addArrayItem("itinerary")}>
            Add Day
          </Button>
          </div>
        )}

        {activeStep === 2 && (
          <div className="step-content">
            <h3>Highlights</h3>
            {packageData.highlights.map((h, index) => (
              <div key={index} className="array-field">
                <TextField
                  key={index}
                  label={`Highlight ${index + 1}`}
                  value={h}
                  onChange={(e) => handleArrayChange("highlights", index, e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeArrayItem("highlights", index)}
                  >
                  −
                </button>
              </div>
            ))}
            <Button type="button" onClick={() => addArrayItem("highlights")}>Add Highlight</Button>

            <h3>Inclusions</h3>
            {packageData.inclusions.map((i, index) => (
              <div key={index} className="array-field">
                <TextField
                  key={index}
                  label={`Inclusion ${index + 1}`}
                  value={i}
                  onChange={(e) => handleArrayChange("inclusions", index, e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeArrayItem("inclusions", index)}
                  >
                    −
                </button>
              </div>
            ))}
            <Button type="button" onClick={() => addArrayItem("inclusions")}>Add Inclusion</Button>

            <h3>Exclusions</h3>
            {packageData.exclusions.map((x, index) => (
              <div key={index} className="array-field">
                <TextField
                  key={index}
                  label={`Exclusion ${index + 1}`}
                  value={x}
                  onChange={(e) => handleArrayChange("exclusions", index, e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeArrayItem("exclusions", index)}
                  >
                    −
                </button>
              </div>
            ))}
            <Button type="button" onClick={() => addArrayItem("exclusions")}>Add Exclusion</Button>
          </div>
        )}

        {activeStep === 3 && (
          <div className="step-content">
            <FormControlLabel
              control={<Checkbox checked={packageData.isGroupTourAvailable} onChange={handleChange} name="isGroupTourAvailable" />}
              label="Group Tour Available"
            />
            <FormControlLabel
              control={<Checkbox checked={packageData.isLadiesSpecial} onChange={handleChange} name="isLadiesSpecial" />}
              label="Ladies Special"
            />
            <FormControlLabel
              control={<Checkbox checked={packageData.customizable} onChange={handleChange} name="customizable" />}
              label="Customizable"
            />
            <FormControlLabel
              control={<Checkbox checked={packageData.hide} onChange={handleChange} name="hide" />}
              label="Hide this Package"
            />
          </div>
        )}

        <div className="stepper-buttons">
          {activeStep > 0 && (
            <Button type="button" onClick={handleBack} className="back-btn">
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNext} variant="contained" color="primary">
              Next
            </Button>
          ) : (
            <Button type="submit" variant="contained" color="success">
              Submit Package
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddPackage;
