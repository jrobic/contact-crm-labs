import { ContactEntity } from "../entity";

export interface ContactRepository {
  createContact(input: ContactEntity): Promise<ContactEntity>;

  findAllContacts(): Promise<ContactEntity[]>;

  findContact({ id }: { id: string }): Promise<ContactEntity | null>;

  updateContact(
    id: string,
    input: Partial<ContactEntity>
  ): Promise<ContactEntity | null>;
}
