import Contact from '../models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

import { parseIsFavourite } from '../utils/parseFilterParams.js';

export const getAllContacts = async (
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  let contactsQuery = Contact.find()
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  if (filter.isFavourite !== undefined) {
    const parsedIsFavourite = parseIsFavourite(filter.isFavourite);
    if (parsedIsFavourite !== undefined) {
      contactsQuery = contactsQuery
        .where('isFavourite')
        .equals(parseIsFavourite);
    }
  }
  const contactsCount = await Contact.countDocuments();
  const contacts = await contactsQuery.exec();
  const paginationData = calculatePaginationData(contactsCount, limit, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId },
    payload,

    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return rawResult.value;
};
