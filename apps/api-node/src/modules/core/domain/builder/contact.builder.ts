import { ContactInputProps } from "../entity";
import { faker } from "../../../../utils/faker";

export function newContactBuilder(
  overrides: Partial<ContactInputProps> = {}
): ContactInputProps {
  const firstName = overrides.firstName || faker.name.firstName();
  const lastName = overrides.lastName || faker.name.lastName();

  const email = `${firstName}@${lastName}.com`;

  return {
    firstName,
    lastName,
    email,
    phone: faker.phone.number("+336########"),
    deletedAt: null,
    ...overrides,
  };
}
