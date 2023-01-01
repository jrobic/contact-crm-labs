import crypto from "crypto";

export interface ContactProps extends ContactInputProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInputProps {
  deletedAt?: Date | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export class ContactEntity implements ContactProps {
  public id: string;

  public createdAt: Date;

  public updatedAt: Date;

  public deletedAt: Date | null;

  public firstName: string;

  public lastName: string;

  public email: string;

  public phone: string;

  constructor({
    id,
    createdAt,
    updatedAt,
    deletedAt,
    firstName,
    lastName,
    email,
    phone,
  }: ContactProps) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt || null;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
  }

  static create(data: ContactInputProps) {
    // TODO: Puts some domain validation here

    const now = new Date();

    return new ContactEntity({
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      deletedAt: data.deletedAt || null,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    });
  }

  update(data: Partial<ContactInputProps>) {
    this.updatedAt = new Date();

    Object.assign(this, data);

    return this;
  }

  softDelete() {
    this.update({
      deletedAt: new Date(),
    });
  }

  toUpdate(): Omit<ContactProps, "id"> {
    return {
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
    };
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
    };
  }
}
