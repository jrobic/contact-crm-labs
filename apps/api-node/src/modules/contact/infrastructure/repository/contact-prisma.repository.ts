import {
  ContactEntity,
  ContactProps,
  Prisma,
  PrismaClient,
  prisma,
} from "../../../core";
import { ContactRepository } from "../../domain";

export class ContactPrismaRepository implements ContactRepository {
  db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  private static toContactEntity(contact: ContactProps): ContactEntity {
    return new ContactEntity(contact);
  }

  async createContact(input: ContactEntity): Promise<ContactEntity> {
    const contact = await this.db.contact.create({ data: input });

    return ContactPrismaRepository.toContactEntity(contact);
  }

  async findAllContacts(): Promise<ContactEntity[]> {
    const contacts = await this.db.contact.findMany({
      orderBy: { createdAt: "desc" },
    });

    return contacts.map(ContactPrismaRepository.toContactEntity);
  }

  async findContact({ id }: { id: string }): Promise<ContactEntity | null> {
    const contact = await this.db.contact.findUnique({ where: { id } });

    if (!contact) {
      return null;
    }

    return ContactPrismaRepository.toContactEntity(contact);
  }

  async updateContact(
    id: string,
    input: Partial<ContactProps>
  ): Promise<ContactEntity | null> {
    try {
      const contactUpdated = await this.db.contact.update({
        where: { id },
        data: input,
      });

      return ContactPrismaRepository.toContactEntity(contactUpdated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2001") {
          return null;
        }
      }
      throw error;
    }
  }
}
