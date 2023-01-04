const opentelemetry = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

const collectorOptions = {
    url: 'http://192.168.226.2:4318/v1/traces', // url is optional and can be omitted - default is http://localhost:4318/v1/traces
    // an optional object containing custom headers to be sent with each request
    concurrencyLimit: 10, // an optional limit on pending requests
  };

const resource =
    Resource.default().merge(
        new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: "backend",
        [SemanticResourceAttributes.SERVICE_VERSION]: "0.1.0",
        })
);

const httpexporter = new OTLPTraceExporter(collectorOptions);
const sdk = new opentelemetry.NodeSDK({
  resource: resource,
  traceExporter: httpexporter,
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start()