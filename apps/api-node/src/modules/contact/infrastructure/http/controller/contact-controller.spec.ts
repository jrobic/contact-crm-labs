import { describe, expect, it, vi } from "vitest";
import * as testing from "../../../../../utils/testing";

describe("ContactController", () => {
  describe("getAllContact", () => {
    it("should return all contacts", async () => {
      const contacts = testing.genContactsList();
      const want = contacts.map((contact) => contact.toJSON());

      const server = testing.initServer(contacts);

      const got = await server.inject({
        url: "/contacts",
        method: "GET",
      });

      expect(got.statusCode).toBe(200);
      expect(got.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
      expect(got.json()).toEqual({
        code: 200,
        data: want,
        message: "Success",
        timestamp: expect.any(String),
      });
    });
  });

  describe("getContactById", () => {
    it("should return a contact", async () => {
      const contacts = testing.genContactsList();
      const want = contacts[1].toJSON();

      const server = testing.initServer(contacts);

      const got = await server.inject({
        url: `/contacts/${want.id}`,
        method: "GET",
      });

      expect(got.statusCode).toBe(200);
      expect(got.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
      expect(got.json()).toEqual({
        code: 200,
        data: want,
        message: "Success",
        timestamp: expect.any(String),
      });
    });

    it("should return a 404 error if contact not found", async () => {
      const contacts = testing.genContactsList();

      const server = testing.initServer(contacts);

      const got = await server.inject({
        url: "/contacts/invalid-id",
        method: "GET",
      });

      expect(got.statusCode).toBe(404);
      expect(got.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
      expect(got.json()).toEqual({
        code: 404,
        data: null,
        message: 'Contact with id: "invalid-id" not found',
        timestamp: expect.any(String),
      });
    });
  });

  describe("createContact", () => {
    it("should return a new contact", async () => {
      vi.setSystemTime(new Date("2022-12-07T00:00:00.000Z"));

      const contacts = testing.genContactsList();

      const server = testing.initServer(contacts);

      const payload = {
        firstName: "Robert",
        lastName: "Doe",
        email: "robert@doe.com",
        phone: "+33601010103",
      };

      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      const insertedContact = await server.inject({
        url: "/contacts",
        method: "POST",
        payload,
      });

      const insertedContactJson = insertedContact.json();
      const contactId = insertedContactJson.data.id;

      const want = {
        code: 200,
        data: {
          ...payload,
          id: contactId,
          deletedAt: null,
          createdAt: "2022-12-07T00:00:00.000Z",
          updatedAt: "2022-12-07T00:00:00.000Z",
        },
        message: "Success",
        timestamp: expect.any(String),
      };

      const got = await server.inject({
        url: `/contacts/${contactId}`,
        method: "GET",
      });
      const gotJson = got.json();

      expect(insertedContact.statusCode).toBe(201);
      expect(insertedContactJson).toEqual({
        ...want,
        code: 201,
      });

      expect(gotJson).toEqual({
        ...want,
      });
    });
  });

  describe("removeContact", () => {
    it("should remove a contact", async () => {
      const contacts = testing.genContactsList();
      const contact = contacts[0];

      const server = testing.initServer(contacts);

      vi.setSystemTime(new Date("2023-01-01T00:00:00.000Z"));

      const removeContact = await server.inject({
        url: `/contacts/${contact.id}`,
        method: "DELETE",
      });

      expect(removeContact.statusCode).toBe(204);
      expect(removeContact.json()).toEqual({
        code: 204,
        data: null,
        message: "Success",
        timestamp: expect.any(String),
      });

      const got = await server.inject({
        url: `/contacts/${contact.id}`,
        method: "GET",
      });

      expect(got.statusCode).toBe(200);
      expect(got.json()).toEqual({
        code: 200,
        data: {
          ...contact.toJSON(),
          updatedAt: "2023-01-01T00:00:00.000Z",
          deletedAt: "2023-01-01T00:00:00.000Z",
        },
        message: `Success`,
        timestamp: expect.any(String),
      });
    });

    it("should return an error when contact is not exist", async () => {
      const contacts = testing.genContactsList();

      const server = testing.initServer(contacts);

      const removeContact = await server.inject({
        url: `/contacts/invalid-id`,
        method: "DELETE",
      });

      expect(removeContact.statusCode).toBe(404);
      expect(removeContact.json()).toEqual({
        code: 404,
        data: null,
        message:
          "Its not possible to remove contact with id 'invalid-id' because it does not exist",
        timestamp: expect.any(String),
      });
    });
  });
});
