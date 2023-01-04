const opentelemetry = require("@opentelemetry/api");
const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { getWebAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-web');
const { BaseOpenTelemetryComponent } = require('@opentelemetry/plugin-react-load');
const { WebTracerProvider } = require("@opentelemetry/sdk-trace-web");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { ConsoleSpanExporter, BatchSpanProcessor, SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const collectorOptions = {
    url: 'http://192.168.226.2:4318/v1/traces', // url is optional and can be omitted - default is http://localhost:4318/v1/traces
    // an optional object containing custom headers to be sent with each request
    concurrencyLimit: 10, // an optional limit on pending requests
  };
// Optionally register automatic instrumentation libraries
module.exports =  (serviceName) => {
    registerInstrumentations({
    instrumentations: [getWebAutoInstrumentations()],
    });

    const resource =
    Resource.default().merge(
        new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: "frontend",
        [SemanticResourceAttributes.SERVICE_VERSION]: "0.1.0",
        })
    );

    const provider = new WebTracerProvider({
        resource: resource,
    });
    const exporter = new ConsoleSpanExporter();
    const httpexporter = new OTLPTraceExporter(collectorOptions);
    const processor = new SimpleSpanProcessor(httpexporter);
    provider.addSpanProcessor(processor);

    provider.register();

    console.log("Tracing initialized")

    const tracer = provider.getTracer(serviceName);

    BaseOpenTelemetryComponent.setTracer(serviceName)
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

    return tracer;
}