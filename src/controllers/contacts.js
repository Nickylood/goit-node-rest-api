import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
import { ENV_VARS } from '../constants/index.js';

export const getAllContactsController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = { ...parseFilterParams(req.query) };
    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;

    const contact = await getContactById(contactId, userId);

    if (!contact) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }

    res.status(200).json({
      status: 200,
      message: `Contacts found with id ${contactId}`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

console.log('createContact:', createContact);

export const createContactController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const photo = req.file;

    let photoUrl;

    if (photo) {
      if (env(ENV_VARS.ENABLE_CLOUDINARY) === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    console.log('createContactController starts create contact');

    const contact = await createContact({
      ...req.body,
      userId,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: contact,
    });
  } catch (error) {
    console.log('createContactController error:', error);
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const contact = await deleteContact(contactId, userId);

    if (!contact) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const upsertContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const photo = req.file;

    let photoUrl;

    if (photo) {
      if (env(ENV_VARS.ENABLE_CLOUDINARY) === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    const result = await updateContact(
      contactId,
      userId,
      {
        ...req.body,
        photo: photoUrl,
      },
      {
        upsert: true,
      },
    );

    if (!result) {
      next(createHttpError(404, 'Contact not found'));
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
      status,
      message: `Successfully upserted a contact!`,
      data: result.contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env(ENV_VARS.ENABLE_CLOUDINARY) === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact(contactId, userId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(
      createHttpError(404, {
        status: 404,
        message: ' Not found',
        data: { message: 'Contact not found' },
      }),
    );
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};
