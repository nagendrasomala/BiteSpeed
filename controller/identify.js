const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const identify = async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ message: 'Provide email or phoneNumber' });
  }

  // STEP 1: Find all contacts that match either email or phone
  const matchedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined }
      ]
    }
  });

  // If no matching contact, create a new primary
  if (matchedContacts.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: 'primary',
      }
    });

    return res.status(200).json({
      contact: {
        primaryContatctId: newContact.id,
        emails: [newContact.email].filter(Boolean),
        phoneNumbers: [newContact.phoneNumber].filter(Boolean),
        secondaryContactIds: []
      }
    });
  }

  // STEP 2: Get all linked contacts by collecting ids and linkedIds
  const contactIds = new Set();
  for (const contact of matchedContacts) {
    if (contact.linkedId) contactIds.add(contact.linkedId);
    contactIds.add(contact.id);
  }

  const allContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: { in: Array.from(contactIds) } },
        { linkedId: { in: Array.from(contactIds) } }
      ]
    }
  });

  // STEP 3: Determine the primary contact (oldest createdAt)
  const primaryContact = allContacts.reduce((oldest, contact) =>
    new Date(contact.createdAt) < new Date(oldest.createdAt) ? contact : oldest
  );

  // STEP 4: Ensure all other contacts are linked to the primary
  for (const contact of allContacts) {
    if (
      contact.id !== primaryContact.id &&
      contact.linkPrecedence === 'primary'
    ) {
      await prisma.contact.update({
        where: { id: contact.id },
        data: {
          linkedId: primaryContact.id,
          linkPrecedence: 'secondary',
        }
      });
    }
  }

  // STEP 5: If current email + phone combo doesn't exist, create a new secondary
  const exists = allContacts.find(
    c => c.email === email && c.phoneNumber === phoneNumber
  );

  if (!exists) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: 'secondary',
      }
    });
  }

  // STEP 6: Refresh full contact list again
  const refreshedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primaryContact.id },
        { linkedId: primaryContact.id }
      ]
    }
  });

  const emails = new Set();
  const phones = new Set();
  const secondaryIds = [];

  for (const contact of refreshedContacts) {
    if (contact.email) emails.add(contact.email);
    if (contact.phoneNumber) phones.add(contact.phoneNumber);
    if (contact.id !== primaryContact.id) {
      secondaryIds.push(contact.id);
    }
  }

  return res.status(200).json({
    contact: {
      primaryContatctId: primaryContact.id,
      emails: Array.from(emails),
      phoneNumbers: Array.from(phones),
      secondaryContactIds: secondaryIds
    }
  });
};

module.exports = identify;
