import { ContactEntity, ContactInputProps } from "../../../core";
import { ContactRepository } from "../../domain";

export class CreateContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(input: ContactInputProps): Promise<ContactEntity> {
    const contact = ContactEntity.create(input);
    return this.contactRepository.createContact(contact);
  }
}
