import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { Contact } from '../types/Contact';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading contacts...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="text-muted">
          <i className="bi bi-person-plus fs-1"></i>
          <h5 className="mt-3">No contacts found</h5>
          <p>Start by adding your first contact!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <Table striped hover className="mb-0">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={contact.id}>
              <td>
                <Badge bg="secondary">{index + 1}</Badge>
              </td>
              <td>
                <strong>{contact.name}</strong>
              </td>
              <td>
                <code>{contact.phone}</code>
              </td>
              <td>
                <small className="text-muted">
                  {formatDate(contact.createdAt)}
                </small>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onEdit(contact)}
                    title="Edit contact"
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(contact.id)}
                    title="Delete contact"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ContactList;
