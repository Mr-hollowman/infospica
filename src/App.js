import React, { useState, Fragment, useEffect } from "react";
import "./App.css";
import ReadOnlyRow from "./components/ReadOnlyRow";
import EditableRow from "./components/EditableRow";
import axios from "axios";

const App = () => {

    const [contacts, setContacts] = useState([]);
    const [editContactId, setEditContactId] = useState(null);
    const [tableData, setTableData] = useState(null)
    const [editFormData, setEditFormData] = useState(null);
    const [resetContacts, setResetContacts] = useState(0)

    const handleAddFormChange = (e) => {
        setTableData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleAddFormSubmit = (e) => {
        e.preventDefault()
        e.target.reset()
        axios.post('http://localhost:3000/data', { ...tableData }).then(()=>{
          setResetContacts(contacts+1)
        })
    }

    const handleDeleteClick = (id) => {
        axios.delete(`http://localhost:3000/data/${id}`).then(()=>{
          setResetContacts(contacts+1)
        })
    }


    const handleEditClick = (event, contact) => {
        event.preventDefault();
        setEditContactId(contact.id);
        setEditFormData({...contact});
    };

    const handleEditFormChange = (e) => {
        e.preventDefault();
        setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCancelClick = () => {
        setEditContactId(null);
    };

    const handleEditFormSubmit = (e) => {
        e.preventDefault()
        if (isTableEdited()) {
            axios.put(`http://localhost:3000/data/${editContactId}`, { ...editFormData }).then(()=>{
              setResetContacts(contacts+1)
            })
        }
        else{
            setEditContactId(null)
            setEditFormData(null)
        }
    }

    const isTableEdited = () => {
        const toEdit = editContactId && contacts && contacts.filter((item) => item.id === editContactId)
        return JSON.stringify(toEdit[0]) !== JSON.stringify(editFormData)
    }

    useEffect(() => {
        axios.get('http://localhost:3000/data').then((res) => {
            setContacts(res.data)
        })
    }, [resetContacts])
    return (
        <div className="container">
            <form onSubmit={handleEditFormSubmit}>
                <table className="table table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact, index) => (
                            <Fragment key={index}>
                                {editContactId === contact.id ? (
                                    <EditableRow
                                        editFormData={editFormData}
                                        handleEditFormChange={handleEditFormChange}
                                        handleCancelClick={handleCancelClick}
                                    />
                                ) : (
                                    <ReadOnlyRow
                                        contact={contact}
                                        handleEditClick={handleEditClick}
                                        handleDeleteClick={handleDeleteClick}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </form>

            <h2>Add a Contact</h2>
            <form onSubmit={handleAddFormSubmit}>
                <input
                    className="form-control"
                    type="text"
                    name="fullName"
                    required="required"
                    placeholder="Enter a name..."
                    onChange={handleAddFormChange}
                />
                <input
                    className="form-control"
                    type="text"
                    name="address"
                    required="required"
                    placeholder="Enter an addres..."
                    onChange={handleAddFormChange}
                />
                <input
                    className="form-control"
                    type="phone"
                    pattern="[0-9]{10}"
                    format="1234567890"
                    name="phoneNumber"
                    required="required"
                    placeholder="Enter a phone number..."
                    onChange={handleAddFormChange}
                />

                <input
                    className="form-control"
                    type="email"
                    name="email"
                    required="required"
                    placeholder="Enter an email..."
                    onChange={handleAddFormChange}
                />
                <button type="submit" className="btn btn-primary">Add</button>
            </form>
        </div>
    );
};

export default App;
