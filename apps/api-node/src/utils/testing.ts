/* eslint-disable import/no-extraneous-dependencies */
import { randomUUID } from "crypto";
import { expect } from "vitest";
import { ContactEntity, ContactInMemoryRepository } from "../modules/contact";
import { newHttpServer } from "../modules/core/infrastructure/http/server";

export function jsonify(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

// --------------- SERVER ---------------
export function initServer(contacts: ContactEntity[] = []) {
  const repo = new ContactInMemoryRepository(contacts);
  const server = newHttpServer(repo);

  return server;
}

// --------------- CONTACT ---------------
export function genContactsList() {
  return [
    {
      id: randomUUID(),
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      phone: "+33601010101",
      deletedAt: null,
      createdAt: new Date("2022-12-21T12:00:00.000Z"),
      updatedAt: new Date("2022-12-21T12:00:00.000Z"),
    },
    {
      id: randomUUID(),
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@doe.com",
      phone: "+33601010102",
      deletedAt: null,
      createdAt: new Date("2022-12-21T12:00:00.000Z"),
      updatedAt: new Date("2022-12-21T12:00:00.000Z"),
    },
  ].map((contact) => new ContactEntity(contact));
}

export function assertContactEqual<T>(got: T, want: T) {
  // console.log({ got: testing.jsonify(got), want: testing.jsonify(want) });
  expect(jsonify(got)).toEqual(jsonify(want));
}
