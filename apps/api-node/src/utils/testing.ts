/* eslint-disable @typescript-eslint/no-use-before-define, import/no-extraneous-dependencies */
import { randomUUID } from "crypto";
import { expect } from "vitest";
import { faker } from "@faker-js/faker";
import { ContactEntity, ContactInMemoryRepository } from "../modules/contact";
import { newHttpServer } from "../modules/core/infrastructure/http/server";

faker.seed(2023);

// --------------- SERVER ---------------
export function initServer(contacts: ContactEntity[] = []) {
  const repo = new ContactInMemoryRepository(contacts);
  const server = newHttpServer(repo);

  return server;
}

// --------------- CONTACT ---------------
export function genContactsList(numOfContacts = 2) {
  return range(numOfContacts).map(() => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const createdAt = faker.date.past();

    return new ContactEntity({
      id: randomUUID(),
      firstName,
      lastName,
      email: `${firstName}@${lastName}.com`,
      phone: faker.phone.number("+336########"),
      deletedAt: null,
      createdAt,
      updatedAt: createdAt,
    });
  });
}

export function assertContactEqual<T>(got: T, want: T) {
  // console.log({ got: testing.jsonify(got), want: testing.jsonify(want) });
  expect(jsonify(got)).toEqual(jsonify(want));
}

// --------------- HELPERS ---------------
export function jsonify(obj: unknown) {
  return JSON.parse(JSON.stringify(obj));
}

function range(n: number) {
  return [...Array(n).keys()];
}
