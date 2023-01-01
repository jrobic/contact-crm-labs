/* eslint-disable @typescript-eslint/no-use-before-define, import/no-extraneous-dependencies */
import { randomUUID } from "crypto";
import { expect } from "vitest";

import { ContactInMemoryRepository } from "../modules/contact";
import { newHttpServer } from "../modules/core/infrastructure/http/server";
import { ContactEntity } from "../modules/core";
import { newContactBuilder } from "../modules/core/domain/builder";
import { faker } from "./faker";

// --------------- SERVER ---------------
export function initServer(contacts: ContactEntity[] = []) {
  const repo = new ContactInMemoryRepository(contacts);
  const server = newHttpServer(repo);

  return server;
}

// --------------- CONTACT ---------------
export function genContactsList(numOfContacts = 2) {
  return range(numOfContacts).map(() => {
    const contact = newContactBuilder();
    const createdAt = faker.date.past();

    return new ContactEntity({
      id: randomUUID(),
      createdAt,
      updatedAt: createdAt,
      ...contact,
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
