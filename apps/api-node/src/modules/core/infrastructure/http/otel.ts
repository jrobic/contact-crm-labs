/* eslint-disable no-console */
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  diag,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DiagConsoleLogger,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DiagLogLevel,
  trace as otelTrace,
} from "@opentelemetry/api";

// instrumentation
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { FastifyInstrumentation } from "@opentelemetry/instrumentation-fastify";

// Collector trace exporter
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { Resource } from "@opentelemetry/resources";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg";

// propagator
import { JaegerPropagator } from "@opentelemetry/propagator-jaeger";
// import { B3InjectEncoding, B3Propagator } from "@opentelemetry/propagator-b3";

// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

export async function registerTracing() {
  // Tracer provider
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "crm-api-node",
    }),
  });

  // Tracer exporter
  // Configure how spans are processed and exported. In this case we're sending spans
  // as we receive them to an OTLP-compatible collector (e.g. Jaeger).
  const traceExporter = new OTLPTraceExporter();
  // { url: "http://localhost:4318/v1/traces", }

  if (process.env.NODE_ENV === "production") {
    provider.addSpanProcessor(new BatchSpanProcessor(traceExporter));
  } else {
    provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
  }

  provider.register({
    propagator: new JaegerPropagator(),
    // propagator: new B3Propagator({
    //   injectEncoding: B3InjectEncoding.MULTI_HEADER,
    // }),
  });

  // Register your auto-instrumentors
  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      new HttpInstrumentation(),
      new FastifyInstrumentation(),
      new PrismaInstrumentation({ middleware: true }),
      new PgInstrumentation(),
    ],
  });
}

export const trace = otelTrace.getTracer("api");
