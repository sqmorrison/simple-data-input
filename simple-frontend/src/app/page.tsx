'use client';

import { useState, useRef } from 'react';

export default function Home() {
  // --- Form State ---
  const initialFormState = {
    englishName: '',
    spanishName: '',
    englishIngredientList: '',
    spanishIngredientList: '',
    englishInstructionsList: '',
    spanishInstructionsList: '',
    imageLink: '',
    isBlueRibbon: false,
    isVegan: false,
    isVegetarian: false,
    structuredIngredients: [], // Array of objects { refId, amount, unit }
    structuredAppliances: []   // Array of strings (refIds)
  };
  const [formData, setFormData] = useState(initialFormState);

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  
  const clearForm = () => {
    setFormData(initialFormState);
    // Optional: If you have temporary modal state that might be lingering, reset that too
    setNewIngredient({ refId: '', amount: '', unit: '' });
    setNewAppliance('');
  };

  // --- Modal State & Refs ---
  const ingredientModalRef = useRef(null);
  const applianceModalRef = useRef(null);

  // Temporary state for Modal Inputs
  const [newIngredient, setNewIngredient] = useState({ refId: '', amount: '', unit: '' });
  const [newAppliance, setNewAppliance] = useState('');

  // --- Handlers ---

  // Handle Text/Checkbox Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Add Ingredient Logic
  const handleAddIngredient = () => {
    if (!newIngredient.refId || !newIngredient.amount || !newIngredient.unit) return;
    
    setFormData((prev) => ({
      ...prev,
      structuredIngredients: [...prev.structuredIngredients, newIngredient]
    }));
    
    setNewIngredient({ refId: '', amount: '', unit: '' }); // Reset
    ingredientModalRef.current.close();
  };

  // Add Appliance Logic
  const handleAddAppliance = () => {
    if (!newAppliance) return;

    setFormData((prev) => ({
      ...prev,
      structuredAppliances: [...prev.structuredAppliances, newAppliance]
    }));

    setNewAppliance(''); // Reset
    applianceModalRef.current.close();
  };

  // Submit to Database
  const handleSubmit = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit');

      setStatus('success');
      clearForm();
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };
  
  // Remove Ingredient by index
  const handleRemoveIngredient = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      structuredIngredients: prev.structuredIngredients.filter((_, index) => index !== indexToRemove)
    }));
  };
  
  // Remove Appliance by index
  const handleRemoveAppliance = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      structuredAppliances: prev.structuredAppliances.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <div className="min-w-screen min-h-screen bg-red-200 flex items-center justify-center">
      <div className="card w-3/4 bg-base-100 card-xl shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Input your items</h2>

          {/* Status Messages */}
          {status === 'success' && <div className="alert alert-success mb-4">Recipe Added!</div>}
          {status === 'error' && <div className="alert alert-error mb-4">Error saving recipe.</div>}

          <div className="flex flex-row justify-around gap-4">
            
            {/* --- PART 1 --- */}
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4">
              <legend className="fieldset-legend">Part 1</legend>

              <label className="label">English name</label>
              <input 
                name="englishName"
                value={formData.englishName}
                onChange={handleChange}
                type="text" 
                className="input w-full" 
                placeholder="English Name" 
              />

              <label className="label">Spanish name</label>
              <input 
                name="spanishName"
                value={formData.spanishName}
                onChange={handleChange}
                type="text" 
                className="input w-full" 
                placeholder="Spanish Name" 
              />

              <div className="label">English Ingredient List</div>
              <textarea 
                name="englishIngredientList"
                value={formData.englishIngredientList}
                onChange={handleChange}
                className="textarea h-24 w-full" 
                placeholder="English Ingredient List"
              ></textarea>

              <div className="label">Spanish Ingredient List</div>
              <textarea 
                name="spanishIngredientList"
                value={formData.spanishIngredientList}
                onChange={handleChange}
                className="textarea h-24 w-full" 
                placeholder="Spanish Ingredient List"
              ></textarea>
            </fieldset>
            
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4">
              <legend className="fieldset-legend">Part 2</legend>

              <div className="label">English Instructions List</div>
              <textarea 
                name="englishInstructionsList"
                value={formData.englishInstructionsList}
                onChange={handleChange}
                className="textarea h-48 w-full" 
                placeholder="English Instructions List"
              ></textarea>

              <div className="label">Spanish Instructions List</div>
              <textarea 
                name="spanishInstructionsList"
                value={formData.spanishInstructionsList}
                onChange={handleChange}
                className="textarea h-48 w-full" 
                placeholder="Spanish Instructions List"
              ></textarea>
            </fieldset>

            {/* --- PART 3 --- */}
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4">
              <legend className="fieldset-legend">Part 3</legend>

              <label className="label">Image Link</label>
              <input 
                name="imageLink"
                value={formData.imageLink}
                onChange={handleChange}
                type="text" 
                className="input w-full" 
                placeholder="Image Link" 
              />

              <div className="flex flex-row justify-around mt-4">
                <div>
                  <input 
                    name="isBlueRibbon"
                    checked={formData.isBlueRibbon}
                    onChange={handleChange}
                    type="checkbox" 
                    className="checkbox checkbox-primary mr-1" 
                  />
                  <label>Blue Ribbon</label>
                </div>
                <div>
                  <input 
                    name="isVegan"
                    checked={formData.isVegan}
                    onChange={handleChange}
                    type="checkbox" 
                    className="checkbox checkbox-secondary mr-1" 
                  />
                  <label>Vegan</label>
                </div>
                <div>
                  <input 
                    name="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={handleChange}
                    type="checkbox" 
                    className="checkbox checkbox-accent mr-1" 
                  />
                  <label>Vegetarian</label>
                </div>
              </div>

              {/* Data Preview (To see what's added) */}
              <div className="divider">Current Items</div>
              
              {/* Ingredients List */}
              <div className="mb-4">
                <h4 className="font-bold text-sm mb-2">Ingredients ({formData.structuredIngredients.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.structuredIngredients.length === 0 && <span className="text-xs opacity-50">No ingredients added yet.</span>}
                  
                  {formData.structuredIngredients.map((ing, index) => (
                    <div key={index} className="badge badge-neutral gap-2 p-3">
                      {/* Display Format: ID: 50g */}
                      <span>{ing.refId}: {ing.amount}{ing.unit}</span>
                      <button 
                        onClick={() => handleRemoveIngredient(index)}
                        className="btn btn-xs btn-circle btn-ghost text-white"
                      >✕</button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Appliances List */}
              <div>
                <h4 className="font-bold text-sm mb-2">Appliances ({formData.structuredAppliances.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.structuredAppliances.length === 0 && <span className="text-xs opacity-50">No appliances added yet.</span>}
              
                  {formData.structuredAppliances.map((app, index) => (
                    <div key={index} className="badge badge-secondary gap-2 p-3">
                      <span>{app}</span>
                      <button 
                        onClick={() => handleRemoveAppliance(index)}
                        className="btn btn-xs btn-circle btn-ghost text-white"
                      >✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-row justify-around mt-4">
                <button 
                  className="btn btn-neutral"
                  onClick={() => ingredientModalRef.current.showModal()}
                >
                  Add Ingredient
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => applianceModalRef.current.showModal()}
                >
                  Add Appliance
                </button>
              </div>
            </fieldset>
          </div>
          <div className="justify-start card-actions">
            <button 
              className="btn btn-warning" 
              onClick={clearForm}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'clearing...' : 'Clear form'}
            </button>
          </div>
          <div className="justify-end card-actions">
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Saving...' : 'Add to recipes'}
            </button>
          </div>
        </div>
      </div>

      {/* --- INGREDIENT MODAL --- */}
      <dialog ref={ingredientModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Structured Ingredient</h3>
          <div className="py-4 space-y-3">
            <input 
              type="text" 
              placeholder="Reference ID (String)" 
              className="input input-bordered w-full" 
              value={newIngredient.refId}
              onChange={(e) => setNewIngredient({...newIngredient, refId: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="Amount (Number)" 
              className="input input-bordered w-full" 
              value={newIngredient.amount}
              onChange={(e) => setNewIngredient({...newIngredient, amount: Number(e.target.value)})}
            />
            <input 
              type="text" 
              placeholder="Unit of Measure (String)" 
              className="input input-bordered w-full" 
              value={newIngredient.unit}
              onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
            />
          </div>
          <div className="modal-action">
            <button className="btn btn-success" onClick={handleAddIngredient}>Add</button>
            <button className="btn" onClick={() => ingredientModalRef.current.close()}>Close</button>
          </div>
        </div>
      </dialog>

      {/* --- APPLIANCE MODAL --- */}
      <dialog ref={applianceModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Appliance</h3>
          <div className="py-4">
            <input 
              type="text" 
              placeholder="Reference ID (String)" 
              className="input input-bordered w-full" 
              value={newAppliance}
              onChange={(e) => setNewAppliance(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <button className="btn btn-secondary" onClick={handleAddAppliance}>Add</button>
            <button className="btn" onClick={() => applianceModalRef.current.close()}>Close</button>
          </div>
        </div>
      </dialog>

    </div>
  );
}