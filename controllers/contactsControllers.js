import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const myId = req.params.id;
  const contact = await contactsService.getContactById(myId);
  if (!contact) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json(contact);
};

export const deleteContact = async (req, res) => {
  const deletedId = req.params.id;
  const deleteMyId = await contactsService.removeContact(deletedId);
  if (!deleteMyId) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json(deleteMyId);
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const newContact = await contactsService.addContact(name, email, phone);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const undateId = req.params.id;
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Body must have at least one field" });
    return;
  }
  const updateContact = await contactsService.updateContact(undateId, {
    name,
    email,
    phone,
  });
  if (!updateContact) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json(updateContact);
};
