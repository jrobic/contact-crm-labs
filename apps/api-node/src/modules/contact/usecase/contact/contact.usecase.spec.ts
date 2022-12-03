import { describe, it, expect, vi } from "vitest";
import crypto from "crypto";
import { testing } from "../../../../utils";
import { ContactEntity } from "../../domain";
import { ContactInMemoryRepository } from "../../infrastructure/repository/contact-inmemory.repository";
import { newContactUsecases } from "./contact.usecase";

describe("ContactUseCases", () => {
  describe("GetContactUseCase", () => {
    it("should return a contact", async () => {
      const want = testing.genContactsList();

      const contactRepository = new ContactInMemoryRepository(want);

      const contactUseCases = newContactUsecases(contactRepository);

      const got = await contactUseCases.getContact.execute({ id: want[0].id });

      testing.assertContactEqual(got, want[0]);
    });
  });

  describe("GetContactsUseCase", () => {
    it("should return all contacts", async () => {
      const want = testing.genContactsList();

      const contactRepository = new ContactInMemoryRepository(want);

      const contactUseCases = newContactUsecases(contactRepository);

      const got = await contactUseCases.getAllContact.execute();

      testing.assertContactEqual(got, want);
    });
  });

  describe("RemoveContactUseCase", () => {
    it("should remove a contact", async () => {
      vi.useFakeTimers({ now: new Date("2022-12-07T00:00:00.000Z") });

      const contacts = testing.genContactsList();

      const contactRepository = new ContactInMemoryRepository(contacts);
      const contactUseCases = newContactUsecases(contactRepository);

      const want = contacts[1];
      want.deletedAt = new Date("2022-12-07T00:00:00.000Z");

      const removeContact = await contactUseCases.removeContact.execute(
        want.id
      );
      testing.assertContactEqual(removeContact, want);

      const got = await contactUseCases.getContact.execute({ id: want.id });

      testing.assertContactEqual(got, want);
    });

    it("should return an error when contact is not exist", async () => {
      const contacts = testing.genContactsList();

      const contactRepository = new ContactInMemoryRepository(contacts);
      const contactUseCases = newContactUsecases(contactRepository);

      expect(contactUseCases.removeContact.execute("123")).rejects.toThrowError(
        `Its not possible to remove contact with id '123' because it does not exist`
      );
    });
  });

  describe("CreateContactUseCase", () => {
    it("should create a contact", async () => {
      vi.useFakeTimers({ now: new Date("2022-12-01T00:00:00.000Z") });
      vi.spyOn(crypto, "randomUUID").mockReturnValue("1234567890");

      const contactRepository = new ContactInMemoryRepository();
      const contactUseCases = newContactUsecases(contactRepository);

      const want = {
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        phone: "+33601010101",
      };

      const insertedContact = await contactUseCases.createContact.execute(want);

      const got = await contactUseCases.getContact.execute({
        id: insertedContact.id,
      });

      testing.assertContactEqual(
        got,
        want
          ? new ContactEntity({
              ...want,
              createdAt: new Date("2022-12-01T00:00:00.000Z"),
              updatedAt: new Date("2022-12-01T00:00:00.000Z"),
              deletedAt: null,
              id: "1234567890",
            })
          : null
      );
    });
  });
});
