import { ContactRepository } from "../../domain";
import { CreateContactUseCase } from "./create-contact.usecase";
import { GetContactUseCase } from "./get-contact.usecase";
import { GetContactsUseCase } from "./get-contacts.usecase";
import { RemoveContactUseCase } from "./remove-contact.usecase";

export function newContactUsecases(repo: ContactRepository) {
  return {
    createContact: new CreateContactUseCase(repo),
    getAllContact: new GetContactsUseCase(repo),
    getContact: new GetContactUseCase(repo),
    removeContact: new RemoveContactUseCase(repo),
  };
}
