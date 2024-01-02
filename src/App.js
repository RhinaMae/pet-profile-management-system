import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const App = () => {
  const [pets, setPets] = useState([]);
  const [newPet, setNewPet] = useState({
    picture: '',
    species: '',
    breed: '',
    gender: 'male',
    color_markings: '',
    weight: '',
    size: '',
    medical_history: '',
    vaccination_status: 'up-to-date',
    price: '',
  });
  const [editing, setEditing] = useState(false);
const [editPet, setEditPet] = useState(null);

  const [filterSpecies, setFilterSpecies] = useState('');
  const [selectedPicture, setSelectedPicture] = useState(null);


  useEffect(() => {
    axios
      .get('http://localhost:5000/api/pets')
      .then((response) => {
        setPets(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fetchPets = () => {
    axios
      .get('http://localhost:5000/api/pets')
      .then((response) => {
        setPets(response.data);
      })
      .catch((error) => console.log(error));
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'picture') {
      setNewPet((prevPet) => ({
        ...prevPet,
        picture: files[0],
      }));
    } else {
      setNewPet((prevPet) => ({
        ...prevPet,
        [name]: value,
      }));
    }
  };


  const handleEditInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'picture') {
      setEditPet((prevEditPet) => ({
        ...prevEditPet,
        picture: files[0] || prevEditPet.picture, // Keep the previous picture if no new file is selected
      }));
    } else {
      setEditPet((prevEditPet) => ({
        ...prevEditPet,
        [name]: value,
      }));
    }
  };

  const addPet = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('picture', newPet.picture);
    formData.append('species', newPet.species);
    formData.append('breed', newPet.breed);
    formData.append('gender', newPet.gender);
    formData.append('color_markings', newPet.color_markings);
    formData.append('weight', newPet.weight);
    formData.append('size', newPet.size);
    formData.append('medical_history', newPet.medical_history);
    formData.append('vaccination_status', newPet.vaccination_status);
    formData.append('price', newPet.price);
  
    axios
      .post('http://localhost:5000/api/pets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setPets((prevPets) => [...prevPets, response.data]);
        setNewPet({
          picture: '',
          species: '',
          breed: '',
          gender: '',
          color_markings: '',
          weight: '',
          size: '',
          medical_history: '',
          vaccination_status: '',
          price: '',
        });
        fetchPets();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };


const handlePictureSelection = (event) => {
  setSelectedPicture(event.target.files[0]);
};

const updatePet = (id, updatedPet) => {
  const formData = new FormData();
  formData.append('picture', updatedPet.picture); // Include the picture file
  formData.append('species', updatedPet.species);
  formData.append('breed', updatedPet.breed);
  formData.append('gender', updatedPet.gender);
  formData.append('color_markings', updatedPet.color_markings);
  formData.append('weight', updatedPet.weight);
  formData.append('size', updatedPet.size);
  formData.append('medical_history', updatedPet.medical_history);
  formData.append('vaccination_status', updatedPet.vaccination_status);
  formData.append('price', updatedPet.price);


  axios
    .put(`http://localhost:5000/api/pets/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      fetchPets();
      cancelEdit(); // Exit edit mode after updating
    })
    .catch((error) => console.log(error));
};


  const deletePet = (id) => {
    axios
      .delete(`http://localhost:5000/api/pets/${id}`)
      .then(() => {
        setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
        setEditing(false);
        setEditPet(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const enterEditMode = (pet) => {
    setEditPet({ ...pet, picture: pet.picture ? pet.picture.replace('http://localhost:5000', '') : '' });
    setEditing(true); // Enter edit mode
  
    // Pre-populate the picture field
    const picture = new File([], pet.picture); // Create a File object with an empty file and the pet's picture URL
    setEditPet((prevEditPet) => ({
      ...prevEditPet,
      picture: picture,
    }));
  };
  

  const cancelEdit = () => {
    setEditPet(null);
    setEditing(false); // Exit edit mode
  };


  const editPetForm = (pet) => {
  setEditing(true);
  setEditPet({
    id: pet.id,
    picture: pet.picture,
    species: pet.species,
    breed: pet.breed,
    gender: pet.gender,
    color_markings: pet.color_markings,
    weight: pet.weight,
    size: pet.size,
    medical_history: pet.medical_history,
    vaccination_status: pet.vaccination_status,
    price: pet.price,
  });
};


  const handleFilterChange = (event) => {
    setFilterSpecies(event.target.value);
  };

  const filteredPets = filterSpecies
    ? pets.filter((pet) => pet.species === filterSpecies)
    : pets;

  return (
    <div>
      <h1>Pet Management System</h1>


      {editing && editPet !== null ? (
  // Edit Pet Form
  <div>
  <h2>Edit Pet</h2>
  <form onSubmit={() => updatePet(editPet.id, editPet)}>
    <div>
      <label>Picture:</label>
      <input type="file" name="picture" onChange={handleEditInputChange} />
      {editPet.picture && typeof editPet.picture === 'object' && (
        <div>
          <img src={URL.createObjectURL(editPet.picture)} alt="Pet" style={{ maxWidth: '200px' }} />
        </div>
      )}
    </div>
      <label htmlFor="species">Species:</label>
        <input type="text" name="species" value={editPet.species} onChange={handleEditInputChange} required />

        <label htmlFor="breed">Breed:</label>
        <input type="text" name="breed" value={editPet.breed} onChange={handleEditInputChange} required />

        <label htmlFor="gender">Gender:</label>
        <select name="gender" value={editPet.gender} onChange={handleEditInputChange} required>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label htmlFor="color_markings">Color/Markings:</label>
        <input type="text" name="color_markings" value={editPet.color_markings} onChange={handleEditInputChange} required />

        <label htmlFor="weight">Weight (lbs):</label>
        <input type="number" name="weight" value={editPet.weight} onChange={handleEditInputChange} required />

        <label htmlFor="size">Size:</label>
        <input type="text" name="size"
            value={editPet.size}
            onChange={handleEditInputChange} required />

        <label htmlFor="medical_history">Medical History:</label>
        <textarea name="medical_history" value={editPet.medical_history}
            onChange={handleEditInputChange} required />

        <label htmlFor="vaccination_status">Vaccination Status:</label>
        <select name="vaccination_status" value={editPet.vaccination_status}
            onChange={handleEditInputChange} required>
          <option value="up-to-date">Up-to-date</option>
          <option value="not-up-to-date">Not up-to-date</option>
        </select>

        <label htmlFor="price">Price:</label>
        <input type="number" name="price" value={editPet.price} onChange={handleEditInputChange} required />
        <button type="submit">Update Pet</button>
            <button onClick={cancelEdit}>Cancel</button>
          </form>
        </div>
      ) : (
        // Add Pet Form
        <div>
        <h2>Add Pet</h2>

      <form onSubmit={addPet}>
        <div>
            <label>Picture:</label>
            <input type="file" name="picture" onChange={handleInputChange} />
            {newPet.picture && (
              <div>
                <img src={URL.createObjectURL(newPet.picture)} alt="Pet" style={{ maxWidth: '200px' }} />
              </div>
            )}
          </div>
        <label htmlFor="species">Species:</label>
        <input type="text" name="species" value={newPet.species} onChange={handleInputChange} required />

        <label htmlFor="breed">Breed:</label>
        <input type="text" name="breed" value={newPet.breed} onChange={handleInputChange} required />

        <label htmlFor="gender">Gender:</label>
        <select name="gender" value={newPet.gender} onChange={handleInputChange} required>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label htmlFor="color_markings">Color/Markings:</label>
        <input type="text" name="color_markings" value={newPet.color_markings} onChange={handleInputChange} required />

        <label htmlFor="weight">Weight (lbs):</label>
        <input type="number" name="weight" value={newPet.weight} onChange={handleInputChange} required />

        <label htmlFor="size">Size:</label>
        <input type="text" name="size"
            value={newPet.size}
            onChange={handleInputChange} required />

        <label htmlFor="medical_history">Medical History:</label>
        <textarea name="medical_history" value={newPet.medical_history}
            onChange={handleInputChange} required />

        <label htmlFor="vaccination_status">Vaccination Status:</label>
        <select name="vaccination_status" value={newPet.vaccination_status}
            onChange={handleInputChange} required>
          <option value="up-to-date">Up-to-date</option>
          <option value="not-up-to-date">Not up-to-date</option>
        </select>

        <label htmlFor="price">Price:</label>
        <input type="number" name="price" value={newPet.price} onChange={handleInputChange} required />

        <button type="submit">Add</button>
        </form>
</div>
)}
      

     



      <h2>Filter Pets by Species</h2>
      <select onChange={handleFilterChange}>
        <option value="">All</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="bird">Bird</option>
        <option value="fish">Fish</option>
        <option value="guinea pig">Guinea Pig</option>
        <option value="turtle">Turtle</option>
        <option value="rabbit">Rabbit</option>
      </select>

      <h2>Pet List</h2>
      <table>
        <thead>
          <tr>
            <th>Picture</th>
            <th>Species</th>
            <th>Breed</th>
            <th>Gender</th>
            <th>Color/Markings</th>
            <th>Weight (lbs)</th>
            <th>Size</th>
            <th>Medical History</th>
            <th>Vaccination Status</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPets.map((pet) => (
            
            <tr key={pet.id}>
               <td>
        {pet.picture && <img src={pet.picture} alt="Pet" style={{ maxWidth: '200px' }} />}
      </td>
              <td>{pet.species}</td>
              <td>{pet.breed}</td>
              <td>{pet.gender}</td>
              <td>{pet.color_markings}</td>
              <td>{pet.weight}</td>
              <td>{pet.size}</td>
              <td>{pet.medical_history}</td>
              <td>{pet.vaccination_status}</td>
              <td>{pet.price}</td>
              <td>
              {editing && pet.id === editPet.id ? (
          // Edit mode buttons for the edited pet
          <>
            <button onClick={() => updatePet(pet.id, editPet)}>Update Pet</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          // View mode buttons for other pets
          <>
            <button onClick={() => enterEditMode(pet)}>Edit Pet</button>
            <button onClick={() => deletePet(pet.id)}>Delete Pet</button>
            </>
             )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
