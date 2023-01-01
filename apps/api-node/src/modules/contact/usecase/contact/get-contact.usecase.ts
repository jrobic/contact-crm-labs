import { ContactEntity } from "../../../core";
import { ContactRepository } from "../../domain";

export class GetContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute({ id }: { id: string }): Promise<ContactEntity | null> {
    return this.contactRepository.findContact({ id });
  }
}
