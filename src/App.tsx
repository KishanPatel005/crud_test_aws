import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import { Contact, CreateContactData, UpdateContactData } from './types/Contact';
import { contactService } from './services/api';

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // Load contacts on component mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllContacts();
      setContacts(data);
    } catch (error) {
      showAlert('danger', 'Failed to load contacts. Please try again.');
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleCreateContact = async (data: CreateContactData) => {
    try {
      setFormLoading(true);
      const newContact = await contactService.createContact(data);
      setContacts(prev => [newContact, ...prev]);
      setShowForm(false);
      showAlert('success', 'Contact created successfully!');
    } catch (error) {
      showAlert('danger', 'Failed to create contact. Please try again.');
      console.error('Error creating contact:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateContact = async (data: UpdateContactData) => {
    if (!editingContact) return;

    try {
      setFormLoading(true);
      const updatedContact = await contactService.updateContact(editingContact.id, data);
      setContacts(prev => 
        prev.map(contact => 
          contact.id === editingContact.id ? updatedContact : contact
        )
      );
      setShowForm(false);
      setEditingContact(null);
      showAlert('success', 'Contact updated successfully!');
    } catch (error) {
      showAlert('danger', 'Failed to update contact. Please try again.');
      console.error('Error updating contact:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleDeleteContact = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await contactService.deleteContact(id);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      showAlert('success', 'Contact deleted successfully!');
    } catch (error) {
      showAlert('danger', 'Failed to delete contact. Please try again.');
      console.error('Error deleting contact:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const handleFormSubmit = (data: CreateContactData | UpdateContactData) => {
    if (editingContact) {
      handleUpdateContact(data as UpdateContactData);
    } else {
      handleCreateContact(data as CreateContactData);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Container className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h2 mb-1">
                  <i className="bi bi-person-lines-fill text-primary me-2"></i>
                  Contact Manager
                </h1>
                <p className="text-muted mb-0">Manage your contacts easily</p>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowForm(true)}
                className="d-flex align-items-center gap-2"
              >
                <i className="bi bi-plus-lg"></i>
                Add Contact
              </Button>
            </div>
          </Col>
        </Row>

        {/* Alert */}
        {alert && (
          <Row className="mb-3">
            <Col>
              <Alert 
                variant={alert.type} 
                dismissible 
                onClose={() => setAlert(null)}
              >
                {alert.message}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Stats */}
        <Row className="mb-4">
          <Col md={4}>
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <i className="bi bi-people-fill fs-1 me-3"></i>
                  <div>
                    <h3 className="mb-0">{contacts.length}</h3>
                    <p className="mb-0">Total Contacts</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill fs-1 me-3"></i>
                  <div>
                    <h3 className="mb-0">{contacts.length}</h3>
                    <p className="mb-0">Active Contacts</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <i className="bi bi-graph-up fs-1 me-3"></i>
                  <div>
                    <h3 className="mb-0">100%</h3>
                    <p className="mb-0">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Contact List */}
        <Row>
          <Col>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="bi bi-list-ul me-2"></i>
                  Contact List
                </h5>
              </div>
              <div className="card-body p-0">
                <ContactList
                  contacts={contacts}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                  isLoading={loading}
                />
              </div>
            </div>
          </Col>
        </Row>

        {/* Contact Form Modal */}
        <ContactForm
          show={showForm}
          onHide={handleFormClose}
          onSubmit={handleFormSubmit}
          contact={editingContact}
          isLoading={formLoading}
        />
      </Container>
    </div>
  );
}

export default App;
