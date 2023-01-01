import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { format } from "util";
import { ContactRepository } from "../../../domain";
import { newContactUsecases } from "../../../usecase/contact/contact.usecase";
import { ApiResponse } from "../dto";

const CONTACT_NOT_FOUND = `Contact with id: "%s" not found`;

class ContactController {
  #app!: FastifyInstance;

  readonly #usecases: ReturnType<typeof newContactUsecases>;

  constructor(repo: ContactRepository) {
    this.#usecases = newContactUsecases(repo);
  }

  register(app: FastifyInstance) {
    app.register(
      (f, opts, done) => {
        f.get("/", this.getAllContact);
        f.post("/", this.createNewContact);
        f.get("/:id", this.getContactById);
        f.delete("/:id", this.removeContact);

        done();
      },
      { prefix: "/contacts" }
    );

    this.#app = app;
  }

  getAllContact: RouteHandlerMethod = async (request, reply) => {
    const contacts = await this.#usecases.getAllContact.execute();

    return reply.send(ApiResponse.success(200, contacts));
  };

  getContactById: RouteHandlerMethod = async (request, reply) => {
    const { id } = request.params as { id: string };

    const contact = await this.#usecases.getContact.execute({ id });

    if (!contact) {
      return reply
        .status(404)
        .send(ApiResponse.error(404, null, format(CONTACT_NOT_FOUND, id)));
    }

    return reply.send(ApiResponse.success(200, contact));
  };

  createNewContact: RouteHandlerMethod = async (request, reply) => {
    const { phone, email, lastName, firstName } = request.body as {
      phone: string;
      email: string;
      lastName: string;
      firstName: string;
    };

    const contact = await this.#usecases.createContact.execute({
      phone,
      email,
      lastName,
      firstName,
    });

    return reply.status(201).send(ApiResponse.success(201, contact));
  };

  removeContact: RouteHandlerMethod = async (request, reply) => {
    const { id } = request.params as { id: string };

    await this.#usecases.removeContact.execute(id);

    return reply.status(204).send(ApiResponse.success(204, null));
  };
}

export function newContactController(repo: ContactRepository) {
  return new ContactController(repo);
}
