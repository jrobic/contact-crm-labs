import { ContactEntity, DomainError } from "../../../core";
import { ContactRepository } from "../../domain";

function removeContactNotFound(id: string) {
  return `Its not possible to remove contact with id '${id}' because it does not exist`;
}

export class RemoveContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(id: string): Promise<ContactEntity> {
    const contact = await this.contactRepository.findContact({ id });

    if (!contact) {
      throw new DomainError(removeContactNotFound(id));
    }

    contact.softDelete();

    const contactUpdated = await this.contactRepository.updateContact(
      id,
      contact.toUpdate()
    );

    if (!contactUpdated) {
      throw new DomainError(removeContactNotFound(id));
    }

    return contactUpdated;
  }
}
