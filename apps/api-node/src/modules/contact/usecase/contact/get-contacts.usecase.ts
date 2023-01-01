import { ContactEntity } from "../../../core";
import { ContactRepository } from "../../domain";

export class GetContactsUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(): Promise<ContactEntity[]> {
    return this.contactRepository.findAllContacts();
  }
}
