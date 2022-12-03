import { ContactEntity, ContactProps, ContactRepository } from "../../domain";

export class ContactInMemoryRepository implements ContactRepository {
  private readonly contacts: ContactProps[] = [];

  constructor(contacts: ContactProps[] = []) {
    this.contacts = contacts;
  }

  private static toContactEntity(contact: ContactProps): ContactEntity {
    return new ContactEntity(contact);
  }

  async createContact(input: ContactEntity): Promise<ContactEntity> {
    this.contacts.push(input);

    return Promise.resolve(input);
  }

  async findAllContacts(): Promise<ContactEntity[]> {
    return Promise.resolve(
      this.contacts.map(ContactInMemoryRepository.toContactEntity)
    );
  }

  async findContact({ id }: { id: string }): Promise<ContactEntity | null> {
    const contact = this.contacts.find((con) => con.id === id) || null;

    if (!contact) {
      return null;
    }

    return Promise.resolve(ContactInMemoryRepository.toContactEntity(contact));
  }

  async updateContact(
    id: string,
    input: Partial<ContactProps>
  ): Promise<ContactEntity | null> {
    const contact = this.contacts.find((con) => con.id === id);

    if (!contact) {
      return Promise.resolve(null);
    }

    Object.assign(contact, input);

    return Promise.resolve(ContactInMemoryRepository.toContactEntity(contact));
  }
}
