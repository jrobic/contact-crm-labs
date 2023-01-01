/* eslint-disable class-methods-use-this */
import { ContactEntity, ContactProps } from "../../../core";
import { getPGClient } from "../../../core/infrastructure/db/pg";
import { ContactRepository } from "../../domain";

export class ContactPGRepository implements ContactRepository {
  db: ReturnType<typeof getPGClient>;

  constructor() {
    this.db = getPGClient();
  }

  findContact({ id }: { id: string }): Promise<ContactEntity | null> {
    throw new Error("Method not implemented.");
  }

  updateContact(
    id: string,
    input: Partial<ContactEntity>
  ): Promise<ContactEntity | null> {
    throw new Error("Method not implemented.");
  }

  createContact(input: ContactEntity): Promise<ContactEntity> {
    throw new Error("Method not implemented.");
  }

  private static toContactEntity(contact: ContactProps): ContactEntity {
    return new ContactEntity(contact);
  }

  async findAllContacts(): Promise<ContactEntity[]> {
    const { rows: contacts } = await this.db.query<ContactProps>(
      `SELECT * FROM "Contact" ORDER BY "Contact"."createdAt" DESC`
    );

    return contacts.map(ContactPGRepository.toContactEntity);
  }
}
